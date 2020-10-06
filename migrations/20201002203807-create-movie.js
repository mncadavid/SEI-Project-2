'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      imdbID: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      Title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Poster: {
        type: Sequelize.STRING
      },
      Year: {
        type: Sequelize.STRING
      },
      Director: {
        type: Sequelize.STRING
      },
      Plot: {
        type: Sequelize.TEXT
      },
      Rated: {
        type: Sequelize.STRING
      },
      Runtime: {
        type: Sequelize.STRING
      },
      Writer: {
        type: Sequelize.STRING
      },
      Actors: {
        type: Sequelize.STRING
      },
      Metascore: {
        type: Sequelize.STRING
      },
      imdbRating: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Movies');
  }
};