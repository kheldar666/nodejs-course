const Sequelize = require('sequelize');

const dbConfig = require('../configurations/mysql');

// Setting Up Sequelize
const sequelize = new Sequelize(dbConfig.database,dbConfig.username,dbConfig.password,{
    dialect:dbConfig.dialect,
    host:dbConfig.host,
    logging: dbConfig.logging
});
module.exports.sequelize = sequelize;
 
