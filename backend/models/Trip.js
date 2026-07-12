const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Trip = sequelize.define('Trip', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cargoWeight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    plannedDistance: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    finalOdometer: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Draft', 'Dispatched', 'Completed', 'Cancelled'),
        defaultValue: 'Draft',
    },
    dispatchedAt: { type: DataTypes.DATE, allowNull: true },
    completedAt: { type: DataTypes.DATE, allowNull: true },
});

module.exports = Trip;