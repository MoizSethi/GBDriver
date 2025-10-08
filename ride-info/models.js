const { DataTypes } = require("sequelize");
const db = require("../config/db");

// ✅ RideInfo Model
const RideInfo = db.define("RideInfo", {
  service_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pickup_date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pickup_time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pickup_location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dropoff_location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  add_stop: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  return_different_location: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  num_passengers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  num_luggage: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  num_hours: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  has_child_seat: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  distance_km: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  accept_ride: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_exposed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "vehicles", // must match the actual table name
      key: "id",
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users", // adjust this if your user table is named differently
      key: "id",
    },
  },
  driver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "drivers", // adjust this if your user table is named differently
      key: "id",
    },
  },
}, {
  tableName: "rides",
  timestamps: true,
});

module.exports = RideInfo;
