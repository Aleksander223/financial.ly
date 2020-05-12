
const Transaction = require('../models/transaction.js');
const User = require("../models/user.js");

const getTransactions = async function(req, resp){

    await Transaction.find({})
    .populate({path:'from', select:'username'})
    .populate({path:'to', select:'username'}) // populate 'from' ad 'to' property with 'username' property from user model
    .exec(function (err, listOfTransactions) {
      if (err) { return next(err); }
      //Successful
      resp.status(200).json({status: 200, transactions: listOfTransactions});    
    });
};

const addTransaction = async function(req, resp){

    // const IBAN = req.body.to;
    // destinationUser = await User.findOne({IBAN: IBAN}, 
    //   function (err, user) {
    //     if (err) return handleError(err);
    //   });

    transaction = new Transaction({
      from: req.body.from, // id user who makes the transaction
      to: req.body.to,  // id directly from body or looking for the user with IBAN (destination field in frontend form)
      amount: req.body.amount, // + or -. received or paid. If we want to show user transactions, we search for current user_id in list of transactions(in both fields: from and to)
      currency: req.body.currency
    });

    try {
      const result = await transaction.save();
      console.log(result);

      let sender = await User.findById(req.body.from);    // subtract balance from sender
      let receiver = await User.findById(req.body.to);    // add balance to receiver

      sender.wallet[0].amount -= req.body.amount;
      receiver.wallet[0].amount += req.body.amount;

      sender.save();
      receiver.save();

      resp.status(200).json({status: 200, transaction: transaction});   
    } catch (err) {
        console.log(err.message)
        resp.status(400).json({ status: 400, message: err.message });
    }
};

const cancelTransaction = async function(req, resp){
    var currentDate = new Date();

    var transaction = await Transaction.findById(req.body.transactionId);

    // To calculate the no. of hours between two dates 
    var DifferenceInHours = Math.abs(currentDate - transaction.date)/ (1000 * 60 * 60); 
  
    if(DifferenceInHours <=12){
      Transaction.deleteOne({_id: new mongodb.ObjectID(req.body.transactionId)}) // id must be of type ObjectId
      resp.status(200).json({ status: 200 });
    }else
      resp.status(400).json({ 
        status: 400, 
        message: 'You can\'t cancel the transaction. The time limit has passed'
      });
      
};

module.exports = {
    getTransactions,
    addTransaction,
    cancelTransaction
};