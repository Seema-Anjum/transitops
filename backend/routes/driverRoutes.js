const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');
const {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  getExpiringLicenses,
} = require('../controllers/driverController');

router.use(protect);

router.get('/', getDrivers);
router.get('/expiring-licenses', authorize('Safety Officer', 'Fleet Manager'), getExpiringLicenses);
router.get('/:id', getDriverById);
router.post('/', authorize('Fleet Manager'), createDriver);
router.put('/:id', authorize('Fleet Manager', 'Safety Officer'), updateDriver);
router.delete('/:id', authorize('Fleet Manager'), deleteDriver);

module.exports = router;