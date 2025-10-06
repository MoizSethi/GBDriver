'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('drivers');

    // ✅ Add column only if it does not exist
    if (!tableInfo.isApproved) {
      await queryInterface.addColumn('drivers', 'isApproved', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
      console.log('✅ Column "isApproved" added to "drivers" table');
    } else {
      console.log('⚠️ Column "isApproved" already exists in "drivers" table, skipping...');
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('drivers');

    // 🗑️ Remove only if it exists
    if (tableInfo.isApproved) {
      await queryInterface.removeColumn('drivers', 'isApproved');
      console.log('🗑️ Column "isApproved" removed from "drivers" table');
    } else {
      console.log('⚠️ Column "isApproved" not found in "drivers" table, skipping removal...');
    }
  },
};
