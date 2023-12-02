const NewsService = require('../services/NewsService')
const CategoriesService = require('../services/CategoriesService')

class CategoriesController {
    constructor() {
        this.categoriesService = new CategoriesService()
    }

    async create(req, res) {
        const data = await this.categoriesService.create(req);
        res.status(data.statusCode).json(data);
    }

    async update(req, res) {
        const data = await this.categoriesService.update(req);
        res.status(data.statusCode).json(data);
    }

    async get(req, res) {
        const data = await this.categoriesService.get(req);
        res.status(data.statusCode).json(data);
    }

    async delete(req, res) {
        const data = await this.categoriesService.delete(req);
        res.status(data.statusCode).json(data);
    }

    async getSingle(req, res) {
        const data = await this.categoriesService.getSingle(req);
        res.status(data.statusCode).json(data);
    }

    // async getNewsFeed(req, res) {
    //     const data = await this.productsService.getNewsFeed(req);
    //     res.status(data.statusCode).json(data);
    // }

    // async searchNews(req, res) {
    //     const data = await this.productsService.searchNews(req);
    //     res.status(data.statusCode).json(data);
    // }

    // async moreReadableNews (req, res) {
    //     const data = await this.productsService.moreReadableNews(req);
    //     res.status(data.statusCode).json(data);
    // }}
}
module.exports = CategoriesController