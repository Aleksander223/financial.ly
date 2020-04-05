const express = require("express");
const UserModel = require("../models/user.js");
const auth = require("../middleware/auth");

const userRouter = express.Router();

userRouter.post("/user/register", async (req, res) => {
    try {
        console.log(req.body);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        await user.save();

        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });

    } catch(error) {
        console.log(error);
        res.status(400).send(error);
    };
});

userRouter.post("/user/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await UserModel.findByCredentials(email, password);
        if(!user) {
            res.status(401).send({error: "Wrong credentials."});
        }
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });

    } catch(error) {
        console.log(error);
        res.status(400).send(error);
    };
});

userRouter.get("/user/status", auth, async (req, res) => {
    res.send(req.user);
});

module.exports = userRouter;
