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
    }
}, { timestamps: true });

module.exports = Guest;
