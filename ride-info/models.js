const { DataTypes } = require("sequelize");
const db = require("../config/db");

const RideInfo = db.define("RideInfo", {
  ride_type: { type: DataTypes.STRING, allowNull: false },
  pickup_location: { type: DataTypes.STRING, allowNull: false },
  dropoff_location: { type: DataTypes.STRING, allowNull: false },
  pickup_datetime: { type: DataTypes.DATE, allowNull: false },
  add_stop: { type: DataTypes.JSON },
  num_passengers: { type: DataTypes.INTEGER, allowNull: false },
  flight_number: { type: DataTypes.INTEGER, allowNull: false },
  num_luggage: { type: DataTypes.INTEGER, allowNull: false },
  num_hours: { type: DataTypes.INTEGER }, // Only for hourly/as directed
  child_seat: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = RideInfo;
