const  RideInfo  = require("./models");
const Driver = require("../driver_registration/models") 
const Vehicle = require("../vehicle/models") 
const Guest = require("../guest/models") 
const User = require("../user/models"); 

// Helper: extract subdomain from host
function getSubdomain(host) {
  if (!host) return null;
  const parts = host.split(".");
  if (parts.length < 2) return null;
  return parts[0];
}

exports.createRide = async (req, res) => {
  try {
    // const subdomain = req.header('X-Subdomain');
    const host = req.headers.host; // e.g., driver1.localhost:5000
    const subdomain = host.split('.')[0]; 
    console.log('Subdomain received for ride info:', subdomain);
    if (!subdomain) return res.status(400).json({ success: false, error: "Missing subdomain" });

    const driver = await Driver.findOne({ where: { subdomain } });
    if (!driver) return res.status(404).json({ success: false, error: "Driver not found" });

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

    //validate either user or guest has been passed at a time
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

    // Fetch vehicle and ensure it belongs to this driver
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

exports.getAllRides = async (req, res) => {
  try {
    // const subdomain = req.headers["x-subdomain"];
    const host = req.headers.host; // e.g., driver1.localhost:5000
    const subdomain = host.split('.')[0]; 
    if (!subdomain) return res.status(400).json({ success: false, error: "Missing subdomain" });

    const driver = await Driver.findOne({ where: { subdomain } });
    if (!driver) return res.status(404).json({ success: false, error: "Driver not found" });

    // Only fetch rides for this driver
    const rides = await RideInfo.findAll({ where: { driver_id: driver.id } });

    res.status(200).json({ success: true, rides });
  } catch (error) {
    console.error("❌ Error fetching rides:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
