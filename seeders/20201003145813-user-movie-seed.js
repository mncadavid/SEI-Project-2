'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('UserMovies', [
      {
        userId: 1,
        movieId: 1,
        haveSeen: true,
        favorite: false
      },
      {
        userId: 2,
        movieId: 1,
        haveSeen: true,
        favorite: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserMovies', null, {});
  }
};
