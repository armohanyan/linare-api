'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Authors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      author: {
        type: Sequelize.STRING
      },
      postsCount: {
        type: Sequelize.INTEGER,
        default: 0
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Authors');
  }
};