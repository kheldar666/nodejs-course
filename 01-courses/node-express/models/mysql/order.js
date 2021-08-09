const Sequelize = require('sequelize');

const dbConn = require('../../utils/database');

const Order = dbConn.sequelize.define('order', {
    id: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    }
})

module.exports = Order;