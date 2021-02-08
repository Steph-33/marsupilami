'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Friend.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          name: 'user_id',
        },
      });
    }
  };
  Friend.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    age: DataTypes.INTEGER,
    family: DataTypes.STRING,
    race: DataTypes.STRING,
    food: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    location: DataTypes.STRING,
    image: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Friend',
  });
  return Friend;
};