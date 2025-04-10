const { DataTypes } = require("sequelize");
const db = require("../config/db"); // Adjust the path as per your config

const DriverRegistration = db.define("Drivers", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  confirmPassword: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePicture: {
    type: DataTypes.STRING, // Store file path or URL
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
});

module.exports = DriverRegistration;
