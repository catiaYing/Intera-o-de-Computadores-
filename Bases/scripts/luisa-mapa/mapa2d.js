/* BANDy - Mapa 2D */

const seletorFestival = document.getElementById("festival");
const seletorPonto = document.getElementById("ponto");

const mapa = document.getElementById("mapa-recinto");
const marcadores = document.getElementById("marcadores");
const rota = document.getElementById("linha-rota");

const inicio = document.getElementById("origem");
const entrada = document.getElementById("local-entrada");
const personalizado = document.getElementById("ponto-personalizado");

function colocar(elemento, posicao) {
    elemento.style.left = posicao[0] + "%";
    elemento.style.top = posicao[1] + "%";
}

function desenhar() {
    const festival = festivais[festivalAtual];

    mapa.className = "mapa-recinto " + festivalAtual;

    // Posição do utilizador e entrada
    colocar(inicio, festival.origem);
    colocar(entrada, festival.entrada);

    // Desenhar os quatro palcos
    marcadores.innerHTML = "";

    Object.keys(festival.palcos).forEach(function(id) {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "marcador palco";

        if (pontoAtual === id) {
            botao.classList.add("ativo");
        }

        botao.textContent = nomesPontos[id];
        botao.title = nomesPontos[id];

        colocar(botao, festival.palcos[id]);

        botao.addEventListener("click", function(evento) {
            evento.stopPropagation();

            escolherPonto(id);
            seletorPonto.value = id;

            desenhar();
        });

        marcadores.appendChild(botao);
    });

    // Ponto personalizado
    personalizado.hidden = !(
        pontoAtual === "livre" && pontoLivre
    );

    if (!personalizado.hidden) {
        colocar(personalizado, pontoLivre);
    }

    // Rota em SVG: coordenadas 0 a 100
    const pontosRota = percurso().map(function(posicao) {
        return posicao[0] + "," + posicao[1];
    });

    rota.setAttribute("points", pontosRota.join(" "));

    atualizarTitulo();
    links();
}

function sincronizar() {
    seletorFestival.value = festivalAtual;
    seletorPonto.value = pontoAtual;
}

// Alterar festival

seletorFestival.addEventListener("change", function() {
    festivalAtual = seletorFestival.value;
    pontoAtual = "palco-x";
    pontoLivre = null;

    guardar();
    sincronizar();
    desenhar();
});

// Alterar destino

seletorPonto.addEventListener("change", function() {
    escolherPonto(seletorPonto.value);
    desenhar();
});

// Escolher um ponto livre no mapa

mapa.addEventListener("click", function(evento) {
    if (evento.target.closest("button")) {
        return;
    }

    const limites = mapa.getBoundingClientRect();

    const x = (
        evento.clientX - limites.left
    ) / limites.width * 100;

    const y = (
        evento.clientY - limites.top
    ) / limites.height * 100;

    pontoLivre = [
        Math.round(Math.max(5, Math.min(95, x))),
        Math.round(Math.max(5, Math.min(95, y)))
    ];

    escolherPonto("livre");

    seletorPonto.value = "livre";

    desenhar();
});

// Confirmar ponto

document.getElementById("confirmar-ponto")
    .addEventListener("click", function() {
        guardar();

        document.getElementById(
            "mensagem-confirmacao"
        ).textContent = "✓ Ponto de encontro confirmado!";
    });

sincronizar();
desenhar();
