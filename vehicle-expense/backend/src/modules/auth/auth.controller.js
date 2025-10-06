const { validationResult } = require('express-validator');
const authService = require('./auth.service');
const logger = require('../../config/logger');

class AuthController {
  // Register new user
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userData = req.body;
      const user = await authService.register(userData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user }
      });
    } catch (error) {
      logger.error('Register controller error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      
      // Extract device info
      const deviceInfo = {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip || req.connection.remoteAddress,
        deviceType: req.get('User-Agent')?.includes('Mobile') ? 'mobile' : 'desktop',
        browser: this.extractBrowser(req.get('User-Agent')),
        os: this.extractOS(req.get('User-Agent'))
      };

      const result = await authService.login(email, password, deviceInfo);

      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      logger.error('Login controller error:', error);
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Refresh token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      const result = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error) {
      logger.error('Refresh token controller error:', error);
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Logout user
  async logout(req, res) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required'
        });
      }

      await authService.logout(token);

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Logout controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  // Logout from all devices
  async logoutAll(req, res) {
    try {
      const userId = req.user.id;
      await authService.logoutAll(userId);

      res.json({
        success: true,
        message: 'Logged out from all devices'
      });
    } catch (error) {
      logger.error('Logout all controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const User = require('../users/user.model');
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user: user.toJSON() }
      });
    } catch (error) {
      logger.error('Get profile controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile'
      });
    }
  }

  // Get user sessions
  async getSessions(req, res) {
    try {
      const userId = req.user.id;
      const sessions = await authService.getUserSessions(userId);

      res.json({
        success: true,
        data: { sessions }
      });
    } catch (error) {
      logger.error('Get sessions controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get sessions'
      });
    }
  }

  // Helper methods
  extractBrowser(userAgent) {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  }

  extractOS(userAgent) {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
  }
}

module.exports = new AuthController();
