const express = require("express");
const { body } = require("express-validator");

const validResult = require("../middleware/validation-postcheck");
const authController = require("../controllers/auth");
const User = require("../models/user");
const { isLength } = require("validator");
const router = express.Router();

router.put(
  "/signup",
  [
    body("email", "Please input a valid email")
      .trim()
      .isEmail()
      .custom((email, { req }) => {
        return User.findOne({ email: email }).then((user) => {
          if (user) {
            return Promise.reject("This email address is already user.");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty({ ignore_whitespace: false }),
  ],
  validResult,
  authController.signup
);

router.post(
  "/login",
  [
    body("email", "Please input a valid email").trim().isEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  validResult,
  authController.login
);

module.exports = router;
