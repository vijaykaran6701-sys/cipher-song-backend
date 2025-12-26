import { loginUser } from "./api.js";

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const result = await loginUser({ email, password });

  document.getElementById("output").innerText =
    JSON.stringify(result, null, 2);
};
