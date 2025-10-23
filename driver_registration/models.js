const { DataTypes } = require("sequelize");
const db = require("../config/db");
const RideInfo = require('../ride-info/models')

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
  username: {               // 🔹 new field
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  // driver_website: {               // 🔹 new field
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  isApproved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false } 
}, {
  tableName: "drivers",
  timestamps: true
});

//accociations
// ✅ Proper associations
Driver.hasMany(RideInfo, { foreignKey: 'driver_id' });
RideInfo.belongsTo(Driver, { foreignKey: 'driver_id' });

module.exports = Driver;

