const express = require("express");
const { body } = require("express-validator");

const validResult = require("../middleware/validation-postcheck");
const isAuth = require("../middleware/is-auth");

const feedController = require("../controllers/feed");
const router = express.Router();

router.get("/posts", isAuth, feedController.getPosts);

router.post(
  "/post",
  isAuth,
  [
    body("title", "Please input a proper title (min 5 characters long)")
      .notEmpty({ ignore_whitespace: false })
      .trim()
      .isLength({ min: 5 }),
    body("content", "Please input a proper content (min 5 characters long)")
      .notEmpty({ ignore_whitespace: false })
      .trim()
      .isLength({ min: 5 }),
  ],
  validResult,
  feedController.createPost
);

router.get("/post/:postId", isAuth, feedController.getPost);

router.put(
  "/post/:postId",
  isAuth,
  [
    body("title", "Please input a proper title (min 5 characters long)")
      .notEmpty({ ignore_whitespace: false })
      .trim()
      .isLength({ min: 5 }),
    body("content", "Please input a proper content (min 5 characters long)")
      .notEmpty({ ignore_whitespace: false })
      .trim()
      .isLength({ min: 5 }),
  ],
  validResult,
  feedController.updatePost
);

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
