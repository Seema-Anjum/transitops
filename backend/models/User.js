const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"),
        allowNull: false,
    },
    failedLoginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    isLocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    lockUntil: {
        type: DataTypes.DATE,
        allowNull: true, 
    },
});

module.exports = User;
