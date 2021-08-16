const fs = require("fs");
const path = require("path");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        posts: posts,
      });
    })
    .catch((err) => console.error(err));
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (post) {
        res.status(200).json({ post: post });
      } else {
        // We can throw an error here, because it will be caught by the next catch block just bellow
        // Which will in turn use the next(err) function that must be used in Promise
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  if (req.validationError || !req.file) {
    const error = new Error("Validation Failed. Data invalid or file missing.");
    error.statusCode = 422;
    error.errors = req.validationErrorArray;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;

  // Do something in the DB
  const post = new Post({
    title: title,
    content: content,
    imageUrl: req.file.path.replace("public", ""),
    creator: { name: "Martin Papy" },
  });

  post
    .save()
    .then((result) => {
      res
        .status(201) // Success, a resource has been created
        .json({
          message: "Post created successfully.",
          post: result,
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;

  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace("public", "");
  }

  if (req.validationError || !imageUrl) {
    const error = new Error("Validation Failed. Data invalid or file missing.");
    error.statusCode = 422;
    error.errors = req.validationErrorArray;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (post) {
        if (imageUrl !== post.imageUrl) {
          clearImage(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        return post.save();
      } else {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "../public/", filePath);
  fs.unlink(filePath, (err) => {
    if (err) console.error(err);
  });
};
