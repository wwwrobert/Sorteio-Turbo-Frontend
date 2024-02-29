import { Url } from "./configs/config.js";

document.addEventListener("DOMContentLoaded", function () {
  const formCadastro = document.getElementById("registerForm");
  const responseMessageCadastro = document.getElementById("responseMessageCadastro");

  formCadastro.addEventListener("submit", async function (e) {
    e.preventDefault();

    formCadastro.querySelector("button[type='submit']").disabled = true;

    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const displayTime = 2000;

    if (password !== confirmPassword) {
      responseMessageCadastro.innerHTML = `<p>As senhas não conferem</p>`;
      setTimeout(function () {
        responseMessageCadastro.innerHTML = "";
      }, displayTime);
      return;
    }

    if (password.length < 6) {
      responseMessageCadastro.innerHTML = `<p>A senha deve ter no mínimo 6 caracteres</p>`;
      setTimeout(function () {
        responseMessageCadastro.innerHTML = "";
      }, displayTime);
      return;
    }

    const response = await fetch(`${Url}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    responseMessageCadastro.innerHTML = `<p>${data.msg}</p>`;

    setTimeout(() => {
      responseMessageCadastro.innerHTML = "";

      if (data.token) {
        const userId = data.userId;
        const expiresIn = data.expiresIn;
        
        // Armazenar o token no localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("expiresIn", expiresIn);

        window.location.href = `home.html`;
      }
    }, displayTime);

    formCadastro.querySelector("button[type='submit']").disabled = false;
  });
});
