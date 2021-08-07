const path = require('path');

const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const { route } = require('./shop');

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProducts);

router.get('/products', adminController.getProducts);

exports.routes=router;