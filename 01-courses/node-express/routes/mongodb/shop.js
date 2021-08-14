const express = require("express");

const { body } = require("express-validator");

const shopController = require("../../controllers/mongodb/shop");
const isAuth = require("../../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProductDetails);

router.get(
  "/cart",
  isAuth,
  [body("title", "Please input a title").isEmpty(), body("")],
  shopController.getCart
);

router.post("/addtocart", isAuth, shopController.postAddToCart);

router.post("/removefromcart", isAuth, shopController.postRemoveFromCart);

router.get("/checkout", isAuth, shopController.getCheckout);

router.get("/checkout/success", isAuth, shopController.getCheckoutSuccess);

router.get("/checkout/cancel", isAuth, shopController.getCheckout);

router.get("/orders", isAuth, shopController.getOrders);

router.get(
  "/orders/invoice/:orderId",
  isAuth,
  shopController.getOrderDynamicInvoice
);

module.exports = router;
