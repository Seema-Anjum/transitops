const { Trip, Vehicle, Driver }  = require('../models');

// Create trip (Draft Status)
const createTrip = async(req, res) => {
    try{
        const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance } = req.body;

        const vehicle = await Vehicle.findByPk(vehicleId);
        const driver = await Driver.findByPk(driverId);

        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        // Rule 1: Retired or Inshop vehicles must never appear in dispatch selection 
        if (['Retired', 'Inshop'].includes(vehicle.status)) {
            return res.status(400).json({ message: `Vehicle id ${vehicle.status} and cannot be assigned`})
        }
        // Rule 2: vehicle already On Trip cannot be assigned again
        if (vehicle.status === 'On Trip') {
            return res.status(400).json({ message: 'Vehicle is already on another trip' });
        }
        // Rule 3: expired license or suspended driver cannot be assigned 
        const today = new Date().toISOString().split('T')[0];
        if (driver.licenseExpiryDate < today) {
            return res.status(400).json({ message: 'Driver license has expired' });
        } 
        if (driver.status === 'Suspended') {
            return res.status(400).json({ message: 'Driver is suspended and cannot be assigned' });
        }
        if (driver.status === 'On Trip') {
            return res.status(400).json({ message: 'Driver is already on another trip' });
        }

        // Rule 4: cargo weight must not exceed vehicle max load capacity
        if (cargoWeight > vehicle.maxLoadCapacity) {
            return res.status(400).json({ message: `Cargo weight (${cargoWeight}kg) exceeds vehicle capacity (${vehicle.maxLoadCapacity}kg)` });
        }
    
        const trip = await Trip.create({
            source, destination, vehicleId, driverId, cargoWeight, plannedDistance, status: 'Draft'
        });
        res.status(201).json(trip);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: err.message });
    }
}

//Dispatch trip: Draft -> Dispatched, vehicle & driver -> On Trip 
const dispatchTrip = async(req, res) => {
    try {
        const trip = await Trip.findByPk(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        if (trip.status !== 'Draft') {
            return res.status(400).json({ message: `Cannot dispatch a trip that is ${trip.status}` });
        }

        const vehicle = await Vehicle.findByPk(trip.vehicleId);
        const driver = await Driver.findByPk(trip.driverId);

    // Re-validate availability at dispatch time 
    if (vehicle.status !== 'Available') {
      return res.status(400).json({ message: 'Vehicle is no longer available' });
    }
    if (driver.status !== 'Available') {
      return res.status(400).json({ message: 'Driver is no longer available' });
    }

    trip.status = 'Dispatched';
    trip.dispatchedAt = new Date();
    await trip.save();

    vehicle.status = 'On Trip';
    await vehicle.save();

    driver.status = 'On Trip';
    await driver.save();

    res.json({ message: 'Trip dispatched', trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Complete trip: Dispatched -> Completed, vehicle & driver -> Available
const completeTrip = async (req, res) => {
  try {
    const { finalOdometer, fuelConsumed } = req.body;
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.status !== 'Dispatched') {
      return res.status(400).json({ message: `Cannot complete a trip that is ${trip.status}` });
    }

    trip.status = 'Completed';
    trip.completedAt = new Date();
    trip.finalOdometer = finalOdometer;
    trip.fuelConsumed = fuelConsumed;
    await trip.save();

    const vehicle = await Vehicle.findByPk(trip.vehicleId);
    vehicle.status = 'Available';
    if (finalOdometer) vehicle.odometer = finalOdometer;
    await vehicle.save();

    const driver = await Driver.findByPk(trip.driverId);
    driver.status = 'Available';
    await driver.save();

    res.json({ message: 'Trip completed', trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancel trip: restores vehicle/driver to Available if it was Dispatched
const cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (!['Draft', 'Dispatched'].includes(trip.status)) {
      return res.status(400).json({ message: `Cannot cancel a trip that is ${trip.status}` });
    }

    const wasDispatched = trip.status === 'Dispatched';

    trip.status = 'Cancelled';
    await trip.save();

    if (wasDispatched) {
      const vehicle = await Vehicle.findByPk(trip.vehicleId);
      vehicle.status = 'Available';
      await vehicle.save();

      const driver = await Driver.findByPk(trip.driverId);
      driver.status = 'Available';
      await driver.save();
    }

    res.json({ message: 'Trip cancelled', trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTrips = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const trips = await Trip.findAll({
      where,
      include: [{ model: Vehicle }, { model: Driver }],
      order: [['createdAt', 'DESC']],
    });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTrip, dispatchTrip, completeTrip, cancelTrip, getTrips };

