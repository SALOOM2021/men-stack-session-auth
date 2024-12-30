const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const express = require("express");
const router = express.Router();

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const username = req.body.username;
    if (password !== confirmPassword) {
        return res.send('Password do not match');
    }
    const user = await User.findOne({ username });
    if (user) {
        return res.send("Username or Password is invaild.");
    }
    const hashedPassword = bcrypt.hashSync(password, 10)
    req.body.password = hashedPassword;
    const newUser = User.create(req.body);
    res.send(`Thanks for signing up ${newUser.username}`);

});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {
    const password = req.body.password;
    const username = req.body.username;

    const user = await User.findOne({ username });
    if (!user) {
        return res.send("Login failed. Please try again.");
    }

    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) {
        return res.send("Login failed. Please try again.");
    }
    req.session.user = {
        username: user.username,
        _id: user._id
    };
    res.redirect("/")
});

router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });
  

module.exports = router;
