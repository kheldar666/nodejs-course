const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-express','root','admin',{
    dialect:'mysql',
    host:'localhost',
    logging: true
});

module.exports = sequelize;