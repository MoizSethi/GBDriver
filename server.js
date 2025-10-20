require('dotenv').config(); // ✅ Load environment variables
const chalk = require('chalk');
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
console.log(chalk.bold.blue('\n💾 Database Logs'));
console.log(chalk.gray('─────────────────────────────────────────────'));

sequelize.authenticate()
  .then(() => {
    console.log(chalk.green('✅ Database connected successfully'));
    return sequelize.sync(); // ✅ Sync tables without dropping data
  })
  .then(() => {
    console.log(chalk.green('✅ Tables synced'));
    console.log(chalk.gray('─────────────────────────────────────────────\n'));
  })
  .catch(err => console.error(chalk.red('❌ Database error:'), err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(chalk.bold.yellow(`🚀 Server running on port ${PORT}`));
});

// ✅ Function to list all registered routes
function listRoutes(app) {
  console.log("\n📜 Registered API Endpoints:\n");

  const routes = [];

  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Direct route (e.g. app.get('/path', ...))
      const methods = Object.keys(middleware.route.methods)
        .map(m => m.toUpperCase())
        .join(', ');
      routes.push({ method: methods, path: middleware.route.path });
    } else if (middleware.name === 'router') {
      // Router middleware (e.g. app.use('/api/user', userRoutes))
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        if (route) {
          const methods = Object.keys(route.methods)
            .map(m => m.toUpperCase())
            .join(', ');
          routes.push({
            method: methods,
            path: middleware.regexp.source
              .replace('^\\', '')
              .replace('\\/?(?=\\/|$)', '')
              .replace('^', '')
              .replace('?', '')
              .replace(/\\\//g, '/')
              .replace(/\/\?\(\=\.\*\)\?\$/g, '') +
              (route.path === '/' ? '' : route.path)
          });
        }
      });
    }
  });

  routes.forEach(r => {
    console.log(
      chalk.green(r.method.padEnd(10)) + chalk.cyan(' → ') + chalk.yellow(r.path)
    );
  });

  console.log(chalk.bold.blue(`\n✅ Total Routes: ${routes.length}\n`));
}

listRoutes(app);
