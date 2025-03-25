const User = require("./models");

exports.registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body;

    // ✅ Check if all required fields are provided
    if (!first_name || !last_name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields (first_name, last_name, email, phone, password) are required.",
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    // ✅ Create user
    const newUser = await User.create({ first_name, last_name, email, phone, password });

    res.status(201).json({ success: true, message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
