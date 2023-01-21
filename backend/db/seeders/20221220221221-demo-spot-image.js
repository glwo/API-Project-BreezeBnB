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
      },
      {
        spotId: 4,
        url: "https://media.architecturaldigest.com/photos/62b6036de8be957a9ea4ccac/master/w_1600%2Cc_limit/The%2520Boot%2520-%2520New%2520Zealand.jpg",
        preview: true
      },
      {
        spotId: 5,
        url: "https://travelfreak.com/wp-content/uploads/2019/10/homeaway-vs-airbnb-vs-vrbo.jpg",
        preview: true
      },
      {
        spotId: 6,
        url: "https://www.travelandleisure.com/thmb/36Nveq_VHXM18i13DCjTYAnLjPQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/atlanta-georgia-treehouse-airbnb-exterior-TREEHOUSEATL0222-6162d3ab7b9d4294a13e55eb6b6ed48e.jpg",
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
