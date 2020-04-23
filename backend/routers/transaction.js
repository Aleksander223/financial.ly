const express = require("express");
const transactionRouter = express.Router();
const auth = require("../middleware/auth");

const Transaction = require("../models/transaction.js");
const transactionController = require("../services/tranzactionController");

transactionRouter.get("/transactions", transactionController.getTransactions);
transactionRouter.post("/createTransaction", transactionController.addTransactions);
transactionRouter.post("/cancelTransaction", transactionController.cancelTransactions);

module.exports = transactionRouter;