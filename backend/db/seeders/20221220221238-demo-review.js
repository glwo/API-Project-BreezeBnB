'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
   options.tableName = 'Reviews';
   return queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      userId: 1,
      review: "This place rocks!",
      stars: 5
    },
    {
      spotId: 2,
      userId: 2,
      review: "Pretty average.",
      stars: 3
    },
    {
      spotId: 3,
      userId: 3,
      review: "Had a very negative experience here!",
      stars: 1
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    }, {})
  }
};
