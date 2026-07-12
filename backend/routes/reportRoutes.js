const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');
const { getVehicleReport, getFleetReport } = require('../controllers/reportController');

router.use(protect);
router.get('/fleet', authorize('Financial Analyst', 'Fleet Manager'), getFleetReport);
router.get('/vehicle/:vehicleId', authorize('Financial Analyst', 'Fleet Manager'), getVehicleReport);

module.exports = router;