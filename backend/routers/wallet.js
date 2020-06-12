const express = require("express");
const auth = require("../middleware/auth");

const Transaction = require("../models/transaction.js");
const walletController = require("../services/walletController");

const walletRouter = express.Router()

walletRouter.get("/wallet/currencies", auth, walletController.getCurrencies);
walletRouter.get("/wallet/rates", [], walletController.getRates)
walletRouter.post("/wallet/exchange", auth, walletController.exchange)

module.exports = walletRouter