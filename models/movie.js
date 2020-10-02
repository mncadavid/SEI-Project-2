'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Movie.belongsToMany(models.User, {
        through: "UserMovie",
        foreignKey: "movieId",
        otherKey: "userId"
      })
    }
  };
  Movie.init({
    imdbId: DataTypes.STRING,
    title: DataTypes.STRING,
    img: DataTypes.STRING,
    releaseYear: DataTypes.INTEGER,
    director: DataTypes.STRING,
    genre: DataTypes.STRING,
    plot: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};