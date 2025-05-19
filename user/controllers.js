const User = require("./models");
const Driver = require("../driver_registration/models"); // Adjust if needed
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      driver_id // 🔥 Required for tenant association
    } = req.body;

    // ✅ Validate required fields
    if (!first_name || !last_name || !email || !phone || !password || !driver_id) {
      return res.status(400).json({
        success: false,
        error: "All fields including driver_id are required.",
      });
    }

    // ✅ Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    // ✅ Validate driver exists
    const driverExists = await Driver.findByPk(driver_id);
    if (!driverExists) {
      return res.status(404).json({ success: false, error: "Invalid driver ID" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user with driver association
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      driver_id
    });

    res.status(201).json({
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
