const Vehicle = require('../models/Vehicle');

// Create vehicle
const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Registration number already exists' });
    }
    res.status(500).json({ message: err.message });
  }
};

// Get all vehicles (with optional filters)
const getVehicles = async (req, res) => {
  try {
    const { status, type } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const vehicles = await Vehicle.findAll({ where });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single vehicle
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update vehicle
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

   // Prevent manual status changes to 'On Trip' or 'In Shop'
    if (req.body.status && ['On Trip', 'In Shop'].includes(req.body.status)) {
      return res.status(400).json({
        message: 'Status cannot be manually set to On Trip or In Shop — these are automatic.',
      });
    }

    await vehicle.update(req.body);
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete vehicle 
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    if (vehicle.status === 'On Trip') {
      return res.status(400).json({ message: 'Cannot delete a vehicle that is currently on a trip' });
    }

    await vehicle.destroy();
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createVehicle, getVehicles, getVehicleById, updateVehicle, deleteVehicle };