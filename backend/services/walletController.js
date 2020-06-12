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

const exchange = async function (req, resp) {
  const currentUser = req.user;

  req.body.amount = Number(req.body.amount)

  req.body.amount = req.body.amount.toFixed(2)

  let base = req.body.from
  if (base == "$") {
    base = "USD"
  } else if (base == "€") {
    base = "EUR"
  }

  let rates = await axios.get("https://api.exchangeratesapi.io/latest?base=" + base)

  let exchanged = req.body.amount * rates.data.rates[req.body.to]

  exchanged = exchanged.toFixed(2)

  try {
    let u = await User.findById(currentUser._id)


    let i, j;

    for (i = 0; i < u.wallet.length; i++) {
      if (u.wallet[i].currency === req.body.from)
        break;
    }

    for (j = 0; j < u.wallet.length; j++) {
      if (u.wallet[j].currency === req.body.to)
        break;
    }

    u.wallet[i].amount -= Number(req.body.amount);
    u.wallet[j].amount += Number(exchanged);

    await u.save()

    resp.status(200).send({
      status: 200
    })
  } catch (err) {
    console.log(err.message);
    resp.status(400).json({
      status: 400,
      message: err.message
    });
  }
}

module.exports = {
  getCurrencies,
  getRates,
  exchange
};