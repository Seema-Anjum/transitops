const { FuelLog, Expense, Maintenance, Vehicle } = require('../models');

// Fuel logs
const createFuelLog = async (req, res) => {
  try {
    const { vehicleId, liters, cost, date } = req.body;
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const log = await FuelLog.create({ vehicleId, liters, cost, date });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFuelLogs = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    const where = {};
    if (vehicleId) where.vehicleId = vehicleId;

    const logs = await FuelLog.findAll({ where, order: [['date', 'DESC']] });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Expenses
const createExpense = async (req, res) => {
  try {
    const { vehicleId, type, amount, date, notes } = req.body;
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const expense = await Expense.create({ vehicleId, type, amount, date, notes });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    const where = {};
    if (vehicleId) where.vehicleId = vehicleId;

    const expenses = await Expense.findAll({ where, order: [['date', 'DESC']] });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Auto-computed total operational cost per vehicle: Fuel + Maintenance
const getOperationalCost = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const fuelLogs = await FuelLog.findAll({ where: { vehicleId } });
    const maintenanceRecords = await Maintenance.findAll({ where: { vehicleId } });
    const expenses = await Expense.findAll({ where: { vehicleId } });

    const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0);
    const totalMaintenanceCost = maintenanceRecords.reduce((sum, m) => sum + m.cost, 0);
    const totalExpenseCost = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Spec formula: Fuel + Maintenance (expenses like tolls tracked separately, shown too)
    const totalOperationalCost = totalFuelCost + totalMaintenanceCost;

    res.json({
      vehicleId: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      totalFuelCost,
      totalMaintenanceCost,
      totalExpenseCost,
      totalOperationalCost,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createFuelLog, getFuelLogs,
  createExpense, getExpenses,
  getOperationalCost,
};