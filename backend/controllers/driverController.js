const Driver = require('../models/Driver');
const { Op } = require('sequelize');

const createDriver = async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'License number already exists' });
    }
    res.status(500).json({ message: err.message });
  }
};

const getDrivers = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const drivers = await Driver.findAll({ where });

    // Flag expired licenses 
    const today = new Date().toISOString().split('T')[0];
    const enriched = drivers.map(d => ({
      ...d.toJSON(),
      licenseExpired: d.licenseExpiryDate < today,
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    if (req.body.status === 'On Trip') {
      return res.status(400).json({ message: 'Status "On Trip" is set automatically by trip dispatch' });
    }

    await driver.update(req.body);
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    if (driver.status === 'On Trip') {
      return res.status(400).json({ message: 'Cannot delete a driver currently on a trip' });
    }

    await driver.destroy();
    res.json({ message: 'Driver deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Safety Officer specific: drivers with expiring/expired licenses
const getExpiringLicenses = async (req, res) => {
  try {
    const today = new Date();
    const in30Days = new Date();
    in30Days.setDate(today.getDate() + 30);

    const drivers = await Driver.findAll({
      where: {
        licenseExpiryDate: { [Op.lte]: in30Days.toISOString().split('T')[0] },
      },
    });

    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  getExpiringLicenses,
};