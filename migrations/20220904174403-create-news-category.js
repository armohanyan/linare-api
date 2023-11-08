'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('News_Categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      newsId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'News',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('News_Categories');
  }
};