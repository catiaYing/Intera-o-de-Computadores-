/* BANDy - Navegação AR simulada */

const vista = document.getElementById("vista-ar");
const seta = document.getElementById("seta-ar");
const instrucao = document.getElementById("direcao-ar");
const progresso = document.getElementById("progresso-ar");

const iniciar = document.getElementById("iniciar-ar");
const proximo = document.getElementById("proximo-passo");
const chegar = document.getElementById("cheguei");

let passo = 0;

// Criar instruções a partir da rota 2D

function passos() {
    const pontos = percurso();
    const resultado = [];

    for (let i = 1; i < pontos.length; i++) {
        const dx = pontos[i][0] - pontos[i - 1][0];
        const dy = pontos[i][1] - pontos[i - 1][1];

        // Ignorar segmentos sem movimento
        if (dx === 0 && dy === 0) {
            continue;
        }

        if (Math.abs(dx) >= Math.abs(dy)) {
            resultado.push({
                seta: dx > 0 ? "→" : "←",
                texto: dx > 0
                    ? "Segue para a direita no mapa"
                    : "Segue para a esquerda no mapa"
            });
        } else {
            resultado.push({
                seta: dy > 0 ? "↓" : "↑",
                texto: dy > 0
                    ? "Segue para baixo no mapa"
                    : "Segue para cima no mapa"
            });
        }
    }

    return resultado;
}

// Atualizar a simulação

function mostrar() {
    const lista = passos();

    vista.className = "vista-ar " + festivalAtual;

    atualizarTitulo();

    document.getElementById("destino-ar").textContent =
        nomesPontos[pontoAtual];

    if (passo >= lista.length) {
        seta.textContent = "✓";
        instrucao.textContent =
            "Chegaste ao ponto de encontro!";
        progresso.textContent = "Percurso concluído";

        proximo.hidden = true;
        chegar.hidden = true;
        return;
    }

    seta.textContent = lista[passo].seta;
    instrucao.textContent = lista[passo].texto;

    progresso.textContent =
        "Passo " + (passo + 1) +
        " de " + lista.length;

    proximo.hidden = false;
    chegar.hidden = false;
}

// Iniciar navegação

iniciar.addEventListener("click", function() {
    passo = 0;
    vista.hidden = false;
    iniciar.hidden = true;

    mostrar();
});

// Próximo passo

proximo.addEventListener("click", function() {
    passo++;
    mostrar();
});

// Cheguei!

chegar.addEventListener("click", function() {
    passo = passos().length;
    mostrar();
});

// Reiniciar

document.getElementById("reiniciar-ar")
    .addEventListener("click", function() {
        passo = 0;
        vista.hidden = false;
        iniciar.hidden = true;

        mostrar();
    });

links();
atualizarTitulo();
