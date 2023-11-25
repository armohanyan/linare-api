const MailService = require('./mailService');
const bcrypt = require('bcrypt')
const BaseService = require("./BaseService");
const { Users } = require("../models");
const {createToken, verifyToken} = require("../common/token");
const mailService = new MailService();

module.exports = class AuthService extends BaseService {

  constructor() {
    super();
    this.userModel = Users

  }

  async signUp(req) {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      const err = this.handleErrors(req);
      if(err.hasErrors) {
        return err.body;
      }

      const user = await this.userModel.findOne(
    { where: { email } }
      )

      if(user) {
        return this.response({
          status: false,
          statusCode: 409,
          message: 'User already registered'
        });
      }

      const confirmationToken = createToken({
        payload: {
          email
        },
        secret: process.env.JWT_EMAIL_SECRET,
        options: {
          expiresIn: '2m'
        }
      });

      const hashedPassword = await bcrypt.hash(password, 10)

      const createUser = await this.userModel.create({
        confirmationToken,
        firstName,
        lastName,
        password: hashedPassword,
        email,
        phone,
        role: 'superAdmin'
      });

      if (createUser) {
        const url = `verify-email?email=${email}&token=${confirmationToken}`;

        mailService.sendMail(
          email,
          url,
          'Email verification',
          'Please click to verify your email'
        );

        const token = createToken({
          payload: {
            id: createUser._id
          }
        });

        return this.response({
          data: { token },
          statusCode: 201,
          message: 'User Register'
        });
      }
    } catch(error) {
      console.log(error)
      return this.serverErrorResponse(error);
    }
  }

  async signIn(req) {
    try {
      const err = this.handleErrors(req);
      if(err.hasErrors) {
        return err.body;
      }

      const { email, password } = req.body;
      const user = await this.userModel.findOne(
          { where: { email } }
      )

      if(user && bcrypt.compareSync(password, user.password)) {
        if(user.isVerified) {
          const token = createToken({
            payload: {
              id: user.id
            }
          });

          return this.response({
            data: {
              token,
              user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isVerified: user.isVerified,
                role: user.role
              }
            }
          });

        } else {
          return this.response({
            statusCode: 401,
            status: false,
            data: { isVerified: false },
            message: 'Email is not verified'
          });
        }
      }

      return this.response({
        statusCode: 400,
        status: false,
        message: 'Incorrect email and/or  password'
      });

    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async requestVerifyEmail(req) {
    try {
      const { email } = req.body;

      const user = await this.userModel.findOne({where: {email}});

      if(!user) {
        return this.response({
          statusCode: 400,
          status: false,
          message: 'Invalid Email'
        });
      }

      const confirmationToken = createToken({
        payload: {
          email
        },
        secret: process.env.JWT_EMAIL_SECRET,
        options: {
          expiresIn: '2m'
        }
      });

      await this.userModel.update({
        confirmationToken
      },  {
        where: { email }
      })

      const url = `verify-email?email=${email}&token=${confirmationToken}`;

      mailService.sendMail(
          email,
          url,
          'Email verification',
          'Please click to verify your email'
      );


      return this.response({
        message: 'Token was sent to email'
      });

    } catch(error) {
      console.log(error)
      return this.serverErrorResponse(error);
    }
  }

  async verifyEmail(req) {
    try {
      const { email, token } = req.body;
      if(
        token &&
        verifyToken({ token, secret: process.env.JWT_EMAIL_SECRET })
      ) {
        const isValidUser = await this.userModel.findOne(
            { where: { email } }
        )

        if (!isValidUser) {
          return this.response({
            statusCode: 404,
            status: false,
            message: 'User does not  found'
          });
        }

        if(isValidUser.isVerified) {
          return this.response({
            message: 'User has already verified'
          });
        }

        const user = await this.userModel.findOne(
            { where: { email, confirmationToken: token } }
        )
        await this.userModel.update({
          isVerified: true,
          confirmationToken: null
        },  {
          where: { id: user.id }
        })

        return this.response({
          message: 'Email successfully confirmed'
        });

      } else {
        return this.response({
          status: false,
          statusCode: 401,
          message: 'Invalid or expire token'
        });
      }
    } catch(error) {
      console.log(error)
      return this.serverErrorResponse(error);
    }
  }

  async resendVerificationToken(req) {
    try {
      const { email } = req.body;

      const user = await this.userModel.findOne(
          { where: { email } }
      )

      if (user) {
        const confirmationToken = createToken({
          payload: {
            email
          },
          secret: process.env.JWT_EMAIL_SECRET,
          options: {
            expiresIn: '2m'
          }
        });

        const url = `verify-email?email=${email}&token=${confirmationToken}`;

        await this.userModel.update({
          confirmationToken
        },  {
          where: { email }
        })

        mailService.sendMail(
          email,
          url,
          'Email verification',
          'Please click to verify your email'
        );

        return this.response({
          message: 'Token was sent to email'
        });

      } else {
        return this.response({
          status: false,
          statusCode: 404,
          message: 'User does not found'
        });
      }
    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async verifyEmailOnResetPassword(req) {
    try {
      const { email } = req.body;
      const user =await this.userModel.findOne(
          { where: { email } }
      )

      if (!user) {
        return this.response({
          status: false,
          statusCode: 404,
          message: 'User does not found'
        });
      }

      const confirmationToken = createToken({
        payload: {
          email
        },
        secret: process.env.JWT_PASSOWRD_RESET_SECRET,
        options: {
          expiresIn: '10m'
        }
      });

      const updateUserConfirmationToken =   await this.userModel.update({
        confirmationToken
      },  {
        where: { email }
      })

      if (updateUserConfirmationToken) {
        const url = `reset-password?email=${email}&token=${confirmationToken}`;

        mailService.sendMail(
          email,
          url,
          'Reset Password',
          'Please click to reset your password'
        );
      }

      return this.response({
        status: false,
        message: "Token was sent to email"
      });
    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async resetPassword(req) {
    try {
      const validationError = this.handleErrors(req);

      if (validationError.hasErrors) {
        return validationError.body;
      }

      const { password } = req.body;

      const token = req?.headers?.authorization?.split(' ')[1] || null;
      const isTokenValid = verifyToken({
        token,
        secret: process.env.JWT_PASSOWRD_RESET_SECRET
      });

      if (isTokenValid) {
        const { email } = isTokenValid;
        const user = await this.userModel.findOne(
                { where: { email } }
        )

        if (!user) {
          return this.response({
            status: false,
            statusCode: 404,
            message: "User does not found"
          });
        }

        const hashedPassword = bcrypt.hash(password, 10)

        const resetUserPassword = await this.userModel.update({
          hashedPassword,
          confirmationToken: null
        },  {
          where: { email }
        })

        if (resetUserPassword) {
          return this.response({
            status: false,
            statusCode: 200,
            message: "Password reset successfully"
          });
        }
      } else {
        return this.response({
          status: false,
          statusCode: 401,
          message: "Invalid token"
        });
      }
    } catch(error) {
      return this.serverErrorResponse(error)
    }
  }
};
