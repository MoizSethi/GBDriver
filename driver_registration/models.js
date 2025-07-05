const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Driver = db.define("Driver", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  subdomain: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    }
}, {
  tableName: "drivers",
  timestamps: true
});

module.exports = Driver;
