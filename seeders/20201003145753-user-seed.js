'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        name: "Chris",
        username: "cmyers",
        password: "password",
        email: "christopher.myers88@gmail.com",
        favoriteGenre: "Sci-Fi"
      },
      {
        name: "Marissa",
        username: "mcadavid",
        password: "12345",
        email: "mberns1994@gmail.com",
        favoriteGenre: "Horror"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
