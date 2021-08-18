const fs = require("fs");
const path = require("path");
const Post = require("../models/post");
const User = require("../models/user");

const POST_PER_PAGE = 2;

// How to use async / await
exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  try {
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 }) // Descending order
      .skip((currentPage - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE);

    res.status(200).json({
      posts: posts,
      totalItems: totalPosts,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId).populate("creator");
  try {
    if (post) {
      res.status(200).json({ post: post });
    } else {
      // We can throw an error here, because it will be caught by the next catch block just bellow
      // Which will in turn use the next(err) function that must be used in Promise
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
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
    creator: req.userId,
  });
  try {
    await post.save();
    const creator = await User.findById(req.userId);
    creator.posts.push(post);
    await creator.save();

    res
      .status(201) // Success, a resource has been created
      .json({
        message: "Post created successfully.",
        post: post,
        creator: { _id: creator._id, name: creator.name },
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
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
  try {
    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }

    if (post.creator._id.toString() !== req.userId) {
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
    const result = await post.save();

    res.status(200).json({ message: "Post updated", post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

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

    await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "../public/", filePath);
  fs.unlink(filePath, (err) => {
    if (err) console.error(err);
  });
};
