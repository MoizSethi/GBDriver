const Vehicle = require("./models");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// ✅ Configure Multer for multiple file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const vehicleName = req.body.name.replace(/\s+/g, "_"); // Remove spaces from name
    const folderPath = `./public/images/vehicles/${vehicleName}`;
    
    // ✅ Create folder dynamically if it doesn’t exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// ✅ Multer middleware for multiple image uploads
const upload = multer({ storage }).array("images", 3); // Allow up to 3 images

// ✅ Add Vehicle with Multiple Images
exports.addVehicle = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    console.log("Uploaded Files:", req.files);

    try {
      const { name, type, luggage, passengers, flat_rate, available } = req.body;

      if (!name || !type || !luggage || !passengers || !flat_rate) {
        return res.status(400).json({ success: false, error: "All fields are required." });
      }

      // ✅ Store image URLs in the database
      let imagePaths = req.files.map(file => `/images/vehicles/${name.replace(/\s+/g, "_")}/${file.filename}`);
      console.log("Image Paths to Store:", imagePaths);

      const newVehicle = await Vehicle.create({
        name,
        type,
        luggage,
        passengers,
        flat_rate,
        available: available === "true",
        images: imagePaths.length > 0 ? imagePaths : null,
      });

      res.status(201).json({ success: true, message: "Vehicle added", vehicle: newVehicle });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

// ✅ Get All Vehicles Sorted by Name (Including Images)
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({ order: [["name", "ASC"]] }); // ✅ Sort by name

    // ✅ Parse image paths before sending response
    const formattedVehicles = vehicles.map(vehicle => ({
      ...vehicle.dataValues,
      images: vehicle.images || []
    }));

    res.status(200).json({ success: true, vehicles: formattedVehicles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
