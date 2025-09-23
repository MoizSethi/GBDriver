const User = require("./models");
const Driver = require("../driver_registration/models");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body;
    const { username } = req.params; // 👈 driver username from route

    // Validate required fields
    if (!email || !phone || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields (except names) are required.",
      });
    }

    // Find driver by username
    const driver = await Driver.findOne({ where: { username } });
    if (!driver) {
      return res.status(404).json({
        success: false,
        error: `No driver found with username: ${username}`,
      });
    }

    // Check if email already exists (per driver)
    const existingUser = await User.findOne({
      where: { email, driver_id: driver.id },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Email already registered for this driver" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user linked to driver
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      driver_id: driver.id,
    });

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        phone: newUser.phone,
        driver_id: newUser.driver_id,
      },
    });
  } catch (error) {
    console.error("❌ Error in user registration:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { username } = req.params; // 👈 driver username from route

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    // Find driver by username
    const driver = await Driver.findOne({ where: { username } });
    if (!driver) {
      return res.status(404).json({
        success: false,
        error: `No driver found with username: ${username}`,
      });
    }

    // Find user scoped to driver
    const user = await User.findOne({ where: { email, driver_id: driver.id } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        driver_id: user.driver_id,
      },
    });
  } catch (error) {
    console.error("❌ Error logging in user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
