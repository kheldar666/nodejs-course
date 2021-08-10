const express = require("express");

const authController = require("../../controllers/mongodb/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postSignup);

router.get("/logout", authController.getLogout);

module.exports = router;
