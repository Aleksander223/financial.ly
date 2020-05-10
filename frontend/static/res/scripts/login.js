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

  console.log(res);

  Cookies.set("Authorization", "Bearer " + res.token);
  window.location.replace("/");
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

  const response = await fetch("http://localhost:3333/user/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log(await response.json());
}
