const BaseService = require('./BaseService')
const StorageService = require('./StorageService')
const CategoriesProvider = require('../provider/CategoriesProvider')
const ProductsProvider = require('../provider/ProductsProvider')
const {Sequelize, Products, Categories, Authors, Products_Categories, Views} = require('../models')
const {Op} = require("sequelize");
const {getLastWeeksDate, getLastMonthDate, getPreviousDay, paginate} = require("../helpers");

class ProductsService extends BaseService {
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
            const { title, shortDescription, description, price, categories, images  } = req.body
            const parseCategories = Array.isArray(categories) ? categories : [categories]

            if (!parseCategories?.length)  {
                return this.response({
                    status: false,
                    statusCode: 400,
                    message: "Category is required"
                })
            }

            if (req.file) {
                console.log(req.file, 'file')
                // const image = await this.storageService.uploadImage(req.file)
                // console.log(imagsse, 'image')
            }

            const createdProduct = await this.productsModel.create({
                title,
                description,
                shortDescription,
                price,
                images
            })

            // todo
            for (let i = 0; i < parseCategories.length; i++) {
                 await this.categoriesProvider.createCategoryWithRel(parseCategories[i], createdProduct.id)
            }

            return this.response({
                message: "Created successfully",
                data: createdProduct
            })
        } catch (error) {
            return this.serverErrorResponse();
        }
    }

    async update(req) {
        try {
            const { title, description, shortDescription, price, categories, images  } = req.body
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

            // delete all categories where products id is match
            await this.productsCategoriesModel.destroy({
                where: { productId: id}
            })

            // edit categories
            for (let i = 0; i < parseCategories.length; i++) {
                await this.categoriesProvider.createCategoryWithRel(parseCategories[i], id)
            }

            // edit image
            // image = req.file ? await this.storageService.uploadImage(req.file) : products.image

            const updatedProduct = await this.productsModel.update({
                title,
                description,
                shortDescription,
                price,
                images
            },  {
                where:  { id }
            })

            return this.response({
                message: "Product successfully updated"
            })
        } catch (error) {
            return this.serverErrorResponse()
        }
    }

    async get(req) {
        try {
            const { category, sort, page, limit } = req.query;
            const params = category ? {} : { page, limit }
            let products  = await this.productsProvider.findAll(params)

            if (category) {
                const findCategory = await this.categoriesModel.findOne({ where: { name: category }})


                if (!findCategory) {
                    return this.response({
                        statusCode: 404,
                        status: false,
                        message: 'Category not found'
                    })
                }


                const paginateParams = paginate({
                    currentPage: page,
                    pageSize: limit
                })

                const filteredProducts = products.products.filter(product => product.categories.some(category => category.id === findCategory.id))

                return this.response({
                    data: {
                        products: filteredProducts.slice(paginateParams.offset, paginateParams.offset + paginateParams.limit),
                        count: filteredProducts.length
                    }
                })
            } else {

                return this.response({
                    data: products
                })
            }
        } catch (error) {

            console.log(error, 'error')
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

            const product = await this.productsProvider.findById({id})

            if (!product) {
                return this.response({
                    status: false,
                    statusCode: 404,
                    message: "Products not found"
                })
            }

            return this.response({ data: product })
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
                where: {id}
            })

            if (!products) {
                return this.response({
                    status: false,
                    statusCode: 404,
                    message: "Product not found"
                })
            }

            await this.productsModel.destroy({
                where: { id }
            })

            return this.response({message: "Product deleted successfully"})
        } catch (error) {
            return this.serverErrorResponse();
        }
    }


    getProductsByCategory(req) {

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