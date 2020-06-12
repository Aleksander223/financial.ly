const express = require("express");
const auth = require("../middleware/auth");

const userInfoController = require("../services/userInfoController");

const userInfoRouter = express.Router()

userInfoRouter.get("/user/name/:id", auth, userInfoController.getName);
userInfoRouter.get("/user/id/:name", auth, userInfoController.getID)

module.exports = userInfoRouter