const express = require('express');

const adminData = require('../routes/admin')

const router = express.Router();

router.get('/', (req, res, next) => {
    const products = adminData.products;

    res.render('shop',{
            prods: products,
            pageTitle:'Martin\'s Shop',
            path:'/',
            css:['product']
        });

});

module.exports = router;