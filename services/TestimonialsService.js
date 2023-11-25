const fs = require('fs');
const BaseService = require("./BaseService");
const {Sequelize, Testimonials, Authors, Categories} = require('../models')

/*
*  const createdNews = await this.newsModel.create({
                title,
                text,
                image,
                icon,
                imageAlt: handleImageAlt,
                authorId: newsAuthor?.id,
                iframe
            })*/
module.exports = class extends BaseService {
  constructor() {
    super();
    this.testimonialsModel = Testimonials
  }

  async create(req) {
    try {
      const { position, comment, avatar } = req.body;

      const  params =  {
        position, comment, avatar
      }

      const testimonial = await this.testimonialsModel.create(params);

      return this.response({
        statusCode: 201,
        data: {
          testimonial
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
        console.log(id)
        const testimonial = await this.testimonialsModel.findOne({ where: { id: id } } );

        console.log(testimonial)
        if(!testimonial) {
          return this.response({
            status: false,
            statusCode: 400,
            message: 'Testimonial does not found'
          });
        }

        return this.response({
          data: {
            testimonial
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

      const { id, position, comment, avatar } = req.body;


      if(!id) {
        return this.response({
          status: false,
          statusCode: 400,
          message: 'Testimonial ID is required'
        });
      }

      const testimonial = await this.testimonialsModel.findOne({ where: { id } } );

      await this.testimonialsModel.update({
        ...testimonial,
        position,
        comment,
        avatar
      },  {
        where: {id}
      })

      return this.response({
        message: 'Testimonial updated successfully'
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
          message: "Testimonial ID is required"
        })
      }

      await this.newsModel.destroy({
        where: {id}
      })

      return this.response({message: "Testimonial deleted successfully"})
    } catch (error) {
      return this.serverErrorResponse();
    }
  }

};
