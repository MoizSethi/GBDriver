const RideInfo = require("./models");
const Driver = require("../driver_registration/models");
const Vehicle = require("../vehicle/models");
const Guest = require("../guest/models");
const User = require("../user/models");

// ✅ Create a new ride
exports.createRide = async (req, res) => {
  try {
    const { username } = req.params; // now taken from URL
    if (!username) {
      return res.status(400).json({ success: false, error: "Missing driver username" });
    }

    const driver = await Driver.findOne({ where: { username } });
    if (!driver) {
      return res.status(404).json({ success: false, error: "Driver not found" });
    }

    const {
      serviceType,
      pickupDate,
      pickupTime,
      pickupLocation,
      dropoffLocation,
      multipleStops,
      returnDifferentLocation,
      passengers,
      luggage,
      hours,
      childSeats,
      distanceKm,
      vehicleId,
      userId,
      guestId
    } = req.body;

    if (
      !serviceType || !pickupDate || !pickupTime ||
      !pickupLocation || !dropoffLocation || !distanceKm ||
      !passengers || !luggage
    ) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Ensure either userId or guestId is provided (but not both)
    if ((userId && guestId) || (!userId && !guestId)) {
      return res.status(400).json({
        success: false,
        error: "Ride must be booked by either a user or a guest, not both or neither.",
      });
    }

    // Validate user or guest
    let user = null;
    let guest = null;

    if (userId) {
      user = await User.findOne({ where: { id: userId, driver_id: driver.id } });
      if (!user) {
        return res.status(403).json({ success: false, error: "Invalid user for this driver" });
      }
    }

    if (guestId) {
      guest = await Guest.findOne({ where: { id: guestId, driver_id: driver.id } });
      if (!guest) {
        return res.status(403).json({ success: false, error: "Invalid guest for this driver" });
      }
    }

    // Validate vehicle ownership
    const vehicle = await Vehicle.findOne({ where: { id: vehicleId, driver_id: driver.id } });
    if (!vehicle) {
      return res.status(404).json({ success: false, error: "Vehicle not found or unauthorized" });
    }

    const totalPrice = parseFloat(distanceKm) * parseFloat(vehicle.pricePerKm);

    const stops = Array.isArray(multipleStops)
      ? multipleStops
      : multipleStops
        ? [multipleStops]
        : null;

    const ride = await RideInfo.create({
      service_type: serviceType,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      add_stop: stops,
      return_different_location: returnDifferentLocation || false,
      num_passengers: passengers,
      num_luggage: luggage,
      num_hours: hours || null,
      has_child_seat: childSeats || false,
      distance_km: distanceKm,
      total_price: totalPrice,
      accept_ride: false,
      vehicle_id: vehicleId,
      driver_id: driver.id,
      user_id: user ? user.id : null,
      guest_id: guest ? guest.id : null,
    });

    res.status(200).json({ success: true, ride });
  } catch (error) {
    console.error("❌ Error creating ride:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Fetch all rides for a driver
exports.getAllRides = async (req, res) => {
  try {
    const { username } = req.params; // now from URL
    if (!username) {
      return res.status(400).json({ success: false, error: "Missing driver username" });
    }

    const driver = await Driver.findOne({ where: { username } });
    if (!driver) {
      return res.status(404).json({ success: false, error: "Driver not found" });
    }

    const rides = await RideInfo.findAll({ where: { driver_id: driver.id } });

    res.status(200).json({ success: true, rides });
  } catch (error) {
    console.error("❌ Error fetching rides:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Driver progress (summary)
exports.getDriverProgress = async (req, res) => {
  try {
    const { username } = req.params;
    const driver = await Driver.findOne({ where: { username } });

    if (!driver) {
      return res.status(404).json({ success: false, error: "Driver not found" });
    }

    const rides = await RideInfo.findAll({ where: { driver_id: driver.id } });

    const totalRides = rides.length;
    const totalIncome = rides.reduce((sum, ride) => sum + parseFloat(ride.total_price || 0), 0);
    const totalDistance = rides.reduce((sum, ride) => sum + parseFloat(ride.distance_km || 0), 0);

    res.json({
      success: true,
      data: {
        totalRides,
        totalIncome,
        totalDistance,
        rides,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching progress:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// PATCH /api/ride/:id/accept
exports.updateAcceptRide = async (req, res) => {
  try {
    const { id } = req.params;
    const { accept_ride } = req.body;

    // Validate input
    if (typeof accept_ride !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: '`accept_ride` must be a boolean value (true/false)',
      });
    }

    // Check ride existence
    const ride = await RideInfo.findByPk(id);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    // Update the column
    ride.accept_ride = accept_ride;
    await ride.save();

    return res.status(200).json({
      success: true,
      message: `Ride updated successfully.`,
      data: ride,
    });
  } catch (error) {
    console.error('❌ Error updating accept_ride:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};