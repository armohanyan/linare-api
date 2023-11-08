const {Sequelize, News, Categories, Authors, News_Category} = require('../models')
const _ = require("lodash");
const {paginate} = require("../helpers");

class CategoriesProvider {

    constructor() {}

    async createCategoryWithRel(category, createdNewsId) {
        const [findOrCreatedCategory] = await Categories.findOrCreate({
            where: {category},
            defaults: {category: category.toLowerCase()}
        });

        await News_Category.create({
            newsId: createdNewsId,
            categoryId: findOrCreatedCategory?.id
        })
    }
}

module.exports = CategoriesProvider