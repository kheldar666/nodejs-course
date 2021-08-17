const User = require("../models/user");

exports.getUserStatus = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ status: user.status });
    })
    .catch((err) => {
      if (err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUserStatus = (req, res, next) => {
  if (req.validationError) {
    const error = new Error("Validation Failed. Please input a valid Status.");
    error.statusCode = 422;
    error.errors = req.validationErrorArray;
    throw error;
  }
  const updatedStatus = req.body.status;
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
      user.status = updatedStatus;
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Status updated." });
    })
    .catch((err) => {
      if (err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
