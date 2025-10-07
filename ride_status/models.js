const { DataTypes } = require("sequelize");
const db = require  ("../config/db");

const RideStatus = db.define(
  "RideStatus",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ride_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "rides", // ✅ assumes your rides table name is 'rides'
        key: "id",
      },
      onDelete: "CASCADE",
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "drivers", // ✅ assumes your drivers table name is 'drivers'
        key: "id",
      },
      onDelete: "CASCADE",
    },
    dispatched: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    arrived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    pickup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    stops: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "ride_statuses", // ✅ plural, clean table name
    timestamps: true, // ✅ createdAt & updatedAt
  }
);

module.exports = RideStatus;
