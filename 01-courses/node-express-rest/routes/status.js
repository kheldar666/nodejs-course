const express = require("express");
const { body } = require("express-validator");

const validResult = require("../middleware/validation-postcheck");
const isAuth = require("../middleware/is-auth");
const statusController = require("../controllers/status");

const router = express.Router();

router.get("/", isAuth, statusController.getUserStatus);

router.patch(
  "/",
  isAuth,
  [
    body("status")
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: false })
      .isLength({ min: 5 }),
  ],
  validResult,
  statusController.updateUserStatus
);

module.exports = router;
