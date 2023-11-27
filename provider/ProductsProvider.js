const {Sequelize, Categories, Authors, Products_Category, Products} = require('../models')
const {paginate} = require("../helpers");

class ProductsProvider {

    async findAll({page, limit, where = null}) {
        const response = await Products.findAndCountAll({
            ...paginate({
                currentPage: page,
                pageSize: limit
            }),
            where,
            order: [
                ['createdAt', 'DESC']
            ],
            attributes: ['id', 'title', 'description', 'images', 'price', 'createdAt'],
            include: [{
                model: Categories,
                as: 'categories',
                attributes: ['id', 'name', 'description'],
                through: {
                    attributes: []
                }
            }
            ],
            through: {
                attributes: []
            }
        })
        response.products = response?.rows

        delete response.rows

        return response

    }

    async findById({id}) {
        return await Products.findByPk(id, {
            attributes:  ['id', 'title', 'description', 'images', 'price', 'createdAt'],
            include: [{
                model: Categories,
                as: 'categories',
                attributes: ['id', 'name', 'description'],
                through: {
                    attributes: []
                }
            }
            ],
            through: {
                attributes: []
            }
        })
    }

    async findProductsByCategory({page, limit, category, include = true, attributes=  ['id', 'title', 'description', 'images', 'price', 'createdAt']}) {
        const parsedRel = [{
            model: Categories,
            as: 'categories',
            where: { category: category.toLowerCase() },
            attributes: ['id', 'name', 'description'],
            through: {
                attributes: []
            }
        }]
        
        const response = await Products.findAndCountAll({
            ...paginate({
                currentPage: page,
                pageSize: limit
            }),
            order: [
                ['createdAt', 'DESC']
            ],
            attributes,
            include: parsedRel,
            through: {
                attributes: []
            }
        })
        
        response.products = response?.rows
        delete response.rows

        if(!include) {
            response.products.forEach(element => {
                if (element.dataValues.categories)
                    delete element.dataValues.categories
                if (element.dataValues.author) 
                    delete element.dataValues.author
            });
        }   
        
        return response
    }
}

module.exports = ProductsProvider