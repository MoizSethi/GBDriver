'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('rides', 'driver_id', {
      type: Sequelize.INTEGER, // Or Sequelize.UUID, depending on your driver's primary key
      allowNull: false,
      references: {
        model: 'drivers', // Make sure this is the correct table name
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('rides', 'driver_id');
  }
};
