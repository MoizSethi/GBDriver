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
      dateOfBirth,
      username,   // 🔹 add username
      // website
    } = req.body;

    if (!name || !email || !password || !confirmPassword || !dateOfBirth || !username) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: "Passwords do not match" });
    }

    const existingEmail = await Driver.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    const existingUsername = await Driver.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ success: false, error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePicture = req.file
      ? `/images/drivers/${name.replace(/\s+/g, "_")}/${req.file.filename}`
      : null;

    const driver = await Driver.create({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      profilePicture,
      username,
      website: `http://localhost:3000/${username}`,
      isApproved: false
    });

    res.status(200).json({
      success: true,
      message: "Driver registered",
      driver: {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        username: driver.username,
        website: `http://localhost:3000/${driver.username}` // 🔹 full URL
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

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    // 🔍 Check if driver exists
    const driver = await Driver.findOne({ where: { email } });
    if (!driver) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // ❌ Check if approved
    if (!driver.isApproved) {
      return res.status(403).json({ success: false, error: "Your account is pending approval by the admin." });
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
    const users = await Driver.findAll({ attributes: { exclude: ["password"] } }); // show all only exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

exports.approveDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { role } = req.body; // 🚨 Get role from request body (or use req.headers['x-user-role'])

    if (!['superadmin', 'manager'].includes(role)) {
      return res.status(403).json({ success: false, error: "Not authorized to approve drivers" });
    }

    const driver = await Driver.findByPk(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, error: "Driver not found" });
    }

    driver.isApproved = true;
    await driver.save();

    res.status(200).json({ success: true, message: "Driver approved" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🧠 Only unapproved drivers
exports.getUnapprovedDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      where: { isApproved: false },
      attributes: { exclude: ["password"] }
    });
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch unapproved drivers", error: err.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, error: "Role is required" });
    }

    if (role !== 'superadmin') {
      return res.status(403).json({ success: false, error: "Only superadmin can delete drivers" });
    }

    const driver = await Driver.findByPk(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, error: "Driver not found" });
    }

    await driver.destroy();
    res.status(200).json({ success: true, message: "Driver deleted" });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDriverByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const driver = await Driver.findOne({
      where: { username },
      attributes: { exclude: ["password"] }
    });

    if (!driver) {
      return res.status(404).json({ success: false, error: "Driver not found" });
    }

    res.status(200).json({ success: true, driver });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

