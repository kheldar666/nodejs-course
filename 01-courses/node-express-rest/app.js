const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { Server } = require("socket.io");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const statusRoutes = require("./routes/status");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/img");
  },
  filename: (req, file, callback) => {
    callback(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

//Setup the static/public path
app.use(express.static(path.join(__dirname, "public")));

//Prevent CORS issue
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // could be a list of domains
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  //Allow Client to set Content-Type and Authorization headers
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/status", statusRoutes);
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

//Managing Errors
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const errors = error.errors || [];
  res.status(status).json({ message: message, errors: errors });
});

if (process.env.APP_PORT) {
  console.log("Starting Node Express Server");
  mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then((result) => {
      const server = app.listen(process.env.APP_PORT);
      const io = require("./socket").init(server);
      io.on("connection", (socket) => {
        console.log("IO : Client Connected");
      });
    })
    .catch((err) => {
      console.error(err);
      throw new Error("Fatal Error. Unable to connect to MongoDB.");
    });
} else {
  throw new Error("Fatal Error. Environment variable not loaded.");
}
