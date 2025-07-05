const User = require("./models");
const Driver = require("../driver_registration/models"); // Adjust if needed
const bcrypt = require("bcrypt");

// Helper: extract subdomain from host string
function getSubdomain(host) {
  if (!host) return null;
  // host can be like: driver1.localhost:3000 or driver1.yourapp.com
  const parts = host.split('.');
  if (parts.length < 2) return null; // no subdomain
  return parts[0];
}

exports.registerUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      password,
    } = req.body;

    // Validate required fields (without driver_id)
    if (!email || !phone || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields except driver_id are required.",
      });
    }

    // Extract subdomain from request host
    const subdomain = req.header('X-Subdomain');
    console.log('Subdomain received for registration:', subdomain); // debug log

    if (!subdomain) {
      return res.status(400).json({
        success: false,
        error: "Subdomain missing from request. Unable to identify driver.",
      });
    }

    // Find driver by subdomain (you need a unique 'subdomain' column in your Driver model)
    const driver = await Driver.findOne({ where: { subdomain } });
    if (!driver) {
      return res.status(404).json({
        success: false,
        error: `No driver found for subdomain: ${subdomain}`,
      });
    }

    // Check if email already exists for any user (optional: restrict to driver?)
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user associated with driver.id
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      driver_id: driver.id
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

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    // Extract subdomain to validate driver context (optional)
    const subdomain = req.header('X-Subdomain');
    console.log('Subdomain received for login:', subdomain); // debug log
    if (!subdomain) {
      return res.status(400).json({ success: false, error: "Subdomain missing from request." });
    }

    // Find driver by subdomain
    const driver = await Driver.findOne({ where: { subdomain } });
    if (!driver) {
      return res.status(404).json({ success: false, error: "Driver not found for subdomain." });
    }

    // Find user by email AND driver_id to ensure tenant isolation
    const user = await User.findOne({ where: { email, driver_id: driver.id } });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // Login successful - return minimal user info
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        driver_id: user.driver_id
      }
    });
  } catch (error) {
    console.error("❌ Error logging in user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
