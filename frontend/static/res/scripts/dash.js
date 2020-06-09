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

$(document).ready(async () => {
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
  Cookies.set("sender", userData._id);


  table = $("#example").DataTable({
    autoWidth: false,
    lengthChange: false,
    paging: false,
    ordering: false,
    info: false,
    responsive: true,
    searching: false,
    ajax: async (data, callback, settings) => {
      const transactions = await fetch(
        "http://localhost:3333/transaction/list/",
        {
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

      for(let transaction of trc) {
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
      sEmptyTable: `<h3>No transactions</h3>`
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

          //   return `<h5>${verb} ${full.sender}</h5><p>${full.sum}</p>`;
          return `
          <div class="uk-card uk-card-body uk-card-default uk-grid uk-margin">
          <div class="uk-width-1-2"><h5 class="uk-text-secondary">${verb} ${subject}</h3></div>
          <div class="uk-width-1-2"><h5 class="uk-text-secondary">${sign} ${Math.abs(
            full.amount
          )} ${full.currency}</h3></div>
          <div><h3 class="uk-text-meta">${moment(full.date).format(
            "HH:mm DD MMM"
          )}</h3></div>
          </div>
          `;
        },
      },
    ],
  });
});

function signOut() {
  Cookies.remove("Authorization");
  Cookies.remove("sender");
  window.location.reload();
}

async function sendTransaction() {
  const from = Cookies.get("sender");
  const to = $("#transaction_to").val();
  const amount = $("#transaction_sum").val();
  const currency = $("#transaction_currency").val();

  const data = {
    from,
    to,
    amount,
    currency,
  };

  const transactionData = await fetch(
    "http://localhost:3333/transaction/create/",
    {
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

  window.location.reload();
}
