const Guest = require("./models");
const Driver = require("../driver_registration/models");

exports.registerGuest = async (req, res) => {
  try {
    const { first_name, last_name, phone, email } = req.body;

    // ✅ Validate fields
    if (!first_name || !last_name || !phone || !email) {
      return res.status(400).json({
        success: false,
        error: "All fields (first_name, last_name, phone, email) are required.",
      });
    }

    // ✅ Extract subdomain from header (case-insensitive, standardized)
    const subdomain = req.header('X-Subdomain');
    console.log('Subdomain received for guest registration:', subdomain);

    if (!subdomain) {
      return res.status(400).json({
        success: false,
        error: "Subdomain missing from request. Unable to associate with a driver.",
      });
    }

    // ✅ Find driver using subdomain
    const driver = await Driver.findOne({ where: { subdomain } });

    if (!driver) {
      return res.status(404).json({
        success: false,
        error: `No driver found for subdomain: ${subdomain}`,
      });
    }

    // ✅ Create guest linked to driver
    const guest = await Guest.create({
      first_name,
      last_name,
      phone,
      email,
      driver_id: driver.id, // Ensure field is driver_id (snake_case)
    });

    res.status(201).json({
      success: true,
      message: "Guest registered successfully",
      guest,
    });

  } catch (error) {
    console.error("❌ Error creating guest:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        error: error.errors.map(e => e.message),
      });
    }

    res.status(500).json({ success: false, error: error.message });
  }
};
