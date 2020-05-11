const express = require("express");
const auth = require("../middleware/auth");

const Transaction = require("../models/transaction.js");
const transactionController = require("../services/tranzactionController");



const transactionRouter = express.Router();

transactionRouter.get("/transactions", auth, transactionController.getTransactions);
transactionRouter.post("/createTransaction", auth, transactionController.addTransactions);
transactionRouter.post("/cancelTransaction", auth, transactionController.cancelTransactions);


module.exports = transactionRouter;