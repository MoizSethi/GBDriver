const Guest = require("./models");

exports.registerGuest = async (req, res) => {
  try {
    const { first_name, last_name, phone, email } = req.body;

    // ✅ Check for missing fields
    if (!first_name || !last_name || !phone || !email) {
      return res.status(400).json({
        success: false,
        error: "All fields (first_name, last_name, phone, email) are required.",
      });
    }

    const guest = await Guest.create({ first_name, last_name, phone, email });

    res.status(201).json({ success: true, guest });

  } catch (error) {
    console.error("Error creating guest:", error);

    // ✅ Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ success: false, error: error.errors.map(e => e.message) });
    }

    res.status(500).json({ success: false, error: error.message });
  }
};
