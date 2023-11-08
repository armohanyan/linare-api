const BaseService = require('./BaseService')
const StorageService = require('./StorageService')
const CategoriesProvider = require('../provider/CategoriesProvider')
const NewsProvider = require('../provider/NewsProvider')
const {Sequelize, News, Categories, Authors, News_Category, Views} = require('../models')
const {Op} = require("sequelize");
const {getLastWeeksDate, getLastMonthDate, getPreviousDay} = require("../helpers");

class NewsService extends BaseService {
    constructor() {
        super();
        this.categoriesProvider = new CategoriesProvider()
        this.storageService = new StorageService()
        this.newsProvider = new NewsProvider()
        this.categoriesModel = Categories
        this.authorModel = Authors
        this.newsModel = News
        this.viewssModel = Views
    }

    async createNews(req) {
        try {
            const {title, text, categories, icon, author, imageAlt, iframe} = req.body
            const parseCategories = Array.isArray(categories) ? categories : [categories]
            let newsAuthor;
            let image;

            if (!parseCategories?.length)
                return this.response({
                    status: false,
                    statusCode: 400,
                    message: "Category is required"
                })

            if (author) {
                const findAuthor = await this.authorModel.findOne({
                    where: {author},
                })

                if (!findAuthor)
                    newsAuthor = await this.authorModel.create({author, postsCount: 1})
                else {
                    await this.authorModel.update(
                        {postsCount: findAuthor.postsCount + 1},
                        {where: {id: findAuthor.id}}
                    )

                    newsAuthor = await this.authorModel.findOne({
                        where: {id: findAuthor.id},
                    })
                }
            }

            if (req.file)
                image = await this.storageService.uploadImage(req.file)

            const handleImageAlt = req.file ? imageAlt : null

            const createdNews = await this.newsModel.create({
                title,
                text,
                image,
                icon,
                imageAlt: handleImageAlt,
                authorId: newsAuthor?.id,
                iframe
            })

            for (let i = 0; i < parseCategories.length; i++)
                await this.categoriesProvider.createCategoryWithRel(parseCategories[i], createdNews.id)

            return this.response({
                message: "Created successfully"
            })
        } catch (error) {
            return this.serverErrorResponse();
        }
    }

    async editNews(req) {
        try {
            const {title, text, categories, icon, author, imageAlt, iframe} = req.body
            const {id} = req.params
            const parseCategories = Array.isArray(categories) ? categories : [categories]
            let newsAuthor;
            let image;

            const news = await this.newsProvider.findById({id})

            if(!news) 
                return this.response({
                    message: 'News not found',
                    statusCode: 404,
                    status: false
                })

            if (!parseCategories?.length)
                return this.response({
                    status: false,
                    statusCode: 400,
                    message: "Category is required"
                })

            // delete all categories where news id is match
            await News_Category.destroy({
                where: {newsId: id}
                })

            // edit categories
            for (let i = 0; i < parseCategories.length; i++) {
                await this.categoriesProvider.createCategoryWithRel(parseCategories[i], id)
            }

            // edit author when does not match with news author
            if (author) {
                if (news?.author?.author !== author) {
                    const findAuthor = await this.authorModel.findOne({
                        where: {author},
                    })

                    if (!findAuthor)
                        newsAuthor = await this.authorModel.create({author, postsCount: 1})
                    else {
                        newsAuthor = await this.authorModel.findOne({
                            where: {id: findAuthor.id},
                        })
                    }
                } else {
                    newsAuthor = news.author
                }
            }

            // edit image
            image = req.file ? await this.storageService.uploadImage(req.file) : news.image

            await this.newsModel.update({
                title: title || news.title,
                text: text || news.text,
                imageAlt: imageAlt || news.imageAlt,
                icon: icon || news.icon,
                iframe: iframe || news.iframe,
                authorId: newsAuthor.id,
                image
            },  {
                where: {id}
            })

            return this.response({
                message: "News successfully edited"
            })
        } catch (error) {
            return this.serverErrorResponse()
        }
    }

    async getNews(req) {
        try {
            const {category, page, limit} = req.query;
            let news = []
            if (category) {
                let attributes = ['id', 'title', 'text', 'image', 'icon', 'imageAlt', 'createdAt']
                const parseCategory = category.toLowerCase()
                let rels = true

                if (parseCategory === 'տեսանյութեր') {
                    attributes = ['id', 'title', 'text', 'iframe', 'icon', 'createdAt']
                    rels = false
                } else if (parseCategory === 'գլխավոր') {
                    attributes = ['id', 'title', 'image', 'imageAlt', 'icon', 'createdAt']
                    rels = false
                }  else if (parseCategory === 'կարդացեք֊նաև') {
                    attributes = ['id', 'title', 'text', 'image', 'imageAlt', 'icon', 'createdAt']
                    rels = false
                }

                news = await this.newsProvider.findNewsByCategory({
                    page,
                    limit,
                    include: rels,
                    category,
                    attributes
                })
            }
            else
                news = await this.newsProvider.findAll({page, limit})

            return this.response({
                data: news
            })
        } catch (error) {
            return this.serverErrorResponse();
        }
    }

    async getNewsFeed(req) {
        try {
            const {page, limit} = req.query;
            const category = 'լրահոս'

            const news = await this.newsProvider.findNewsByCategory({
                page,
                limit,
                include: false,
                category,
                attributes: ['id', 'title', 'image', 'createdAt']
            })

            return this.response({
                data: news
            })

        } catch (error) {
            return this.serverErrorResponse()
        }
    }

    async getSingleNews(req) {
        try {
            const {id} = req.params;

            if (!id)
                return this.response({
                    status: false,
                    statusCode: 400,
                    message: "News is required"
                })

            const news = await this.newsProvider.findById({id})

            if (!news) return this.response({
                status: false,
                statusCode: 404,
                message: "News not found"
            })

            await this.viewsProvider.handleNewsViews({ newsId: news.id, ip: req.socket.remoteAddress })

            return this.response({data: news})
        } catch (error) {
            return this.serverErrorResponse();
        }
    }

    async deleteNews(req) {
        try {
            const {id} = req.params

            if (!id) {
                return this.response({
                    status: false,
                    statusCode: 400,
                    message: "Missing news id"
                })
            }

            const news = await this.newsModel.findOne({
                where: {id},
                include: [{
                    model: Authors,
                    as: 'author'
                }, {
                    model: Categories,
                    as: 'categories'
                }]
            })

            if (!news) return this.response({
                status: false,
                statusCode: 404,
                message: "News not found"
            })


            if (news.author) {
                if (news.author.postsCount - 1 <= 0) {
                    await this.authorModel.destroy(
                        {where: {id: news.author.id}}
                    )
                } else {
                    await this.authorModel.update(
                        {postsCount: news.author.postsCount - 1},
                        {where: {id: news.author.id}}
                    )
                }
            }

            await this.newsModel.destroy({
                where: {id}
            })

            // destroy categories if there aren't exist any news
            for (let i = 0; i < news.categories.length; i++) {
                const where = {category: news.categories[i].category}
                const isEmptyCategory = await this.newsProvider.findNewsByCategory(where)

                if (!isEmptyCategory.count)
                    await this.categoriesModel.destroy({where})
            }

            return this.response({message: "News deleted successfully"})
        } catch (error) {
            return this.serverErrorResponse();
        }
    }

    async searchNews(req) {
        try {
            const {page, limit, query} = req.query;
            if (!query) return this.response({status: false, statusCode: 400, message: "Missing search value"})

            const news = await this.newsProvider.findAll({
                    page,
                    limit,
                    where: {
                        [Op.or]: [
                            {'title': {[Op.like]: '%' + query + '%'}},
                            {'text': {[Op.like]: '%' + query + '%'}}
                        ]
                    }
                }
            )

            return this.response({data: news})
        } catch (error) {
            return this.serverErrorResponse();
        }
    }

}

module.exports = NewsService