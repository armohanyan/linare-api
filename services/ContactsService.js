
const fs = require('fs');
const BaseService = require("./BaseService");
const {Contacts} = require("../models");

module.exports = class extends BaseService {
  constructor() {
    super();
    this.cotactsModel = Contacts
  }

  async create(req) {
    try {
      const { phone_1, phone_2, email, address, facebook, instagram } = req.body;

      const  params =  {
        phone_1, phone_2, email, address, facebook, instagram
      }

      const contacts = await this.cotactsModel.create(params);

      return this.response({
        statusCode: 201,
        data: {
          contacts
        }
      });

    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async show(req) {
    try {
      const { id } = req.params;

      if(id) {
        const contacts = await this.cotactsModel.findOne({ where: { id } } );

        if(!contacts) {
          return this.response({
            status: false,
            statusCode: 400,
            message: 'Contacts does not found'
          });
        }

        return this.response({
          data: {
            contacts
          }
        });
      }

      return this.response({
        status: false,
        statusCode: 400,
        message: 'Contacts ID is required'
      });
    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async update(req) {
    try {
      const { id, phone_1, phone_2, email, address, facebook, instagram } = req.body;


      if(!id) {
        return this.response({
          status: false,
          statusCode: 400,
          message: 'Contacts ID is required'
        });
      }

      const collaborator = await this.cotactsModel.findOne({ where: { id } } );

      await this.cotactsModel.update({
        ...collaborator,
        phone_1,
        phone_2,
        email,
        address,
        facebook,
        instagram
      },  {
        where: {id}
      })

      return this.response({
        message: 'Contacts updated successfully'
      });

    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }
};
