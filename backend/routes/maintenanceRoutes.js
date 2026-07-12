const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');
const {
  createMaintenance, closeMaintenance, getMaintenanceRecords,
} = require('../controllers/maintenanceController');

router.use(protect);

router.get('/', getMaintenanceRecords);
router.post('/', authorize('Fleet Manager'), createMaintenance);
router.put('/:id/close', authorize('Fleet Manager'), closeMaintenance);

module.exports = router;