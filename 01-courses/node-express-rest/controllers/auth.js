const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  if (req.validationError) {
    const error = new Error("Validation Failed. Please check the entries.");
    error.statusCode = 422;
    error.errors = req.validationErrorArray;
    throw error;
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const newUser = new User({
        email: email,
        password: hashedPassword,
        name: name,
      });
      return newUser.save();
    })
    .then((newUser) => {
      res.status(201).json({ message: "User created", userId: newUser._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const loginError = new Error("Please input a valid email/password");
  loginError.statusCode = 401;

  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        throw loginError;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((passwordDoMatch) => {
      if (passwordDoMatch) {
        //Create JWT
        const jwtToken = jwt.sign(
          { email: loadedUser.email, userId: loadedUser._id.toString() },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res
          .status(200)
          .json({ token: jwtToken, userId: loadedUser._id.toString() });
      } else {
        throw loginError;
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
