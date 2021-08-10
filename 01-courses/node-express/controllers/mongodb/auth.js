const User = require("../../models/mongodb/user");

exports.getSignup = (req, res, next) => {
  res.render("mongodb/auth/signup", {
    pageTitle: "Martin's Shop - Signup",
    path: "/signup",
    css: ["forms", "auth"],
    res: res,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        //user already exists
        res.redirect("/");
      }
      const newUser = new User({
        email: email,
        password: password,
      });
      return newUser.save();
    })
    .then(result => {
      res.redirect("/login");
    })
    .catch((err) => console.error(err));
};

exports.getLogin = (req, res, next) => {
  res.render("mongodb/auth/login", {
    pageTitle: "Martin's Shop - Login",
    path: "/login",
    css: ["forms", "auth"],
    res: res,
  });
};

exports.postLogin = (req, res, next) => {
  User.findOne()
    .then((user) => {
      req.session.isAuthenticated = true;
      req.session.currentUser = user;
      // The call to save is to ensure all session data is
      // saved before the redirect that is almost instant
      req.session.save((err) => {
        if (err) console.error(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.error(err));
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/");
  });
};
