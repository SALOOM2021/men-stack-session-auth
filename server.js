const dotenv = require("dotenv");
dotenv.config();
require("./config/database")
const express = require("express");

const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');

//controllers
const authController = require("./controllers/auth.js");


// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

//----------------------------------------------------------

// GET /
app.get("/", (req, res) => {
    res.render("index.ejs", {
      user: req.session.user,
    });
  });
  
  app.get("/vip-lounge", (req, res) => {
    if (req.session.user) {
      res.send(`Welcome to the party ${req.session.user.username}.`);
    } else {
      res.send("Sorry, no guests allowed.");
    }
  });
  
app.use("/auth", authController)
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
