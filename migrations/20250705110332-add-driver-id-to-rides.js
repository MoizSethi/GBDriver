'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Describe the table to check existing columns
    const tableInfo = await queryInterface.describeTable('rides');

    // Only add if it doesn't exist
    if (!tableInfo.driver_id) {
      await queryInterface.addColumn('rides', 'driver_id', {
        type: Sequelize.INTEGER, // adjust if your driver table uses UUID
        allowNull: false,
        references: {
          model: 'drivers', // ensure this matches your actual table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      console.log('✅ Column "driver_id" added to "rides" table');
    } else {
      console.log('⚠️ Column "driver_id" already exists in "rides" table, skipping...');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Describe again for safety
    const tableInfo = await queryInterface.describeTable('rides');

    // Only remove if it exists
    if (tableInfo.driver_id) {
      await queryInterface.removeColumn('rides', 'driver_id');
      console.log('🗑️ Column "driver_id" removed from "rides" table');
    } else {
      console.log('⚠️ Column "driver_id" not found, skipping removal...');
    }
  },
};
