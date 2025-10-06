const Expense = require('./expense.model');
const User = require('../users/user.model');
const logger = require('../../config/logger');

class ExpenseService {
  // Create new expense
  async createExpense(expenseData, userId) {
    try {
      const expense = new Expense({
        ...expenseData,
        createdBy: userId,
        updatedBy: userId
      });

      await expense.save();
      
      logger.info(`New expense created: ${expense._id} by user: ${userId}`);
      
      return expense;
    } catch (error) {
      logger.error('Create expense service error:', error);
      throw error;
    }
  }

  // Get expenses by exporter
  async getExpensesByExporter(exporterId, filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        status,
        sharedWithLocal,
        startDate,
        endDate,
        search
      } = filters;

      const query = { exporterId };

      // Apply filters
      if (category) query.category = category;
      if (status) query.status = status;
      if (sharedWithLocal !== undefined) query.sharedWithLocal = sharedWithLocal;
      
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'invoice.number': { $regex: search, $options: 'i' } },
          { 'vehicle.vin': { $regex: search, $options: 'i' } }
        ];
      }

      const expenses = await Expense.find(query)
        .populate('exporterId', 'firstName lastName email')
        .populate('sharedWith.userId', 'firstName lastName email')
        .sort({ date: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Expense.countDocuments(query);

      return {
        expenses,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      };
    } catch (error) {
      logger.error('Get expenses by exporter service error:', error);
      throw error;
    }
  }

  // Get shared expenses for local user
  async getSharedExpensesForUser(userId, filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        exporterId,
        startDate,
        endDate
      } = filters;

      const query = {
        sharedWithLocal: true,
        'sharedWith.userId': userId
      };

      // Apply filters
      if (exporterId) query.exporterId = exporterId;
      
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      const expenses = await Expense.find(query)
        .populate('exporterId', 'firstName lastName email company')
        .sort({ date: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Expense.countDocuments(query);

      // Filter by share status if provided
      let filteredExpenses = expenses;
      if (status) {
        filteredExpenses = expenses.filter(expense => {
          const userShare = expense.sharedWith.find(share => 
            share.userId.toString() === userId.toString()
          );
          return userShare && userShare.status === status;
        });
      }

      return {
        expenses: filteredExpenses,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      };
    } catch (error) {
      logger.error('Get shared expenses for user service error:', error);
      throw error;
    }
  }

  // Update expense
  async updateExpense(expenseId, updateData, userId) {
    try {
      const expense = await Expense.findById(expenseId);
      if (!expense) {
        throw new Error('Expense not found');
      }

      // Check if user can update this expense
      if (expense.exporterId.toString() !== userId.toString()) {
        throw new Error('Access denied. You can only update your own expenses.');
      }

      const updatedExpense = await Expense.findByIdAndUpdate(
        expenseId,
        { ...updateData, updatedBy: userId },
        { new: true, runValidators: true }
      ).populate('exporterId', 'firstName lastName email')
       .populate('sharedWith.userId', 'firstName lastName email');

      logger.info(`Expense updated: ${expenseId} by user: ${userId}`);

      return updatedExpense;
    } catch (error) {
      logger.error('Update expense service error:', error);
      throw error;
    }
  }

  // Delete expense
  async deleteExpense(expenseId, userId) {
    try {
      const expense = await Expense.findById(expenseId);
      if (!expense) {
        throw new Error('Expense not found');
      }

      // Check if user can delete this expense
      if (expense.exporterId.toString() !== userId.toString()) {
        throw new Error('Access denied. You can only delete your own expenses.');
      }

      await Expense.findByIdAndDelete(expenseId);
      
      logger.info(`Expense deleted: ${expenseId} by user: ${userId}`);

      return true;
    } catch (error) {
      logger.error('Delete expense service error:', error);
      throw error;
    }
  }

  // Share expense with local users
  async shareExpense(expenseId, userIds, notes, userId) {
    try {
      const expense = await Expense.findById(expenseId);
      if (!expense) {
        throw new Error('Expense not found');
      }

      // Check if user can share this expense
      if (expense.exporterId.toString() !== userId.toString()) {
        throw new Error('Access denied. You can only share your own expenses.');
      }

      // Verify that all user IDs are valid local users
      const users = await User.find({
        _id: { $in: userIds },
        role: 'ROLE_LOCAL',
        isActive: true
      });

      if (users.length !== userIds.length) {
        throw new Error('Some users are invalid or not local users.');
      }

      await expense.shareWithLocal(userIds, notes);

      logger.info(`Expense shared: ${expenseId} with users: ${userIds.join(', ')} by user: ${userId}`);

      return expense;
    } catch (error) {
      logger.error('Share expense service error:', error);
      throw error;
    }
  }

  // Update share status
  async updateShareStatus(expenseId, shareUserId, status, notes, userId) {
    try {
      const expense = await Expense.findById(expenseId);
      if (!expense) {
        throw new Error('Expense not found');
      }

      // Check if user can update this share status
      const userShare = expense.sharedWith.find(share => 
        share.userId.toString() === shareUserId.toString()
      );

      if (!userShare) {
        throw new Error('Share not found');
      }

      // Only the shared user or the exporter can update the status
      if (shareUserId.toString() !== userId.toString() && 
          expense.exporterId.toString() !== userId.toString()) {
        throw new Error('Access denied. You can only update your own share status.');
      }

      await expense.updateShareStatus(shareUserId, status, notes);

      logger.info(`Share status updated: ${expenseId} for user: ${shareUserId} to status: ${status} by user: ${userId}`);

      return expense;
    } catch (error) {
      logger.error('Update share status service error:', error);
      throw error;
    }
  }

  // Get expense statistics
  async getExpenseStatistics(exporterId, filters = {}) {
    try {
      const { startDate, endDate, category } = filters;
      
      const matchQuery = { exporterId };
      
      if (startDate || endDate) {
        matchQuery.date = {};
        if (startDate) matchQuery.date.$gte = new Date(startDate);
        if (endDate) matchQuery.date.$lte = new Date(endDate);
      }
      
      if (category) matchQuery.category = category;

      const stats = await Expense.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: 1 },
            totalAmount: { $sum: '$amountInUSD' },
            sharedExpenses: { $sum: { $cond: ['$sharedWithLocal', 1, 0] } },
            averageAmount: { $avg: '$amountInUSD' },
            categories: {
              $push: {
                category: '$category',
                amount: '$amountInUSD'
              }
            }
          }
        }
      ]);

      if (stats.length === 0) {
        return {
          totalExpenses: 0,
          totalAmount: 0,
          sharedExpenses: 0,
          averageAmount: 0,
          categoryBreakdown: []
        };
      }

      // Calculate category breakdown
      const categoryBreakdown = {};
      stats[0].categories.forEach(item => {
        if (!categoryBreakdown[item.category]) {
          categoryBreakdown[item.category] = { count: 0, amount: 0 };
        }
        categoryBreakdown[item.category].count += 1;
        categoryBreakdown[item.category].amount += item.amount;
      });

      return {
        totalExpenses: stats[0].totalExpenses,
        totalAmount: stats[0].totalAmount,
        sharedExpenses: stats[0].sharedExpenses,
        averageAmount: stats[0].averageAmount,
        categoryBreakdown: Object.entries(categoryBreakdown).map(([category, data]) => ({
          category,
          count: data.count,
          amount: data.amount
        }))
      };
    } catch (error) {
      logger.error('Get expense statistics service error:', error);
      throw error;
    }
  }
}

module.exports = new ExpenseService();
