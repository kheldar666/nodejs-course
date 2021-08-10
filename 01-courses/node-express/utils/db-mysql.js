const Sequelize = require('sequelize');

// Setting Up Sequelize
const sequelize = new Sequelize(
  process.env.SEQUELIZE_DATABASE,
  process.env.SEQUELIZE_USERNAME,
  process.env.SEQUELIZE_PASSWORD,
  {
    dialect: process.env.SEQUELIZE_DIALECT,
    host: process.env.SEQUELIZE_HOST,
    logging: process.env.SEQUELIZE_LOGGING
  }
);
module.exports.sequelize = sequelize;
 
