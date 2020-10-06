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
      }),
      Movie.belongsToMany(models.Genre, {
        through: "MovieGenre",
        foreignKey: "movieId",
        otherKey: "genreId"
      })
    }
  };
  Movie.init({
    imdbID: DataTypes.STRING,
    Title: DataTypes.STRING,
    Poster: DataTypes.STRING,
    Year: DataTypes.STRING,
    Director: DataTypes.STRING,
    Plot: DataTypes.TEXT,
    Rated: DataTypes.STRING,
    Runtime: DataTypes.STRING,
    Writer: DataTypes.STRING,
    Actors: DataTypes.STRING,
    Metascore: DataTypes.STRING,
    imdbRating: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};