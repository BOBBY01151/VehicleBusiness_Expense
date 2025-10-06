const Shipment = require('./shipment.model');
const logger = require('../../config/logger');

class ShipmentService {
  // Create new shipment
  async createShipment(shipmentData, userId) {
    try {
      const shipment = new Shipment({
        ...shipmentData,
        createdBy: userId,
        updatedBy: userId
      });

      await shipment.save();
      
      logger.info(`New shipment created: ${shipment._id} by user: ${userId}`);
      
      return shipment;
    } catch (error) {
      logger.error('Create shipment service error:', error);
      throw error;
    }
  }

  // Get shipments by exporter
  async getShipmentsByExporter(exporterId, filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        search
      } = filters;

      const query = { exporterId };

      // Apply filters
      if (status) query.status = status;
      
      if (search) {
        query.$or = [
          { trackingNumber: { $regex: search, $options: 'i' } },
          { 'carrier.name': { $regex: search, $options: 'i' } }
        ];
      }

      const shipments = await Shipment.find(query)
        .populate('exporterId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Shipment.countDocuments(query);

      return {
        shipments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      };
    } catch (error) {
      logger.error('Get shipments by exporter service error:', error);
      throw error;
    }
  }

  // Update shipment
  async updateShipment(shipmentId, updateData, userId) {
    try {
      const shipment = await Shipment.findById(shipmentId);
      if (!shipment) {
        throw new Error('Shipment not found');
      }

      // Check if user can update this shipment
      if (shipment.exporterId.toString() !== userId.toString()) {
        throw new Error('Access denied. You can only update your own shipments.');
      }

      const updatedShipment = await Shipment.findByIdAndUpdate(
        shipmentId,
        { ...updateData, updatedBy: userId },
        { new: true, runValidators: true }
      ).populate('exporterId', 'firstName lastName email');

      logger.info(`Shipment updated: ${shipmentId} by user: ${userId}`);

      return updatedShipment;
    } catch (error) {
      logger.error('Update shipment service error:', error);
      throw error;
    }
  }

  // Delete shipment
  async deleteShipment(shipmentId, userId) {
    try {
      const shipment = await Shipment.findById(shipmentId);
      if (!shipment) {
        throw new Error('Shipment not found');
      }

      // Check if user can delete this shipment
      if (shipment.exporterId.toString() !== userId.toString()) {
        throw new Error('Access denied. You can only delete your own shipments.');
      }

      await Shipment.findByIdAndDelete(shipmentId);
      
      logger.info(`Shipment deleted: ${shipmentId} by user: ${userId}`);

      return true;
    } catch (error) {
      logger.error('Delete shipment service error:', error);
      throw error;
    }
  }
}

module.exports = new ShipmentService();
