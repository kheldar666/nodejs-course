const { validationResult } = require("express-validator");

const fileHelper = require("../../utils/file-helper");

const Product = require("../../models/mongodb/product");

exports.getProducts = (req, res, next) => {
  Product.find({ createdBy: req.currentUser })
    //.select('title price -userId') // only fetch the fields we want
    //.populate('createdBy', 'name') //populate the data from relations
    .then((products) => {
      res.render("mongodb/admin/products", {
        prods: products,
        pageTitle: "Martin's Shop - Admin - Product List",
        path: "/admin/products",
        css: ["product"],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getAddProduct = (req, res, next) => {
  res.render("mongodb/admin/add-product", {
    pageTitle: "Martin's Shop - Admin - Add a Product",
    path: "/admin/add-product",
    css: ["product", "forms"],
    product: new Product(),
  });
};

exports.postAddProducts = (req, res, next) => {
  if (req.validationError) {
    return res.status(422).render("mongodb/admin/add-product", {
      pageTitle: "Martin's Shop - Admin - Add a Product",
      path: "/admin/add-product",
      css: ["product", "forms"],
      product: new Product({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
      }),
    });
  }

  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    createdBy: req.currentUser,
  });

  if (req.file) {
    product.imageUrl = req.file.path.replace("public", "");
  }

  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findOne({ _id: productId, createdBy: req.currentUser })
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      return res.render("mongodb/admin/edit-product", {
        pageTitle: "Martin's Shop - Admin - Edit a Product",
        path: "/admin/edit-product",
        css: ["product", "forms"],
        product: product,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postUpdateProduct = (req, res, next) => {
  const productId = req.body.productId;
  if (req.validationError) {
    return res.status(422).render("mongodb/admin/edit-product", {
      pageTitle: "Martin's Shop - Admin - Edit a Product",
      path: "/admin/edit-product",
      css: ["product", "forms"],
      product: new Product({
        _id: productId,
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
      }),
    });
  }

  Product.findOne({ _id: productId, createdBy: req.currentUser })
    .then((product) => {
      if (product) {
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        if (req.file) {
          // Remove the old file
          try {
            if (product.imageUrl.startsWith("/uploads/")) {
              // We don't want to delete the default file
              fileHelper.deleteFile("public" + product.imageUrl);
            }
          } catch (err) {
            console.error(
              "Problem when deleting the file :" + "public" + product.imageUrl
            );
            console.error(err);
          }
          product.imageUrl = req.file.path.replace("public", "");
        }
        return product.save();
      }
      return Promise.reject("Product not found.");
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findOneAndRemove(
    { _id: productId, createdBy: req.currentUser },
    { select: "imageUrl" }
  )
    .then((result) => {
      console.log(result.imageUrl)
      // Remove the old file
      try {
        if (result.imageUrl.startsWith("/uploads/")) {
          // We don't want to delete the default file
          fileHelper.deleteFile("public" + result.imageUrl);
        }
      } catch (err) {
        console.error(
          "Problem when deleting the file :" +
            "public" +
            result.imageUrl
        );
        console.error(err);
      }
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};
