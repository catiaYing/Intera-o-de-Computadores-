
document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const resultsList = document.getElementById("searchResultsList");
    const noResults = document.getElementById("noSearchResults");
    const resultsSection = document.getElementById("searchResults");

    // Utilizadores simulados da plataforma
    const utilizadores = [
        { nome: "Ana", id: "1001", telefone: "912345678" },
        { nome: "João", id: "1002", telefone: "913456789" },
        { nome: "Pedro", id: "1003", telefone: "914567890" },
        { nome: "Sofia", id: "1004", telefone: "915678901" },
        { nome: "Inês", id: "1005", telefone: "916789012" },
        { nome: "Miguel", id: "1006", telefone: "917890123" }
    ];

    // Pesquisar novos utilizadores
    searchInput.addEventListener("input", function () {

        const pesquisa = this.value.trim().toLowerCase();

        resultsList.innerHTML = "";

        if (pesquisa === "") {
            resultsSection.style.display = "none";
            return;
        }

        // Excluir utilizadores já adicionados ou com pedido recebido
        const resultados = utilizadores.filter(user =>
            user.nome.toLowerCase().includes(pesquisa) ||
            user.id.includes(pesquisa) ||
            user.telefone.includes(pesquisa)
        );

        resultsSection.style.display = "block";

        if (resultados.length === 0) {
            noResults.style.display = "block";
            return;
        }

        noResults.style.display = "none";

        resultados.forEach(user => {

            const card = document.createElement("div");
            card.className = "user-card";

            card.innerHTML = `
                <div class="user-avatar">
                    ${user.nome.charAt(0)}
                </div>

                <div class="user-info">
                    <h3>${user.nome}</h3>
                    <p>ID: ${user.id}</p>
                </div>

                <button class="action-button">
                    Adicionar
                </button>
            `;

            card.querySelector("button").addEventListener("click", function () {
                this.textContent = "Pedido enviado";
                this.disabled = true;
                this.classList.add("requested");
            });

            resultsList.appendChild(card);
        });

    });

    // Aceitar pedido de amizade
    window.aceitarPedido = function (button) {

        const card = button.closest(".user-card");

        const nome = card.querySelector(".user-info h3").textContent;
        const descricao = card.querySelector(".user-info p").textContent;

        const novoAmigo = document.createElement("div");
        novoAmigo.className = "user-card";

        novoAmigo.innerHTML = `
            <div class="user-avatar">${nome.charAt(0)}</div>

            <div class="user-info">
                <h3>${nome}</h3>
                <p>${descricao}</p>
            </div>

            <span class="added-label">✓ Adicionado</span>
        `;

        document.getElementById("acceptedList").appendChild(novoAmigo);

        card.remove();

        const lista = document.getElementById("pendingList");
        const mensagem = document.getElementById("emptyPending");

        mensagem.style.display =
            lista.children.length === 0 ? "block" : "none";
    };

});
