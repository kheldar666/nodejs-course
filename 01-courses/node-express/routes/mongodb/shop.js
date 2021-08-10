const express = require('express');

const shopController = require('../../controllers/mongodb/shop')

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductDetails);

router.get('/cart', shopController.getCart);

router.post('/addtocart', shopController.postAddToCart);

router.post('/removefromcart', shopController.postRemoveFromCart);

// router.get('/orders', shopController.getOrders);

// router.post('/create-order', shopController.createOrder);

module.exports = router;