/* BANDy - Mapa 2D Interativo */

const mapaRecinto = document.getElementById("mapa-recinto");

if (mapaRecinto) {

    const { festivais, estado } = BandyMapa;

    const confirmar = document.getElementById("confirmar-ponto");
    const mensagem = document.getElementById("mensagem-confirmacao");

    // Posicionar elementos no mapa
    function colocar(elemento, posicao) {
        if (!elemento || !posicao) return;

        elemento.style.left = posicao[0] + "%";
        elemento.style.top = posicao[1] + "%";
    }

    // Desenhar o percurso específico do festival
    function desenharRota() {
        const linha = document.getElementById("linha-rota");
        if (!linha) return;

        const pontos = BandyMapa.percurso();

        const coordenadas = pontos.map(ponto =>
            ponto[0] + "," + ponto[1]
        );

        linha.setAttribute("points", coordenadas.join(" "));
    }

    // Atualizar o mapa completo
    function atualizarMapa() {
        const festival = festivais[estado.festival];

        mapaRecinto.className = "mapa " + estado.festival;

        // Localização inicial do utilizador
        colocar(
            document.getElementById("origem"),
            festival.origem
        );

        // Locais do recinto
        ["palco", "bar", "wc", "entrada"].forEach(local => {
            colocar(
                document.getElementById("local-" + local),
                festival.locais[local]
            );
        });

        // Pontos de encontro
        document.querySelectorAll(".destino").forEach(botao => {
            const numero = botao.dataset.ponto;

            colocar(botao, festival.pontos[numero]);

            botao.classList.toggle(
                "selecionado",
                estado.ponto === numero
            );
        });

        // Ponto personalizado
        const personalizado = document.getElementById(
            "ponto-personalizado"
        );

        if (personalizado) {
            personalizado.hidden =
                estado.ponto !== "livre" || !estado.livre;

            if (!personalizado.hidden) {
                colocar(personalizado, estado.livre);
            }
        }

        desenharRota();
    }

    // Permitir confirmar uma nova escolha
    function novaEscolha() {
        if (confirmar) confirmar.disabled = false;
        if (mensagem) mensagem.textContent = "";

        atualizarMapa();
    }

    // Selecionar ponto predefinido
    document.querySelectorAll(".destino").forEach(botao => {
        botao.addEventListener("click", evento => {
            evento.stopPropagation();

            BandyMapa.selecionarPonto(botao.dataset.ponto);
            novaEscolha();
        });
    });

    // Escolher um ponto livre
    mapaRecinto.addEventListener("click", evento => {
        if (evento.target.closest(".local, .ponto")) return;

        const limites = mapaRecinto.getBoundingClientRect();

        const x = (evento.clientX - limites.left) /
            limites.width * 100;

        const y = (evento.clientY - limites.top) /
            limites.height * 100;

        BandyMapa.selecionarLivre(x, y);
        novaEscolha();
    });

    // Confirmar o ponto de encontro
    if (confirmar) {
        confirmar.addEventListener("click", () => {
            if (mensagem) {
                mensagem.textContent =
                    "✓ Ponto de encontro confirmado!";
            }

            confirmar.disabled = true;
        });
    }

    atualizarMapa();
}
