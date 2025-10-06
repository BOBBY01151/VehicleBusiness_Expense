const express = require('express');
const { body } = require('express-validator');
const partController = require('./part.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Parts management routes
router.get('/', requireRole('ROLE_EXPORTER'), partController.getParts);
router.post('/', requireRole('ROLE_EXPORTER'), partController.createPart);

module.exports = router;
