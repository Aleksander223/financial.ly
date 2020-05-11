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

  table = $("#example").DataTable({
    autoWidth: false,
    lengthChange: false,
    paging: false,
    ordering: false,
    info: false,
    responsive: true,
    searching: false,
    ajax: {
      url: "http://localhost:9999/res/mock/ron.json",
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

          if (full.sum < 0) {
            sign = "-";
            verb = "To";
          } else {
            sign = "+";
            verb = "From";
          }

          //   return `<h5>${verb} ${full.sender}</h5><p>${full.sum}</p>`;
          return `
          <div class="uk-card uk-card-body uk-card-default uk-grid">
          <div class="uk-width-1-2"><h5 class="uk-text-secondary">${verb} ${
            full.sender
          }</h3></div>
          <div class="uk-width-1-2"><h5 class="uk-text-secondary">${sign} ${Math.abs(
            full.sum
          )} ${full.wallet}</h3></div>
          <div><h3 class="uk-text-meta">${moment(date).format(
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
  window.location.reload();
}
