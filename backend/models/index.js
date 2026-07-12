const sequelize = require("../config/db");
const Driver = require("./Driver");
const User = require("./User");
const Vehicle = require("./Vehicle");
const Trip = require("./Trip");
const Maintenance = require("./Maintenance");


// Trip belongs to a Vehicle and a Driver
Vehicle.hasMany(Trip, { foreignKey: "vehicleId" });
Trip.belongsTo(Vehicle, { foreignKey: "vehicleId" }); 

Driver.hasMany(Trip, { foreignKey: "driverId" });
Trip.belongsTo(Driver, { foreignKey: "driverId" }); 

Vehicle.hasMany(Maintenance, { foreignKey: "vehicleId" });
Maintenance.belongsTo(Vehicle, { foreignKey: "vehicleId" });

module.exports = {
  sequelize,
  Driver,  
    User,
    Vehicle,
    Trip,
};