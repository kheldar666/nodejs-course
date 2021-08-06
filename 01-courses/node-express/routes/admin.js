const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
    //Return Static File
    //res.sendFile(path.join(rootDir,'views','html','add-product.html'))

    //Return Pug Template
    res
        .render('add-product',{docTitle:'Add a Product', path:'/admin/add-product'});
});

router.post('/add-product', (req, res, next) => {
    products.push({title: req.body.title});
    res.redirect('/');
});

module.exports = {
    routes: router,
    products: products
}