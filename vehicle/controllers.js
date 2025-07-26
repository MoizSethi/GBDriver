const Vehicle = require("./models");
const Driver = require("../driver_registration/models"); // Adjust if needed
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// 🔍 Extract subdomain helper
function getSubdomain(host) {
  if (!host) return null;
  const parts = host.split(".");
  if (parts.length < 2) return null;
  return parts[0];
}

// 🛠 Multer setup (dynamic driver-aware storage)
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const host = req.headers.host;
      const subdomain = getSubdomain(host);
      if (!subdomain) return cb(new Error("Missing subdomain"), null);

      const driver = await Driver.findOne({ where: { subdomain } });
      if (!driver) return cb(new Error("Driver not found for subdomain"), null);

      const vehicleBrand = req.body.vehicleBrand || "unknown_brand";
      const folderName = vehicleBrand.replace(/\s+/g, "_");

      const folderPath = `./public/images/vehicles/${subdomain}/${folderName}`;
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

// ✅ Add Vehicle (multi-tenant)
exports.addVehicle = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    try {
      const subdomain = req.header('X-Subdomain');
      // const host = req.headers.host; // e.g., driver1.localhost:5000
      // const subdomain = host.split('.')[0]; 
      console.log('Subdomain received for vehicle:', subdomain); // debug log
      if (!subdomain) return res.status(400).json({ success: false, error: "Missing subdomain" });

      const driver = await Driver.findOne({ where: { subdomain } });
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
        `/images/vehicles/${subdomain}/${folderName}/${file.filename}`
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

      res.status(201).json({ success: true, message: "Vehicle added", vehicle: newVehicle });
    } catch (error) {
      console.error("❌ Error adding vehicle:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

// ✅ Get Vehicles for Current Subdomain Driver
exports.getVehicles = async (req, res) => {
  try {
    // const host = req.headers.host; // e.g., driver1.localhost:5000
    // const subdomain = host.split('.')[0];
    const subdomain = req.header('X-Subdomain');
    console.log('Subdomain received for vehicle selection:', subdomain); // debug log

    if (!subdomain) return res.status(400).json({ success: false, error: "Missing subdomain" });

    const driver = await Driver.findOne({ where: { subdomain } });
    if (!driver) {
      console.log('Driver not found for subdomain:', subdomain);
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
