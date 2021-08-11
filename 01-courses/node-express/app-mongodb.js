const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStoreSession = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const User = require("./models/mongodb/user");

const app = express();
const store = MongoDBStoreSession({
  uri: process.env.MONGODB_CONNECTION_STRING,
  collection: "sessions",
});

//Initialize CSRF Protection
const csrfProtection = csrf();

//Setting the Templating Engine
//Using EJS
app.set("view engine", "ejs");
app.set("views", "views");

//Importing the Routes
const adminRoutes = require("./routes/mongodb/admin");
const shopRoutes = require("./routes/mongodb/shop");
const authRoutes = require("./routes/mongodb/auth");

//Managing Error Routes
const errorRoutes = require("./routes/errors");

//Process the forms/query strings
app.use(
  express.urlencoded({
    extended: false,
  })
);

//Setup the static/public path
app.use(express.static(path.join(__dirname, "public")));

//Adding Session Management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// CSRF protection needs to come after the session init
app.use(csrfProtection);

//Adding Flash message featare (after Session)
app.use(flash());

//Setup Routes Management and Middlewares
app.use((req, res, next) => {
  if (!req.session.isAuthenticated) {
    req.session.isAuthenticated = false;
  }
  next();
});

app.use((req, res, next) => {
  if (req.session.currentUser) {
    //transforms a data structure into a "real" mongoose object
    return User.getUserFromData(req.session.currentUser)
      .then((user) => {
        req.currentUser = user;
      })
      .then((result) => next())
      .catch((err) => console.error(err));
  } else {
    next();
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  const errMessage = req.flash("error");
  if (errMessage.length > 0) {
    res.locals.errorMessage = errMessage[0];
  } else {
    res.locals.errorMessage = null;
  }
  const infMessage = req.flash("info");
  if (infMessage.length > 0) {
    res.locals.infoMessage = infMessage[0];
  } else {
    res.locals.infoMessage = null;
  }

  next();
});

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

// Managing 404
app.use(errorRoutes);

//Init the Database and Start the Server
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.info("Starting Node.JS App Server");
    app.listen(process.env.APP_PORT);
  })
  .catch((err) => console.error(err));
