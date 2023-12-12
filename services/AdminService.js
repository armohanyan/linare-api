const BaseService = require("./BaseService");
const {verifyToken} = require("../common/token");
const {Users, Categories, Products, Products_Categories, Contacts, Collaborators, Testimonials} = require("../models");
const bcrypt = require("bcrypt");

class AccountService extends BaseService {

  constructor() {
    super();
    this.userModel = Users

    this.categoriesModel = Categories
    this.userModel = Users
    this.productsModel = Products
    this.contactsModel = Contacts
    this.collaboratorsModel = Collaborators
    this.testimonialsModel = Testimonials
  }

  async statics(req) {
    try {
      const categories = await this.categoriesModel.count()
      const products = await this.productsModel.count()
      const testimonials = await this.testimonialsModel.count()
      const partners = await this.collaboratorsModel.count()
      const users = await this.userModel.count()

      return this.response({
        data: {
          categories,
          products,
          testimonials,
          partners,
          users
        }
      });

    } catch (error) {
      return this.serverErrorResponse(error);
    }
  }
}

module.exports = AccountService;
