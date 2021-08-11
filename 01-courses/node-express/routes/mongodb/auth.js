const express = require("express");

const authController = require("../../controllers/mongodb/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);

router.get("/logout", authController.getLogout);

router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

router.get("/reset-password/:token", authController.getSetNewPassword);

router.post("/set-new-password", authController.postSetNewPassword);


module.exports = router;
