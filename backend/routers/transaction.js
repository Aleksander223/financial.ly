const express = require("express");
const auth = require("../middleware/auth");

const Transaction = require("../models/transaction.js");
const transactionController = require("../services/transactionController");

const transactionRouter = express.Router();

transactionRouter.get(
  "/transaction/all",
  auth,
  transactionController.getTransactions
);
transactionRouter.get(
  "/transaction/list",
  auth,
  transactionController.getUserTransactions
);
transactionRouter.get(
  "/transaction/currencies",
  auth,
  transactionController.getCurrencies
);
transactionRouter.post(
  "/transaction/create",
  auth,
  transactionController.addTransaction
);
transactionRouter.post(
  "/transaction/cancel",
  auth,
  transactionController.cancelTransaction
);

module.exports = transactionRouter;
