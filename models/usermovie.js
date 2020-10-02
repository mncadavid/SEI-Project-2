'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserMovie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserMovie.init({
    userId: DataTypes.INTEGER,
    movieId: DataTypes.INTEGER,
    haveSeen: DataTypes.BOOLEAN,
    favorite: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserMovie',
  });
  return UserMovie;
};