/* BANDy - Dados e percursos dos festivais */

const BandyMapa = (() => {

    // 1. Dados ilustrativos
    const festivais = {
        alive: {
            nome: "NOS Alive",
            origem: [20, 82],
            locais: {
                palco: [18, 15],
                bar: [78, 15],
                wc: [80, 82],
                entrada: [12, 60]
            },
            pontos: {
                1: [75, 35],
                2: [25, 35],
                3: [65, 75]
            }
        },

        kalorama: {
            nome: "MEO Kalorama",
            origem: [50, 88],
            locais: {
                palco: [75, 18],
                bar: [20, 70],
                wc: [15, 20],
                entrada: [55, 70]
            },
            pontos: {
                1: [72, 42],
                2: [25, 40],
                3: [75, 72]
            }
        },

        primavera: {
            nome: "Primavera Sound",
            origem: [80, 85],
            locais: {
                palco: [20, 65],
                bar: [75, 15],
                wc: [75, 65],
                entrada: [45, 85]
            },
            pontos: {
                1: [30, 25],
                2: [60, 45],
                3: [25, 80]
            }
        }
    };

    // 2. Ler os parâmetros
    const parametros = new URLSearchParams(location.search);

    const festivalURL = parametros.get("festival") ||
        localStorage.getItem("festivalMapa");

    const pontoURL = parametros.get("ponto") ||
        localStorage.getItem("pontoMapa");

    const estado = {
        festival: festivais[festivalURL] ? festivalURL : "alive",
        ponto: ["1", "2", "3", "livre"].includes(pontoURL)
            ? pontoURL : "1",
        livre: null
    };

    function coordenada(valor) {
        if (valor === null || valor === "") return null;

        const numero = Number(valor);
        if (!Number.isFinite(numero)) return null;

        return Math.max(5, Math.min(95, numero));
    }

    // 3. Recuperar ponto personalizado
    function recuperarLivre() {
        const x = coordenada(parametros.get("x"));
        const y = coordenada(parametros.get("y"));

        if (x !== null && y !== null) return [x, y];

        try {
            const dados = JSON.parse(
                localStorage.getItem("pontoLivreMapa")
            );

            if (dados && dados.festival === estado.festival) {
                const px = coordenada(dados.x);
                const py = coordenada(dados.y);

                if (px !== null && py !== null) return [px, py];
            }
        } catch (erro) {
            return null;
        }

        return null;
    }

    estado.livre = recuperarLivre();

    if (estado.ponto === "livre" && !estado.livre) {
        estado.ponto = "1";
    }

    // 4. Guardar as escolhas
    function guardar() {
        localStorage.setItem("festivalMapa", estado.festival);
        localStorage.setItem("pontoMapa", estado.ponto);

        if (estado.livre) {
            localStorage.setItem("pontoLivreMapa", JSON.stringify({
                festival: estado.festival,
                x: estado.livre[0],
                y: estado.livre[1]
            }));
        }
    }

    function destino() {
        return estado.ponto === "livre" && estado.livre
            ? estado.livre
            : festivais[estado.festival].pontos[estado.ponto];
    }

    // 5. Percursos diferentes por festival
    function percurso() {
        const origem = festivais[estado.festival].origem;
        const fim = destino();

        let pontos;

        if (estado.festival === "alive") {
            // Primeiro, passar pela Avenida Central
            pontos = [
                origem,
                [50, origem[1]],
                [50, fim[1]],
                fim
            ];

        } else if (estado.festival === "kalorama") {
            // Primeiro, seguir pelo caminho do parque
            pontos = [
                origem,
                [origem[0], 50],
                [fim[0], 50],
                fim
            ];

        } else {
            // Primeiro, passar pela zona do Palco 2
            pontos = [
                origem,
                [40, origem[1]],
                [40, fim[1]],
                fim
            ];
        }

        // Eliminar pontos consecutivos iguais
        return pontos.filter((ponto, i) =>
            i === 0 ||
            ponto[0] !== pontos[i - 1][0] ||
            ponto[1] !== pontos[i - 1][1]
        );
    }

    // 6. Ligações entre páginas
    function criarLink(pagina) {
        const dados = new URLSearchParams({
            festival: estado.festival,
            ponto: estado.ponto
        });

        if (estado.ponto === "livre" && estado.livre) {
            dados.set("x", estado.livre[0]);
            dados.set("y", estado.livre[1]);
        }

        return pagina + "?" + dados.toString();
    }

    function atualizarLinks() {
        const links = {
            "abrir-2d": "mapa2d.html",
            "abrir-ar": "mapaAR.html",
            "ir-ar": "mapaAR.html",
            "ir-2d": "mapa2d.html",
            "voltar-2d": "mapa2d.html"
        };

        Object.entries(links).forEach(([id, pagina]) => {
            const elemento = document.getElementById(id);
            if (elemento) elemento.href = criarLink(pagina);
        });
    }

    // 7. Informações apresentadas
    function atualizarInformacao() {
        const nome = document.getElementById("nome-festival");
        const titulo = document.getElementById("titulo-ponto");
        const descricao = document.getElementById("descricao-ponto");

        if (nome) {
            nome.textContent = festivais[estado.festival].nome;
        }

        if (titulo) {
            titulo.textContent = estado.ponto === "livre"
                ? "📍 Ponto de Encontro Personalizado"
                : "📍 Ponto de Encontro " + estado.ponto;
        }

        if (descricao) {
            descricao.textContent = estado.ponto === "livre"
                ? "Local escolhido no mapa."
                : "Ponto de encontro predefinido.";
        }
    }

    // 8. Alterar escolhas
    function selecionarFestival(valor) {
        estado.festival = festivais[valor] ? valor : "alive";
        estado.ponto = "1";
        estado.livre = null;

        guardar();
        atualizarLinks();
        atualizarInformacao();
    }

    function selecionarPonto(valor) {
        if (!["1", "2", "3", "livre"].includes(valor)) return;
        if (valor === "livre" && !estado.livre) return;

        estado.ponto = valor;

        guardar();
        atualizarLinks();
        atualizarInformacao();
    }

    function selecionarLivre(x, y) {
        const px = coordenada(x);
        const py = coordenada(y);

        if (px === null || py === null) return;

        estado.livre = [px, py];
        estado.ponto = "livre";

        guardar();
        atualizarLinks();
        atualizarInformacao();
    }

    // 9. Seletores da página inicial
    const seletorFestival = document.getElementById("festival");
    const seletorPonto = document.getElementById("ponto");

    if (seletorFestival && seletorPonto) {
        seletorFestival.value = estado.festival;

        if (estado.ponto === "livre") {
            seletorPonto.add(
                new Option("Ponto personalizado", "livre")
            );
        }

        seletorPonto.value = estado.ponto;

        seletorFestival.addEventListener("change", () => {
            selecionarFestival(seletorFestival.value);
            seletorPonto.querySelector('option[value="livre"]')?.remove();
            seletorPonto.value = "1";
        });

        seletorPonto.addEventListener("change", () => {
            selecionarPonto(seletorPonto.value);
        });
    }

    guardar();
    atualizarLinks();
    atualizarInformacao();

    return {
        festivais,
        estado,
        destino,
        percurso,
        selecionarPonto,
        selecionarLivre
    };

})();
