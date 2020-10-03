'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('MovieGenres', [
      {
        movieId: 1,
        genreId: 1
      },
      {
        movieId: 1,
        genreId: 2
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('MovieGenres', null, {});

  }
};
