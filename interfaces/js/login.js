import { Url } from '../config.js';

document.addEventListener("DOMContentLoaded", async function () {
  const form = document.getElementById("loginForm");
  const responseMessage = document.getElementById("responseMessage");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("inputEmail").value;
    const password = document.getElementById("inputPassword").value;

    const response = await fetch(
      `${Url}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (data.token) {
      const userId = data.userId;

      // Armazenar o token no localStorage
      localStorage.setItem("token", data.token);

      // Redirecionar para a página home.html com o parâmetro userId
      window.location.href = `home.html?userId=${userId}`;
    } else {
      responseMessage.innerHTML = `<p>${data.msg}</p>`;

      const displayTime = 2000;

      setTimeout(() => {
        responseMessage.innerHTML = "";
      }, displayTime);
    }
  });
});
