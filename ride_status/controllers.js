// backend/rideStatus/rideStatus.controller.js
const RideStatus = require  ("./models");


exports.updateRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { flag } = req.body; // e.g. { flag: "arrived" }

    if (!flag) {
      return res.status(400).json({ success: false, error: "Flag is required" });
    }

    const rideStatus = await RideStatus.findOne({ where: { ride_id: rideId } });

    if (!rideStatus) {
      return res.status(404).json({ success: false, error: "RideStatus not found" });
    }

    if (!(flag in rideStatus)) {
      return res.status(400).json({ success: false, error: "Invalid flag name" });
    }

    rideStatus[flag] = true;
    rideStatus.lastUpdated = new Date();

    await rideStatus.save();

    res.json({ success: true, data: rideStatus });
  } catch (err) {
    console.error("❌ updateRideStatus Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    const rideStatus = await RideStatus.findOne({ where: {  ride_id: rideId  } });

    if (!rideStatus) {
      return res.status(404).json({ success: false, error: "RideStatus not found" });
    }

    res.json({ success: true, data: rideStatus });
  } catch (err) {
    console.error("❌ getRideStatus Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
