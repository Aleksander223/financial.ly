const path = require("path");
const express = require("express");


const staticRouter = express.static(path.join(__dirname, "..", "..", "./static"))

module.exports = staticRouter;
