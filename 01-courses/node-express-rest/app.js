const express = require("express");
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

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

app.use("/feed", feedRoutes);

app.listen(process.env.APP_PORT);
