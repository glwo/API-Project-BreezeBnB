'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "https://www.images.com/published/spot1/reviewimage1"
      },
      {
        reviewId: 2,
        url: "https://www.images.com/published/spot2/reviewimage2"
      },
      {
        reviewId: 3,
        url: "https://www.images.com/published/spot3/reviewimage3"
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3]}
    }, {});
  }
};
