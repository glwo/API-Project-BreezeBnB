'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "601 North Highland Drive",
        city: "Buffalo",
        state: "New York",
        country: "United States",
        lat: 40,
        lng: 70,
        name: "Palace Place",
        description: "Wonderful open space cabin",
        price: 200
      },
      {
        ownerId: 2,
        address: "5565 South Avenue",
        city: "Denver",
        state: "Colorado",
        country: "United States",
        lat: 40,
        lng: 104,
        name: "Cruise Club",
        description: "Luxury suite and bar",
        price: 250
      },
      {
        ownerId: 3,
        address: "777 North Avenue",
        city: "Miami",
        state: "Florida",
        country: "United States",
        lat: 35,
        lng: 80,
        name: "Beach Retreat",
        description: "Warmth, sunshine, and fresh air",
        price: 75
      },
      {
        ownerId: 1,
        address: "478 North Avenue",
        city: "Salt Lake",
        state: "Utah",
        country: "United States",
        lat: 45,
        lng: 80,
        name: "Magic Manor",
        description: "Spice of Life",
        price: 75
      },
      {
        ownerId: 2,
        address: "354 South Avenue",
        city: "Albuquerque",
        state: "New Mexico",
        country: "United States",
        lat: 55,
        lng: 80,
        name: "Mystical Mansion",
        description: "Relaxing rural oasis",
        price: 300
      },
      {
        ownerId: 3,
        address: "890 East Avenue",
        city: "Raleigh",
        state: "North Carolina",
        country: "United States",
        lat: 40,
        lng: 85,
        name: "Magic Tree House",
        description: "Warmth, sunshine, and fresh air",
        price: 450
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3]}
    }, {});
  }
};
