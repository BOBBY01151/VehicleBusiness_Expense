const { validationResult } = require('express-validator');
const User = require('./user.model');
const logger = require('../../config/logger');

class UserController {
  // Get all users (admin only)
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 10, role, search } = req.query;
      const query = {};

      // Filter by role if provided
      if (role) {
        query.role = role;
      }

      // Search functionality
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { 'company.name': { $regex: search, $options: 'i' } }
        ];
      }

      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total
          }
        }
      });
    } catch (error) {
      logger.error('Get users controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      logger.error('Get user by ID controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user'
      });
    }
  }

  // Update user profile
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
      const updateData = req.body;

      // Remove sensitive fields
      delete updateData.password;
      delete updateData.role;
      delete updateData.email;

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (error) {
      logger.error('Update profile controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  }

  // Change password
  async changePassword(req, res) {
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
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(userId).select('+password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      logger.error('Change password controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
  }

  // Deactivate user account
  async deactivateAccount(req, res) {
    try {
      const userId = req.user.id;
      const { password } = req.body;

      const user = await User.findById(userId).select('+password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Password is incorrect'
        });
      }

      // Deactivate account
      user.isActive = false;
      await user.save();

      res.json({
        success: true,
        message: 'Account deactivated successfully'
      });
    } catch (error) {
      logger.error('Deactivate account controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to deactivate account'
      });
    }
  }

  // Get exporters list (for local users to see available exporters)
  async getExporters(req, res) {
    try {
      const exporters = await User.find({ 
        role: 'ROLE_EXPORTER',
        isActive: true 
      })
      .select('firstName lastName email company')
      .sort({ 'company.name': 1 });

      res.json({
        success: true,
        data: { exporters }
      });
    } catch (error) {
      logger.error('Get exporters controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch exporters'
      });
    }
  }

  // Get local users list (for exporters to see available local users)
  async getLocalUsers(req, res) {
    try {
      const localUsers = await User.find({ 
        role: 'ROLE_LOCAL',
        isActive: true 
      })
      .select('firstName lastName email company')
      .sort({ 'company.name': 1 });

      res.json({
        success: true,
        data: { localUsers }
      });
    } catch (error) {
      logger.error('Get local users controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch local users'
      });
    }
  }
}

module.exports = new UserController();
