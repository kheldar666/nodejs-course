const path = require("path");
const express = require("express");
const { body } = require("express-validator");

//Configuration of the File Upload
const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/data/uploads");
  },
  filename: (req, file, callback) => {
    callback(null, new Date().getTime() + "." + file.originalname.split(".")[1]);
  },
});

const fileFilter = (req, file, callback) => {
  if (["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const router = express.Router();

const adminController = require("../../controllers/mongodb/admin");
const isAuth = require("../../middleware/is-auth");
const validResult = require("../../middleware/validation-postcheck");

router.get("/products", isAuth, adminController.getProducts);

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post(
  "/add-product",
  isAuth,
  //Multer doit absolument venir AVANT les validation sinon ça casse tout
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),
  [
    body("title", "Please provide a title")
      .not()
      .isEmpty({
        ignore_whitespace: true,
      })
      .isString()
      .trim(),
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
  //Multer doit absolument venir AVANT les validation sinon ça casse tout
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),
  [
    body("title", "Please provide a title")
      .not()
      .isEmpty({
        ignore_whitespace: true,
      })
      .isString()
      .trim(),
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
