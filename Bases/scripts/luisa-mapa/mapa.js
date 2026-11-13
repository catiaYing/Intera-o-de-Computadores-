/* BANDy - Dados dos mapas */

// Dados ilustrativos dos três festivais

const festivais = {
    alive: {
        nome: "NOS Alive",
        origem: [12, 85],
        entrada: [12, 85],

        palcos: {
            "palco-x": [20, 20],
            "side-stage": [80, 20],
            "palco-y": [75, 65],
            "palco-z": [35, 55]
        },

        corredor: 45
    },

    kalorama: {
        nome: "MEO Kalorama",
        origem: [50, 90],
        entrada: [50, 90],

        palcos: {
            "palco-x": [75, 18],
            "side-stage": [20, 30],
            "palco-y": [25, 65],
            "palco-z": [75, 70]
        },

        corredor: 52
    },

    primavera: {
        nome: "Primavera Sound",
        origem: [85, 85],
        entrada: [85, 85],

        palcos: {
            "palco-x": [18, 65],
            "side-stage": [70, 20],
            "palco-y": [25, 25],
            "palco-z": [65, 60]
        },

        corredor: 45
    }
};


// Nomes utilizados no Chat e no mapa

const nomesPontos = {
    "palco-x": "Palco X",
    "side-stage": "Side Stage",
    "palco-y": "Palco Y",
    "palco-z": "Palco Z",
    "livre": "Ponto personalizado"
};


// Ler os parâmetros do endereço

const params = new URLSearchParams(
    window.location.search
);

const origemChat = params.get("origem") === "chat";
const contactoChat = params.get("user") || "maria";


// Festival escolhido

let festivalAtual =
    params.get("festival") ||
    localStorage.getItem("festivalMapa") ||
    "alive";

if (!festivais[festivalAtual]) {
    festivalAtual = "alive";
}


// Ponto escolhido

let pontoAtual =
    params.get("ponto") ||
    localStorage.getItem("pontoMapa") ||
    "palco-x";

if (!nomesPontos[pontoAtual]) {
    pontoAtual = "palco-x";
}


// Ponto personalizado

let pontoLivre = null;

try {
    const guardado = JSON.parse(
        localStorage.getItem("pontoLivreMapa")
    );

    if (
        guardado &&
        guardado.festival === festivalAtual &&
        Number.isFinite(guardado.x) &&
        Number.isFinite(guardado.y)
    ) {
        pontoLivre = [guardado.x, guardado.y];
    }
} catch (erro) {
    pontoLivre = null;
}


// Ler coordenadas personalizadas do URL

if (params.has("x") && params.has("y")) {
    const x = Number(params.get("x"));
    const y = Number(params.get("y"));

    if (Number.isFinite(x) && Number.isFinite(y)) {
        pontoLivre = [
            Math.max(5, Math.min(95, x)),
            Math.max(5, Math.min(95, y))
        ];
    }
}

if (pontoAtual === "livre" && !pontoLivre) {
    pontoAtual = "palco-x";
}


// Guardar a escolha do utilizador

function guardar() {
    localStorage.setItem("festivalMapa", festivalAtual);
    localStorage.setItem("pontoMapa", pontoAtual);

    if (pontoLivre) {
        localStorage.setItem(
            "pontoLivreMapa",
            JSON.stringify({
                festival: festivalAtual,
                x: pontoLivre[0],
                y: pontoLivre[1]
            })
        );
    }
}


// Obter as coordenadas do destino

function destino() {
    if (pontoAtual === "livre") {
        return pontoLivre;
    }

    return festivais[festivalAtual].palcos[pontoAtual];
}


// Criar uma rota ilustrativa

function percurso() {
    const festival = festivais[festivalAtual];

    const inicio = festival.origem;
    const fim = destino();
    const corredor = festival.corredor;

    if (!fim) {
        return [inicio];
    }

    // No Kalorama, o corredor principal
    // é horizontal.

    if (festivalAtual === "kalorama") {
        return [
            inicio,
            [inicio[0], corredor],
            [fim[0], corredor],
            fim
        ];
    }

    // Nos outros festivais,
    // o corredor principal é vertical.

    return [
        inicio,
        [corredor, inicio[1]],
        [corredor, fim[1]],
        fim
    ];
}


// Criar links entre Mapa 2D e AR

function urlPagina(pagina) {
    const dados = new URLSearchParams({
        festival: festivalAtual,
        ponto: pontoAtual
    });

    if (origemChat) {
        dados.set("origem", "chat");
        dados.set("user", contactoChat);
    }

    if (pontoAtual === "livre" && pontoLivre) {
        dados.set("x", pontoLivre[0]);
        dados.set("y", pontoLivre[1]);
    }

    return pagina + "?" + dados.toString();
}


// Atualizar os links das páginas

function links() {
    document.querySelectorAll("[data-link]").forEach(
        function(elemento) {
            elemento.href = urlPagina(
                elemento.dataset.link
            );
        }
    );
}


// Atualizar os nomes apresentados

function atualizarTitulo() {
    document.querySelectorAll(
        "[data-festival-nome]"
    ).forEach(function(elemento) {
        elemento.textContent =
            festivais[festivalAtual].nome;
    });

    document.querySelectorAll(
        "[data-ponto-nome]"
    ).forEach(function(elemento) {
        elemento.textContent =
            nomesPontos[pontoAtual];
    });
}


// Escolher outro destino

function escolherPonto(ponto) {

    // Não alterar convites confirmados no Chat
    if (origemChat) {
        return;
    }

    if (ponto === "livre" && !pontoLivre) {
        return;
    }

    if (
        ponto !== "livre" &&
        !festivais[festivalAtual].palcos[ponto]
    ) {
        return;
    }

    pontoAtual = ponto;

    guardar();
    atualizarTitulo();
    links();
}


// Guardar o estado inicial

guardar();
