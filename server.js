require('dotenv').config(); // ✅ Load environment variables

const express = require('express');
const cors = require('cors'); // ✅ Allow cross-origin requests
const sequelize = require('./config/db'); // ✅ Ensure DB is imported

// ✅ Import Routes
const rideInfoRoutes = require("./ride-info/routes");
const vehicleRoutes = require("./vehicle/routes");
const userRoutes = require("./user/routes");
const guestRoutes = require("./guest/routes");
const driverRoutes = require("./driver_registration/routes");

const app = express();

// ✅ Middleware
app.use(cors()); // ✅ Enable CORS
app.use(express.json()); // ✅ Parse JSON
app.use("/images", express.static("public/images"));

// ✅ Routes
app.use("/api/ride", rideInfoRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/user", userRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/driver", driverRoutes);

// ✅ Test Database Connection & Sync Tables
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    return sequelize.sync({ alter: true }); // ✅ Sync tables without dropping data
  })
  .then(() => console.log('✅ Tables synced'))
  .catch(err => console.error('❌ Database error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
