
const Sequelize = require('sequelize');

const dbConn = require('../../utils/database');

const OrderItem = dbConn.sequelize.define('orderItem', {
    id: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    quantity: {
        type:Sequelize.INTEGER,
        allowNull:false
    }
})

module.exports = OrderItem;