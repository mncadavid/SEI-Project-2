'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.changeColumn(
       'Movies',
       'Actors',
      { type: Sequelize.TEXT }
      );
      await queryInterface.changeColumn(
        'Movies',
        'Poster',
        { type: Sequelize.TEXT}
      );
      await queryInterface.changeColumn(
        'Movies',
        'Writer',
        { type: Sequelize.TEXT}
      );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
