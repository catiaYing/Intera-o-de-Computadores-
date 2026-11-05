
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

    // Recuperar os pedidos que já foram enviados
    function obterPedidosEnviados() {
        try {
            return JSON.parse(localStorage.getItem("pedidosEnviados")) || [];
        } catch (error) {
            return [];
        }
    }

    // Criar resultados de pesquisa
    function mostrarResultados(pesquisa) {

        resultsList.innerHTML = "";

        if (pesquisa === "") {
            resultsSection.style.display = "none";
            return;
        }

        const resultados = utilizadores.filter(user =>
            user.nome.toLowerCase().includes(pesquisa) ||
            user.id.includes(pesquisa) ||
            user.telefone.includes(pesquisa)
        );

        resultsSection.style.display = "block";
        noResults.style.display = resultados.length === 0 ? "block" : "none";

        resultados.forEach(user => {

            const card = document.createElement("div");
            card.className = "user-card";

            const info = document.createElement("div");
            info.className = "user-info";

            const nome = document.createElement("h3");
            nome.textContent = user.nome;

            const id = document.createElement("p");
            id.textContent = "ID: " + user.id;

            info.appendChild(nome);
            info.appendChild(id);

            const button = document.createElement("button");
            button.className = "action-button";

            const pedidosEnviados = obterPedidosEnviados();
            const jaEnviado = pedidosEnviados.some(
                pedido => String(pedido.id) === String(user.id)
            );

            if (jaEnviado) {
                button.textContent = "Pedido enviado";
                button.classList.add("sent-button");
                button.disabled = true;
            } else {
                button.textContent = "Adicionar";

                button.addEventListener("click", function () {

                    // Guardar o destinatário, mas ainda NÃO marcar como enviado
                    sessionStorage.setItem(
                        "destinatarioPedido",
                        JSON.stringify(user)
                    );

                    // Abrir a página de pedido de amizade
                    window.location.href = "pedido_amizade.html";
                });
            }

            card.appendChild(info);
            card.appendChild(button);

            resultsList.appendChild(card);
        });
    }

    // Pesquisar novos utilizadores
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            mostrarResultados(this.value.trim().toLowerCase());
        });
    }

    // Aceitar pedido de amizade recebido
    window.aceitarPedido = function (button) {

        const card = button.closest(".user-card");

        if (!card) return;

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

        if (mensagem && lista) {
            mensagem.style.display =
                lista.children.length === 0 ? "block" : "none";
        }
    };

});
