const TestimonialsService = require('../services/TestimonialsService')

class TestimonialsController {
    constructor() {
        this.testimonialsService = new TestimonialsService();
    }

    async create(req, res) {
        const data = await this.testimonialsService.create(req);
        res.status(data.statusCode).json(data);
    }

    async show(req, res) {
        const data = await this.testimonialsService.show(req);
        res.status(data.statusCode).json(data);
    }

    async update(req, res) {
        const data = await this.testimonialsService.update(req);
        res.status(data.statusCode).json(data);
    }

    async delete(req, res) {
        const data = await this.testimonialsService.delete(req);
        res.status(data.statusCode).json(data);
    }
}

module.exports = TestimonialsController
