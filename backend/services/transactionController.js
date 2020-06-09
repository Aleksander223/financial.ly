const Transaction = require("../models/transaction.js");
const User = require("../models/user.js");

const getTransactions = async function (req, resp) {
  await Transaction.find({})
    .populate({ path: "from", select: "username" })
    .populate({ path: "to", select: "username" }) // populate 'from' ad 'to' property with 'username' property from user model
    .exec(function (err, listOfTransactions) {
      if (err) {
        return next(err);
      }
      //Successful
      console.log(listOfTransactions);
      resp.status(200).json({ status: 200, transactions: listOfTransactions });
    });
};

const getUserTransactions = async function (req, resp) {
  const currentUser = req.user;
  let received = [];
  let transferred = [];
  let c = await Transaction.find({from : currentUser._id})
  .exec(function (err, listOfUserTransactions) {
    if (err) {
      return next(err);
    }
    //Successful
    transferred = JSON.parse(JSON.stringify(listOfUserTransactions));
  });

  let d = await Transaction.find({to : currentUser._id})
  .exec(function (err, listOfUserTransactions) {
    if (err) {
      return next(err);
    }
    //Successful
    received = JSON.parse(JSON.stringify(listOfUserTransactions));

    let transactions = transferred.concat(received)

    console.log(transactions)

    resp.status(200).json({ status: 200, transactions });
  });

}

const addTransaction = async function (req, resp) {
  // const IBAN = req.body.to;
  // destinationUser = await User.findOne({IBAN: IBAN},
  //   function (err, user) {
  //     if (err) return handleError(err);
  //   });

  console.log(req.body);
  const currentUser = req.user;

  if (req.body.to == req.body.from) {
    return resp.status(400).json({ status: 400, message: "Sender is receiver!" });
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

    let sender = await User.findById(req.body.from); // subtract balance from sender
    let receiver = await User.findById(req.body.to); // add balance to receiver

    let i, j;
    for(i=0; i<sender.wallet.length; i++){
      if(sender.wallet[i].currency === transaction.currency)
        break;
    }

    for(j=0; j<receiver.wallet.length; j++){
      if(receiver.wallet[j].currency === transaction.currency)
        break;
    }

    if(i === sender.wallet.length || j === receiver.wallet.length)
      resp.status(400).json({ status: 400, message: "You can't make transaction. Invalid currency."});
    
    sender.wallet[i].amount -= Number(req.body.amount);
    receiver.wallet[j].amount += Number(req.body.amount);

    sender.save();
    receiver.save();

    resp.status(200).json({ status: 200, transaction: transaction });
  } catch (err) {
    console.log(err.message);
    resp.status(400).json({ status: 400, message: err.message });
  }
};

const cancelTransaction = async function (req, resp) {
  var currentDate = new Date();

  var transaction = await Transaction.findById(req.body.transactionId);

  // To calculate the no. of hours between two dates
  var DifferenceInHours =
    Math.abs(currentDate - transaction.date) / (1000 * 60 * 60);

  if (DifferenceInHours <= 12) {
    Transaction.deleteOne({
      _id: new mongodb.ObjectID(req.body.transactionId),
    }); // id must be of type ObjectId

    // Need to modify amount from sender and receiver account 

    resp.status(200).json({ status: 200 });
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
};
