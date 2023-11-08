'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Authors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.hasMany(models.News, {
      //   foreignKey: "authorId",
      //   as: 'news'
      // })
    }
  }
  Authors.init({
    author: DataTypes.STRING,
    postsCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Authors',
    timestamps: false
  });
  return Authors;
};