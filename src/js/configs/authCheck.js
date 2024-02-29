import { Url } from "../configs/config.js";

document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const expiresIn = localStorage.getItem("expiresIn");

  try {
    const response = await fetch(`${Url}/auth/getToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      const data = await response.json();
      const tokenFromBackend = data.token;
      // Comparar o token do localStorage com o token do backend
      if (token === tokenFromBackend) {
        // Verifique se o token ainda é válido
        const currentTime = Math.floor(Date.now() / 1000);
        if (expiresIn > currentTime) {
          console.log(
            "O token do localStorage está válido. Usuário autenticado."
          );
          // Se o token ainda é válido, redirecione para a página home.html
          window.location.href = `home.html`;
        } else {
          console.log(
            "O token do localStorage está expirado. Redirecionando para a página de login."
          );
          // Se o token expirou, limpe o localStorage e redirecione para a página de login
          localStorage.clear();
        }
      } else {
        console.log(
          "O token do localStorage não corresponde ao token do backend. Redirecionando para a página de login."
        );
      }
    } else {
      console.log(
        "Erro ao obter o token do backend. Redirecionando para a página de login."
      );
    }
  } catch (error) {
    console.error(
      "Erro ao fazer a solicitação para obter o token do backend:",
      error
    );
  }
});
