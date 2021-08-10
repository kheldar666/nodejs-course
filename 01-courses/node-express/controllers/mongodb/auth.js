const User = require("../../models/mongodb/user");

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
      res.redirect("/");
    })
    .catch((err) => console.error(err));
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/");
  });
};
