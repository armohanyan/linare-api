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

  async getAll(req)
  {
    try {
      const users = await this.userModel.findAll()

      return this.response({
        data: users
      })
    } catch {
      return this.serverErrorResponse()
    }
  }

  async update(req) {
    try {
      const params = req.body

      if (params.id) {
        return this.response({
          status: false,
          statusCode: 400,
          message: "Id is requited"
        })
      }

      const hashedPassword = await bcrypt.hash(params.password, 10)

      await this.userModel.update({
        ...params,
        password: hashedPassword
      }, {
        where: { id: params.id }
      })

      return this.response({message: 'Admin updated successfully'})
    } catch {
      return this.serverErrorResponse()
    }

  }


  async delete(req) {
    try {
      const {id} = req.params

      if (id) {
        return this.response({
          status: false,
          statusCode: 400,
          message: "Id is requited"
        })
      }

      await this.userModel.destroy({where: {id}})

      return this.response({message: "delete successfully"})
    } catch {
      this.serverErrorResponse()
    }

  }

}

module.exports = AccountService;
