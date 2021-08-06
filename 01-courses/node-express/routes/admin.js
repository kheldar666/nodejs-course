const path = require('path');

const express = require('express');

const router = express.Router();

const productsController = require('../controllers/products')

router.get('/add-product', productsController.getAddProduct);

router.post('/add-product', productsController.postAddProducts);

module.exports = {
    routes: router
}