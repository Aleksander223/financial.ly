const Transaction = require("../models/transaction.js");
const User = require("../models/user.js");
const nodemailer = require('nodemailer');
const e = require("express");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'financiallysuppport@gmail.com',
    pass: 'parolacompletrandom123'
  }
});

const getTransactions = async function (req, resp) {
  await Transaction.find({})
    .populate({
      path: "from",
      select: "username"
    })
    .populate({
      path: "to",
      select: "username"
    }) // populate 'from' ad 'to' property with 'username' property from user model
    .exec(function (err, listOfTransactions) {
      if (err) {
        return next(err);
      }
      //Successful
      console.log(listOfTransactions);
      resp.status(200).json({
        status: 200,
        transactions: listOfTransactions
      });
    });
};

const getUserTransactions = async function (req, resp) {
  const currentUser = req.user;
  let received = [];
  let transferred = [];
  let c = await Transaction.find({
      from: currentUser._id
    })
    .exec(function (err, listOfUserTransactions) {
      if (err) {
        return next(err);
      }
      //Successful
      transferred = JSON.parse(JSON.stringify(listOfUserTransactions));
    });

  let d = await Transaction.find({
      to: currentUser._id
    })
    .exec(function (err, listOfUserTransactions) {
      if (err) {
        return next(err);
      }
      //Successful
      received = JSON.parse(JSON.stringify(listOfUserTransactions));

      let transactions = transferred.concat(received)

      console.log(transactions)

      resp.status(200).json({
        status: 200,
        transactions
      });
    });

}

const topUp = async function (req, resp) {
  const currentUser = req.user;

  req.body.amount = Number(req.body.amount)

  const from = "000000000000"
  const to = currentUser._id

  transaction = new Transaction({
    from, // id user who makes the transaction
    to, // id directly from body or looking for the user with IBAN (destination field in frontend form)
    amount: req.body.amount, // + or -. received or paid. If we want to show user transactions, we search for current user_id in list of transactions(in both fields: from and to)
    currency: req.body.currency,
  });


  try {
    const result = await transaction.save();
    console.log(result);

    let receiver = await User.findById(to); // add balance to receiver

    let j;

    for (j = 0; j < receiver.wallet.length; j++) {
      if (receiver.wallet[j].currency === transaction.currency)
        break;
    }

    receiver.wallet[j].amount += Number(req.body.amount);

    receiver.save();

    resp.status(200).json({
      status: 200,
      transaction: transaction
    });
  } catch (err) {
    console.log(err.message);
    resp.status(400).json({
      status: 400,
      message: err.message
    });
  }
}

const addTransaction = async function (req, resp) {
  // const IBAN = req.body.to;
  // destinationUser = await User.findOne({IBAN: IBAN},
  //   function (err, user) {
  //     if (err) return handleError(err);
  //   });

  const currentUser = req.user;

  req.body.amount = Number(req.body.amount)

  req.body.amount = req.body.amount.toFixed(2)

  const email = await User.findOne({
    _id: req.body.to
  }).email

  var mailOptions = {
    from: 'Financial.ly support',
    to: email, // receiver's email
    subject: 'New transaction',
    text: 'You just received ' + req.body.amount + " " + req.body.currency + " from user " + currentUser.username
  };

  if (req.body.to == req.body.from) {
    return resp.status(400).json({
      status: 400,
      message: "Sender is receiver!"
    });
  }

  transaction = new Transaction({
    from: currentUser._id, // id user who makes the transaction
    to: req.body.to, // id directly from body or looking for the user with IBAN (destination field in frontend form)
    amount: req.body.amount, // + or -. received or paid. If we want to show user transactions, we search for current user_id in list of transactions(in both fields: from and to)
    currency: req.body.currency,
  });


  try {
    const result = await transaction.save();
    console.log(result);

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    let sender = await User.findById(req.body.from); // subtract balance from sender
    let receiver = await User.findById(req.body.to); // add balance to receiver

    let i, j;
    for (i = 0; i < sender.wallet.length; i++) {
      if (sender.wallet[i].currency === transaction.currency)
        break;
    }

    for (j = 0; j < receiver.wallet.length; j++) {
      if (receiver.wallet[j].currency === transaction.currency)
        break;
    }

    if (i === sender.wallet.length || j === receiver.wallet.length)
      resp.status(400).json({
        status: 400,
        message: "You can't make transaction. Invalid currency."
      });

    sender.wallet[i].amount -= Number(req.body.amount);
    receiver.wallet[j].amount += Number(req.body.amount);

    await sender.save();
    await receiver.save();

    resp.status(200).json({
      status: 200,
      transaction: transaction
    });
  } catch (err) {
    console.log(err.message);
    resp.status(400).json({
      status: 400,
      message: err.message
    });
  }
};

const cancelTransaction = async function (req, resp) {
  var currentDate = new Date();

  var transaction = await Transaction.findById(req.body.transactionId);

  let from = transaction.from;
  let to = transaction.to;

  let amount = transaction.amount;

  let currency = transaction.currency;

  let topup = false

  if (from == "303030303030303030303030") {
    topup = true
  }

  // To calculate the no. of hours between two dates
  var DifferenceInHours =
    Math.abs(currentDate - transaction.date) / (1000 * 60 * 60);

  if (DifferenceInHours <= 12) {
    await Transaction.deleteOne({
      _id: req.body.transactionId,
    }); // id must be of type ObjectId

    // Need to modify amount from sender and receiver account 

    let j;

    let receiver = await User.findById(to)

    console.log(receiver)

    for (j = 0; j < receiver.wallet.length; j++) {
      if (receiver.wallet[j].currency === currency)
        break;
    }

    receiver.wallet[j].amount -= Number(amount)

    await receiver.save()

    if (!topup) {
      let sender = await User.findById(from)

      let i;

      for (i = 0; i < sender.wallet.length; i++) {
        if (sender.wallet[i].currency === currency)
          break;
      }

      sender.wallet[i].amount += Number(amount)

      await sender.save()
    }

    return resp.status(200).json({
      status: 200
    });
  } else
    resp.status(400).json({
      status: 400,
      message: "You can't cancel the transaction. The time limit has passed.",
    });
};

module.exports = {
  getTransactions,
  addTransaction,
  cancelTransaction,
  getUserTransactions,
  topUp
};