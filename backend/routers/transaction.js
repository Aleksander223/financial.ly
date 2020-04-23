const express = require("express");
const transactionRouter = express.Router();
const auth = require("../middleware/auth");

const Transaction = require("../models/transaction.js");
const transactionController = require("../services/tranzactionController");

transactionRouter.get("/transactions", auth, transactionController.getTransactions);
transactionRouter.post("/createTransaction", auth, transactionController.addTransactions);
transactionRouter.post("/cancelTransaction", auth, transactionController.cancelTransactions);

module.exports = transactionRouter;