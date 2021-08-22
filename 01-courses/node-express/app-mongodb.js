const path = require("path");
const fs = require("fs");
const https = require("https");

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStoreSession = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const User = require("./models/mongodb/user");

const app = express();
const store = MongoDBStoreSession({
  uri: process.env.MONGODB_CONNECTION_STRING,
  collection: "sessions",
});

// Setting Up HTTPS
const privateKey = fs.readFileSync(process.env.HTTPS_PRIVATEKEY_FILE);
const certificate = fs.readFileSync(process.env.HTTPS_CERTIFICATE_FILE);

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

// Adding Helmet
app.use(helmet());

// Adding Compression
app.use(compression());

// Adding request logging
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs", "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

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
const csrfProtection = csrf();
app.use(csrfProtection);

//Adding Flash message feature (after Session)
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
    return User.findById(req.session.currentUser._id)
      .then((user) => {
        req.currentUser = user;
        next();
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(error);
      });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
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

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Managing 404 (catch all remainiing routes)
app.use(errorRoutes);

//Special Route for managing Errors
app.use((error, req, res, next) => {
  console.error(error);
  res.redirect("/500");
});

//Init the Database and Start the Server
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.info("Starting Node.JS App Server");
    https
      .createServer({ key: privateKey, cert: certificate }, app)
      .listen(process.env.APP_PORT);
  })
  .catch((err) => console.error(err));
