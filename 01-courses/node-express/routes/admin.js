const path = require('path');

const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/products', adminController.getProducts);

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProducts);

router.get('/edit-product', adminController.getEditProduct);

router.post('/edit-product', adminController.getUpdateProduct);

router.post('/delete-product', adminController.postDeleteProduct);

exports.routes=router;