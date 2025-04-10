const RideInfo = require("./models");

exports.createRide = async (req, res) => {
  try {
    const {
      rideType,
      pickupLocation,
      dropoffLocation,
      pickupDateTime,
      numPassengers,
      addStop,
      flightNumber,
      numLuggage,
      numHours,
      hasChildSeat
    } = req.body;

    // ✅ Ensure required fields are present
    if (!rideType || !pickupLocation || !dropoffLocation || !pickupDateTime || !numPassengers || !numLuggage) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // ✅ Validate addStop is an array or null
    const stops = Array.isArray(addStop) ? addStop : (addStop ? [addStop] : null);

    // ✅ Create new ride in DB
    const ride = await RideInfo.create({
      ride_type: rideType,
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      pickup_datetime: pickupDateTime,
      add_stop: stops,
      flight_number: flightNumber,
      num_passengers: numPassengers,
      num_hours: numHours || null,
      num_luggage: numLuggage,
      has_child_seat: hasChildSeat || false
    });

    res.status(200).json({ success: true, ride });
  } catch (error) {
    console.error("❌ Error creating ride:", error);
    res.status(500).json({ success: false, error: error.message });
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