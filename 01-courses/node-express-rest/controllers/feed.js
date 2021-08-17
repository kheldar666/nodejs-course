const fs = require("fs");
const path = require("path");
const Post = require("../models/post");
const User = require("../models/user");
const POST_PER_PAGE = 2;

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  let totalPosts;
  Post.find()
    .countDocuments()
    .then((total) => {
      totalPosts = total;
      return Post.find()
        .skip((currentPage - 1) * POST_PER_PAGE)
        .limit(POST_PER_PAGE);
    })
    .then((posts) => {
      res.status(200).json({
        posts: posts,
        totalItems: totalPosts,
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
  let creator = req.userId;

  // Do something in the DB
  const post = new Post({
    title: title,
    content: content,
    imageUrl: req.file.path.replace("public", ""),
    creator: req.userId,
  });

  post
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      res
        .status(201) // Success, a resource has been created
        .json({
          message: "Post created successfully.",
          post: post,
          creator: { _id: creator._id, name: creator.name },
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
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error("Editing not authorized");
        error.statusCode = 403;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
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

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error("Editing not authorized");
        error.statusCode = 403;
        throw error;
      }

      clearImage(post.imageUrl);
      return Post.findOneAndRemove(postId);
    })
    .then((result) => {
      User.findById(req.userId).then((user) => {
        user.posts.pull(postId);
        return user.save();
      });
    })
    .then((result) => {
      res.status(200).json({ message: "Post deleted" });
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
