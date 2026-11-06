
const params = new URLSearchParams(window.location.search);
const nome = params.get("festival") || "MEO Alive";

const dados = {
    "MEO Alive": {
        local: "Algés, Lisboa",
        data: "10 – 12 Junho 2027",
        precos: [45, 120, 190]
    },
    "Primavera Sound": {
        local: "Porto",
        data: "12 – 14 Junho 2027",
        precos: [75, 180, 250]
    },
    "Sumol Summer Fest": {
        local: "Ericeira",
        data: "3 – 4 Julho 2027",
        precos: [45, 80, 120]
    },
    "Meo Kalorama": {
        local: "Lisboa",
        data: "29 Agosto 2027",
        precos: [65, 110, 170]
    }
};

const festival = dados[nome];

if (!festival) {
    window.location.replace("pesquisar.html");
} else {
    iniciarSelecao();
}

function iniciarSelecao() {
    document.getElementById("nome-festival").textContent = nome;

    document.getElementById("info-festival").textContent =
        festival.local + " · " + festival.data;

    document.getElementById("voltar-detalhes").href =
        "../luisa/detalhes.html?festival=" +
        encodeURIComponent(nome);

    const opcoes = document.querySelectorAll(".opcao");
    const quantidadeTexto = document.getElementById("quantidade");
    const totalTexto = document.getElementById("total");
    const continuar = document.getElementById("continuar");
    const mensagem = document.getElementById("mensagem");

    let quantidade = 1;
    let tipo = null;
    let preco = 0;

    function formatar(valor) {
        return valor.toFixed(2).replace(".", ",") + " €";
    }

    function atualizarTotal() {
        quantidadeTexto.textContent = quantidade;
        totalTexto.textContent = formatar(preco * quantidade);
    }

    opcoes.forEach(function(opcao, index) {
        const valor = festival.precos[index];

        opcao.dataset.preco = valor;

        opcao.querySelector(".opcao-preco").textContent =
            formatar(valor);

        opcao.addEventListener("click", function() {
            opcoes.forEach(function(item) {
                item.classList.remove("ativo");
                item.setAttribute("aria-pressed", "false");
            });

            opcao.classList.add("ativo");
            opcao.setAttribute("aria-pressed", "true");

            tipo = opcao.dataset.tipo;
            preco = Number(opcao.dataset.preco);

            continuar.disabled = false;
            mensagem.textContent = "";

            atualizarTotal();
        });
    });

    document.getElementById("aumentar").onclick = function() {
        if (quantidade < 10) {
            quantidade++;
            atualizarTotal();
        }
    };

    document.getElementById("diminuir").onclick = function() {
        if (quantidade > 1) {
            quantidade--;
            atualizarTotal();
        }
    };

    continuar.onclick = function() {
        if (!tipo || preco <= 0) {
            mensagem.textContent = "Seleciona um tipo de bilhete.";
            return;
        }

        const compra = {
            festival: nome,
            tipo: tipo,
            preco: preco,
            quantidade: quantidade,
            total: preco * quantidade
        };

        sessionStorage.setItem(
            "bandyCompra",
            JSON.stringify(compra)
        );

        const destino = new URL(
            "../luisa/pagamento.html",
            window.location.href
        );

        Object.entries(compra).forEach(function([chave, valor]) {
            destino.searchParams.set(chave, valor);
        });

        window.location.href = destino.href;
    };

    atualizarTotal();
}
