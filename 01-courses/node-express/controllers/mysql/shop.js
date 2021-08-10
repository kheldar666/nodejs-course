const Product = require("../../models/mysql/product");

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("mysql/shop/index", {
        prods: products,
        pageTitle: "Martin's Shop - Welcome",
        path: "/",
        css: ["product"],
      });
    })
    .catch((error) => {
      console.error(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("mysql/shop/product-list", {
        prods: products,
        pageTitle: "Martin's Shop - All Products",
        path: "/products",
        css: ["product"],
      });
    })
    .catch((error) => {
      console.error(err);
    });
};

exports.getProductDetails = (req, res, next) => {
  const productId = req.params.productId;
  if (isNaN(productId)) {
    next(); // Send to 404
  }
  Product.findByPk(productId)
    .then((product) => {
      res.render("mysql/shop/product-detail", {
        pageTitle: "Martin's Shop - Details - " + product.title,
        path: "/products",
        css: ["product"],
        product: product,
      });
    })
    .catch((err) => {
      console.error(err);
      next(); // Should go to 404
    });
};

exports.getCart = (req, res, next) => {
  req.session.currentUser
    .getCart()
    .then((cart) => {
      if (!cart) {
        return req.session.currentUser.createCart();
      }
      return Promise.resolve(cart);
    })
    .then((cart) => {
      return cart.getProducts();
    })
    .then((cartProducts) => {
      res.render("mysql/shop/cart", {
        pageTitle: "Martin's Shop - Your Cart",
        path: "/cart",
        css: ["product", "cart"],
        cartProducts: cartProducts,
      });
    })
    .catch((err) => console.error(err));
};

exports.postAddToCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.session.currentUser
    .getCart()
    .then((cart) => {
      if (!cart) {
        return req.session.currentUser.createCart();
      }
      return Promise.resolve(cart);
    })
    .then((cart) => {
      fetchedCart = cart; //Make it available for subsecquent calls
      // Check if we already have that product in the Cart
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      if (products.length > 0) {
        // Update the Quantity
        newQuantity = products[0].cartItem.quantity + 1;
        return Promise.resolve(products[0]);
      } else {
        // Add Product to the Cart
        return Product.findByPk(productId);
      }
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then((result) => res.redirect("/cart"))
    .catch((err) => console.error(err));
};

exports.postRemoveFromCart = (req, res, next) => {
  const productId = req.body.productId;
  req.session.currentUser
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};

exports.createOrder = (req, res, next) => {
  let fetchedCart;
  req.session.currentUser
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      // Transfer all Products from Cart to Order
      return req.session.currentUser.createOrder().then((order) => {
        order.addProducts(
          products.map((product) => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          })
        );
      });
    })
    .then((result) => {
      //Cleanup the Cart
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.error(err));
};

exports.getOrders = (req, res, next) => {
  req.session.currentUser
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("mysql/shop/orders", {
        pageTitle: "Martin's Shop - Orders",
        path: "/orders",
        css: ["product"],
        orders: orders,
      });
    })
    .catch((err) => console.error(err));
};
