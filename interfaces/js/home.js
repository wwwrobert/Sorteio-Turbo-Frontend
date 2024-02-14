import { Url } from "../config.js";

document.addEventListener("DOMContentLoaded", function () {
  const formTreino = document.getElementById("criarTreinoForm");
  const formCampeonato = document.getElementById("criarCampeonatoForm");
  const responseMessageTreino = document.getElementById(
    "responseMessageAdicionar"
  );
  const responseMessageCampeonato = document.getElementById(
    "response-message-sortear"
  );
  const userId = new URLSearchParams(window.location.search).get("userId");
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    window.location.href = "login.html";
  }

  const btnView = document.getElementById("btn-view");
  btnView.addEventListener("click", function () {
    window.location.href = `getTraining.html?userId=${userId}`;
  });

  formTreino.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nomeTreino = document.getElementById("nomeTreino").value;
    const diaTreino = document.getElementById("diaTreino").value;
    const horaTreino = document.getElementById("horaTreino").value;

    const response = await fetch(`${Url}/auth/treino/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

        window.location.href = `playerHub.html?treinoId=${data.treinoId}`;
      }, 2000);
    } else {
      responseMessageTreino.innerHTML =
        "<p>Erro ao criar treino. Tente novamente.</p>";
    }
  });
});
