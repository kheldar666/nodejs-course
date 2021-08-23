const User = require("../models/user");

exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
    return;
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 500;
    }
    return err;
    next(err);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  if (req.validationError) {
    const error = new Error("Validation Failed. Please input a valid Status.");
    error.statusCode = 422;
    error.errors = req.validationErrorArray;
    throw error;
  }
  const updatedStatus = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    user.status = updatedStatus;
    await user.save();
    res.status(200).json({ message: "Status updated." });
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
