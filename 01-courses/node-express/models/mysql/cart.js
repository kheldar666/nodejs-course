const Sequelize = require('sequelize');

const dbConn = require('../../utils/database');

const Cart = dbConn.sequelize.define('cart', {
    id: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    }
})

module.exports = Cart;