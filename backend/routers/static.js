const path = require("path");
const express = require("express");

const staticRouter = express.Router();

staticRouter.get("/login", (req, res) => {
  res.sendFile("login.html", {
    root: path.join(__dirname, "..", "..", "./frontend")
  });
});

module.exports = staticRouter;
