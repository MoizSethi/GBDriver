const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Vehicle = db.define("Vehicle", {
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  luggage: { type: DataTypes.INTEGER, allowNull: false }, // ✅ Luggage count
  passengers: { type: DataTypes.INTEGER, allowNull: false }, // ✅ Passenger count
  flat_rate: { type: DataTypes.FLOAT, allowNull: false }, // ✅ Flat rate instead of hourly/mile pricing
  available: { type: DataTypes.BOOLEAN, defaultValue: true },
  images: { 
    type: DataTypes.JSON, // ✅ Store multiple image URLs as an array
    allowNull: true 
  }
});

module.exports = Vehicle;
