const { Vehicle, Trip, Maintenance, FuelLog } = require('../models');

const getVehicleReport = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const trips = await Trip.findAll({ where: { vehicleId, status: 'Completed' } });
    const maintenanceRecords = await Maintenance.findAll({ where: { vehicleId } });
    const fuelLogs = await FuelLog.findAll({ where: { vehicleId } });

    const totalDistance = trips.reduce((sum, t) => sum + (t.plannedDistance || 0), 0);
    const totalFuel = fuelLogs.reduce((sum, f) => sum + f.liters, 0);
    const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0);
    const totalMaintenanceCost = maintenanceRecords.reduce((sum, m) => sum + m.cost, 0);

    // Fuel Efficiency = Distance / Fuel (km per liter)
    const fuelEfficiency = totalFuel > 0 ? (totalDistance / totalFuel).toFixed(2) : null;

    // Operational Cost = Fuel + Maintenance
    const operationalCost = totalFuelCost + totalMaintenanceCost;

    // Revenue isn't captured elsewhere in the system, 
    // so we can accept it as a query parameter for this report
    const revenue = parseFloat(req.query.revenue) || 0;

    // Vehicle ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
    const roi = vehicle.acquisitionCost > 0
      ? (((revenue - operationalCost) / vehicle.acquisitionCost) * 100).toFixed(2)
      : null;

    res.json({
      vehicleId: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      totalDistance,
      totalFuel,
      fuelEfficiency: fuelEfficiency ? `${fuelEfficiency} km/l` : 'N/A (no fuel logged)',
      totalFuelCost,
      totalMaintenanceCost,
      operationalCost,
      revenue,
      roi: roi !== null ? `${roi}%` : 'N/A',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fleet-wide summary across all vehicles
const getFleetReport = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();

    const reports = await Promise.all(vehicles.map(async (vehicle) => {
      const trips = await Trip.findAll({ where: { vehicleId: vehicle.id, status: 'Completed' } });
      const maintenanceRecords = await Maintenance.findAll({ where: { vehicleId: vehicle.id } });
      const fuelLogs = await FuelLog.findAll({ where: { vehicleId: vehicle.id } });

      const totalDistance = trips.reduce((sum, t) => sum + (t.plannedDistance || 0), 0);
      const totalFuel = fuelLogs.reduce((sum, f) => sum + f.liters, 0);
      const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0);
      const totalMaintenanceCost = maintenanceRecords.reduce((sum, m) => sum + m.cost, 0);

      return {
        vehicleId: vehicle.id,
        registrationNumber: vehicle.registrationNumber,
        status: vehicle.status,
        fuelEfficiency: totalFuel > 0 ? `${(totalDistance / totalFuel).toFixed(2)} km/l` : 'N/A',
        operationalCost: totalFuelCost + totalMaintenanceCost,
      };
    }));

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getVehicleReport, getFleetReport };