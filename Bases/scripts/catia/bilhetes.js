
document.addEventListener("DOMContentLoaded", function () {

    // Elementos principais
    const ticketList = document.getElementById("ticketList");
    const selectButton = document.getElementById("selectButton");

    const selectionBar = document.getElementById("selectionBar");
    const cancelSelection = document.getElementById("cancelSelection");
    const deleteSelected = document.getElementById("deleteSelected");
    const selectedCount = document.getElementById("selectedCount");

    const ticketSearch = document.getElementById("ticketSearch");

    // Modais
    const deleteModal = document.getElementById("deleteModal");
    const cancelDelete = document.getElementById("cancelDelete");
    const confirmDelete = document.getElementById("confirmDelete");

    const successModal = document.getElementById("successModal");
    const successButton = document.getElementById("successButton");

    const emptyMessage = document.getElementById("emptyMessage");

    // Estado
    let selectionMode = false;
    let currentMonth = "all";

    // Dados dos festivais (data, mês e imagem)
    const FESTIVAIS = {
        "MEO Alive": { data: "10 – 12 Junho 2027", mes: "6", imagem: "image-one" },
        "Primavera Sound": { data: "12 – 14 Junho 2027", mes: "6", imagem: "image-four" },
        "Sumol Summer Fest": { data: "3 – 4 Julho 2027", mes: "7", imagem: "image-three" },
        "Meo Kalorama": { data: "29 Agosto 2027", mes: "8", imagem: "image-two" }
    };

    function lerBilhetes() {
        try {
            return JSON.parse(localStorage.getItem("bilhetesComprados")) || [];
        } catch (erro) {
            return [];
        }
    }

    // Mostrar apenas os bilhetes efetivamente comprados
    function carregarBilhetes() {

        ticketList.innerHTML = "";

        lerBilhetes().forEach(function (b) {

            const info = FESTIVAIS[b.festival] ||
                { data: "", mes: "", imagem: "image-one" };

            const artigo = document.createElement("article");
            artigo.className = "ticket-item";
            artigo.dataset.month = info.mes;
            artigo.dataset.id = b.id;

            const circulo = document.createElement("div");
            circulo.className = "select-circle";

            const imagem = document.createElement("div");
            imagem.className = "ticket-image " + info.imagem;
            imagem.innerHTML = "<span>♫</span>";

            const detalhes = document.createElement("div");
            detalhes.className = "ticket-details";

            const tipo = document.createElement("span");
            tipo.className = "ticket-type";
            tipo.textContent = String(b.tipo).toUpperCase() +
                (b.quantidade > 1 ? " · ×" + b.quantidade : "");

            const nome = document.createElement("h3");
            nome.textContent = b.festival;

            const data = document.createElement("p");
            data.textContent = info.data;

            const preco = document.createElement("span");
            preco.className = "ticket-price";
            preco.textContent = Number(b.total).toLocaleString("pt-PT", {
                style: "currency",
                currency: "EUR"
            });

            detalhes.append(tipo, nome, data, preco);

            const seta = document.createElement("a");
            seta.href = "bilhete_digital.html";
            seta.className = "ticket-arrow";
            seta.textContent = "›";

            artigo.append(circulo, imagem, detalhes, seta);
            ticketList.appendChild(artigo);
        });
    }

    // Obter bilhetes selecionados
    function getSelectedTickets() {
        return ticketList.querySelectorAll(".ticket-item.selected");
    }

    // Atualizar contador
    function atualizarSelecao() {

        const quantidade = getSelectedTickets().length;

        selectedCount.textContent =
            quantidade + (quantidade === 1
                ? " selecionado"
                : " selecionados");

        deleteSelected.disabled = quantidade === 0;
    }

    // Ativar ou desativar modo de seleção
    selectButton.addEventListener("click", function () {

        selectionMode = !selectionMode;

        document.body.classList.toggle(
            "selection-mode",
            selectionMode
        );

        selectionBar.classList.toggle(
            "show",
            selectionMode
        );

        selectButton.textContent =
            selectionMode ? "Fechar" : "Selecionar";

        // Limpar seleções ao sair do modo
        if (!selectionMode) {

            ticketList.querySelectorAll(".ticket-item.selected")
                .forEach(ticket => {
                    ticket.classList.remove("selected");
                });

        }

        atualizarSelecao();
    });

    // Selecionar ou desselecionar bilhetes
    ticketList.addEventListener("click", function (event) {

        const ticket = event.target.closest(".ticket-item");

        if (!ticket) return;

        // Só permitir seleção no modo Selecionar
        if (!selectionMode) return;

        // Ignorar bilhetes escondidos pelo filtro
        if (ticket.style.display === "none") return;

        ticket.classList.toggle("selected");

        atualizarSelecao();
    });

    // Cancelar seleção
    cancelSelection.addEventListener("click", function () {

        selectionMode = false;

        document.body.classList.remove("selection-mode");

        selectionBar.classList.remove("show");

        selectButton.textContent = "Selecionar";

        ticketList.querySelectorAll(".ticket-item.selected")
            .forEach(ticket => {
                ticket.classList.remove("selected");
            });

        atualizarSelecao();
    });

    // Abrir modal de eliminação
    deleteSelected.addEventListener("click", function () {

        const quantidade = getSelectedTickets().length;

        if (quantidade === 0) return;

        document.getElementById("deleteTitle").textContent =
            quantidade === 1
                ? "Remover 1 bilhete?"
                : "Remover " + quantidade + " bilhetes?";

        document.getElementById("deleteDescription").textContent =
            "Tens a certeza de que queres eliminar os bilhetes selecionados?";

        deleteModal.classList.add("show");
    });

    // Cancelar eliminação
    cancelDelete.addEventListener("click", function () {

        deleteModal.classList.remove("show");

    });

    // Confirmar eliminação
    confirmDelete.addEventListener("click", function () {

        const selecionados = getSelectedTickets();

        if (selecionados.length === 0) return;

        // Remover bilhetes selecionados (também do armazenamento)
        const idsRemovidos = Array.from(selecionados).map(t => t.dataset.id);

        try {
            localStorage.setItem(
                "bilhetesComprados",
                JSON.stringify(lerBilhetes().filter(
                    b => !idsRemovidos.includes(String(b.id))
                ))
            );
        } catch (erro) {}

        selecionados.forEach(ticket => {
            ticket.remove();
        });

        deleteModal.classList.remove("show");

        // Sair do modo de seleção
        selectionMode = false;

        document.body.classList.remove("selection-mode");

        selectionBar.classList.remove("show");

        selectButton.textContent = "Selecionar";

        atualizarLista();

        // Mostrar sucesso
        successModal.classList.add("show");
    });

    // Fechar modal de sucesso
    successButton.addEventListener("click", function () {

        successModal.classList.remove("show");

    });

    // Fechar modal ao clicar no fundo
    deleteModal.addEventListener("click", function (event) {

        if (event.target === deleteModal) {
            deleteModal.classList.remove("show");
        }

    });

    successModal.addEventListener("click", function (event) {

        if (event.target === successModal) {
            successModal.classList.remove("show");
        }

    });

    // Filtro por mês
    document.querySelectorAll(".category").forEach(button => {

        button.addEventListener("click", function () {

            document.querySelectorAll(".category").forEach(item => {
                item.classList.remove("active");
            });

            this.classList.add("active");

            currentMonth = this.dataset.month;

            atualizarLista();

        });

    });

    // Pesquisa por nome do festival
    ticketSearch.addEventListener("input", atualizarLista);

    // Atualizar lista de bilhetes
    function atualizarLista() {

        const pesquisa = ticketSearch.value
            .toLowerCase()
            .trim();

        const tickets = ticketList.querySelectorAll(".ticket-item");

        let visiveis = 0;

        tickets.forEach(ticket => {

            const nome = ticket.textContent.toLowerCase();

            const mes = ticket.dataset.month;

            const correspondeMes =
                currentMonth === "all" ||
                mes === currentMonth;

            const correspondePesquisa =
                nome.includes(pesquisa);

            const mostrar =
                correspondeMes && correspondePesquisa;

            ticket.style.display = mostrar ? "flex" : "none";

            if (mostrar) {
                visiveis++;
            }

        });

        // Mostrar mensagem quando não existem resultados
        emptyMessage.hidden = visiveis !== 0;

        atualizarSelecao();
    }

    // Inicializar página
    carregarBilhetes();
    atualizarLista();

});
