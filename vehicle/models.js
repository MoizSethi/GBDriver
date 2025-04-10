const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Vehicle = db.define("Vehicle", {
  vehicleBrand: { type: DataTypes.STRING, allowNull: true },
  vehicleModel: { type: DataTypes.STRING, allowNull: true },
  vehicleColor: { type: DataTypes.STRING, allowNull: true },
  productionYear: { type: DataTypes.INTEGER, allowNull: true },
  numberPlate: { type: DataTypes.STRING, allowNull: true },
  luggage: { type: DataTypes.INTEGER, allowNull: false }, // Luggage count
  passengers: { type: DataTypes.INTEGER, allowNull: false }, // Passenger count
  flat_rate: { type: DataTypes.FLOAT, allowNull: false }, // Flat rate pricing
  images: { 
    type: DataTypes.JSON, // Multiple image URLs as array
    allowNull: true 
  }
});

module.exports = Vehicle;
