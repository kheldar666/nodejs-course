const path = require("path");
const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const adminController = require("../../controllers/mongodb/admin");
const isAuth = require("../../middleware/is-auth");
const validResult = require("../../middleware/validation-postcheck");

router.get("/products", isAuth, adminController.getProducts);

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post(
  "/add-product",
  isAuth,
  [
    body("title", "Please provide a title")
      .not()
      .isEmpty({
        ignore_whitespace: true,
      })
      .isString()
      .trim(),
    body("imageUrl", "Please provide a valid Image URL")
      .not()
      .isEmpty({
        ignore_whitespace: true,
      })
      .isURL({require_protocol:true}),
    body("price", "Please indicate a valid price")
      .not()
      .isEmpty({
        ignore_whitespace: true,
      })
      .isDecimal({ decimal_digits: "0,2" }),
    body("description", "Please provide a minimal description").not().isEmpty({
      ignore_whitespace: false,
    }),
  ],
  validResult,
  adminController.postAddProducts
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  isAuth,
  [
    body("title", "Please provide a title")
      .not()
      .isEmpty({
        ignore_whitespace: true,
      })
      .isString()
      .trim(),
    body("imageUrl", "Please provide a valid Image URL")
      .not()
      .isEmpty({
        ignore_whitespace: true,
      })
      .isURL({ require_protocol: true }),
    body("price", "Please indicate a valid price")
      .not()
      .isEmpty({
        ignore_whitespace: true,
      })
      .isDecimal({ decimal_digits: "0,2" }),
    body("description", "Please provide a minimal description").not().isEmpty({
      ignore_whitespace: false,
    }),
  ],
  validResult,
  adminController.postUpdateProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

exports.routes = router;
