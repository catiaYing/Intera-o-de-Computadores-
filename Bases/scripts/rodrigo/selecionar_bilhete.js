/* Selecionar Bilhete com ligação com a página de Pagamento*/


/* 1. IDENTIFICAR FESTIVAL  */

const params = new URLSearchParams(window.location.search);

const nome = params.get("festival") || "NOS Alive";


/*  2. DADOS DOS FESTIVAIS  */

const dados = {

    "NOS Alive": {
        local: "Algés, Lisboa",
        data: "10 – 12 Junho 2027",
        dias: ["10 Junho 2027", "11 Junho 2027", "12 Junho 2027"],
        precos: [45, 120, 190]
    },

    "Primavera Sound": {
        local: "Porto",
        data: "12 – 14 Junho 2027",
        dias: ["12 Junho 2027", "13 Junho 2027", "14 Junho 2027"],
        precos: [75, 180, 250]
    },

    "Sumol Summer Fest": {
        local: "Ericeira",
        data: "3 – 4 Julho 2027",
        dias: ["3 Julho 2027", "4 Julho 2027"],
        precos: [45, 80, 120]
    },

    "Meo Kalorama": {
        local: "Lisboa",
        data: "29 Agosto 2027",
        dias: ["29 Agosto 2027"],
        precos: [65, 110, 170]
    }

};


/*3. VERIFICAR FESTIVAL  */

const festival = dados[nome];

if (!festival) {

    window.location.replace("pesquisar.html");

} else {

    iniciarSelecao();

}


/*  4. INICIAR SELEÇÃO  */

function iniciarSelecao() {

    /* Mostrar nome do festival */

    document.getElementById("nome-festival").textContent = nome;

    document.getElementById("info-festival").textContent =
        festival.local + " · " + festival.data;


    /* Voltar à página Detalhes */

    document.getElementById("voltar-detalhes").href =
        "../detalhes.html?festival=" +
        encodeURIComponent(nome);


    const opcoes = document.querySelectorAll(".opcao");

    const secaoDia = document.getElementById("secao-dia");

    const opcoesDia = document.getElementById("opcoes-dia");

    const quantidadeTexto = document.getElementById("quantidade");

    const totalTexto = document.getElementById("total");

    const continuar = document.getElementById("continuar");

    const mensagem = document.getElementById("mensagem");


    /*  6. DADOS DA SELEÇÃO  */

    let quantidade = 1;

    let tipo = null;

    let preco = 0;

    let diaSelecionado = null;


    /*  7. PREÇO  */

    function formatar(valor) {

        return valor.toFixed(2).replace(".", ",") + " €";

    }


    /*  8.  TOTAL  */

    function atualizarTotal() {

        quantidadeTexto.textContent = quantidade;

        totalTexto.textContent = formatar(preco * quantidade);

    }


    /* DIAS DO FESTIVAL  */

    function mostrarDias() {

        opcoesDia.innerHTML = "";
        diaSelecionado = null;

        festival.dias.forEach(function (dia) {

            const botaoDia = document.createElement("button");
            botaoDia.type = "button";
            botaoDia.className = "opcao-dia";
            botaoDia.dataset.dia = dia;
            botaoDia.textContent = dia;
            botaoDia.setAttribute("aria-pressed", "false");

            botaoDia.addEventListener("click", function () {

                opcoesDia.querySelectorAll(".opcao-dia").forEach(function (item) {
                    item.classList.remove("ativo");
                    item.setAttribute("aria-pressed", "false");
                });

                botaoDia.classList.add("ativo");
                botaoDia.setAttribute("aria-pressed", "true");

                diaSelecionado = dia;
                continuar.disabled = false;
                mensagem.textContent = "";
            });

            opcoesDia.appendChild(botaoDia);
        });

        secaoDia.hidden = false;

        /* Se o festival só tiver 1 dia (ex: Meo Kalorama), seleciona logo */
        if (festival.dias.length === 1) {
            opcoesDia.querySelector(".opcao-dia").click();
        } else {
            continuar.disabled = true;
        }
    }


    /* 9. ESCOLHER TIPO DE BILHETE */

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

            mensagem.textContent = "";


            /* Mostrar escolha de dia se for Passe 1 dia */

            if (tipo === "Passe 1 dia") {
                mostrarDias();
            } else {
                secaoDia.hidden = true;
                diaSelecionado = null;
                continuar.disabled = false;
            }

            atualizarTotal();

        });

    });


    /*  10. AUMENTAR QUANTIDADE  */

    document.getElementById("aumentar").onclick = function() {

        if (quantidade < 10) {

            quantidade++;

            atualizarTotal();

        }

    };


    /*  11. DIMINUIR QUANTIDADE  */

    document.getElementById("diminuir").onclick = function() {

        if (quantidade > 1) {

            quantidade--;

            atualizarTotal();

        }

    };


    /*  12. CONTINUAR PARA PAGAMENTO  */

    continuar.onclick = function() {

        /* Verificar se existe um bilhete selecionado */

        if (!tipo || preco <= 0) {

            mensagem.textContent =
                "Seleciona um tipo de bilhete.";

            return;

        }

        /* Verificar se escolheu o dia no Passe 1 dia */

        if (tipo === "Passe 1 dia" && !diaSelecionado) {

            mensagem.textContent =
                "Seleciona o dia do festival.";

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

        if (diaSelecionado) {
            compra.dia = diaSelecionado;
        }


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


        /* Enviar dados pelo URL */

        Object.entries(compra).forEach(function([chave, valor]) {

            destino.searchParams.set(chave, valor);

        });

        window.location.href = destino.href;

    };


    /*  13. MOSTRAR TOTAL INICIAL  */

    atualizarTotal();

}