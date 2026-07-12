const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  licenseCategory: {
    type: DataTypes.STRING, // e.g. LMV, HMV
    allowNull: false,
  },
  licenseExpiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  safetyScore: {
    type: DataTypes.FLOAT,
    defaultValue: 100,
  },
  status: {
    type: DataTypes.ENUM('Available', 'On Trip', 'Off Duty', 'Suspended'),
    defaultValue: 'Available',
  },
});

module.exports = Driver;