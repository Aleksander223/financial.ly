async function getName(_id) {
  let url = "http://localhost:3333/user/name/" + _id
  const username = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  })

  const res = await username.json()

  return res.username
}

async function cancelTransaction(transactionId) {
  let url = "http://localhost:3333/transaction/cancel/"
  console.log(transactionId)

  let d = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      transactionId
    }),
    credentials: "include"
  })

  let res = await d.json()

  if (res.status != 200) {
    alert("Cannot revert transaction")
  } else {
    window.location.reload()
  }
}

let currentCurrency;

$(document).ready(async () => {

  $("#transaction-modal").on("show", () => {
    // new autoComplete({
    //   data: {
    //     src: async () => {
    //       const q = await fetch("http://localhost:3333/user/all/", {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         credentials: "include",
    //       });

    //       const data = await q.json()
    //       return data
    //     },
    //     key: ["username"],
    //     cache: false
    //   },
    //   selector: "#transactionTo",
    //   resultsList: {
    //     render: true,
    //     destination: document.querySelector("#transactionTo"),
    //     position: "afterend",
    //     element: "ul"
    //   },
    //   maxResults: 5,
    //   threshold: 1,
    //   resultItem: {
    //     content: (data, source) => {
    //       source.innerHTML = `
    //         <div class="uk-card uk-card-body uk-card-default uk-remove-padding uk-remove-margin uk-position-relative uk-position-z-index">
    //           <p class="uk-text uk-remove-padding uk-remove-margin">${data.match}</p>
    //         </div>
    //         `;
    //     },
    //     element: "Custom"
    //   }
    // })
  })


  const userD = await fetch("http://localhost:3333/user/status/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const userData = await userD.json();

  $("#username").text(userData.username);
  $("#balance").text(userData.wallet[0].amount);
  $("#currency").text(" " + userData.wallet[0].currency);

  currentCurrency = userData.wallet[0].currency

  Cookies.set("sender", userData._id);


  table = $("#example").DataTable({
    autoWidth: false,
    lengthChange: false,
    paging: false,
    ordering: false,
    info: false,
    responsive: true,
    searching: true,
    ajax: async (data, callback, settings) => {
      const transactions = await fetch(
        "http://localhost:3333/transaction/list/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      res = await transactions.json();

      let trc = res.transactions

      if (!res.transactions) {
        trc = []
      }

      trc = trc.sort((a, b) => {

        let x = new Date(a.date)
        let y = new Date(b.date)


        if (x < y) {
          return 1;
        } else {
          return -1
        }
      })

      for (let transaction of trc) {
        transaction.from = await getName(transaction.from)
        transaction.to = await getName(transaction.to)
      }

      tableData = {
        data: trc,
      };

      console.log(tableData);



      callback(tableData);
    },
    // ajax: {
    //   url: "htttp://localhost:3333/transaction/list",
    //   type: "GET",
    //   dataSrc: "",
    //   xhrFields: {
    //     withCredentials: true,
    //   },
    // },
    oLanguage: {
      sEmptyTable: `<h3>No transactions</h3>`,
      sZeroRecords: `<h3>No transactions found</h3>`
    },
    columns: [
      //   {
      //     data: "timestamp",
      //     title: "Date",
      //     type: "date",
      //     render(val) {
      //       const date = new Date(val);
      //       return moment(date).format("HH:mm DD MMM");
      //     },
      //   },
      //   { data: "sender", title: "Sender" },
      //   { data: "receiver", title: "Receiver" },
      //   {
      //     data: "sum",
      //     title: "Sum",
      //     render(val, type, full, meta) {
      //       return val + " " + full.wallet;
      //     },
      //   },
      {
        data: "sum",
        title: "",
        width: "100%",
        render(val, type, full, meta) {
          //   return val + " " + full.wallet;
          let sign;
          let verb;

          const date = new Date(val);

          // if (full.sum < 0) {
          //   sign = "-";
          //   verb = "To";
          // } else {
          //   sign = "+";
          //   verb = "From";
          // }

          if (full.from == userData.username) {
            sign = "-";
            verb = "To";
            subject = full.to
          } else {

            sign = "+";
            verb = "From";
            subject = full.from
          }

          if (subject == undefined) {
            subject = ""
            verb = "Top up"
          }

          //   return `<h5>${verb} ${full.sender}</h5><p>${full.sum}</p>`;
          return `
          <div class="uk-card uk-card-body uk-card-default uk-grid uk-margin">
          <div class="uk-width-1-2"><h5 class="uk-text-secondary">${verb} ${subject}</h5></div>
          <div class="uk-width-1-3"><h5 class="uk-text-secondary">${sign} ${Math.abs(
            full.amount
          )} ${full.currency}</h5></div>
          <div class="uk-width-auto">
          <a href="javascript:cancelTransaction('${full._id}');" uk-icon="icon: close"></a>
          </div>
          <div><h3 class="uk-text-meta">${moment(full.date).format(
            "HH:mm DD MMM"
          )}</h3></div>
          </div>
          `;
        },
      },
    ],
  });

  let search = $("#example_filter input")
  search.removeClass()
  search.addClass("uk-search-input")
  search.attr('id', 'searchForm')

  let container = $("#example_filter")
  container.removeClass()
  container.addClass(["uk-search", "uk-width-auto", "uk-search-default", "uk-margin-remove", "uk-padding-remove"])


});

function signOut() {
  Cookies.remove("Authorization");
  Cookies.remove("sender");
  window.location.reload();
}

async function sendTransaction() {
  const from = Cookies.get("sender");
  const to_username = $("#transaction_to").val();
  const amount = $("#transaction_sum").val();
  const currency = $("#transaction_currency").val();

  let to_id = await fetch("http://localhost:3333/user/id/" + to_username, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  let to = await to_id.json()
  to = to._id

  const data = {
    from,
    to,
    amount,
    currency,
  };

  const transactionData = await fetch(
    "http://localhost:3333/transaction/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  console.log(transactionData.status);
  console.log(await transactionData.json());

  if (transactionData.status < 200 || transactionData.status >= 300) {
    $("#dangerTransaction").removeClass("uk-hidden");
  } else {
    window.location.reload();
  }

}

async function topUp() {
  const amount = $("#topup_sum").val();
  const currency = $("#topup_currency").val();

  const data = {
    amount,
    currency
  }

  const transactionData = await fetch(
    "http://localhost:3333/transaction/topup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  console.log(transactionData.status);
  console.log(await transactionData.json());

  if (transactionData.status < 200 || transactionData.status >= 300) {
    $("#dangerTopup").removeClass("uk-hidden");
  } else {
    window.location.reload();
  }
}

async function changeCurrency(el) {
  const curr = el.innerHTML;

  const userD = await fetch("http://localhost:3333/user/status/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const userData = await userD.json();

  let i = 0
  for (wallet of userData.wallet) {
    if (wallet.currency == curr) {
      break
    } else {
      i++;
    }
  }

  if (i > 2) {
    i = 0
  }

  currentCurrency = userData.wallet[i].currency

  $("#username").text(userData.username);
  $("#balance").text(userData.wallet[i].amount);
  $("#currency").text(" " + userData.wallet[i].currency);
}