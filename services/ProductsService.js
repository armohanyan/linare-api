const BaseService = require('./BaseService')
const StorageService = require('./StorageService')
const CategoriesProvider = require('../provider/CategoriesProvider')
const ProductsProvider = require('../provider/ProductsProvider')
const {Sequelize, products, Products, Categories, Authors, products_Category, Views} = require('../models')
const {Op} = require("sequelize");
const {getLastWeeksDate, getLastMonthDate, getPreviousDay} = require("../helpers");

class ProductsService extends BaseService {
    constructor() {
        super();
        this.categoriesProvider = new CategoriesProvider()
        this.storageService = new StorageService()
        this.productsProvider = new ProductsProvider()
        this.categoriesModel = Categories
        this.productsModel = products
    }

    async create(req) {
        try {
            const { title, description, price, categories  } = req.body
            const parseCategories = Array.isArray(categories) ? categories : [categories]

            if (!parseCategories?.length)  {
                return this.response({
                    status: false,
                    statusCode: 400,
                    message: "Category is required"
                })
            }

            // if (req.file) {
            //     image = await this.storageService.uploadImage(req.file)
            // }

            const createdProduct = await this.productsModel.create({
                title,
                description,
                price,
                images: []
            })

            for (let i = 0; i < parseCategories.length; i++) {
                 await this.categoriesProvider.createCategoryWithRel(parseCategories[i], createdProduct.id)
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
            const { title, description, price, categories  } = req.body
            const {id} = req.params

            const parseCategories = Array.isArray(categories) ? categories : [categories]
            let image;

            const product = await this.productsProvider.findById({id})

            if(!product) {
                return this.response({
                    message: 'products not found',
                    statusCode: 404,
                    status: false
                })
            }

            if (!parseCategories?.length) {
                return this.response({
                    status: false,
                    statusCode: 400,
                    message: "Category is required"
                })
            }

            // delete all categories where products id is match
            await products_Category.destroy({
                where: { productId: id}
            })

            // edit categories
            for (let i = 0; i < parseCategories.length; i++) {
                await this.categoriesProvider.createCategoryWithRel(parseCategories[i], id)
            }

            // edit image
            // image = req.file ? await this.storageService.uploadImage(req.file) : products.image

            await this.productsModel.update({
                title,
                description,
                price,
                images: []
            },  {
                where:  { id }
            })

            return this.response({
                message: "products successfully edited"
            })
        } catch (error) {
            return this.serverErrorResponse()
        }
    }

    async get(req) {
        try {
            const {category, page, limit} = req.query;
            let products = products = await this.productsProvider.findAll({ page, limit })
                
            return this.response({
                data: products
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
                    message: "Products is required"
                })
            }

            const products = await this.productsProvider.findById({id})

            if (!products) {
                return this.response({
                    status: false,
                    statusCode: 404,
                    message: "Products not found"
                })
            }

            return this.response({ data: products })
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
                    message: "Missing products id"
                })
            }

            const products = await this.productsModel.findOne({
                where: {id},
                include: [{
                    model: Categories,
                    as: 'categories'
                }]
            })

            if (!products) {
                return this.response({
                    status: false,
                    statusCode: 404,
                    message: "products not found"
                })
            }

            await this.productsModel.destroy({
                where: {id}
            })

            return this.response({message: "products deleted successfully"})
        } catch (error) {
            return this.serverErrorResponse();
        }
    }

    // async getproductsFeed(req) {
    //     try {
    //         const {page, limit} = req.query;
    //         const category = 'լրահոս'
    //
    //         const products = await this.productsProvider.findproductsByCategory({
    //             page,
    //             limit,
    //             include: false,
    //             category,
    //             attributes: ['id', 'title', 'image', 'createdAt']
    //         })
    //
    //         return this.response({
    //             data: products
    //         })
    //
    //     } catch (error) {
    //         return this.serverErrorResponse()
    //     }
    // }
    //
    // async searchproducts(req) {
    //     try {
    //         const {page, limit, query} = req.query;
    //         if (!query) return this.response({status: false, statusCode: 400, message: "Missing search value"})
    //
    //         const products = await this.productsProvider.findAll({
    //                 page,
    //                 limit,
    //                 where: {
    //                     [Op.or]: [
    //                         {'title': {[Op.like]: '%' + query + '%'}},
    //                         {'text': {[Op.like]: '%' + query + '%'}}
    //                     ]
    //                 }
    //             }
    //         )
    //
    //         return this.response({data: products})
    //     } catch (error) {
    //         return this.serverErrorResponse();
    //     }
    // }

}

module.exports = ProductsService