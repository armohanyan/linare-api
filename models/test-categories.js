'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for deifining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsToMany(models.News, {
      //   through: 'News_Category',
      //   foreignKey: "categoryId",
      //   as: 'news'
      // });
    }
  }
  Categories.init({
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Categories',
    timestamps: false
  });
  return Categories;
};