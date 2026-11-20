
/* ==========================================
   BANDy - Selecionar Bilhete
   Ligação com a página de Pagamento
   ========================================== */


/* ===== 1. IDENTIFICAR FESTIVAL ===== */

const params = new URLSearchParams(window.location.search);

const nome = params.get("festival") || "MEO Alive";


/* ===== 2. DADOS DOS FESTIVAIS ===== */

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


/* ===== 3. VERIFICAR FESTIVAL ===== */

const festival = dados[nome];

if (!festival) {

    window.location.replace("pesquisar.html");

} else {

    iniciarSelecao();

}


/* ===== 4. INICIAR SELEÇÃO ===== */

function iniciarSelecao() {

    /* Mostrar nome do festival */

    document.getElementById("nome-festival").textContent = nome;

    document.getElementById("info-festival").textContent =
        festival.local + " · " + festival.data;


    /* Voltar à página Detalhes */

    document.getElementById("voltar-detalhes").href =
        "../detalhes.html?festival=" +
        encodeURIComponent(nome);


    /* ===== 5. ELEMENTOS ===== */

    const opcoes = document.querySelectorAll(".opcao");

    const quantidadeTexto = document.getElementById("quantidade");

    const totalTexto = document.getElementById("total");

    const continuar = document.getElementById("continuar");

    const mensagem = document.getElementById("mensagem");


    /* ===== 6. DADOS DA SELEÇÃO ===== */

    let quantidade = 1;

    let tipo = null;

    let preco = 0;


    /* ===== 7. FORMATAR PREÇO ===== */

    function formatar(valor) {

        return valor.toFixed(2).replace(".", ",") + " €";

    }


    /* ===== 8. ATUALIZAR TOTAL ===== */

    function atualizarTotal() {

        quantidadeTexto.textContent = quantidade;

        totalTexto.textContent = formatar(preco * quantidade);

    }


    /* ===== 9. ESCOLHER TIPO DE BILHETE ===== */

    opcoes.forEach(function(opcao, index) {

        const valor = festival.precos[index];

        opcao.dataset.preco = valor;

        opcao.querySelector(".opcao-preco").textContent =
            formatar(valor);


        opcao.addEventListener("click", function() {

            /* Remover seleção anterior */

            opcoes.forEach(function(item) {

                item.classList.remove("ativo");

                item.setAttribute("aria-pressed", "false");

            });


            /* Selecionar bilhete */

            opcao.classList.add("ativo");

            opcao.setAttribute("aria-pressed", "true");

            tipo = opcao.dataset.tipo;

            preco = Number(opcao.dataset.preco);


            /* Ativar botão Continuar */

            continuar.disabled = false;

            mensagem.textContent = "";

            atualizarTotal();

        });

    });


    /* ===== 10. AUMENTAR QUANTIDADE ===== */

    document.getElementById("aumentar").onclick = function() {

        if (quantidade < 10) {

            quantidade++;

            atualizarTotal();

        }

    };


    /* ===== 11. DIMINUIR QUANTIDADE ===== */

    document.getElementById("diminuir").onclick = function() {

        if (quantidade > 1) {

            quantidade--;

            atualizarTotal();

        }

    };


    /* ===== 12. CONTINUAR PARA PAGAMENTO ===== */

    continuar.onclick = function() {

        /* Verificar se existe um bilhete selecionado */

        if (!tipo || preco <= 0) {

            mensagem.textContent =
                "Seleciona um tipo de bilhete.";

            return;

        }


        /* Criar dados da compra */

        const compra = {

            festival: nome,

            tipo: tipo,

            preco: preco,

            quantidade: quantidade,

            total: preco * quantidade

        };


        /* Guardar dados para a página Pagamento */

        sessionStorage.setItem(
            "bandyCompra",
            JSON.stringify(compra)
        );


        /* Abrir página da Luisa */

        const destino = new URL(
            "../luisa-pagamento/pagamento.html",
            window.location.href
        );


        /* Enviar dados também pelo URL */

        Object.entries(compra).forEach(function([chave, valor]) {

            destino.searchParams.set(chave, valor);

        });


        /* Navegar para Pagamento */

        window.location.href = destino.href;

    };


    /* ===== 13. MOSTRAR TOTAL INICIAL ===== */

    atualizarTotal();

}
