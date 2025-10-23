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
const adminUserRoutes = require('./admin_users/routes');
const rideStatuses = require('./ride_status/routes.js');
const networkRoutes = require('./network/routes.js');

const app = express();

// ✅ Enable subdomain parsing (e.g., driver1.localhost)
app.set("subdomain offset", 1); // So req.subdomains[0] = "driver1"

// ✅ Middleware to extract subdomain and attach to request
app.use((req, res, next) => {
  const subdomain = req.subdomains[0]; // e.g., "driver1"
  req.tenantSubdomain = subdomain;
  next();
});

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
app.use('/api/admin', adminUserRoutes);
app.use('/api/status', rideStatuses);
app.use('/api/network', networkRoutes);

// ✅ Test Database Connection & Sync Tables
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    return sequelize.sync(); // ✅ Sync tables without dropping data
  })
  .then(() => console.log('✅ Tables synced'))
  .catch(err => console.error('❌ Database error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});