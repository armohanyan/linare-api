const {Sequelize, News, Categories, Authors, News_Category, Products} = require('../models')
const {paginate} = require("../helpers");

class NewsProvider {

    async findAll({page, limit, where = null}) {
        const response = await News.findAndCountAll({
            ...paginate({
                currentPage: page,
                pageSize: limit
            }),
            where,
            order: [
                ['createdAt', 'DESC']
            ],
            attributes: ['id', 'title', 'text', 'image', 'icon', 'imageAlt', 'createdAt'],
            include: [{
                model: Categories,
                as: 'categories',
                attributes: ['id', 'name'],
                through: {
                    attributes: []
                }
            }, {
                model: Authors,
                as: 'author'
            }
            ],
            through: {
                attributes: []
            }
        })
        response.news = response?.rows
        delete response.rows

        return response

    }

    async findById({id}) {
        return await Products.findByPk(id, {
            attributes: ['id', 'title', 'text', 'image', 'createdAt', 'imageAlt'],
            include: [{
                model: Categories,
                as: 'categories',
                attributes: ['id', 'name'],
                through: {
                    attributes: []
                }
            }, {
                model: Authors,
                as: 'author'
            }
            ],
            through: {
                attributes: []
            }
        })
    }

    async findNewsByCategory({page, limit, category, include = true, attributes= ['id', 'title', 'text', 'image', 'createdAt']}) {
        const parsedRel = [{
            model: Categories,
            as: 'categories',
            where: {name: category.toLowerCase()},
            attributes: ['id', 'name'],
            through: {
                attributes: []
            }
        }, {
            model: Authors,
            as: 'author'
        }]
        
        const response = await News.findAndCountAll({
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
        
        response.news = response?.rows
        delete response.rows

        if(!include) {
            response.news.forEach(element => {
                if (element.dataValues.categories)
                    delete element.dataValues.categories
                if (element.dataValues.author) 
                    delete element.dataValues.author
            });
        }   
        
        return response
    }
}

module.exports = NewsProvider