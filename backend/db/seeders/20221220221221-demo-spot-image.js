'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "https://www.images.com/new-content/spot1/image1",
        preview: true
      },
      {
        spotId: 2,
        url: "https://www.images.com/new-content/spot2/image2",
        preview: true
      },
      {
        spotId: 3,
        url: "https://www.images.com/new-content/spot3/image3",
        preview: true
      }
    ], {})
  },

  down: async(queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    }, {})
  }
};
