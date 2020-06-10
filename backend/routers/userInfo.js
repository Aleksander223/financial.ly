const express = require("express");
const auth = require("../middleware/auth");

const userInfoController = require("../services/userInfoController");

const userInfoRouter = express.Router()

userInfoRouter.get("/user/name/:id", auth, userInfoController.getName);

module.exports = userInfoRouter