const AdminService = require("../services/AdminService");

class AccountController {
  constructor() {
    this.adminService = new AdminService();
  }

  async statics(req, res) {
    const data = await this.adminService.statics(req);
    res.status(data.statusCode).json(data);
  }

  async update(req, res) {
    const data = await this.adminService.update(req);
    res.status(data.statusCode).json(data);
  }

  async getAll(req, res) {
    const data = await this.adminService.getAll(req);
    res.status(data.statusCode).json(data);
  }

  async delete(req, res) {
    const data = await this.adminService.delete(req);
    res.status(data.statusCode).json(data);
  }
}

module.exports = AccountController;
