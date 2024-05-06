const express = require("express");
const app = express();
const morgan = require("morgan"); //logger middleware
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const parkingRoutes = require("./api/routes/parkings");
const reservationRoutes = require("./api/routes/reservations");
const userRoutes = require("./api/routes/users");
require("dotenv").config();

mongoose.connect(
  "mongodb+srv://seriiinna:" +
    process.env.MONGO_ATLAS_PW +
    "@tdm-project.hsqf2qq.mongodb.net/?retryWrites=true&w=majority&appName=TDM-project"
);

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next(); // continue to the next middleware, block the incoming request
});

app.use("/parkings", parkingRoutes);
app.use("/reservations", reservationRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
