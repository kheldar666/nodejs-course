const Sequelize = require('sequelize');

const dbConn = require('../../utils/db-mysql');

const Product = dbConn.sequelize.define('product', {
    id: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    title:{
        type:Sequelize.STRING,
        allowNull:false

    },
    price:{
        type:Sequelize.DOUBLE,
        allowNull:false
    },
    imageUrl:{
        type:Sequelize.STRING,
        allowNull:false,
        defaultValue:'https://www.odoo.com/web/image/res.users/601020/image_1024?unique=c28878c'
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = Product;