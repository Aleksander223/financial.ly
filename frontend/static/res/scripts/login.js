function deleteWarnings() {
  $("#email").removeClass("uk-form-danger");
  $("#password").removeClass("uk-form-danger");
  $("#dangerText").addClass("uk-hidden");
}

$(document).ready(() => {
  $("#email").click(() => {
    deleteWarnings();
  });

  $("#password").click(() => {
    deleteWarnings();
  });
});

async function sendLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = {
    email,
    password,
  };

  const response = await fetch("http://localhost:3333/user/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  res = await response.json();

  if (response.status != 201) {
    const el = $("#submitButton").get(0);
    $("#submitButton").removeClass("animate__shakeX");
    void el.offsetWidth;
    el.style.setProperty("--animate-duration", "0.6s");
    $("#submitButton").addClass("animate__shakeX");

    $("#email").addClass("uk-form-danger");
    $("#password").addClass("uk-form-danger");
    $("#dangerText").removeClass("uk-hidden");
  } else {
    Cookies.set("Authorization", "Bearer " + res.token);
    window.location.replace("/");
  }
}

async function sendRegister() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const telephone = document.getElementById("telephone").value;
  const country = document.getElementById("country").value;
  const city = document.getElementById("city").value;
  const street = document.getElementById("street").value;
  const zip = document.getElementById("zip").value;

  const data = {
    username,
    email,
    password,
    telephone,
    country,
    city,
    street,
    zip,
  };
  // console.log(JSON.stringify(data));
  const response = await fetch("http://localhost:3333/user/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  res = await response.json();
  Cookies.set("Authorization", "Bearer " + res.token);
  window.location.replace("/");
}
