const {Sequelize, News, Categories, Authors, Products_Categories} = require('../models')
const _ = require("lodash");
const {paginate} = require("../helpers");

class CategoriesProvider {

    constructor() {}

    async createCategoryWithRel(category, createdProductId) {
        const findOrCreatedCategory = await Categories.findOne({
            where: { name: category }
        });

        if (!findOrCreatedCategory) return

        await Products_Categories.create({
            productId: createdProductId,
            categoryId: findOrCreatedCategory.id
        })
    }
}

module.exports = CategoriesProvider