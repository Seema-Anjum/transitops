const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');
const {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');

router.use(protect); // all routes below require login

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', authorize('Fleet Manager'), createVehicle);
router.put('/:id', authorize('Fleet Manager'), updateVehicle);
router.delete('/:id', authorize('Fleet Manager'), deleteVehicle);

module.exports = router;