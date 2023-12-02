const BaseService = require("./BaseService");
const {verifyToken} = require("../common/token");
const {Users} = require("../models");

class AccountService extends BaseService {

  constructor() {
    super();
    this.userModel = Users
  }

  async current(req) {
    try {
      const token =
        req?.cookies?.accessToken ||
        req?.headers?.authorization?.split(' ')[1] ||
        null;
      if (!token) {
        return this.response({
          status: false,
          statusCode: 401,
          message: 'Invalid Token'
        });
      }
      const isValidToken = verifyToken({ token });
      console.log(isValidToken)
      if (isValidToken) {
        const userId = isValidToken.id;

        const user = await this.userModel.findOne(
            { where: { id: userId } }
        )

        if (!user) {
          return this.response({
            status: false,
            statusCode: 404,
            message: 'User does not found'
          });
        }
        return this.response({
          data: {
            currentAccount: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              isVerified: user.isVerified,
              role: user.role
            }
          }
        });
      }

      return this.response({
        status: false,
        statusCode: 401,
        message: 'Invalid or expire token'
      });
    } catch (error) {
      return this.serverErrorResponse(error);
    }
  }
}

module.exports = AccountService;
