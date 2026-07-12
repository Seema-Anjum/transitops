const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FuelLog = sequelize.define('FuelLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  liters: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = FuelLog;