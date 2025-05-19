const Vehicle = require("./models");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// 🛠 Configure Multer for vehicle images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const vehicleBrand = req.body.vehicleBrand || "unknown_brand";
    const folderName = vehicleBrand.replace(/\s+/g, "_");
    const folderPath = `./public/images/vehicles/${folderName}`;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage }).array("images", 3); // Max 3 images

// ✅ Add Vehicle
exports.addVehicle = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    try {
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

      // Validate required fields
      if (!vehicleBrand || !luggage || !passengers || !flat_rate || !pricePerKm) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }

      // Normalize image paths
      const folderName = vehicleBrand.replace(/\s+/g, "_");
      const imagePaths = req.files.map(file =>
        `/images/vehicles/${folderName}/${file.filename}`
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
        images: imagePaths.length > 0 ? imagePaths : null,
      });

      return res.status(201).json({ success: true, message: "Vehicle added", vehicle: newVehicle });
    } catch (error) {
      console.error("❌ Error adding vehicle:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });
};

// ✅ Get All Vehicles
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
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
