'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Produtos', 'foto', {
      type: Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Produtos', 'foto')
  }
};
