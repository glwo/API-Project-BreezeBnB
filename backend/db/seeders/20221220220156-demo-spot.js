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
      },
      {
        ownerId: 3,
        address: "654 Mountain Avenue",
        city: "Austin",
        state: "Texas",
        country: "United States",
        lat: 40,
        lng: 85,
        name: "East Side Beehive",
        description: "Clean, Zen modern backyard cottage, easy access to SXSW, convention center, great dining, and public transportation. Gorgeous, peaceful space, close to the action but perfect for rest and recharging. Easy access to SXSW, ACL, F1 and all festivals.",
        price: 450
      },
      {
        ownerId: 1,
        address: "1111 Country Road",
        city: "Baileyville",
        state: "Kansas",
        country: "United States",
        lat: 40,
        lng: 85,
        name: "Zome on the Range",
        description: "See the countryside from from a whole new angle! You won't hear a discouraging word about this ten sided 'zome' located  in the Kansas range! ",
        price: 650
      },
      {
        ownerId: 2,
        address: "137 Mountain Ave",
        city: "Boulder",
        state: "Utah",
        country: "United States",
        lat: 40,
        lng: 85,
        name: "Bedrock Homestead Full Cave",
        description: "Embrace the mountainside with converted cave home!",
        price: 1100
      },
      {
        ownerId: 3,
        address: "137 Studio Road",
        city: "Rhineback",
        state: "New York",
        country: "United States",
        lat: 40,
        lng: 85,
        name: "Architectural wonder in the woods",
        description: "Unique experience, secluded. Enjoy a weekend or a few days eco-friendly retreat in an architectural, geometric masterpiece on 30 preserved acres just minutes from all that Rhinebeck and the Hudson Valley have to offer.",
        price: 750
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
