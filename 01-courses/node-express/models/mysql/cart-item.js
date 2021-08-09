const Sequelize = require('sequelize');

const dbConn = require('../../utils/database');

const CartItem = dbConn.sequelize.define('cartItem', {
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

module.exports = CartItem;