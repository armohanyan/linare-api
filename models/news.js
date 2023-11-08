'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsToMany(models.Categories, {
      //   as: 'categories',
      //   through: 'News_Category',
      //   foreignKey: "newsId"
      // });
      //
      // this.belongsTo(models.Authors, {
      //   as: 'author',
      //   foreignKey: 'authorId'
      // })
      //
      // this.hasMany(models.Views, {
      //   foreignKey: "newsId",
      //   as: 'view'
      // })
    }
  }
  News.init({
    title: DataTypes.STRING,
    text: DataTypes.TEXT,
    image: DataTypes.STRING,
    imageAlt: DataTypes.STRING,
    iframe: DataTypes.STRING,
    icon: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'News',
  });
  return News;
};