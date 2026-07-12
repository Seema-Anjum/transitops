const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');
const {
  createTrip, dispatchTrip, completeTrip, cancelTrip, getTrips,
} = require('../controllers/tripController');

router.use(protect);

router.get('/', getTrips);
router.post('/', authorize('Driver', 'Fleet Manager'), createTrip);
router.put('/:id/dispatch', authorize('Driver', 'Fleet Manager'), dispatchTrip);
router.put('/:id/complete', authorize('Driver', 'Fleet Manager'), completeTrip);
router.put('/:id/cancel', authorize('Driver', 'Fleet Manager'), cancelTrip);

module.exports = router;