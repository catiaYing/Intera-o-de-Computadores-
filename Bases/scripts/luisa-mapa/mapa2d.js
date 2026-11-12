/* BANDy - Mapa 2D */

// Elementos da página

const seletorFestival = document.getElementById("festival");
const seletorPonto = document.getElementById("ponto");

const painelEscolha = document.getElementById("painel-escolha");
const mapa = document.getElementById("mapa-recinto");
const marcadores = document.getElementById("marcadores");
const rota = document.getElementById("linha-rota");

const inicio = document.getElementById("origem");
const entrada = document.getElementById("local-entrada");
const personalizado = document.getElementById("ponto-personalizado");

const confirmar = document.getElementById("confirmar-ponto");
const mensagem = document.getElementById("mensagem-confirmacao");
const ajuda = document.getElementById("ajuda-mapa");


// Colocar um elemento no mapa

function colocar(elemento, posicao) {
    elemento.style.left = posicao[0] + "%";
    elemento.style.top = posicao[1] + "%";
}


// Atualizar os seletores

function sincronizar() {
    seletorFestival.value = festivalAtual;
    seletorPonto.value = pontoAtual;
}


// Desenhar o mapa e a rota

function desenhar() {
    const festival = festivais[festivalAtual];

    // Mostrar o cenário correto
    mapa.className = "mapa-recinto " + festivalAtual;

    // Localização do utilizador e entrada
    colocar(inicio, festival.origem);
    colocar(entrada, festival.entrada);

    // Evitar que a etiqueta tape o ponto azul
    entrada.style.transform = "translate(-50%, 14px)";

    // Limpar os marcadores anteriores
    marcadores.innerHTML = "";

    // Criar os quatro palcos
    for (const id in festival.palcos) {

        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "marcador palco";
        botao.textContent = nomesPontos[id];

        colocar(botao, festival.palcos[id]);

        if (pontoAtual === id) {
            botao.classList.add("ativo");
        }

        // Escolher um palco
        botao.addEventListener("click", function(evento) {
            evento.stopPropagation();

            if (origemChat) {
                return;
            }

            escolherPonto(id);

            sincronizar();
            desenhar();

            mensagem.textContent = "";
        });

        marcadores.appendChild(botao);
    }

    // Mostrar o ponto personalizado
    personalizado.hidden = (
        pontoAtual !== "livre" || !pontoLivre
    );

    if (pontoAtual === "livre" && pontoLivre) {
        colocar(personalizado, pontoLivre);
    }

    // Desenhar a linha verde com SVG
    const pontos = percurso();

    const coordenadas = pontos.map(function(p) {
        return p[0] + "," + p[1];
    });

    rota.setAttribute(
        "points",
        coordenadas.join(" ")
    );

    atualizarTitulo();
    links();
}


// Alterar Festival

seletorFestival.addEventListener("change", function() {

    if (origemChat) {
        sincronizar();
        return;
    }

    festivalAtual = seletorFestival.value;

    pontoAtual = "palco-x";
    pontoLivre = null;

    guardar();
    sincronizar();
    desenhar();

    mensagem.textContent = "";
});


// Alterar destino

seletorPonto.addEventListener("change", function() {

    if (origemChat) {
        sincronizar();
        return;
    }

    if (seletorPonto.value === "livre" && !pontoLivre) {
        alert("Toca no mapa para escolher um ponto.");
        sincronizar();
        return;
    }

    escolherPonto(seletorPonto.value);

    sincronizar();
    desenhar();

    mensagem.textContent = "";
});


// Escolher um ponto personalizado no mapa

mapa.addEventListener("click", function(evento) {

    if (origemChat) {
        return;
    }

    // Não selecionar quando se clica num palco
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

    sincronizar();
    desenhar();

    mensagem.textContent = "";
});


// Confirmar ponto

confirmar.addEventListener("click", function() {

    guardar();

    mensagem.textContent =
        "✓ Ponto de encontro confirmado!";
});


// Configurar a navegação vinda do Chat

function configurarChat() {

    if (!origemChat) {
        return;
    }

    // O ponto já foi combinado
    painelEscolha.hidden = true;
    confirmar.hidden = true;

    seletorFestival.disabled = true;
    seletorPonto.disabled = true;

    mapa.style.cursor = "default";

    mensagem.textContent =
        "✓ Ponto de encontro confirmado no Chat.";

    ajuda.textContent =
        "Segue o percurso até ao ponto de encontro combinado.";

    // Voltar à conversa
    const voltar = document.getElementById("voltar-mapa");

    const dados = new URLSearchParams({
        user: contactoChat,
        festival: festivalAtual
    });

    voltar.href = "../catia/chat.html?" + dados.toString();
}


// Iniciar

sincronizar();
configurarChat();
desenhar();
