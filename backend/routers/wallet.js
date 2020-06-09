const express = require("express");
const auth = require("../middleware/auth");

const Transaction = require("../models/transaction.js");
const walletController = require("../services/walletController");

const walletRouter = express.Router()

walletRouter.get("/wallet/currencies", auth, walletController.getCurrencies);

module.exports = walletRouter