const ContactsService = require('../services/ContactsService')

class ContactsController {
    constructor() {
        this.contactsService = new ContactsService();
    }

    async create(req, res) {
        const data = await this.contactsService.create(req);
        res.status(data.statusCode).json(data);
    }

    async show(req, res) {
        const data = await this.contactsService.showAll(req);
        res.status(data.statusCode).json(data);
    }

    async update(req, res) {
        const data = await this.contactsService.update(req);
        res.status(data.statusCode).json(data);
    }
}

module.exports = ContactsController
