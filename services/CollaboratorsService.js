const fs = require('fs');
const BaseService = require("./BaseService");
const {Collaborators} = require("../models");
const StorageService = require("./StorageService");

module.exports = class extends BaseService {
  constructor() {
    super();
    this.collaboratorsModel = Collaborators
    this.storageService = new StorageService()
  }

  async create(req) {
    try {
      const { name, description } = req.body;

      const  params =  {
        name,
        description
      }

      const logo = req.file ? await this.storageService.uploadImage(req.file) : null

      const collaborator = await this.collaboratorsModel.create({
        ...params,
        logo
      });

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

        if (!collaborator) {
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
      const { id, name, description } = req.body;

      if(!id) {
        return this.response({
          status: false,
          statusCode: 400,
          message: 'Collaborator ID is required'
        });
      }

      const collaborator = await this.collaboratorsModel.findOne({ where: { id } } );

      const logo = req.file ? await this.storageService.uploadImage(req.file) : (collaborator?.logo || null)

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

      const collaborator = await this.collaboratorsModel.findByPk(id)

      if (collaborator?.logo) {
        await this.storageService.deleteImage(collaborator.logo)
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
