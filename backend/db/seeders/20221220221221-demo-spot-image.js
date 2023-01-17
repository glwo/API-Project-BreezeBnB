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
        url: "https://media.architecturaldigest.com/photos/5db73274fbe61f00086f4789/16:9/w_2560%2Cc_limit/IMG_9147_PatrickMahoney.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://www.coloradohomesmag.com/content/uploads/2020/05/EMR_coverb.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://www.southernliving.com/thmb/22fGiTEjJ7ll8-lCGLMe2qbP2Aw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/tiny-florida-rentals-romantic-retreat-key-west-2e1f65d902134a1c810740f69e1b0de0.jpg",
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
