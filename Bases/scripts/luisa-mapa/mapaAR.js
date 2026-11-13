/* ==========================================
   BANDy - Navegação AR
   Simulação baseada na rota do Mapa 2D
   ========================================== */


// 1. ELEMENTOS DA PÁGINA

const vistaAR =
    document.getElementById("vista-ar");

const setaAR =
    document.getElementById("seta-ar");

const estadoAR =
    document.getElementById("estado-ar");

const passoAR =
    document.getElementById("passo-ar");

const direcaoAR =
    document.getElementById("direcao-ar");

const detalheAR =
    document.getElementById("detalhe-ar");

const progressoAR =
    document.getElementById("progresso-ar");

const preenchimentoAR =
    document.getElementById("preenchimento-ar");

const botaoIniciar =
    document.getElementById("iniciar-ar");

const botaoAnterior =
    document.getElementById("passo-anterior");

const botaoProximo =
    document.getElementById("proximo-passo");

const botaoCheguei =
    document.getElementById("cheguei");

const botaoReiniciar =
    document.getElementById("reiniciar-ar");

const botoesPassos =
    document.getElementById("botoes-passos");


// 2. ESTADO DA NAVEGAÇÃO

let iniciado = false;
let concluido = false;
let passoAtual = 0;


// 3. NOME DO DESTINO

const nomeDestino =
    nomesPontos[pontoAtual] ||
    "Ponto de encontro";


// 4. IDENTIFICAR A DIREÇÃO NO MAPA

function direcaoInicial(dx, dy) {

    if (Math.abs(dx) >= Math.abs(dy)) {

        if (dx > 0) {
            return {
                seta: "→",
                titulo: "Segue para a direita"
            };
        }

        return {
            seta: "←",
            titulo: "Segue para a esquerda"
        };
    }

    if (dy < 0) {
        return {
            seta: "↑",
            titulo: "Segue em frente"
        };
    }

    return {
        seta: "↓",
        titulo: "Segue pelo caminho indicado"
    };
}


// 5. IDENTIFICAR AS VIRAGENS

function identificarViragem(anterior, atual) {

    const dx1 = anterior[0];
    const dy1 = anterior[1];

    const dx2 = atual[0];
    const dy2 = atual[1];

    // Produto vetorial:
    // permite distinguir esquerda e direita
    // nas coordenadas do mapa.

    const cruzado =
        dx1 * dy2 - dy1 * dx2;

    if (cruzado > 0) {
        return {
            seta: "→",
            titulo: "Vira à direita"
        };
    }

    if (cruzado < 0) {
        return {
            seta: "←",
            titulo: "Vira à esquerda"
        };
    }

    return {
        seta: "↑",
        titulo: "Continua em frente"
    };
}


// 6. CONSTRUIR OS PASSOS DA ROTA

function criarPassos() {

    // A rota é a mesma utilizada no Mapa 2D.

    const pontos = percurso();

    const resultado = [];

    let direcaoAnterior = null;

    for (let i = 1; i < pontos.length; i++) {

        const anterior = pontos[i - 1];
        const atual = pontos[i];

        const dx = atual[0] - anterior[0];
        const dy = atual[1] - anterior[1];

        // Ignorar segmentos sem deslocação.

        if (dx === 0 && dy === 0) {
            continue;
        }

        const direcaoAtual = [dx, dy];

        let indicacao;

        if (direcaoAnterior === null) {

            indicacao = direcaoInicial(dx, dy);

        } else {

            indicacao = identificarViragem(
                direcaoAnterior,
                direcaoAtual
            );
        }


        // Texto de apoio ao utilizador

        let detalhe = "Segue pelo corredor do recinto.";

        if (resultado.length === 0) {

            detalhe =
                "Sai da entrada e segue pelo caminho indicado no mapa.";

        }

        if (i === pontos.length - 1) {

            detalhe =
                "Último troço até ao " +
                nomeDestino + ".";
        }


        resultado.push({
            seta: indicacao.seta,
            titulo: indicacao.titulo,
            detalhe: detalhe
        });

        direcaoAnterior = direcaoAtual;
    }

    return resultado;
}


// 7. GUARDAR OS PASSOS

const passosNavegacao = criarPassos();


// 8. ATUALIZAR O ECRÃ

function atualizarAR() {

    // Mostrar o cenário do Festival escolhido.

    vistaAR.className =
        "vista-ar " + festivalAtual;

    if (concluido) {
        vistaAR.classList.add("chegada");
    }

    // Atualizar dados do Festival e destino.

    atualizarTitulo();
    links();


    // 8.1. ANTES DE INICIAR

    if (!iniciado) {

        estadoAR.textContent = "Preparado";

        passoAR.textContent =
            "Pronto para começar";

        setaAR.textContent = "↑";

        direcaoAR.textContent =
            "Percurso preparado";

        detalheAR.textContent =
            "Inicia a navegação para chegar ao " +
            nomeDestino + ".";

        progressoAR.textContent =
            "Não iniciado";

        preenchimentoAR.style.width = "0%";

        botaoIniciar.hidden = false;
        botoesPassos.hidden = true;
        botaoCheguei.hidden = true;
        botaoReiniciar.hidden = true;

        return;
    }


    // 8.2. PERCURSO CONCLUÍDO

    if (concluido || passosNavegacao.length === 0) {

        estadoAR.textContent = "Concluído";

        passoAR.textContent =
            "Destino alcançado";

        setaAR.textContent = "✓";

        direcaoAR.textContent =
            "Chegaste!";

        detalheAR.textContent =
            "Estás no ponto de encontro: " +
            nomeDestino + ".";

        progressoAR.textContent =
            "100%";

        preenchimentoAR.style.width = "100%";

        botaoIniciar.hidden = true;
        botoesPassos.hidden = true;
        botaoCheguei.hidden = true;
        botaoReiniciar.hidden = false;

        vistaAR.classList.add("chegada");

        return;
    }


    // 8.3. PASSO ATUAL

    const passo = passosNavegacao[passoAtual];

    const total = passosNavegacao.length;

    const numero = passoAtual + 1;

    estadoAR.textContent = "Em curso";

    passoAR.textContent =
        "Passo " + numero + " de " + total;

    setaAR.textContent = passo.seta;

    direcaoAR.textContent =
        passo.titulo;

    detalheAR.textContent =
        passo.detalhe;

    // Barra de progresso

    const percentagem =
        Math.round(numero / total * 100);

    progressoAR.textContent =
        percentagem + "%";

    preenchimentoAR.style.width =
        percentagem + "%";


    // 8.4. BOTÕES

    botaoIniciar.hidden = true;
    botaoReiniciar.hidden = false;

    botaoAnterior.disabled =
        passoAtual === 0;

    const ultimoPasso =
        passoAtual === total - 1;

    // Nos passos intermédios:
    // mostrar Anterior e Próximo.

    botoesPassos.hidden = ultimoPasso;

    // No último passo:
    // mostrar Cheguei!

    botaoCheguei.hidden = !ultimoPasso;
}


// 9. INICIAR NAVEGAÇÃO

botaoIniciar.addEventListener(
    "click",
    function() {

        iniciado = true;
        concluido = false;
        passoAtual = 0;

        atualizarAR();
    }
);


// 10. PRÓXIMO PASSO

botaoProximo.addEventListener(
    "click",
    function() {

        if (!iniciado || concluido) {
            return;
        }

        if (
            passoAtual <
            passosNavegacao.length - 1
        ) {

            passoAtual++;

            atualizarAR();
        }
    }
);


// 11. PASSO ANTERIOR

botaoAnterior.addEventListener(
    "click",
    function() {

        if (!iniciado || concluido) {
            return;
        }

        if (passoAtual > 0) {

            passoAtual--;

            atualizarAR();
        }
    }
);


// 12. CHEGUEI!

botaoCheguei.addEventListener(
    "click",
    function() {

        concluido = true;

        atualizarAR();
    }
);


// 13. REINICIAR PERCURSO

botaoReiniciar.addEventListener(
    "click",
    function() {

        iniciado = true;
        concluido = false;
        passoAtual = 0;

        atualizarAR();
    }
);


// 14. INICIALIZAR

atualizarAR();
