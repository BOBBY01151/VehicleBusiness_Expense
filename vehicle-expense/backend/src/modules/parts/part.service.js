const Part = require('./part.model');
const logger = require('../../config/logger');

class PartService {
  // Create new part
  async createPart(partData, userId) {
    try {
      const part = new Part({
        ...partData,
        createdBy: userId,
        updatedBy: userId
      });

      await part.save();
      
      logger.info(`New part created: ${part._id} by user: ${userId}`);
      
      return part;
    } catch (error) {
      logger.error('Create part service error:', error);
      throw error;
    }
  }

  // Get parts by exporter
  async getPartsByExporter(exporterId, filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        condition,
        search
      } = filters;

      const query = { exporterId };

      // Apply filters
      if (category) query.category = category;
      if (condition) query.specifications.condition = condition;
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { partNumber: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const parts = await Part.find(query)
        .populate('exporterId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Part.countDocuments(query);

      return {
        parts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      };
    } catch (error) {
      logger.error('Get parts by exporter service error:', error);
      throw error;
    }
  }

  // Update part
  async updatePart(partId, updateData, userId) {
    try {
      const part = await Part.findById(partId);
      if (!part) {
        throw new Error('Part not found');
      }

      // Check if user can update this part
      if (part.exporterId.toString() !== userId.toString()) {
        throw new Error('Access denied. You can only update your own parts.');
      }

      const updatedPart = await Part.findByIdAndUpdate(
        partId,
        { ...updateData, updatedBy: userId },
        { new: true, runValidators: true }
      ).populate('exporterId', 'firstName lastName email');

      logger.info(`Part updated: ${partId} by user: ${userId}`);

      return updatedPart;
    } catch (error) {
      logger.error('Update part service error:', error);
      throw error;
    }
  }

  // Delete part
  async deletePart(partId, userId) {
    try {
      const part = await Part.findById(partId);
      if (!part) {
        throw new Error('Part not found');
      }

      // Check if user can delete this part
      if (part.exporterId.toString() !== userId.toString()) {
        throw new Error('Access denied. You can only delete your own parts.');
      }

      await Part.findByIdAndDelete(partId);
      
      logger.info(`Part deleted: ${partId} by user: ${userId}`);

      return true;
    } catch (error) {
      logger.error('Delete part service error:', error);
      throw error;
    }
  }
}

module.exports = new PartService();
