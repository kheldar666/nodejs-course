const User = require("../../models/mongodb/user");

exports.getSignup = (req, res, next) => {
  res.render("mongodb/auth/signup", {
    pageTitle: "Martin's Shop - Signup",
    path: "/signup",
    css: ["forms", "auth"],
    res: res,
  });
};

exports.postSignup = (res, req, next) => {};

exports.getLogin = (req, res, next) => {
  res.render("mongodb/auth/login", {
    pageTitle: "Martin's Shop - Login",
    path: "/login",
    css: ["forms", "auth"],
    res: res,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById(process.env.APP_DEFAULT_USERID)
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
