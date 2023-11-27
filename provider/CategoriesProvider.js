const {Sequelize, News, Categories, Authors, Products_Categories} = require('../models')
const _ = require("lodash");
const {paginate} = require("../helpers");

class CategoriesProvider {

    constructor() {}

    async createCategoryWithRel(category, createdProductId) {
        const [findOrCreatedCategory] = await Categories.findOrCreate({
            where: {category},
            defaults: { name: category.toLowerCase()}
        });

        if (!findOrCreatedCategory) throw new Error("Category not found")

        await Products_Categories.create({
            productId: createdProductId,
            categoryId: findOrCreatedCategory.id
        })
    }
}

module.exports = CategoriesProvider