const User = require("../models/user");
const bcrypt = require("bcryptjs");

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
