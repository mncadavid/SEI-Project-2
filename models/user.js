'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Movie, {
        through: "UserMovie",
        foreignKey: "userId",
        otherKey: "movieId"
      })
    }
  };
  User.init({
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    favoriteGenre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};