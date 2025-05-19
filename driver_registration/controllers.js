const Driver = require("./models");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

// ✅ Register Driver
exports.registerDriver = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      dateOfBirth
    } = req.body;

    // 🔍 Basic validations
    if (!name || !email || !password || !confirmPassword || !dateOfBirth) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: "Passwords do not match" });
    }

    const existing = await Driver.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save profile picture if uploaded
    let profilePicture = null;
    if (req.file) {
      const driverFolder = name.replace(/\s+/g, "_");
      const uploadDir = path.join(__dirname, "../public/images/drivers", driverFolder);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, req.file.originalname);
      fs.writeFileSync(filePath, req.file.buffer); // Optional: if using buffer

      profilePicture = `/images/drivers/${driverFolder}/${req.file.originalname}`;
    }

    // ✅ Create driver (remove confirmPassword)
    const driver = await Driver.create({
      name,
      email,
      password: hashedPassword,
      profilePicture,
      dateOfBirth
    });

    res.status(201).json({ success: true, message: "Driver registered", driver });
  } catch (error) {
    console.error("❌ Error registering driver:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
