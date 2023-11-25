const CollaboratorsService = require('../services/CollaboratorsService')

class CollaboratorsController {
    constructor() {
        this.collaboratorsService = new CollaboratorsService();
    }

    async create(req, res) {
        const data = await this.collaboratorsService.create(req);
        res.status(data.statusCode).json(data);
    }

    async show(req, res) {
        const data = await this.collaboratorsService.show(req);
        res.status(data.statusCode).json(data);
    }

    async update(req, res) {
        const data = await this.collaboratorsService.update(req);
        res.status(data.statusCode).json(data);
    }

    async delete(req, res) {
        const data = await this.collaboratorsService.delete(req);
        res.status(data.statusCode).json(data);
    }
}

module.exports = CollaboratorsController
