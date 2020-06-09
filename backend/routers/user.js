const express = require("express");
const User = require("../models/user.js");
const auth = require("../middleware/auth");

const userRouter = express.Router();

userRouter.post("/user/register", async (req, res) => {
  try {
    console.log(req.body);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      wallet: [{"currency": "RON", "amount": 10000}]    // money printing machine go BRRRRRRRRRRR
    });
    await user.save();

    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

userRouter.post("/user/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      res.status(401).send({ error: "Wrong credentials." });
    }
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

userRouter.get("/user/status", auth, async (req, res) => {
  console.log(req.user);
  res.status(200).send(req.user);
});

userRouter.get("/user/all", auth, async (req, res) => {
  try {
    let users = await User.find({})

    res.status(200).send(users)
  } catch (error) {
    res.status(400).send("Error")
  }
})

module.exports = userRouter;
