const BaseService = require('./BaseService')
const StorageService = require('./StorageService')
const CategoriesProvider = require('../provider/CategoriesProvider')
const ProductsProvider = require('../provider/ProductsProvider')
const {Sequelize, Products, Categories, Authors, Products_Categories, Views} = require('../models')
const {Op} = require("sequelize");
const {getLastWeeksDate, getLastMonthDate, getPreviousDay} = require("../helpers");

class CategoriesService extends BaseService {
    constructor() {
        super();
        this.categoriesProvider = new CategoriesProvider()
        this.storageService = new StorageService()
        this.productsProvider = new ProductsProvider()
        this.categoriesModel = Categories
        this.productsModel = Products
        this.productsCategoriesModel = Products_Categories
    }

    async create(req) {
        try {
            const { name, description, parentCategoryName  } = req.body

            if (!name) {
                return this.response({
                    status: false,
                    statusCode: 400,
                    message: "Category name is required"
                })
            }
            const parentCategory =  parentCategoryName ? await this.categoriesModel.findOne({ where: {
                    name: parentCategoryName
                }}) : undefined

            const category =  parentCategoryName ? await this.categoriesModel.findOne({ where: {
                    name: name
                }}) : undefined

            if (!category) {
                await this.categoriesModel.create({
                    name,
                    description,
                    parentId: parentCategory ? parentCategory.id : null,
                })
            }

            return this.response({
                message: "Created successfully"
            })

        } catch (error) {
            return this.serverErrorResponse();
        }
    }

    async update(req) {
        try {
            const { id } = req.params
            const { name, description, parentCategoryName  } = req.body

            const category = await this.categoriesModel.findOne({ where: {
                    id
            }})

            if (!category) {
                return this.response({
                    status: false,
                    statusCode: 404,
                    message: "Category not found"
                })
            }

            const parentCategory = parentCategoryName ?  await this.categoriesModel.findOne({ where: {
                    name: parentCategoryName
                }}) : null

            await this.categoriesModel.update({
                name,
                description,
                parentId: parentCategory ? parentCategory.id : null
            }, { where: {id} })

            return this.response({
                message: "Created successfully"
            })
        } catch (error) {
            return this.serverErrorResponse()
        }
    }

    async get(req) {
        try {
            const categories = await this.categoriesModel.findAll()

            return this.response({
                data: categories
            })

        } catch (error) {
            return this.serverErrorResponse();
        }
    }

    async getSingle(req) {
        try {
            const {id} = req.params;

            if (!id) {
                return this.response({
                    status: false,
                    statusCode: 400,
                    message: "Category is required"
                })
            }

            const category = await this.categoriesModel.findOne({ where: { id } })

            if (!category) {
                return this.response({
                    status: false,
                    statusCode: 404,
                    message: "Category not found"
                })
            }

            return this.response({ data: category })
        } catch (error) {
            return this.serverErrorResponse();
        }
    }

    async delete(req) {
        try {
            const {id} = req.params

            if (!id) {
                return this.response({
                    status: false,
                    statusCode: 400,
                    message: "Missing category id"
                })
            }

            const category = await this.categoriesModel.findByPk(id)

            const data = await this.productsProvider.findProductsByCategory({
                category: category.name
            })

            for(const product of data) {
                await this.productsModel.destroy({
                    where: { id: product.id }
                })
            }

            await this.categoriesModel.destroy({
                where: { id }
            })

            return this.response({
                message: "Category deleted successfully"
            })
        } catch (error) {
            return this.serverErrorResponse();
        }
    }
}

module.exports = CategoriesService