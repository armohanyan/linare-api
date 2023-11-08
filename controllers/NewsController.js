const NewsService = require('../services/NewsService')

class NewsController {
    constructor() {
        this.newsService = new NewsService()
    }

    async createNews(req, res) {
        const data = await this.newsService.createNews(req);
        res.status(data.statusCode).json(data);
    }

    async editNews(req, res) {
        const data = await this.newsService.editNews(req);
        res.status(data.statusCode).json(data);
    }

    async getNewsFeed(req, res) {
        const data = await this.newsService.getNewsFeed(req);
        res.status(data.statusCode).json(data);
    }

    async getNews(req, res) {
        const data = await this.newsService.getNews(req);
        res.status(data.statusCode).json(data);
    }

    async getSingleNews(req, res) {
        const data = await this.newsService.getSingleNews(req);
        res.status(data.statusCode).json(data);
    }

    async searchNews(req, res) {
        const data = await this.newsService.searchNews(req);
        res.status(data.statusCode).json(data);
    }

    async deleteNews(req, res) {
        const data = await this.newsService.deleteNews(req);
        res.status(data.statusCode).json(data);
    }

    async moreReadableNews (req, res) {
        const data = await this.newsService.moreReadableNews(req);
        res.status(data.statusCode).json(data);
    }}

module.exports = NewsController