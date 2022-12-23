'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: new Date("2022-01-01"),
        endDate: new Date("2022-02-02")
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date("2022-03-03"),
        endDate: new Date("2022-04-04")
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date("2022-05-05"),
        endDate: new Date("2022-06-06")
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    }, {});
  }
};
