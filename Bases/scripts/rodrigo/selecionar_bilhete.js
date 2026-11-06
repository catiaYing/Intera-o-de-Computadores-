document.addEventListener("DOMContentLoaded", function () {

    const MAXIMO = 8;
    const MINIMO = 1;

    const opcoes = document.querySelectorAll(".opcao");
    const diminuir = document.getElementById("diminuir");
    const aumentar = document.getElementById("aumentar");
    const quantidadeEl = document.getElementById("quantidade");
    const totalEl = document.getElementById("total");
    const continuar = document.getElementById("continuar");
    const mensagem = document.getElementById("mensagem");
    const nomeFestival = document.getElementById("nome-festival");

    let tipoSelecionado = null;
    let precoUnitario = 0;
    let quantidade = 1;

    const parametros = new URLSearchParams(window.location.search);
    const festival = parametros.get("festival");

    if (festival) {
        nomeFestival.textContent = festival;
        document.title = "Selecionar bilhete - " + festival;
    }

    function formatarPreco(valor) {
        return valor.toFixed(2).replace(".", ",") + " €";
    }

    function atualizar() {

        quantidadeEl.textContent = quantidade;

        diminuir.disabled = quantidade <= MINIMO;
        aumentar.disabled = quantidade >= MAXIMO;

        totalEl.textContent = formatarPreco(precoUnitario * quantidade);

        continuar.disabled = tipoSelecionado === null;
    }

    opcoes.forEach(function (opcao) {

        opcao.addEventListener("click", function () {

            const jaSelecionada = opcao.classList.contains("selecionada");

            opcoes.forEach(function (item) {
                item.classList.remove("selecionada");
            });

            if (jaSelecionada) {

                tipoSelecionado = null;
                precoUnitario = 0;

            } else {

                opcao.classList.add("selecionada");

                tipoSelecionado = opcao.dataset.tipo;
                precoUnitario = Number(opcao.dataset.preco);
            }

            mensagem.textContent = "";

            atualizar();
        });
    });

    diminuir.addEventListener("click", function () {

        if (quantidade > MINIMO) {
            quantidade--;
        }

        mensagem.textContent = "";

        atualizar();
    });

    aumentar.addEventListener("click", function () {

        if (quantidade < MAXIMO) {
            quantidade++;
            mensagem.textContent = "";
        } else {
            mensagem.textContent =
                "Só podes comprar até " + MAXIMO + " bilhetes por compra.";
        }

        atualizar();
    });

    continuar.addEventListener("click", function () {

        if (tipoSelecionado === null) return;

        try {
            sessionStorage.setItem("bandyCompra", JSON.stringify({
                festival: nomeFestival.textContent,
                tipo: tipoSelecionado,
                preco: precoUnitario,
                quantidade: quantidade
            }));
        } catch (erro) {
        }

        window.location.href = "../luisa/pagamento.html";
    });

    atualizar();

});
