const User = require("../models/user.js");
const Transaction = require("../models/transaction.js");

const axios = require("axios")

const getCurrencies = async function (req, resp) {
  var currencies = [];
  const currentUser = req.user;
  // aici nu sunt sigur ca ar trebui sa fie currentUser(liniile 22,23)
  for (j = 0; j < currentUser.wallet.length; j++) {
    currencies.push(currentUser.wallet[j].currency);
  }
  resp.status(200).json({
    status: 200,
    currencies: currencies
  });
}

const getRates = async function (req, resp) {
  // async function getRates() {
  //   let r = await fetch("https://api.exchangeratesapi.io/latest/", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   })

  //   let rates = await r.json()
  //   console.log(rates)
  // }

  let rates = await axios.get("https://api.exchangeratesapi.io/latest/")
  resp.status(200).send(rates.data)
}

module.exports = {
  getCurrencies,
  getRates
};