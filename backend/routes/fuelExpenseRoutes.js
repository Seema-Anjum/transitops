const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');
const {
  createFuelLog, getFuelLogs,
  createExpense, getExpenses,
  getOperationalCost,
} = require('../controllers/fuelExpenseController');

router.use(protect);

router.post('/fuel', authorize('Fleet Manager', 'Driver'), createFuelLog);
router.get('/fuel', getFuelLogs);

router.post('/expenses', authorize('Fleet Manager', 'Driver'), createExpense);
router.get('/expenses', getExpenses);

router.get('/operational-cost/:vehicleId', authorize('Financial Analyst', 'Fleet Manager'), getOperationalCost);

module.exports = router;