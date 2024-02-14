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
    
      localStorage.setItem("token", data.token);

      window.location.href = `home.html?userId=${userId}`;
    } 
  });
});
