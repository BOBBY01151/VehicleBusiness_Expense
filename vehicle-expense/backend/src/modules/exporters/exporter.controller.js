const { validationResult } = require('express-validator');
const Exporter = require('./exporter.model');
const User = require('../users/user.model');
const logger = require('../../config/logger');

class ExporterController {
  // Get exporter profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const exporter = await Exporter.findOne({ userId }).populate('userId', 'firstName lastName email');

      if (!exporter) {
        return res.status(404).json({
          success: false,
          message: 'Exporter profile not found'
        });
      }

      res.json({
        success: true,
        data: { exporter }
      });
    } catch (error) {
      logger.error('Get exporter profile controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch exporter profile'
      });
    }
  }

  // Create or update exporter profile
  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const profileData = req.body;

      // Check if user has exporter role
      const user = await User.findById(userId);
      if (user.role !== 'ROLE_EXPORTER') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Exporter role required.'
        });
      }

      // Update or create exporter profile
      const exporter = await Exporter.findOneAndUpdate(
        { userId },
        { ...profileData, userId },
        { 
          new: true, 
          upsert: true, 
          runValidators: true 
        }
      ).populate('userId', 'firstName lastName email');

      res.json({
        success: true,
        message: 'Exporter profile updated successfully',
        data: { exporter }
      });
    } catch (error) {
      logger.error('Update exporter profile controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update exporter profile'
      });
    }
  }

  // Get all exporters (admin only)
  async getExporters(req, res) {
    try {
      const { page = 1, limit = 10, verified, businessType, search } = req.query;
      const query = {};

      // Filter by verification status
      if (verified !== undefined) {
        query['verification.isVerified'] = verified === 'true';
      }

      // Filter by business type
      if (businessType) {
        query['business.type'] = businessType;
      }

      // Search functionality
      if (search) {
        query.$or = [
          { 'company.name': { $regex: search, $options: 'i' } },
          { 'company.registrationNumber': { $regex: search, $options: 'i' } }
        ];
      }

      const exporters = await Exporter.find(query)
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Exporter.countDocuments(query);

      res.json({
        success: true,
        data: {
          exporters,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total
          }
        }
      });
    } catch (error) {
      logger.error('Get exporters controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch exporters'
      });
    }
  }

  // Get exporter by ID
  async getExporterById(req, res) {
    try {
      const { id } = req.params;
      const exporter = await Exporter.findOne({ userId: id })
        .populate('userId', 'firstName lastName email');

      if (!exporter) {
        return res.status(404).json({
          success: false,
          message: 'Exporter not found'
        });
      }

      res.json({
        success: true,
        data: { exporter }
      });
    } catch (error) {
      logger.error('Get exporter by ID controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch exporter'
      });
    }
  }

  // Verify exporter (admin only)
  async verifyExporter(req, res) {
    try {
      const { id } = req.params;
      const verifiedBy = req.user.id;

      const exporter = await Exporter.findOne({ userId: id });
      if (!exporter) {
        return res.status(404).json({
          success: false,
          message: 'Exporter not found'
        });
      }

      await exporter.verify(verifiedBy);

      res.json({
        success: true,
        message: 'Exporter verified successfully',
        data: { exporter }
      });
    } catch (error) {
      logger.error('Verify exporter controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify exporter'
      });
    }
  }

  // Upload verification documents
  async uploadDocuments(req, res) {
    try {
      const userId = req.user.id;
      const { documentType, url } = req.body;

      if (!documentType || !url) {
        return res.status(400).json({
          success: false,
          message: 'Document type and URL are required'
        });
      }

      const exporter = await Exporter.findOne({ userId });
      if (!exporter) {
        return res.status(404).json({
          success: false,
          message: 'Exporter profile not found'
        });
      }

      // Add or update document
      const existingDocIndex = exporter.verification.documents.findIndex(
        doc => doc.type === documentType
      );

      const documentData = {
        type: documentType,
        url,
        uploadedAt: new Date(),
        verified: false
      };

      if (existingDocIndex >= 0) {
        exporter.verification.documents[existingDocIndex] = documentData;
      } else {
        exporter.verification.documents.push(documentData);
      }

      await exporter.save();

      res.json({
        success: true,
        message: 'Document uploaded successfully',
        data: { exporter }
      });
    } catch (error) {
      logger.error('Upload documents controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload document'
      });
    }
  }

  // Get exporter statistics
  async getStatistics(req, res) {
    try {
      const userId = req.user.id;
      const exporter = await Exporter.findOne({ userId });

      if (!exporter) {
        return res.status(404).json({
          success: false,
          message: 'Exporter profile not found'
        });
      }

      // Update statistics
      await exporter.updateStatistics();

      res.json({
        success: true,
        data: { statistics: exporter.statistics }
      });
    } catch (error) {
      logger.error('Get exporter statistics controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }
  }

  // Get public exporter list (for local users)
  async getPublicExporters(req, res) {
    try {
      const exporters = await Exporter.find({ 
        'verification.isVerified': true,
        isActive: true 
      })
      .populate('userId', 'firstName lastName email')
      .select('company business statistics')
      .sort({ 'company.name': 1 });

      res.json({
        success: true,
        data: { exporters }
      });
    } catch (error) {
      logger.error('Get public exporters controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch exporters'
      });
    }
  }
}

module.exports = new ExporterController();
