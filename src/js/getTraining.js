import { Url } from "./configs/config.js";

document.addEventListener("DOMContentLoaded", async function () {
    const treinosList = document.getElementById("treinos-list");
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!userId || !token) {
        window.location.href = "index.html";
    }

    try {
        const response = await fetch(`${Url}/auth/getTraining/${userId}`); 
        const data = await response.json();

        data.forEach((treinos, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${treinos.nome}</td>
                <td>${treinos.dia}</td>
                <td>${treinos.hora}</td>
                <td>
                    <button class="btn delete-treino" data-treino-id="${treinos.id}"><img src="./assets/excluir.png" style="width: 14px;"></button>
                    <button class="btn view-players" data-treino-id="${treinos.id}"><img src="./assets/visualizar.png" style="width: 14px;"></button>
                </td>
            `;
            treinosList.appendChild(row);
        });

        const deleteTreinoButtons = document.querySelectorAll(".delete-treino");
        deleteTreinoButtons.forEach(button => {
            button.addEventListener("click", async function() {
                const treinoId = this.getAttribute("data-treino-id");
                try {
                    // Excluir todos os jogadores associados ao treino
                    const deletePlayersResponse = await fetch(`${Url}/auth/deletePlayers/${treinoId}`, {
                        method: "DELETE"
                    });
                    if (!deletePlayersResponse.ok) {
                        console.error("Erro ao excluir jogadores:", deletePlayersResponse.statusText);
                    }

                    // Excluir o treino
                    const deleteTreinoResponse = await fetch(`${Url}/auth/deleteTreino/${treinoId}/${userId}`, {
                        method: "DELETE"
                    });
                    if (deleteTreinoResponse.ok) {
                        // Remove a linha da tabela
                        this.closest("tr").remove();
                    } else {
                        console.error("Erro ao excluir treino:", deleteTreinoResponse.statusText);
                    }
                } catch (error) {
                    console.error("Erro ao excluir treino:", error);
                }
            });
        });

        const viewPlayersButtons = document.querySelectorAll(".view-players");
        viewPlayersButtons.forEach(button => {
            button.addEventListener("click", function() {
                const treinoId = this.getAttribute("data-treino-id");
                window.location.href = `playerHub.html?treinoId=${treinoId}`;
            });
        });
        
    } catch (error) {
        console.error("Erro ao buscar treinos:", error);
    }
});
