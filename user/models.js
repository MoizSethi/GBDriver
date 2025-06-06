const { DataTypes } = require("sequelize");
const db = require("../config/db");

const User = db.define("User", {
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  driver_id: { // 🔑 User belongs to a Driver
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "drivers",
      key: "id"
    }
  }
}, {
  tableName: "users",
  timestamps: true
});

module.exports = User;
