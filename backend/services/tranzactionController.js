
const Transaction = require('../models/transaction.js');

const getTransactions = function(req, resp){

    Transaction.find({})
    .populate({path:'from', select:'username'})
    .populate({path:'to', select:'username'}) // populate 'from' property with 'username' property from user model
    .exec(function (err, listOfTransactions) {
      if (err) { return next(err); }
      //Successful
      resp.json({transactions: listOfTransactions});    
    });
};

const addTransactions = function(req, resp){
    
};

const deleteTransactions = function(req, resp){
    
};

module.exports = {
    getTransactions,
    addTransactions,
    deleteTransactions
};