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

    if (!name || !email || !password || !confirmPassword || !dateOfBirth) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: "Passwords do not match" });
    }

    const existing = await Driver.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePicture = null;
    if (req.file) {
      const driverFolder = name.replace(/\s+/g, "_");
      profilePicture = `/images/drivers/${driverFolder}/${req.file.filename}`;
    }

    const driver = await Driver.create({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      profilePicture,
      dateOfBirth
    });

    res.status(201).json({ success: true, message: "Driver registered", driver });
  } catch (error) {
    console.error("❌ Error registering driver:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
