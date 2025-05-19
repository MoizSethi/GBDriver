const { RideInfo, Vehicle } = require("./models");

exports.createRide = async (req, res) => {
  try {
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
      vehicleId, // required to calculate price
    } = req.body;

    // Basic field validation
    if (
      !serviceType || !pickupDate || !pickupTime ||
      !pickupLocation || !dropoffLocation || !distanceKm ||
      !passengers || !luggage
    ) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Fetch vehicle to calculate price
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, error: "Vehicle not found" });
    }

    // Calculate total price
    const totalPrice = parseFloat(distanceKm) * parseFloat(vehicle.pricePerKm);

    // Normalize multiple stops (array or null)
    const stops = Array.isArray(multipleStops)
      ? multipleStops
      : multipleStops
      ? [multipleStops]
      : null;

    // Save ride to DB
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
      vehicle_id: vehicleId
    });

    return res.status(200).json({ success: true, ride });

  } catch (error) {
    console.error("❌ Error creating ride:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllRides = async (req, res) => {
  try {
    const rides = await RideInfo.findAll();
    res.status(200).json({ success: true, rides });
  } catch (error) {
    console.error("❌ Error fetching rides:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
