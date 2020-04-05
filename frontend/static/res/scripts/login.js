async function sendLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = {
    email,
    password
  };

  console.log(data);

  const response = await fetch("http://localhost:3333/user/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  console.log(await response.json());
}
