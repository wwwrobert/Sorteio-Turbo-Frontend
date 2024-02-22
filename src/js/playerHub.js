import { Url } from "./configs/config.js";

document.addEventListener("DOMContentLoaded", function () {
  const formAdicionar = document.getElementById("adicionarJogadorForm");
  const responseMessageAdicionar = document.getElementById(
    "responseMessageAdicionar"
  );
  const params = new URLSearchParams(window.location.search);
  const treinoId = params.get("treinoId");
  const token = localStorage.getItem("token");

  if (!treinoId || !token) {
    window.location.href = "index.html";
  }

  formAdicionar.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Desabilita o botão de adicionar jogador para evitar cliques repetidos
    formAdicionar.querySelector("button[type='submit']").disabled = true;

    const nomeInput = document.getElementById("nome");
    const nivelInput = document.getElementById("nivel");

    const nome = nomeInput.value;
    const nivel = parseFloat(nivelInput.value);

    const response = await fetch(`${Url}/auth/adicionar-jogador/${treinoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, nivel }),
    });

    const data = await response.json();

    if (responseMessageAdicionar) {
      responseMessageAdicionar.innerHTML = `<p>${data.message}</p>`;
    }

    // Limpa os campos do formulário após 2 segundos
    setTimeout(function () {
      nomeInput.value = "";
      nivelInput.value = "";
      responseMessageAdicionar.innerHTML = "";
      // Reabilita o botão de adicionar jogador após a conclusão da operação
      formAdicionar.querySelector("button[type='submit']").disabled = false;
    }, 1250);
  });

  const closeModalButton = document.getElementById("closeModalButton");
  closeModalButton.addEventListener("click", function () {
    window.location.reload();
  });

  // Sortear Times ================================================================================
  const sortearTimesForm = document.getElementById("sortearTimesForm");
  sortearTimesForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    sortearTimesForm.querySelector("button[type='submit']").disabled = true;

    const numberOfTeams = document.getElementById("numberOfTeams").value;

    const response = await fetch(`${Url}/auth/sortear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        treinoId,
        numberOfTeams,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      const timesList = document.getElementById("timesList");
      timesList.innerHTML = "";

      data.times.forEach((time, index) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";

        // Ordena os jogadores com base no nível (do maior para o menor)
        time.sort((a, b) => b.nivel - a.nivel);

        // Cria um parágrafo para cada jogador e adiciona ao item da lista
        time.forEach((jogador) => {
          const playerParagraph = document.createElement("p");
          playerParagraph.textContent = jogador.nome;
          playerParagraph.style.marginBottom = "0.1rem";
          listItem.appendChild(playerParagraph);
        });

        // Define o título do time
        const title = document.createElement("h4");
        title.textContent = `Time ${index + 1}:`;
        title.classList.add("team-title");
        listItem.insertBefore(title, listItem.firstChild);

        timesList.appendChild(listItem);
      });

      const compartilharTimesBtn = document.getElementById(
        "compartilharTimesBtn"
      );
      compartilharTimesBtn.addEventListener("click", function () {
        // Captura o conteúdo do modal
        html2canvas(document.getElementById("timesSorteadosModal"), {
          onrendered: function (canvas) {
            // Cria uma URL da imagem capturada
            const imgData = canvas.toDataURL("image/png");

            // Cria um link para download da imagem
            const link = document.createElement("a");
            link.href = imgData;
            link.download = "times_sorteados.png";
            link.click();
          },
        });
      });
      // Abre o modal com os times sorteados
      const modal = new bootstrap.Modal(
        document.getElementById("timesSorteadosModal")
      );
      modal.show();
    } else {
      const errorData = await response.json();
      alert(errorData.error); // Exibe a mensagem de erro retornada pelo servidor
    }

    sortearTimesForm.querySelector("button[type='submit']").disabled = false;
  });

  // Evento de clique para fechar o modal
  document
    .getElementById("timesSorteadosModal")
    .addEventListener("hidden.bs.modal", function () {
      // Limpa a lista de times quando o modal é fechado
      document.getElementById("timesList").innerHTML = "";
    });
});

// Buscar Jogadores ================================================================

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const treinoId = urlParams.get("treinoId");
  const playersTable = document.querySelector(".players-table tbody");

  const loadPlayers = async () => {
    try {
      const response = await fetch(`${Url}/auth/jogadores/${treinoId}`);
      const playersData = await response.json();

      playersTable.innerHTML = "";

      if (playersData.length === 0) {
        const row = playersTable.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 3;
        cell.textContent =
          "Clique em 'Adicionar Jogador' para colocar jogadores na lista.";
      } else {
        playersData.forEach((jogador) => {
          const row = playersTable.insertRow();
          row.innerHTML = `
            <td>${jogador.nome}</td>
            <td>${jogador.nivel}</td>
            <td>
              <button class="btn edit-player-btn" data-id="${jogador.id}">
                <img src="./assets/editar-b.png" style="width: 14px;">
              </button>
              <button class="btn delete-player-btn" data-id="${jogador.id}">
                <img src="./assets/excluir-b.png" style="width: 14px;">
              </button>
            </td>
          `;
        });
      }
      // Adicionar evento de clique para os botões de exclusão
      const deleteButtons = document.querySelectorAll(".delete-player-btn");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", async () => {
          const playerId = button.getAttribute("data-id");
          try {
            const deleteResponse = await fetch(
              `${Url}/auth/deletePlayer/${treinoId}/${playerId}`,
              {
                method: "DELETE",
              }
            );
            if (deleteResponse.ok) {
              loadPlayers();
            } else {
              console.error(
                "Erro ao excluir jogador:",
                deleteResponse.statusText
              );
            }
          } catch (error) {
            console.error("Erro ao excluir jogador:", error);
          }
        });
      });

      // Adicionar evento de clique para os botões de edição
      const editButtons = document.querySelectorAll(".edit-player-btn");
      editButtons.forEach((button) => {
        button.addEventListener("click", async () => {
          const playerId = button.getAttribute("data-id");
          const modal = new bootstrap.Modal(
            document.getElementById("editarNivelModal")
          );
          modal.show();

          const salvarNivelBtn = document.getElementById("salvarNivelBtn");
          salvarNivelBtn.addEventListener("click", async () => {
            const novoNivel = parseFloat(
              document.getElementById("novoNivel").value
            );
            try {
              const updateResponse = await fetch(
                `${Url}/auth/updatePlayer/${treinoId}/${playerId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ nivel: novoNivel }),
                }
              );
              if (updateResponse.ok) {
                modal.hide();

                window.location.reload();
                loadPlayers();
              } else {
                console.error(
                  "Erro ao atualizar jogador:",
                  updateResponse.statusText
                );
              }
            } catch (error) {
              console.error("Erro ao atualizar jogador:", error);
            }
          });
        });
      });
    } catch (error) {
      console.error("Erro ao buscar jogadores:", error);
    }
  };
  loadPlayers();
});
