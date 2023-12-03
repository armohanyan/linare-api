const BaseService = require("./BaseService");
const {verifyToken} = require("../common/token");
const {Users, Categories, Products, Products_Categories, Contacts, Collaborators, Testimonials} = require("../models");

class AccountService extends BaseService {

  constructor() {
    super();
    this.userModel = Users

    this.categoriesModel = Categories
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

      return this.response({
        data: {
          categories,
          products,
          testimonials,
          partners
        }
      });

    } catch (error) {
      return this.serverErrorResponse(error);
    }
  }
}

module.exports = AccountService;
