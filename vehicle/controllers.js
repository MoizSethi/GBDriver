const Vehicle = require("./models");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// ✅ Configure Multer for multiple file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const vehicleName = req.body.name ? req.body.name.replace(/\s+/g, "_") : "default_vehicle"; // Default if `name` is missing
    const folderPath = `./public/images/vehicles/${vehicleName}`;

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath); // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File name
  }
});

// ✅ Multer middleware for multiple image uploads
const upload = multer({ storage }).array("images", 3); // Allow up to 3 images

// ✅ Add Vehicle with Multiple Images
exports.addVehicle = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

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
      } = req.body;

      // Check for required fields
      if (!luggage || !passengers || !flat_rate) {
        return res.status(400).json({ success: false, error: "Required fields are missing." });
      }

      // Map image files to their respective paths
      const imagePaths = req.files.map(file =>
        `/images/vehicles/${vehicleBrand.replace(/\s+/g, "_")}/${file.filename}`
      );

      // Create the new vehicle entry in the database
      const newVehicle = await Vehicle.create({
        vehicleBrand,
        vehicleModel,
        vehicleColor,
        productionYear,
        numberPlate,
        luggage,
        passengers,
        flat_rate,
        images: imagePaths.length > 0 ? imagePaths : null, // Store images as JSON array
      });

      res.status(201).json({ success: true, message: "Vehicle added", vehicle: newVehicle });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

// ✅ Get All Vehicles Sorted by Vehicle Brand (Including Images)
exports.getVehicles = async (req, res) => {
  try {
    // Fetch all vehicles, sorted by vehicle brand
    const vehicles = await Vehicle.findAll({ order: [["vehicleBrand", "ASC"]] });

    // Format the vehicles data to include the images array
    const formattedVehicles = vehicles.map(vehicle => ({
      ...vehicle.dataValues,
      images: vehicle.images || [] // Ensure images are included, even if empty
    }));

    res.status(200).json({ success: true, vehicles: formattedVehicles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
