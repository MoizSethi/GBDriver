const express = require("express");
const router = express.Router();
const controller = require("./controllers");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ✅ Storage config: stores image in /drivers/{driverName}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const name = req.body.name || "unknown_driver";
    const folderName = name.replace(/\s+/g, "_");
    const folderPath = `./public/images/drivers/${folderName}`;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, "profile" + path.extname(file.originalname)); // always name the file 'profile.jpg/png'
  }
});

const upload = multer({ storage });

// ✅ POST /driver/register
router.post("/register", upload.single("profilePicture"), controller.registerDriver);

// ✅ POST /driver/login
router.post("/login", controller.loginDriver);

module.exports = router;

// ✅ GET /driver/all - Fetch all users
router.get("/all", controller.getAllUsers);

module.exports = router;
