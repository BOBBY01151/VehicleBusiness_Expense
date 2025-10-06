const express = require('express');
const shipmentController = require('./shipment.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Shipment management routes
router.get('/', requireRole('ROLE_EXPORTER'), shipmentController.getShipments);
router.post('/', requireRole('ROLE_EXPORTER'), shipmentController.createShipment);

module.exports = router;
