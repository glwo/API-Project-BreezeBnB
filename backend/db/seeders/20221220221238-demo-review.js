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
      userId: 2,
      review: "This place rocks!",
      stars: 5
    },
    {
      spotId: 1,
      userId: 3,
      review: "This is a nice place!",
      stars: 4
    },
    {
      spotId: 2,
      userId: 3,
      review: "Pretty average.",
      stars: 3
    },
    {
      spotId: 2,
      userId: 1,
      review: "Not perfect but we had a lot of fun!",
      stars: 4
    },
    {
      spotId: 3,
      userId: 1,
      review: "Had a very negative experience here!",
      stars: 1
    },
    {
      spotId: 3,
      userId: 2,
      review: "We didn't enjoy it very much.",
      stars: 2
    },
    {
      spotId: 4,
      userId: 2,
      review: "We had an unbelievable stay!",
      stars: 5
    },
    {
      spotId: 5,
      userId: 3,
      review: "Wasn't anything to write home about",
      stars: 3
    },
    {
      spotId: 6,
      userId: 2,
      review: "This place is magic!",
      stars: 5
    }
   ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    }, {})
  }
};
