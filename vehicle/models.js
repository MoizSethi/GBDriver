const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Vehicle = db.define("Vehicle", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  vehicleBrand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vehicleModel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vehicleColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productionYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  numberPlate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  luggage: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  passengers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  flat_rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  pricePerKm: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1.0,
  },
  images: {
    type: DataTypes.JSON, // Array of image URLs
    allowNull: true,
  },
  driver_id: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: "drivers",
    key: "id"
  }
}
}, {
  tableName: "vehicles",
  timestamps: true, // includes createdAt and updatedAt
});

module.exports = Vehicle;
