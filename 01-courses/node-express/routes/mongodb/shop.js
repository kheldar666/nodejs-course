const express = require('express');

const { check, body } = require("express-validator");

const shopController = require('../../controllers/mongodb/shop')
const isAuth = require("../../middleware/is-auth");

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductDetails);

router.get("/cart", isAuth, [
    body("title","Please input a title").isEmpty(),
    body("")
],shopController.getCart);

router.post("/addtocart", isAuth, shopController.postAddToCart);

router.post("/removefromcart", isAuth, shopController.postRemoveFromCart);

router.get("/orders", isAuth, shopController.getOrders);

router.post("/create-order", isAuth, shopController.createOrder);

module.exports = router;