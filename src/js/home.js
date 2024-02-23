import { Url } from "./configs/config.js";

document.addEventListener("DOMContentLoaded", async function () {
  const formTreino = document.getElementById("criarTreinoForm");
  const responseMessageTreino = document.getElementById(
    "responseMessageAdicionar"
  );
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    window.location.href = "index.html";
  }
  try {
    const response = await fetch(`${Url}/auth/getToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ userId })
    });

    if (response.ok) {
      const data = await response.json();
      const tokenFromBackend = data.token;

      // Comparar o token do localStorage com o token do backend
      if (token === tokenFromBackend) {
        console.log("O token do localStorage corresponde ao token do backend. Usuário autenticado.");
      } else {
        console.log("O token do localStorage não corresponde ao token do backend. Redirecionando para a página de login.");
        window.location.href = "index.html";
      }
    } else {
      console.log("Erro ao obter o token do backend. Redirecionando para a página de login.");
      window.location.href = "index.html";
    }
  } catch (error) {
    console.error("Erro ao fazer a solicitação para obter o token do backend:", error);
    window.location.href = "index.html";
  }

  const btnView = document.getElementById("btn-view");
  btnView.addEventListener("click", function () {
    window.location.href = `getTraining.html`;
  });

  formTreino.addEventListener("submit", async function (e) {
    e.preventDefault();

    formTreino.querySelector("button[type='submit']").disabled = true;

    const nomeTreino = document.getElementById("nomeTreino").value;
    const diaTreino = document.getElementById("diaTreino").value;
    const horaTreino = document.getElementById("horaTreino").value;

    const response = await fetch(`${Url}/auth/treino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        nome: nomeTreino,
        dia: diaTreino,
        hora: horaTreino,
      }),
    });

    if (response.ok) {
      // Verifica se a resposta foi bem-sucedida (status 2xx)
      const data = await response.json();
      responseMessageTreino.innerHTML = `<p>${data.message}</p>`;

      setTimeout(() => {
        responseMessageTreino.innerHTML = "";
        
        localStorage.setItem("treinoId", data.treinoId);
        window.location.href = `playerHub.html`;
      }, 2000);
    } else {
      responseMessageTreino.innerHTML =
        "<p>Erro ao criar treino. Tente novamente.</p>";
    }
    
    formTreino.querySelector("button[type='submit']").disabled = false;
  });
});
