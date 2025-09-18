const Vehicle = require("./models");
const Driver = require("../driver_registration/models");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// 🛠 Multer setup (dynamic storage per driver.username)
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { username } = req.params; // 👈 username from route

      if (!username) return cb(new Error("Missing driver username"), null);

      const driver = await Driver.findOne({ where: { username } });
      if (!driver) return cb(new Error(`Driver not found for username: ${username}`), null);

      const vehicleBrand = req.body.vehicleBrand || "unknown_brand";
      const folderName = vehicleBrand.replace(/\s+/g, "_");

      // Save under ./public/images/vehicles/<username>/<brand>
      const folderPath = `./public/images/vehicles/${username}/${folderName}`;
      fs.mkdirSync(folderPath, { recursive: true });

      cb(null, folderPath);
    } catch (err) {
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage }).array("images", 3); // Max 3 images

// ✅ Add Vehicle (driver by username)
exports.addVehicle = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    try {
      const { username } = req.params; // 👈 username from route
      if (!username) return res.status(400).json({ success: false, error: "Missing username" });

      const driver = await Driver.findOne({ where: { username } });
      if (!driver) return res.status(404).json({ success: false, error: "Driver not found" });

      const {
        vehicleBrand,
        vehicleModel,
        vehicleColor,
        productionYear,
        numberPlate,
        luggage,
        passengers,
        flat_rate,
        pricePerKm,
      } = req.body;

      if (!vehicleBrand || !luggage || !passengers || !flat_rate || !pricePerKm) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }

      const folderName = vehicleBrand.replace(/\s+/g, "_");
      const imagePaths = req.files.map(file =>
        `/images/vehicles/${username}/${folderName}/${file.filename}`
      );

      const newVehicle = await Vehicle.create({
        vehicleBrand,
        vehicleModel,
        vehicleColor,
        productionYear,
        numberPlate,
        luggage,
        passengers,
        flat_rate,
        pricePerKm,
        driver_id: driver.id, // associate vehicle with driver
        images: imagePaths.length > 0 ? imagePaths : null,
      });

      res.status(200).json({ success: true, message: "Vehicle added", vehicle: newVehicle });
    } catch (error) {
      console.error("❌ Error adding vehicle:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

// ✅ Get Vehicles (driver by username)
exports.getVehicles = async (req, res) => {
  try {
    const { username } = req.params; // 👈 username from route
    if (!username) return res.status(400).json({ success: false, error: "Missing username" });

    const driver = await Driver.findOne({ where: { username } });
    if (!driver) {
      console.log(`Driver not found for username: ${username}`);
      return res.status(404).json({ success: false, error: "Driver not found" });
    }

    const vehicles = await Vehicle.findAll({
      where: { driver_id: driver.id },
      order: [["vehicleBrand", "ASC"]],
    });

    const formattedVehicles = vehicles.map(vehicle => ({
      ...vehicle.dataValues,
      images: vehicle.images || [],
    }));

    res.status(200).json({ success: true, vehicles: formattedVehicles });
  } catch (error) {
    console.error("❌ Error fetching vehicles:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
