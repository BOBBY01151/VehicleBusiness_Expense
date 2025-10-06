const express = require('express');
const { body } = require('express-validator');
const authController = require('./auth.controller');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('role')
    .isIn(['ROLE_EXPORTER', 'ROLE_LOCAL', 'ROLE_ADMIN'])
    .withMessage('Invalid role')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.use(authMiddleware); // All routes below require authentication

router.post('/logout', authController.logout);
router.post('/logout-all', authController.logoutAll);
router.get('/profile', authController.getProfile);
router.get('/sessions', authController.getSessions);

module.exports = router;
