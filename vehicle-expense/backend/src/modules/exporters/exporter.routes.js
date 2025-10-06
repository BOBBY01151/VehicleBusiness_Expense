const express = require('express');
const { body } = require('express-validator');
const exporterController = require('./exporter.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { requireRole, requireExporterAccess } = require('../../middleware/role.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation rules
const updateProfileValidation = [
  body('company.name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('company.registrationNumber')
    .trim()
    .notEmpty()
    .withMessage('Company registration number is required'),
  body('company.address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('company.address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('company.address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('company.address.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),
  body('company.contact.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('company.contact.email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('business.type')
    .isIn(['vehicle_exporter', 'parts_supplier', 'both'])
    .withMessage('Invalid business type'),
  body('preferences.currency')
    .optional()
    .isIn(['USD', 'JPY', 'LKR', 'EUR'])
    .withMessage('Invalid currency')
];

const uploadDocumentValidation = [
  body('documentType')
    .isIn(['business_license', 'tax_certificate', 'export_license', 'insurance'])
    .withMessage('Invalid document type'),
  body('url')
    .isURL()
    .withMessage('Please provide a valid URL')
];

// Public routes (for local users to see verified exporters)
router.get('/public', exporterController.getPublicExporters);

// Exporter profile routes
router.get('/profile', requireRole('ROLE_EXPORTER'), exporterController.getProfile);
router.put('/profile', requireRole('ROLE_EXPORTER'), updateProfileValidation, exporterController.updateProfile);
router.get('/statistics', requireRole('ROLE_EXPORTER'), exporterController.getStatistics);
router.post('/documents', requireRole('ROLE_EXPORTER'), uploadDocumentValidation, exporterController.uploadDocuments);

// Admin routes
router.get('/', requireRole('ROLE_ADMIN'), exporterController.getExporters);
router.get('/:id', requireRole('ROLE_ADMIN'), exporterController.getExporterById);
router.put('/:id/verify', requireRole('ROLE_ADMIN'), exporterController.verifyExporter);

module.exports = router;
