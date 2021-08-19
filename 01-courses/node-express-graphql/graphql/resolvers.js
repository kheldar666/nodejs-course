const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");

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
      error.code = 422;
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
};
