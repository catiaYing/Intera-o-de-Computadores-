/* BANDy - Navegação AR por Festival */

const inicioAR = document.getElementById("inicio-ar");

if (inicioAR && typeof BandyMapa !== "undefined") {

    const { estado } = BandyMapa;

    // Elementos da página
    const navegacao = document.getElementById("navegacao-ar");
    const chegada = document.getElementById("chegada-ar");
    const vista = document.getElementById("vista-ar");

    const iniciar = document.getElementById("iniciar-ar");
    const proximo = document.getElementById("proximo-ar");
    const terminar = document.getElementById("terminar-ar");
    const reiniciar = document.getElementById("reiniciar-ar");

    const seta = document.getElementById("seta-ar");
    const direcao = document.getElementById("direcao-ar");
    const detalhe = document.getElementById("detalhe-ar");

    const passoTexto = document.getElementById("passo-ar");
    const percentagem = document.getElementById("percentagem-ar");
    const barra = document.getElementById("barra-ar");

    const destinoTexto = document.getElementById("destino-ar");
    const referencia = document.getElementById("referencia-ar");

    let passoAtual = 0;

    // 1. Referências específicas de cada festival
    const cenarios = {
        alive: {
            nome: "Avenida Central",
            instrucoes: [
                "Dirige-te à Avenida Central.",
                "Segue junto ao Palco Principal.",
                "Sai da avenida até ao ponto escolhido."
            ]
        },

        kalorama: {
            nome: "Caminho do Parque",
            instrucoes: [
                "Segue pelo caminho do parque.",
                "Atravessa a zona verde entre as árvores.",
                "Continua até ao ponto combinado."
            ]
        },

        primavera: {
            nome: "Zona do Palco 2",
            instrucoes: [
                "Dirige-te ao corredor do Palco 2.",
                "Segue junto à zona dos palcos.",
                "Avança até ao ponto de encontro."
            ]
        }
    };

    const cenario = cenarios[estado.festival];

    // 2. Mostrar o cenário correto
    vista.className = "vista-ar " + estado.festival;

    destinoTexto.textContent = estado.ponto === "livre"
        ? "📍 Ponto Personalizado"
        : "📍 Ponto de Encontro " + estado.ponto;

    // 3. Calcular a direção entre dois pontos
    function calcularDirecao(origem, destino) {
        const dx = destino[0] - origem[0];
        const dy = destino[1] - origem[1];

        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0
                ? { seta: "→", texto: "Segue para a direita" }
                : { seta: "←", texto: "Segue para a esquerda" };
        }

        return dy < 0
            ? { seta: "↑", texto: "Segue em frente" }
            : { seta: "↓", texto: "Segue na direção indicada" };
    }

    // 4. Criar passos com base na rota 2D
    function criarPassos() {
        const pontos = BandyMapa.percurso();
        const passos = [];

        for (let i = 0; i < pontos.length - 1; i++) {
            const direcao = calcularDirecao(
                pontos[i],
                pontos[i + 1]
            );

            passos.push({
                seta: direcao.seta,
                direcao: direcao.texto,
                detalhe: cenario.instrucoes[
                    Math.min(i, cenario.instrucoes.length - 1)
                ]
            });
        }

        return passos;
    }

    const passos = criarPassos();

    // 5. Atualizar a navegação
    function mostrarPasso() {
        const passo = passos[passoAtual];

        const progresso = Math.round(
            (passoAtual + 1) / passos.length * 100
        );

        seta.textContent = passo.seta;
        direcao.textContent = passo.direcao;
        detalhe.textContent = passo.detalhe;

        passoTexto.textContent =
            "Passo " + (passoAtual + 1) +
            " de " + passos.length;

        percentagem.textContent = progresso + "%";
        barra.style.width = progresso + "%";

        referencia.textContent =
            cenario.nome + " · Etapa " + (passoAtual + 1);

        proximo.textContent =
            passoAtual === passos.length - 1
                ? "Cheguei!"
                : "Próximo Passo →";

        // Pequeno movimento ilustrativo do cenário
        const fundo = vista.querySelector(
            ".cenario-" + estado.festival
        );

        if (fundo) {
            fundo.style.transition = "transform 0.3s ease";
            fundo.style.transformOrigin = "center bottom";

            fundo.style.transform =
                "scale(" + (1 + passoAtual * 0.04) + ")";
        }
    }

    // 6. Iniciar navegação
    iniciar.addEventListener("click", () => {
        passoAtual = 0;

        inicioAR.hidden = true;
        navegacao.hidden = false;
        chegada.hidden = true;

        mostrarPasso();
    });

    // 7. Próximo passo
    proximo.addEventListener("click", () => {
        if (passoAtual < passos.length - 1) {
            passoAtual++;
            mostrarPasso();
        } else {
            navegacao.hidden = true;
            chegada.hidden = false;
        }
    });

    // 8. Terminar navegação
    terminar.addEventListener("click", () => {
        passoAtual = 0;

        inicioAR.hidden = false;
        navegacao.hidden = true;
        chegada.hidden = true;
    });

    // 9. Reiniciar simulação
    reiniciar.addEventListener("click", () => {
        passoAtual = 0;

        inicioAR.hidden = true;
        navegacao.hidden = false;
        chegada.hidden = true;

        mostrarPasso();
    });
}
