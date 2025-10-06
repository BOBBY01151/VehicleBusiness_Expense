const { validationResult } = require('express-validator');
const expenseService = require('./expense.service');
const logger = require('../../config/logger');

class ExpenseController {
  // Create new expense
  async createExpense(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const expenseData = req.body;
      const userId = req.user.id;

      // Set exporter ID to current user
      expenseData.exporterId = userId;

      const expense = await expenseService.createExpense(expenseData, userId);

      res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        data: { expense }
      });
    } catch (error) {
      logger.error('Create expense controller error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get expenses for exporter
  async getExpenses(req, res) {
    try {
      const exporterId = req.user.id;
      const filters = req.query;

      const result = await expenseService.getExpensesByExporter(exporterId, filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Get expenses controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch expenses'
      });
    }
  }

  // Get shared expenses for local user
  async getSharedExpenses(req, res) {
    try {
      const userId = req.user.id;
      const filters = req.query;

      const result = await expenseService.getSharedExpensesForUser(userId, filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Get shared expenses controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch shared expenses'
      });
    }
  }

  // Get expense by ID
  async getExpenseById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const Expense = require('./expense.model');
      const expense = await Expense.findById(id)
        .populate('exporterId', 'firstName lastName email company')
        .populate('sharedWith.userId', 'firstName lastName email');

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: 'Expense not found'
        });
      }

      // Check access permissions
      if (userRole === 'ROLE_EXPORTER') {
        if (expense.exporterId._id.toString() !== userId.toString()) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. You can only view your own expenses.'
          });
        }
      } else if (userRole === 'ROLE_LOCAL') {
        const hasAccess = expense.sharedWithLocal && 
          expense.sharedWith.some(share => share.userId._id.toString() === userId.toString());
        
        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. You can only view shared expenses.'
          });
        }
      }

      res.json({
        success: true,
        data: { expense }
      });
    } catch (error) {
      logger.error('Get expense by ID controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch expense'
      });
    }
  }

  // Update expense
  async updateExpense(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;

      const expense = await expenseService.updateExpense(id, updateData, userId);

      res.json({
        success: true,
        message: 'Expense updated successfully',
        data: { expense }
      });
    } catch (error) {
      logger.error('Update expense controller error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete expense
  async deleteExpense(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await expenseService.deleteExpense(id, userId);

      res.json({
        success: true,
        message: 'Expense deleted successfully'
      });
    } catch (error) {
      logger.error('Delete expense controller error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Share expense with local users
  async shareExpense(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { userIds, notes } = req.body;
      const currentUserId = req.user.id;

      const expense = await expenseService.shareExpense(id, userIds, notes, currentUserId);

      // Emit notification to shared users
      if (req.io) {
        userIds.forEach(userId => {
          req.io.to(`user_${userId}`).emit('expense_shared', {
            expenseId: expense._id,
            title: expense.title,
            amount: expense.amount,
            currency: expense.currency,
            exporterName: `${expense.exporterId.firstName} ${expense.exporterId.lastName}`
          });
        });
      }

      res.json({
        success: true,
        message: 'Expense shared successfully',
        data: { expense }
      });
    } catch (error) {
      logger.error('Share expense controller error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update share status
  async updateShareStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id, userId } = req.params;
      const { status, notes } = req.body;
      const currentUserId = req.user.id;

      const expense = await expenseService.updateShareStatus(id, userId, status, notes, currentUserId);

      // Emit notification to exporter
      if (req.io) {
        req.io.to(`user_${expense.exporterId._id}`).emit('share_status_updated', {
          expenseId: expense._id,
          title: expense.title,
          status,
          notes,
          updatedBy: currentUserId
        });
      }

      res.json({
        success: true,
        message: 'Share status updated successfully',
        data: { expense }
      });
    } catch (error) {
      logger.error('Update share status controller error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get expense statistics
  async getStatistics(req, res) {
    try {
      const exporterId = req.user.id;
      const filters = req.query;

      const statistics = await expenseService.getExpenseStatistics(exporterId, filters);

      res.json({
        success: true,
        data: { statistics }
      });
    } catch (error) {
      logger.error('Get expense statistics controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }
  }

  // Get all expenses (admin only)
  async getAllExpenses(req, res) {
    try {
      const filters = req.query;
      const result = await expenseService.getExpensesByExporter(null, filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Get all expenses controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch expenses'
      });
    }
  }
}

module.exports = new ExpenseController();
