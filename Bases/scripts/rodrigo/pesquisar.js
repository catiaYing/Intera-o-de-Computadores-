"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const pesquisa = document.getElementById("pesquisa");
    const lista = document.getElementById("lista-festivais");
    const contador = document.getElementById("contador");
    const semResultados = document.getElementById("sem-resultados");
    const ordenar = document.getElementById("ordenar");

    // Botões principais e modal
    const btnTodos = document.getElementById("btn-todos");
    const btnAbrirFiltros = document.getElementById("btn-abrir-filtros");
    const badgeFiltros = document.getElementById("badge-filtros");
    const modalFiltros = document.getElementById("modal-filtros");
    const btnFecharModal = document.getElementById("fechar-modal-filtros");
    const btnLimparModal = document.getElementById("limpar-modal-filtros");
    const btnAplicarFiltros = document.getElementById("aplicar-filtros");
    const opcoesFiltro = document.querySelectorAll(".opcao-chip");

    const estado = {
        mes: "todos",
        zona: "todas",
        preco: "todos"
    };

    function verificarPreco(precoFestival, faixa) {
        if (faixa === "todos") return true;
        if (faixa === "ate50") return precoFestival <= 50;
        if (faixa === "50a70") return precoFestival > 50 && precoFestival <= 70;
        if (faixa === "mais70") return precoFestival > 70;
        return true;
    }

    function atualizarBotoesTopo() {
        let ativos = 0;
        if (estado.mes !== "todos") ativos++;
        if (estado.zona !== "todas") ativos++;
        if (estado.preco !== "todos") ativos++;

        if (ativos === 0) {
            btnTodos.classList.add("ativo");
            btnAbrirFiltros.classList.remove("ativo");
            badgeFiltros.hidden = true;
        } else {
            btnTodos.classList.remove("ativo");
            btnAbrirFiltros.classList.add("ativo");
            badgeFiltros.textContent = ativos;
            badgeFiltros.hidden = false;
        }
    }

    function sincronizarChipsModal() {
        opcoesFiltro.forEach(function (chip) {
            const grupo = chip.dataset.grupo;
            const valor = chip.dataset.valor;
            chip.classList.toggle("ativo", estado[grupo] === valor);
        });
    }

    function corresponde(festival, est, texto) {
        return (est.mes === "todos" || festival.dataset.mes === est.mes) &&
            (est.zona === "todas" || festival.dataset.zona === est.zona) &&
            verificarPreco(Number(festival.dataset.preco), est.preco) &&
            festival.textContent.toLocaleLowerCase("pt-PT").includes(texto);
    }

    // Mostra em cada opção do modal quantos festivais teria, antes de aplicar
    function atualizarContagensChips() {
        const texto = pesquisa.value.toLocaleLowerCase("pt-PT").trim();
        const cartoes = Array.from(lista.querySelectorAll(".festival"));

        opcoesFiltro.forEach(function (chip) {
            const hipotese = Object.assign({}, estado);
            hipotese[chip.dataset.grupo] = chip.dataset.valor;

            const n = cartoes.filter(function (f) {
                return corresponde(f, hipotese, texto);
            }).length;

            let badge = chip.querySelector(".chip-contagem");
            if (!badge) {
                badge = document.createElement("span");
                badge.className = "chip-contagem";
                chip.appendChild(badge);
            }
            badge.textContent = n;
            chip.classList.toggle("sem-resultados-chip", n === 0);
            chip.setAttribute("aria-label",
                chip.firstChild.textContent.trim() + ": " + n +
                (n === 1 ? " festival" : " festivais"));
        });
    }

    function atualizarLista() {

        const texto = pesquisa.value.toLocaleLowerCase("pt-PT").trim();
        const cartoes = Array.from(lista.querySelectorAll(".festival"));

        // Ordenar cartões
        cartoes.sort(function (a, b) {
            if (ordenar.value === "preco-asc") {
                return Number(a.dataset.preco) - Number(b.dataset.preco);
            }
            if (ordenar.value === "preco-desc") {
                return Number(b.dataset.preco) - Number(a.dataset.preco);
            }
            return Number(a.dataset.ordem) - Number(b.dataset.ordem);
        });

        let visiveis = 0;

        cartoes.forEach(function (festival) {
            lista.appendChild(festival);

            const mostrar = corresponde(festival, estado, texto);

            festival.hidden = !mostrar;
            festival.style.display = mostrar ? "flex" : "none";

            if (mostrar) {
                visiveis++;
            }
        });

        contador.textContent =
            visiveis + (visiveis === 1
                ? " festival encontrado"
                : " festivais encontrados");

        semResultados.hidden = visiveis !== 0;

        atualizarBotoesTopo();
        atualizarContagensChips();
    }

    // Carregar em "Todos" repõe todos os filtros
    btnTodos.addEventListener("click", function () {
        estado.mes = "todos";
        estado.zona = "todas";
        estado.preco = "todos";
        sincronizarChipsModal();
        atualizarLista();
    });

    // Abrir modal ao carregar em "Filtrar"
    btnAbrirFiltros.addEventListener("click", function () {
        sincronizarChipsModal();
        modalFiltros.classList.add("show");
    });

    btnFecharModal.addEventListener("click", function () {
        modalFiltros.classList.remove("show");
    });

    modalFiltros.addEventListener("click", function (evento) {
        if (evento.target === modalFiltros) {
            modalFiltros.classList.remove("show");
        }
    });

    // Seleção de opções dentro do modal
    opcoesFiltro.forEach(function (chip) {
        chip.addEventListener("click", function () {
            const grupo = chip.dataset.grupo;
            const valor = chip.dataset.valor;

            document
                .querySelectorAll('.opcao-chip[data-grupo="' + grupo + '"]')
                .forEach(function (item) {
                    item.classList.remove("ativo");
                });

            chip.classList.add("ativo");
            estado[grupo] = valor;
            atualizarContagensChips();
        });
    });

    // Limpar dentro do modal
    btnLimparModal.addEventListener("click", function () {
        estado.mes = "todos";
        estado.zona = "todas";
        estado.preco = "todos";
        sincronizarChipsModal();
        atualizarContagensChips();
    });

    // Aplicar e fechar modal
    btnAplicarFiltros.addEventListener("click", function () {
        modalFiltros.classList.remove("show");
        atualizarLista();
    });

    pesquisa.addEventListener("input", atualizarLista);
    ordenar.addEventListener("change", atualizarLista);

    atualizarLista();

});