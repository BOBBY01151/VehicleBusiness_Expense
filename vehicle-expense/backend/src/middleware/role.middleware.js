const logger = require('../config/logger');

// Role constants
const ROLES = {
  EXPORTER: 'ROLE_EXPORTER',
  LOCAL: 'ROLE_LOCAL',
  ADMIN: 'ROLE_ADMIN'
};

// Middleware to check if user has required role
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userRole = req.user.role;
      
      if (!allowedRoles.includes(userRole)) {
        logger.warn(`Access denied for user ${req.user.id} with role ${userRole}`);
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      next();
    } catch (error) {
      logger.error('Role middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Role verification failed'
      });
    }
  };
};

// Middleware to check if user can access exporter-specific resources
const requireExporterAccess = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    const resourceExporterId = req.params.exporterId || req.body.exporterId;
    const userId = req.user.id;

    // Admin can access everything
    if (userRole === ROLES.ADMIN) {
      return next();
    }

    // Exporters can only access their own resources
    if (userRole === ROLES.EXPORTER) {
      if (resourceExporterId && resourceExporterId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources.'
        });
      }
      return next();
    }

    // Local users can view shared expenses but not edit exporter resources
    if (userRole === ROLES.LOCAL) {
      // Allow read access to shared expenses
      if (req.method === 'GET' && req.path.includes('shared')) {
        return next();
      }
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. Local users can only view shared expenses.'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions'
    });
  } catch (error) {
    logger.error('Exporter access middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Access verification failed'
    });
  }
};

// Middleware to check if user can access local-specific resources
const requireLocalAccess = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    const resourceUserId = req.params.userId || req.body.userId;
    const userId = req.user.id;

    // Admin can access everything
    if (userRole === ROLES.ADMIN) {
      return next();
    }

    // Local users can only access their own resources
    if (userRole === ROLES.LOCAL) {
      if (resourceUserId && resourceUserId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources.'
        });
      }
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions'
    });
  } catch (error) {
    logger.error('Local access middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Access verification failed'
    });
  }
};

module.exports = {
  requireRole,
  requireExporterAccess,
  requireLocalAccess,
  ROLES
};
