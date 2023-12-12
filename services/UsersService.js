const BaseService = require("./BaseService");
const { Users } = require("../models");
const {hash} = require("bcrypt");
const MailService = require("./mailService");
const mailService = new MailService();

class AccountService extends BaseService {
  constructor() {
    super();

    this.userModel = Users
  }

  async getSingle(req) {
    try {
      const {id} = req.params;

      if (!id) {
        return this.response({
          status: false,
          statusCode: 400,
          message: "ID is required"
        })
      }

      const user = await this.userModel.findOne({ where: { id } })

      if (!user) {
        return this.response({
          status: false,
          statusCode: 404,
          message: "User not found"
        })
      }

      return this.response({ data: user })
    } catch (error) {
      return this.serverErrorResponse();
    }
  }

  async getAll(req){
    try {
      const users = await this.userModel.findAll()

      return this.response({
        data: users
      })
    } catch {
      return this.serverErrorResponse()
    }
  }

  async create(req) {
    try {
      const params = req.body

      const err = this.handleErrors(req);

      if (err.hasErrors) {
        return err.body;
      }

      const user = await this.userModel.findOne(
          { where: { email: params.email } }
      )

      if (user) {
        return this.response({
          status: false,
          statusCode: 409,
          message: 'User already registered'
        });
      }

      const hashedPassword = await hash(params.password, 10)

      await this.userModel.create({
        ...params,
        password: hashedPassword,
        role: 'superAdmin',
        isVerified: true // hardcoded
      })

      mailService.userInviteSendMail(
          params.email,
          'Linare.am',
          'Congratulations, you are invited to Linare!'
      )

      return this.response({message: 'Admin updated successfully'})
    } catch {
      return this.serverErrorResponse()
    }
  }

  async update(req) {
    try {
      const params = req.body

      const err = this.handleErrors(req);
      if (err.hasErrors) {
        console.log(err)
        if (err.body.validationError.property !== 'password') {
          return err.body;
        }

        if (params.password) {
          return err.body
        }
      }

      if (!params.id) {
        return this.response({
          status: false,
          statusCode: 400,
          message: "Id is requited"
        })
      }

      const user  = await this.userModel.findByPk(params.id)
      const hashedPassword = params.password  ? await hash(params.password, 10) : user.password

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

      if (!id) {
        return this.response({
          status: false,
          statusCode: 400,
          message: "Id is required"
        })
      }

      await this.userModel.destroy({where: {id}} )

      return this.response({message: "Deleted successfully"})
    } catch {
      return this.serverErrorResponse()
    }

  }

}

module.exports = AccountService;
