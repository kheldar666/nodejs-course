const express = require("express");
const { body } = require("express-validator");

const validResult = require("../middleware/validation-postcheck");
const feedController = require("../controllers/feed");
const router = express.Router();

router.get("/posts", feedController.getPosts);

router.post(
  "/post",
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

router.get("/post/:postId", feedController.getPost);

router.put(
  "/post/:postId",
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

router.delete("/post/:postId", feedController.deletePost);

module.exports = router;
