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

    // Validate fields
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

    // 🔢 Generate unique subdomain like 'driver1', 'driver2', etc.
    const count = await Driver.count();
    let subdomain = `driver${count + 1}`;

    // 🛑 Ensure subdomain uniqueness in case some drivers were deleted
    while (await Driver.findOne({ where: { subdomain } })) {
      subdomain = `driver${Math.floor(Math.random() * 10000)}`; // fallback unique name
    }

    const profilePicture = req.file
      ? `/images/drivers/${name.replace(/\s+/g, "_")}/${req.file.filename}`
      : null;

    const driver = await Driver.create({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      profilePicture,
      subdomain
    });

    res.status(201).json({
      success: true,
      message: "Driver registered",
      driver: {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        subdomain: driver.subdomain
      }
    });
  } catch (error) {
    console.error("❌ Error registering driver:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Login Driver
exports.loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    // 🔍 Check if driver exists
    const driver = await Driver.findOne({ where: { email } });
    if (!driver) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // 🔒 Verify password
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // ✅ Login successful
    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("❌ Error logging in driver:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//fetching all the users 
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Driver.findAll({attributes: { exclude: ["password"] }}); // show all only exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};
