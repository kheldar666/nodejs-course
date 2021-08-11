const express = require("express");
const { check, body } = require("express-validator");

const User = require("../../models/mongodb/user");

const authController = require("../../controllers/mongodb/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    body("email", "Invalid Email").isEmail(),
    body("password", "Password does not follow the requirements")
      .isLength({ min: 5 }).bail()
      .isAlphanumeric().bail(),
  ],
  authController.postLogin
);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    //check looks in any available area of the request
    check("email")
      .isEmail()
      .withMessage("Please input a valid email address")
      //Exemple of Custom Validator
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email address is not allowed");
        // }
        // return true; // Must return true is the validation is successful
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            //user already exists
            return Promise.reject("Account already exists !");
          }
        });
      }),
    //Here we check only in the body of the request
    body(
      "password",
      "Your password should be at least 5 characters long and contains only alphanumeric"
    )
      .isLength({ min: 5 })
      .bail()
      .isAlphanumeric()
      .bail(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) return false;
        return true;
      })
      .withMessage("Both passwords don't match"),
  ],
  authController.postSignup
);

router.get("/logout", authController.getLogout);

router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

router.get("/reset-password/:token", authController.getSetNewPassword);

router.post("/set-new-password", authController.postSetNewPassword);

module.exports = router;
