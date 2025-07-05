const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Guest = sequelize.define('Guest', {
    first_name: {
        type: DataTypes.STRING,
        allowNull: false, // ✅ Required
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false, // ✅ Required
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false, // ✅ Required
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, // ✅ Required
        validate: {
            isEmail: true, // ✅ Ensure it's a valid email
        }
    },
    driver_id: { // 🔑 Guest belongs to a Driver
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "drivers",
      key: "id"
    }
  }
}, { timestamps: true });

module.exports = Guest;
