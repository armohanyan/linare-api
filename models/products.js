'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Categories, {
        as: 'categories',
        through: 'Products_Categories',
        foreignKey: "productId"
      });
    }
  }
  Products.init({
    title: DataTypes.STRING,
    shortDescription: DataTypes.TEXT,
    price: DataTypes.STRING,
    images: DataTypes.JSON,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};