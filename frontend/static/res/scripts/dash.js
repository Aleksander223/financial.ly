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
});

function signOut() {
  Cookies.remove("Authorization");
  window.location.reload();
}
