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
            where: { name: category.toLowerCase() },
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


        return response?.rows.map(el => el.dataValues)
    }
}

module.exports = ProductsProvider