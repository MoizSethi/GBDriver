'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('rides', 'accept_ride', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // default false, change if needed
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('rides', 'accept_ride');
  },
};
