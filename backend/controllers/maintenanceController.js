const { Maintenance, Vehicle } = require('../models');

// Create maintenance record: vehicle -> In Shop
const createMaintenance = async (req, res) => {
  try {
    const { vehicleId, description, cost } = req.body;

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    if (vehicle.status === 'On Trip') {
      return res.status(400).json({ message: 'Cannot send a vehicle to maintenance while it is on a trip' });
    }
    if (vehicle.status === 'Retired') {
      return res.status(400).json({ message: 'Cannot create maintenance for a retired vehicle' });
    }

    const record = await Maintenance.create({ vehicleId, description, cost, status: 'Active' });

    vehicle.status = 'In Shop';
    await vehicle.save();

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Close maintenance: vehicle -> Available (unless Retired)
const closeMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Maintenance record not found' });
    if (record.status !== 'Active') {
      return res.status(400).json({ message: 'Maintenance record is already closed' });
    }

    record.status = 'Closed';
    record.closedAt = new Date();
    await record.save();

    const vehicle = await Vehicle.findByPk(record.vehicleId);
    if (vehicle.status !== 'Retired') {
      vehicle.status = 'Available';
      await vehicle.save();
    }

    res.json({ message: 'Maintenance closed', record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMaintenanceRecords = async (req, res) => {
  try {
    const { status, vehicleId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (vehicleId) where.vehicleId = vehicleId;

    const records = await Maintenance.findAll({
      where,
      include: [{ model: Vehicle }],
      order: [['startedAt', 'DESC']],
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createMaintenance, closeMaintenance, getMaintenanceRecords };