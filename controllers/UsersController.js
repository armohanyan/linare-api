const UsersService = require("../services/UsersService");

class AccountController {
  constructor() {
    this.usersService = new UsersService();
  }

  async create(req, res) {
    const data = await this.usersService.create(req);
    res.status(data.statusCode).json(data);
  }

  async update(req, res) {
    const data = await this.usersService.update(req);
    res.status(data.statusCode).json(data);
  }

  async getSingle(req, res) {
    const data = await this.usersService.getSingle(req);
    res.status(data.statusCode).json(data);
  }

  async getAll(req, res) {
    const data = await this.usersService.getAll(req);
    res.status(data.statusCode).json(data);
  }

  async delete(req, res) {
    const data = await this.usersService.delete(req);
    res.status(data.statusCode).json(data);
  }
}

module.exports = AccountController;
