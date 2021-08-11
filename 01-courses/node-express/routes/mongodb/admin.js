const path = require('path');

const express = require('express');

const router = express.Router();

const adminController = require('../../controllers/mongodb/admin');
const isAuth = require("../../middleware/is-auth");

router.get("/products", isAuth, adminController.getProducts);

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post("/add-product", isAuth, adminController.postAddProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postUpdateProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

exports.routes=router;