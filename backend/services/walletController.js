const User = require("../models/user.js");
const Transaction = require("../models/transaction.js");

const getCurrencies = async function (req, resp){
  var currencies = [];
  const currentUser = req.user;
  // aici nu sunt sigur ca ar trebui sa fie currentUser(liniile 22,23)
  for(j=0; j<currentUser.wallet.length; j++){
    currencies.push(currentUser.wallet[j].currency);
  }
  resp.status(200).json({ status: 200, currencies: currencies });
}

module.exports = {
  getCurrencies,
};
