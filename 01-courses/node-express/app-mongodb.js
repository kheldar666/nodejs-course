const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStoreSession = require('connect-mongodb-session')(session)

const User = require("./models/mongodb/user");

const app = express();
const store = MongoDBStoreSession({
  uri:process.env.MONGODB_CONNECTION_STRING,
  collection:'sessions'
})
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
    store:store
  })
);

//Setup Routes Management and Middlewares
app.use((req, res, next) => {
  // console.log("Request URL: " + req.url);
  // console.log("Request method: " + req.method);
  if (!req.session.isAuthenticated) {
    req.session.isAuthenticated = false;
  }

  if (req.session.currentUser) {
    //transforms a data structure into a "real" mongoose object
    req.currentUser = User.getUserFromData(req.session.currentUser);
  }

  next();

});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  next();
})

app.use(authRoutes);

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

// Managing 404
app.use(errorRoutes);

//Init the Database and Start the Server
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    //TODO: We will need to remove that at some point
    return User.findOne().then((defaultUser) => {
      if (!defaultUser) {
        const defaultUser = new User({
          name: "Administrator",
          email: "admin@localhost",
          cart: { items: [] },
        });
        return defaultUser.save();
      }
    });
  })
  .then((result) => {
    console.info("Starting Node.JS App Server");
    app.listen(process.env.APP_LISTEN_PORT);
  })
  .catch((err) => console.error(err));
