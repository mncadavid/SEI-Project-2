'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('Movies', [
      {
        imdbID: "tt0078748",
        Title: "Alien",
        Poster: "https://m.media-amazon.com/images/M/MV5BMmQ2MmU3NzktZjAxOC00ZDZhLTk4YzEtMDMyMzcxY2IwMDAyXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
        Year: "1979",
        Director: "Ridley Scott",
        Plot: "After a space merchant vessel receives an unknown transmission as a distress call, one of the crew is attacked by a mysterious life form and they soon realize that its life cycle has merely begun."
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Movies', null, {});
  }
};
