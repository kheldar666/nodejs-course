const User = require("../../models/mongodb/user");
const bcrypt = require("bcryptjs");

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
      return bcrypt.hash(password, 12).then((hashedpassword) => {
        const newUser = new User({
          email: email,
          password: hashedpassword,
        });
        return newUser.save();
      });
    })
    .then((result) => {
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
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      } else {
        return bcrypt
          .compare(password, user.password)
          .then(passwordDoMatch => {
            if (passwordDoMatch) {
              req.session.isAuthenticated = true;
              req.session.currentUser = user;
              return req.session.save((err) => {
                if (err) console.error(err);
              });
            } else {
              return Promise.reject('Incorrect Username/Password')
            }
          })
          .then(result => {
            res.redirect("/");
          })
          .catch((err) => {
            console.error(err)
            res.redirect('/login')
          });
      }
    })
    .catch((err) => console.error("2" + err));
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/");
  });
};
