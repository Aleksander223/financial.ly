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

const getCurrencies = async function (req, resp){
  var currencies = [];
  const currentUser = req.user;
  // aici nu sunt sigur ca ar trebui sa fie currentUser(liniile 22,23)
  for(j=0; j<currentUser.wallet.length; j++){
    currencies.push(currentUser.wallet[j].currency);
  }
  resp.status(200).json({ status: 200, currencies: currencies });
}

const getUserTransactions = async function (req, resp) {
  const currentUser = req.user;
  var received;
  var transferred;
  await Transaction.find({from : currentUser._id}, { amount: 1, to: 1})
  .exec(function (err, listOfUserTransactions) {
    if (err) {
      return next(err);
    }
    //Successful
    console.log(listOfUserTransactions);
    transferred = JSON.parse(JSON.stringify(listOfUserTransactions));
    transferred.forEach(function (obj) {
      obj.amount = obj.amount*(-1);
    }); 
  });

  await Transaction.find({to : currentUser._id}, { amount: 1, from: 1})
  .exec(function (err, listOfUserTransactions) {
    if (err) {
      return next(err);
    }
    //Successful
    console.log(listOfUserTransactions);
    received = JSON.parse(JSON.stringify(listOfUserTransactions));
  });

  resp.status(200).json({ status: 200, transferred: transferred, received: received });
}

const addTransaction = async function (req, resp) {
  // const IBAN = req.body.to;
  // destinationUser = await User.findOne({IBAN: IBAN},
  //   function (err, user) {
  //     if (err) return handleError(err);
  //   });

  console.log(req.body);
  const currentUser = req.user;

  transaction = new Transaction({
    from: req.body.currentUser._id, // id user who makes the transaction
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
    
    sender.wallet[i].amount -= req.body.amount;
    receiver.wallet[j].amount += req.body.amount;

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
  getCurrencies
};
