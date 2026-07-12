const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getDashboardKPIs } = require('../controllers/dashboardController');

router.use(protect);
router.get('/', getDashboardKPIs);

module.exports = router;