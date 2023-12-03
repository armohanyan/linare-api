const AdminService = require("../services/AdminService");

class AccountController {
  constructor() {
    this.adminService = new AdminService();
  }

  async statics(req, res) {
    const data = await this.adminService.statics(req);
    res.status(data.statusCode).json(data);
  }
}

module.exports = AccountController;
