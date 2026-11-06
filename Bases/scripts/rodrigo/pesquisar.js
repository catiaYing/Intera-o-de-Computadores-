document.addEventListener("DOMContentLoaded", function () {

    const pesquisa = document.getElementById("pesquisa");
    const lista = document.getElementById("lista-festivais");
    const contador = document.getElementById("contador");
    const semResultados = document.getElementById("sem-resultados");
    const filtros = document.querySelectorAll(".filtro");

    let mesAtual = "todos";

    function atualizarLista() {

        const texto = pesquisa.value.toLowerCase().trim();

        let visiveis = 0;

        lista.querySelectorAll(".festival").forEach(function (festival) {

            const correspondeMes =
                mesAtual === "todos" ||
                festival.dataset.mes === mesAtual;

            const correspondeTexto =
                festival.textContent.toLowerCase().includes(texto);

            const mostrar = correspondeMes && correspondeTexto;

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
    }

    filtros.forEach(function (botao) {

        botao.addEventListener("click", function () {

            filtros.forEach(function (item) {
                item.classList.remove("ativo");
            });

            botao.classList.add("ativo");

            mesAtual = botao.dataset.mes;

            atualizarLista();
        });
    });

    pesquisa.addEventListener("input", atualizarLista);

    atualizarLista();

});
