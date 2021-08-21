const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Post = require("../models/post");
const path = require("path");
const fs = require("fs");

const POST_PER_PAGE = 2;

module.exports = {
  // createUser(args, req) {
  //   const email = args.userInput.email;
  //   // if NOT using async/await, we MUST use the return
  //   return User.findOne({email: email}).then(..).catch(...)
  // },

  createUser: async function ({ userInput }, req) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "Email is invalid" });
    }

    if (
      validator.isEmpty(userInput.password, { ignore_whitespace: false }) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Please input a valid password" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid inputs");
      error.data = errors;
      error.statusCode = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error("User exists already !");
      throw error;
    }
    const hashedPassword = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      name: userInput.name,
      email: userInput.email,
      password: hashedPassword,
    });

    const createdUser = await user.save();
    // _doc: stores only data and does not return mongoose metadata
    // we also need to override the _id as ObjectId is not supported
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },

  login: async function ({ email, password }, req) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("Invalid Login/Password");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Invalid Login/Password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { token: token, userId: user._id.toString() };
  },

  createPost: async function ({ postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Access Forbidden");
      error.statusCode = 401;
      throw error;
    }

    const errors = [];
    if (
      validator.isEmpty(postInput.title, { ignore_whitespace: false }) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: "Please input a valid title" });
    }

    if (
      validator.isEmpty(postInput.content, { ignore_whitespace: false }) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Please input content" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid inputs");
      error.data = errors;
      error.statusCode = 422;
      throw error;
    }

    const creator = await User.findById(req.userId);
    if (!creator) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: creator,
    });

    const createdPost = await post.save();

    creator.posts.push(createdPost);

    await creator.save();

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },

  getPosts: async function ({ currentPage }, req) {
    if (!req.isAuth) {
      const error = new Error("Access Forbidden");
      error.statusCode = 401;
      throw error;
    }
    if (!currentPage) {
      currentPage = 1;
    }
    const totalPosts = await Post.find().countDocuments();

    let posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 }) // Descending order
      .skip((currentPage - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE);

    if (!posts) {
      const error = new Error("failed to retrieve Posts");
      error.statusCode = 500;
      throw error;
    }

    posts = posts.map((post) => {
      return {
        ...post._doc,
        _id: post._id.toString(),
        creator: { name: post.creator.name },
        createdAt: post.createdAt.toISOString(),
      };
    });

    return {
      posts: posts,
      totalItems: totalPosts,
    };
  },

  getPost: async function ({ postId }, req) {
    if (!req.isAuth) {
      const error = new Error("Access Forbidden");
      error.statusCode = 401;
      throw error;
    }
    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }
    return {
      ...post._doc,
      _id: post._id.toString(),
      creator: { name: post.creator.name },
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },

  updatePost: async function ({ postId, postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Access Forbidden");
      error.statusCode = 401;
      throw error;
    }

    const errors = [];
    if (
      validator.isEmpty(postInput.title, { ignore_whitespace: false }) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: "Please input a valid title" });
    }

    if (
      validator.isEmpty(postInput.content, { ignore_whitespace: false }) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Please input content" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid inputs");
      error.data = errors;
      error.statusCode = 422;
      throw error;
    }

    const post = await Post.findById(postId).populate("creator");

    if (!post || post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error("Access Forbidden");
      error.statusCode = 401;
      throw error;
    }

    post.title = postInput.title;
    post.content = postInput.content;
    if (postInput.imageUrl !== "undefined") {
      post.imageUrl = postInput.imageUrl;
    }

    const updatedPost = await post.save();
    return {
      ...updatedPost._doc,
      creator: { name: post.creator.name },
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },

  deletePost: async function ({ postId }, req) {
    if (!req.isAuth) {
      const error = new Error("Access Forbidden");
      error.statusCode = 401;
      throw error;
    }
    const post = await Post.findById(postId).populate("creator");
    if (!post || post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error("Access Forbidden");
      error.statusCode = 401;
      throw error;
    }

    clearImage(post.imageUrl);

    await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();
    return true;
  },

  getStatus: async function (args, req) {
    if (!req.isAuth) {
      const error = new Error("Access Forbidden");
      error.statusCode = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    return user.status;
  },

  updateStatus: async function ({ newStatus }, req) {
    if (!req.isAuth) {
      const error = new Error("Access Forbidden");
      error.statusCode = 401;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(newStatus, { ignore_whitespace: false }) ||
      !validator.isLength(newStatus, { min: 5 })
    ) {
      errors.push({ message: "Please input valid status" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid inputs");
      error.data = errors;
      error.statusCode = 422;
      throw error;
    }
    const user = await User.findById(req.userId);
    user.status = newStatus;
    await user.save();
    return true;
  },
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "../public/", filePath);
  fs.unlink(filePath, (err) => {
    if (err) console.error(err);
  });
};
