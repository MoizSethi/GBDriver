// admin-user/models.js

const { DataTypes } = require("sequelize");
const db = require("../config/db"); 

const AdminUser = db.define('AdminUser', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM('superadmin', 'manager', 'viewer'),
    allowNull: false,
    defaultValue: 'viewer',
  },
}, {
  tableName: 'admin_users',
  timestamps: true,
});

module.exports = AdminUser;
