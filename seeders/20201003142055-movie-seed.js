'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('Movies', [
      {
        imdbId: "tt0078748",
        title: "Alien",
        img: "https://m.media-amazon.com/images/M/MV5BMmQ2MmU3NzktZjAxOC00ZDZhLTk4YzEtMDMyMzcxY2IwMDAyXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
        releaseYear: 1979,
        director: "Ridley Scott",
        plot: "After a space merchant vessel receives an unknown transmission as a distress call, one of the crew is attacked by a mysterious life form and they soon realize that its life cycle has merely begun."
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Movies', null, {});
  }
};
