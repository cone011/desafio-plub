const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const dotenv = require("dotenv");

//const MONGODB_URL = process.env.MONGO_URL;

dotenv.config();

const MONGODB_URL = "mongodb://mongo/plub";

const PORT = process.env.PORT || 9090;

const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
  cookie: {
    expires: 60000,
  },
});

const user = require("./routers/users");
const product = require("./routers/product");
const client = require("./routers/client");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(
  session({
    secret: `KEY`,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api", user);
app.use("/api", product);
app.use("/api", client);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URL)
  .then((result) => {
    app.listen(PORT, function () {
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
