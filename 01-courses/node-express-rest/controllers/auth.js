const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  if (req.validationError) {
    const error = new Error("Validation Failed. Please check the entries.");
    error.statusCode = 422;
    error.errors = req.validationErrorArray;
    throw error;
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    let newUser = new User({
      email: email,
      password: hashedPassword,
      name: name,
    });
    newUser = await newUser.save();

    res.status(201).json({ message: "User created", userId: newUser._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const loginError = new Error("Please input a valid email/password");
  loginError.statusCode = 401;
  try {
    const loadedUser = await User.findOne({ email: email });

    if (!loadedUser) {
      throw loginError;
    }
    const passwordDoMatch = await bcrypt.compare(password, loadedUser.password);
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
      return; // returns the Promise implicitly hidden behind the async/await. Useful for Unit Tests
    } else {
      throw loginError;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
