const NewsService = require('../services/NewsService')
const ProductsService = require('../services/ProductsService')

class ProductsController {
    constructor() {
        this.productsService = new ProductsService()
    }

    async create(req, res) {
        const data = await this.productsService.create(req);
        res.status(data.statusCode).json(data);
    }

    async update(req, res) {
        const data = await this.productsService.update(req);
        res.status(data.statusCode).json(data);
    }

    async get(req, res) {
        const data = await this.productsService.get(req);
        res.status(data.statusCode).json(data);
    }

    async delete(req, res) {
        const data = await this.productsService.delete(req);
        res.status(data.statusCode).json(data);
    }

    async getSingle(req, res) {
        const data = await this.productsService.getSingle(req);
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
module.exports = ProductsController