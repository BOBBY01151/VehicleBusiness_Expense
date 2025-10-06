const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../users/user.model');
const AuthSession = require('./auth.model');
const config = require('../../config/env');
const logger = require('../../config/logger');

class AuthService {
  // Generate JWT token
  generateToken(payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE
    });
  }

  // Generate refresh token
  generateRefreshToken() {
    return crypto.randomBytes(40).toString('hex');
  }

  // Create auth session
  async createSession(userId, deviceInfo) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        company: user.company?.name
      };

      const token = this.generateToken(payload);
      const refreshToken = this.generateRefreshToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const session = new AuthSession({
        userId,
        token,
        refreshToken,
        deviceInfo,
        expiresAt
      });

      await session.save();
      
      // Update user's last login
      await User.findByIdAndUpdate(userId, { lastLogin: new Date() });

      return {
        token,
        refreshToken,
        user: user.toJSON(),
        expiresAt
      };
    } catch (error) {
      logger.error('Create session error:', error);
      throw error;
    }
  }

  // Login user
  async login(email, password, deviceInfo) {
    try {
      // Find user with password field
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Create session
      const sessionData = await this.createSession(user._id, deviceInfo);
      
      logger.info(`User ${user.email} logged in successfully`);
      
      return sessionData;
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  async register(userData) {
    try {
      const { email, password, firstName, lastName, role, company } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create new user
      const user = new User({
        email,
        password,
        firstName,
        lastName,
        role,
        company
      });

      await user.save();

      logger.info(`New user registered: ${user.email} with role: ${user.role}`);

      return user.toJSON();
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  // Refresh token
  async refreshToken(refreshToken) {
    try {
      const session = await AuthSession.findOne({ 
        refreshToken, 
        isActive: true 
      }).populate('userId');

      if (!session || !session.isValid()) {
        throw new Error('Invalid refresh token');
      }

      const user = session.userId;
      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        company: user.company?.name
      };

      const newToken = this.generateToken(payload);
      const newRefreshToken = this.generateRefreshToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // Update session
      session.token = newToken;
      session.refreshToken = newRefreshToken;
      session.expiresAt = expiresAt;
      session.lastActivity = new Date();
      await session.save();

      return {
        token: newToken,
        refreshToken: newRefreshToken,
        expiresAt
      };
    } catch (error) {
      logger.error('Refresh token error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(token) {
    try {
      const session = await AuthSession.findOne({ token, isActive: true });
      if (session) {
        await session.deactivate();
        logger.info(`User logged out: ${session.userId}`);
      }
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  // Logout from all devices
  async logoutAll(userId) {
    try {
      await AuthSession.updateMany(
        { userId, isActive: true },
        { isActive: false }
      );
      logger.info(`User logged out from all devices: ${userId}`);
    } catch (error) {
      logger.error('Logout all error:', error);
      throw error;
    }
  }

  // Verify token
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const session = await AuthSession.findOne({ 
        token, 
        isActive: true 
      }).populate('userId');

      if (!session || !session.isValid()) {
        throw new Error('Invalid session');
      }

      return {
        user: session.userId,
        session
      };
    } catch (error) {
      logger.error('Token verification error:', error);
      throw error;
    }
  }

  // Get user sessions
  async getUserSessions(userId) {
    try {
      const sessions = await AuthSession.find({ 
        userId, 
        isActive: true 
      }).sort({ lastActivity: -1 });

      return sessions.map(session => ({
        id: session._id,
        deviceInfo: session.deviceInfo,
        lastActivity: session.lastActivity,
        createdAt: session.createdAt
      }));
    } catch (error) {
      logger.error('Get user sessions error:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
