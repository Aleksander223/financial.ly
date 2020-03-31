const path = require("path");
const express = require("express");


const staticRouter = express.Router();

staticRouter.use(express.static('../static')); // <- ia doar fisierele din static

staticRouter.get("/login", (req, res) => {
  res.sendFile("login.html", {
    root: path.join(__dirname, "..", "..", "/static")
  });
});

staticRouter.get("/register", (req, res) => {
  res.sendFile("register.html", {
    root: path.join(__dirname, "..", "..", "./static")
  });
});

staticRouter.get("*", function(req, res){
  res.send('NOT FOUND', 404);
});

module.exports = staticRouter;
