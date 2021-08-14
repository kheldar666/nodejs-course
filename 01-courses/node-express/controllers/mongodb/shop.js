const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const stripe = require("stripe")(process.env.APP_STRIPE_SECRET);
const Product = require("../../models/mongodb/product");
const Order = require("../../models/mongodb/order");
const rootDir = require("../../utils/path");
const baseUrl = require("../../utils/base-url");

const ITEMS_PER_PAGE = 3;

exports.getIndex = (req, res, next) => {
  let page = 1;
  let totalItems;
  if (req.query.page) {
    page = req.query.page;
  }

  Product.find()
    .countDocuments()
    .then((totalProducts) => {
      totalItems = totalProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("mongodb/shop/index", {
        prods: products,
        pageTitle: "Martin's Shop - Welcome",
        path: "/",
        css: ["product"],
        totalPages: Math.ceil(Number(totalItems) / Number(ITEMS_PER_PAGE)),
        currentPage: parseInt(page),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getProducts = (req, res, next) => {
  let page = 1;
  let totalItems;
  if (req.query.page) {
    page = req.query.page;
  }

  Product.find()
    .countDocuments()
    .then((totalProducts) => {
      totalItems = totalProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("mongodb/shop/product-list", {
        prods: products,
        pageTitle: "Martin's Shop - All Products",
        path: "/products",
        css: ["product"],
        totalPages: Math.ceil(Number(totalItems) / Number(ITEMS_PER_PAGE)),
        currentPage: parseInt(page),
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

exports.getCheckout = (req, res, next) => {
  let products;
  let totalPrice;
  req.currentUser
    .populate("cart.items.product")
    .execPopulate()
    .then((user) => {
      products = user.cart.items;
      totalPrice = 0;
      products.forEach((p) => {
        totalPrice += p.quantity * p.product.price;
      });
      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((p) => {
          return {
            name: p.product.title,
            description: p.product.description,
            amount: p.product.price * 100,
            currency: "usd",
            quantity: p.quantity,
          };
        }),
        success_url: baseUrl + "/checkout/success", // That is just a method use to practice. Should implement webhooks
        cancel_url: baseUrl + "/checkout/cancel",
      });
    })
    .then((stripeSession) => {
      res.render("mongodb/shop/checkout", {
        pageTitle: "Martin's Shop - Checkout",
        path: "/checkout",
        css: ["product", "cart"],
        cartItems: products,
        totalSum: totalPrice,
        stripeSessionId: stripeSession.id,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
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
      console.log(orders);
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

exports.getOrderDynamicInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .populate("items.product")
    .then((order) => {
      if (
        order &&
        order.orderedBy.user._id.toString() === req.currentUser._id.toString()
      ) {
        const invoiceFileName = "invoice-" + orderId + ".pdf";
        const invoicePath = path.join(
          rootDir,
          "private",
          "invoices",
          invoiceFileName
        );

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + invoiceFileName //instead of attachment, can use inline
        );

        try {
          if (!fs.existsSync(invoicePath)) {
            const invoicePdf = new PDFDocument();
            invoicePdf.pipe(fs.createWriteStream(invoicePath)); //Writes the file to the disk
            invoicePdf.pipe(res);

            invoicePdf.fontSize(26).text("Invoice", {
              underline: true,
            });
            invoicePdf.text("-----------------------");
            let totalPrice = 0;
            order.items.forEach((prod) => {
              totalPrice += prod.quantity * prod.product.price;
              invoicePdf
                .fontSize(14)
                .text(
                  prod.product.title +
                    " - " +
                    prod.quantity +
                    " x " +
                    "$" +
                    prod.product.price
                );
            });
            invoicePdf.text("---");
            invoicePdf.fontSize(20).text("Total Price: $" + totalPrice);

            invoicePdf.end();
          } else {
            // Here we stream the file, that is more efficient as Node don't need to read the entire file.
            const fileStream = fs.createReadStream(invoicePath);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              "attachment; filename=" + invoiceFileName //instead of attachment, can use inline
            );
            fileStream.pipe(res);
          }
        } catch (err) {
          next(err);
        }
      } else {
        return Promise.reject("Illegal Access the Invoice");
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};
