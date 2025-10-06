const express = require('express');
const { body, param } = require('express-validator');
const expenseController = require('./expense.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { requireRole, requireExporterAccess, requireLocalAccess } = require('../../middleware/role.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation rules
const createExpenseValidation = [
  body('category')
    .isIn([
      'vehicle_purchase',
      'freight_shipping',
      'packaging',
      'insurance',
      'customs_duty',
      'inspection',
      'documentation',
      'storage',
      'transportation',
      'other'
    ])
    .withMessage('Invalid expense category'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 0 })
    .withMessage('Amount must be positive'),
  body('currency')
    .isIn(['USD', 'JPY', 'LKR', 'EUR'])
    .withMessage('Invalid currency'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters')
];

const updateExpenseValidation = [
  body('category')
    .optional()
    .isIn([
      'vehicle_purchase',
      'freight_shipping',
      'packaging',
      'insurance',
      'customs_duty',
      'inspection',
      'documentation',
      'storage',
      'transportation',
      'other'
    ])
    .withMessage('Invalid expense category'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 0 })
    .withMessage('Amount must be positive'),
  body('currency')
    .optional()
    .isIn(['USD', 'JPY', 'LKR', 'EUR'])
    .withMessage('Invalid currency'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date')
];

const shareExpenseValidation = [
  body('userIds')
    .isArray({ min: 1 })
    .withMessage('At least one user ID is required'),
  body('userIds.*')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

const updateShareStatusValidation = [
  body('status')
    .isIn(['pending', 'accepted', 'rejected', 'requested_info'])
    .withMessage('Invalid status'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

// Exporter routes
router.post('/', requireRole('ROLE_EXPORTER'), createExpenseValidation, expenseController.createExpense);
router.get('/', requireRole('ROLE_EXPORTER'), expenseController.getExpenses);
router.get('/statistics', requireRole('ROLE_EXPORTER'), expenseController.getStatistics);
router.get('/:id', expenseController.getExpenseById);
router.put('/:id', requireRole('ROLE_EXPORTER'), updateExpenseValidation, expenseController.updateExpense);
router.delete('/:id', requireRole('ROLE_EXPORTER'), expenseController.deleteExpense);
router.post('/:id/share', requireRole('ROLE_EXPORTER'), shareExpenseValidation, expenseController.shareExpense);

// Local user routes
router.get('/shared/me', requireRole('ROLE_LOCAL'), expenseController.getSharedExpenses);
router.put('/:id/share/:userId', updateShareStatusValidation, expenseController.updateShareStatus);

// Admin routes
router.get('/admin/all', requireRole('ROLE_ADMIN'), expenseController.getAllExpenses);

module.exports = router;
