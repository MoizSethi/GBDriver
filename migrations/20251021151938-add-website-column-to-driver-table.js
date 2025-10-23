'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('drivers', 'driver_website', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: '', // default false, change if needed
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('drivers', 'driver_website');
  },
};
