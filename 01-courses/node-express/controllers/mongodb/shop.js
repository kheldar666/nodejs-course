const Product = require("../../models/mongodb/product");
const Order = require("../../models/mongodb/order");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("mongodb/shop/index", {
        prods: products,
        pageTitle: "Martin's Shop - Welcome",
        path: "/",
        css: ["product"],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });

};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("mongodb/shop/product-list", {
        prods: products,
        pageTitle: "Martin's Shop - All Products",
        path: "/products",
        css: ["product"],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });

};

exports.getProductDetails = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render("mongodb/shop/product-detail", {
        pageTitle: "Martin's Shop - Details - " + product.title,
        path: "/products",
        css: ["product"],
        product: product,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });

};

exports.getCart = (req, res, next) => {
  req.currentUser
    .populate("cart.items.product")
    .execPopulate()
    .then((user) => {
      res.render("mongodb/shop/cart", {
        pageTitle: "Martin's Shop - Your Cart",
        path: "/cart",
        css: ["product", "cart"],
        cartItems: user.cart.items,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });

};

exports.postAddToCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      return req.currentUser.addToCart(product);
    })
    .then((result) => res.redirect("/cart"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });

};

exports.postRemoveFromCart = (req, res, next) => {
  const productId = req.body.productId;
  req.currentUser
    .removeFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });

};

exports.createOrder = (req, res, next) => {
  return req.currentUser
    .createOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });

};

exports.getOrders = (req, res, next) => {
  return Order.find({ "orderedBy.user": req.currentUser })
    .populate("items.product")
    .then((orders) => {
      res.render("mongodb/shop/orders", {
        pageTitle: "Martin's Shop - Orders",
        path: "/orders",
        css: ["orders"],
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};
