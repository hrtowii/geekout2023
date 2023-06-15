const path = require("path");
const ejsMate = require("ejs-mate");
const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const dbURL = process.env.DB_URL;

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

const Comment = require("./models/comment");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  next();
});

app.get("/", (req, res) => {
  res.render("homepage.ejs");
});

//routes for comments

//routes for cards

app.listen(8080, () => {
  console.log("listening!");
});
