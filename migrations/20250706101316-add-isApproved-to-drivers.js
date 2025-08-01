module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("drivers", "isApproved", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("drivers", "isApproved");
  }
};
