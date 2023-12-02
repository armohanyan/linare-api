const fs = require('fs');
const BaseService = require("./BaseService");
const {Collaborators} = require("../models");

module.exports = class extends BaseService {
  constructor() {
    super();
    this.collaboratorsModel = Collaborators
  }

  async create(req) {
    try {
      const { name, logo, description } = req.body;

      const  params =  {
        name, logo, description
      }

      const collaborator = await this.collaboratorsModel.create(params);

      return this.response({
        statusCode: 201,
        data: {
          collaborator
        }
      });

    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }


  async showAll(req) {
    try {

      const collaborators = await this.collaboratorsModel.findAll();

      return this.response({
        data: {
          collaborators
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
        const collaborator = await this.collaboratorsModel.findOne({ where: { id } } );

        if(!collaborator) {
          return this.response({
            status: false,
            statusCode: 400,
            message: 'Collaborator does not found'
          });
        }

        return this.response({
          data: {
            collaborator
          }
        });
      }

      return this.response({
        status: false,
        statusCode: 400,
        message: 'Testimonial ID is required'
      });
    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async update(req) {
    try {

      const { id, name, logo, description } = req.body;


      if(!id) {
        return this.response({
          status: false,
          statusCode: 400,
          message: 'Collaborator ID is required'
        });
      }

      const collaborator = await this.collaboratorsModel.findOne({ where: { id } } );

      await this.collaboratorsModel.update({
        ...collaborator,
        name,
        logo,
        description
      },  {
        where: {id}
      })

      return this.response({
        message: 'Collaborator updated successfully'
      });

    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async delete(req) {
    try {
      const {id} = req.params

      if (!id) {
        return this.response({
          status: false,
          statusCode: 400,
          message: "Collaborator ID is required"
        })
      }

      await this.collaboratorsModel.destroy({
        where: {id}
      })

      return this.response({message: "Collaborator deleted successfully"})
    } catch (error) {
      return this.serverErrorResponse();
    }
  }
};
