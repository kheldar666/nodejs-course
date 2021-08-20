const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { graphqlHTTP } = require("express-graphql");

const auth = require("./middleware/auth");

const graphqlSchema = require("./graphql/schema");
const graphqlResolvers = require("./graphql/resolvers");

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
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  //Allow Client to set Content-Type and Authorization headers
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Specific to GraphQL
  }
  next();
});

// Check Authentication
app.use(auth);

// Saving Image Uploads
app.put("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }
  if (!req.file) {
    return res.status(200).json({ message: "No file provided" });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res.status(201).json({
    message: "File stored",
    filePath: req.file.path.replace("public", ""),
  });
});

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: process.env.GRAPHIQL_ACTIVE,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "Error Occurred";
      const code = err.originalError.code || 500;

      return { message: message, data: data, code: code };
    },
  })
);

//Managing Errors
app.use((error, req, res, next) => {
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
      app.listen(process.env.APP_PORT);
    })
    .catch((err) => {
      console.error(err);
      throw new Error("Fatal Error. Unable to connect to MongoDB.");
    });
} else {
  throw new Error("Fatal Error. Environment variable not loaded.");
}

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "public/", filePath);
  fs.unlink(filePath, (err) => {
    if (err) console.error(err);
  });
};
