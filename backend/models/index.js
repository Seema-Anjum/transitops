const sequelize = require("../config/db");
const Driver = require("./Driver");
const User = require("./User");
const Vehicle = require("./Vehicle");
const Trip = require("./Trip");

// Trip belongs to a Vehicle and a Driver
Vehicle.hasMany(Trip, { foreignKey: "vehicleId" });
Trip.belongsTo(Vehicle, { foreignKey: "vehicleId" }); 

Driver.hasMany(Trip, { foreignKey: "driverId" });
Trip.belongsTo(Driver, { foreignKey: "driverId" }); 

module.exports = {
  sequelize,
  Driver,  
    User,
    Vehicle,
    Trip,
};