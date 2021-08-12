const express = require("express");
const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../../models/mongodb/user");

const validResult = require("../../middleware/validation-postcheck");

const authController = require("../../controllers/mongodb/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    body("email", "Invalid Email").isEmail().toLowerCase().trim(), //Normalization of data
    body("password", "Password does not follow the requirements")
      .trim()
      .isLength({ min: 5 })
      .bail()
      .isAlphanumeric()
      .bail(),
    body("email", "Incorrect Username or Password").custom((email, { req }) => {
      return User.findOne({ email: email }).then((user) => {
        if (!user) {
          return Promise.reject();
        } else {
          return bcrypt
            .compare(req.body.password, user.password)
            .then((passwordDoMatch) => {
              if (!passwordDoMatch) return Promise.reject();
            });
        }
      });
    }),
  ],
  validResult,
  authController.postLogin
);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    //check looks in any available area of the request
    check("email")
      .isEmail()
      .toLowerCase()
      .trim() //Normalization of data
      .withMessage("Please input a valid email address")
      //Exemple of Custom Validator
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email address is not allowed");
        // }
        // return true; // Must return true is the validation is successful
        return User.findOne({ email: value }).then((user) => {
          //Exemple of Async check
          if (user) {
            //User already exists
            return Promise.reject("Account already exists !");
          }
        });
      }),
    //Here we check only in the body of the request
    body(
      "password",
      "Your password should be at least 5 characters long and contains only alphanumeric"
    )
      .trim() //Normalization of data
      .isLength({ min: 5 })
      .bail()
      .isAlphanumeric()
      .bail(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) return false;
        return true;
      })
      .withMessage("Both passwords don't match"),
  ],
  validResult,
  authController.postSignup
);

router.get("/logout", authController.getLogout);

router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

router.get("/reset-password/:token", authController.getSetNewPassword);

router.post("/set-new-password", authController.postSetNewPassword);

module.exports = router;
