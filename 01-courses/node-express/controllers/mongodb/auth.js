const { doesNotMatch } = require("assert");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");

const User = require("../../models/mongodb/user");
const baseUrl = require("../../utils/base-url");

const transporter = mailer.createTransport(
  sendgrid({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

exports.getSignup = (req, res, next) => {
  res.render("mongodb/auth/signup", {
    pageTitle: "Martin's Shop - Signup",
    path: "/signup",
    css: ["forms", "auth"],
    email: "",
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!req.validationError) {
    return res.status(422).render("mongodb/auth/signup", {
      pageTitle: "Martin's Shop - Signup",
      path: "/signup",
      css: ["forms", "auth"],
      email: email,
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedpassword) => {
      const newUser = new User({
        email: email,
        password: hashedpassword,
      });
      return newUser.save();
    })
    .then((newUser) => {
      transporter.sendMail({
        to: newUser.email,
        from: process.env.SENDGRID_FROM,
        subject: "Signup Succesful",
        html: "<h1>You successfully signed up !</h1>",
      });
      res.redirect("/login");
    })
    .catch((err) => {
      req.flash("error", err);
      res.redirect("/signup");
    });
};

exports.getLogin = (req, res, next) => {
  res.render("mongodb/auth/login", {
    pageTitle: "Martin's Shop - Login",
    path: "/login",
    css: ["forms", "auth"],
    email: "",
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (req.validationError) {
    return res.status(422).render("mongodb/auth/login", {
      pageTitle: "Martin's Shop - Login",
      path: "/login",
      css: ["forms", "auth"],
      email: email,
    });
  }

  User.findOne({ email: email })
    .then(user => {
      req.session.isAuthenticated = true;
      req.session.currentUser = user;
      return req.session.save(err => {
        if (err) console.error(err);
        res.redirect("/");
      });
    })
    .catch((err) => {
      req.flash("error", err.toString());
      res.redirect("/login");
    });
};

exports.getResetPassword = (req, res, next) => {
  res.render("mongodb/auth/reset-password", {
    pageTitle: "Martin's Shop - Reset Password",
    path: "/reset-password",
    css: ["forms", "auth"],
  });
};

exports.postResetPassword = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.error(err);
      res.redirect("/reset-password");
    } else {
      const token = buffer.toString("hex");
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return Promise.resolve();
          } else {
            transporter.sendMail({
              to: user.email,
              from: process.env.SENDGRID_FROM,
              subject: "Reset Your Password",
              html:
                "<h1>A link to reset your password</h1><br /> <br /><p><a href='" +
                baseUrl +
                "/reset-password/" +
                token +
                "'>Reset Your Password</a></p>",
            });
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
          }
        })
        .then((result) => {
          req.flash("info", "If this account exists, an email has been sent");
          res.redirect("/reset-password");
        })
        .catch((err) => {
          console.error(err);
          req.flash("error", err.toString());
          res.redirect("/reset-password");
        });
    }
  });
};

exports.getSetNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid or Expired Link");
        return res.redirect("/");
      }
      return res.render("mongodb/auth/set-new-password", {
        pageTitle: "Martin's Shop - Set a New Password",
        path: "/set-new-password",
        css: ["forms", "auth"],
        user: user,
      });
    })
    .catch((err) => console.error(err));
};

exports.postSetNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  const newPassword = req.body.password;
  const newConfirmPassword = req.body.confirmPassword;
  User.findById(userId)
    .then((user) => {
      return bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        return user.save();
      });
    })
    .then((result) => {
      req.flash("info", "New password set succesfully");
      res.redirect("/login");
    })
    .catch((err) => console.error(err));
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/");
  });
};
