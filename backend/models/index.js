const sequelize = require("../config/db");
const Driver = require("./Driver");
const User = require("./User");
const Vehicle = require("./Vehicle");
const Trip = require("./Trip");
const Maintenance = require("./Maintenance");
const FuelLog = require("./FuelLog");
const Expense = require("./Expense");


// Trip belongs to a Vehicle and a Driver
Vehicle.hasMany(Trip, { foreignKey: "vehicleId" });
Trip.belongsTo(Vehicle, { foreignKey: "vehicleId" }); 

Driver.hasMany(Trip, { foreignKey: "driverId" });
Trip.belongsTo(Driver, { foreignKey: "driverId" }); 

// Maintenance belongs to a Vehicle
Vehicle.hasMany(Maintenance, { foreignKey: "vehicleId" });
Maintenance.belongsTo(Vehicle, { foreignKey: "vehicleId" });

// FuelLog and Expense belong to a Vehicle
Vehicle.hasMany(FuelLog, { foreignKey: "vehicleId" });
FuelLog.belongsTo(Vehicle, { foreignKey: "vehicleId" });

Vehicle.hasMany(Expense, { foreignKey: "vehicleId" });
Expense.belongsTo(Vehicle, { foreignKey: "vehicleId" });

module.exports = {
  sequelize,
  Driver,  
    User,
    Vehicle,
    Trip,
    Maintenance,
    FuelLog,
    Expense
};