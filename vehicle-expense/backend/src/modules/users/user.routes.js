const express = require('express');
const { body } = require('express-validator');
const userController = require('./user.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation rules
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('company.name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('profile.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('preferences.currency')
    .optional()
    .isIn(['USD', 'JPY', 'LKR', 'EUR'])
    .withMessage('Invalid currency')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

const deactivateValidation = [
  body('password')
    .notEmpty()
    .withMessage('Password is required for account deactivation')
];

// Admin routes
router.get('/', requireRole('ROLE_ADMIN'), userController.getUsers);
router.get('/exporters', userController.getExporters);
router.get('/local-users', userController.getLocalUsers);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidation, userController.updateProfile);
router.put('/change-password', changePasswordValidation, userController.changePassword);
router.put('/deactivate', deactivateValidation, userController.deactivateAccount);

// Get user by ID (admin only)
router.get('/:id', requireRole('ROLE_ADMIN'), userController.getUserById);

module.exports = router;
