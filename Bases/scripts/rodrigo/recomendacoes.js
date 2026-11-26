"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const lista = document.getElementById("lista-pessoas");
    const contador = document.getElementById("contador");
    const semResultados = document.getElementById("sem-resultados");
    const meusInteresses = document.getElementById("meus-interesses");
    const filtros = document.querySelectorAll(".filtro");
    const pesquisaPessoas = document.getElementById("pesquisa-pessoas");

    // Elementos do modal de adicionar gosto
    const btnAbrirModal = document.getElementById("abrir-modal-gosto");
    const modalGosto = document.getElementById("modal-gosto");
    const formGosto = document.getElementById("form-gosto");
    const btnCancelarGosto = document.getElementById("cancelar-gosto");
    const selectTipoGosto = document.getElementById("tipo-gosto");
    const inputNomeGosto = document.getElementById("nome-gosto");

    const LIMITE_GOSTOS_VISIVEIS = 5;
    let mostrarTodosGostos = false;

    // Guarda os gostos selecionados ao tocar nas etiquetas do topo
    const gostosSelecionados = new Set();

    // Gostos e festivais do utilizador atual
    const euPadrao = {
        artistas: ["Tame Impala", "Arctic Monkeys", "Dino D'Santiago", "The Weeknd"],
        generos: ["Indie", "Rock", "Pop"],
        festivais: ["MEO Alive", "Meo Kalorama"]
    };

    let eu;
    try {
        eu = JSON.parse(sessionStorage.getItem("meusGostosBandy")) || euPadrao;
    } catch (erro) {
        eu = euPadrao;
    }

    // Utilizadores da plataforma (simulado)
    const utilizadores = [
        {
            nome: "Maria Costa", id: "1010", telefone: "918111222",
            vaiSozinho: true,
            festivais: ["MEO Alive", "Primavera Sound"],
            artistas: ["Tame Impala", "Arctic Monkeys", "Billie Eilish"],
            generos: ["Indie", "Rock"]
        },
        {
            nome: "Pedro Lopes", id: "1003", telefone: "914567890",
            vaiSozinho: false,
            festivais: ["Meo Kalorama"],
            artistas: ["The Weeknd", "Dua Lipa"],
            generos: ["Pop", "R&B"]
        },
        {
            nome: "Sofia Ramos", id: "1004", telefone: "915678901",
            vaiSozinho: true,
            festivais: ["MEO Alive", "Meo Kalorama"],
            artistas: ["Dino D'Santiago", "Mallu Magalhães"],
            generos: ["Pop", "Fado"]
        },
        {
            nome: "Miguel Faria", id: "1006", telefone: "917890123",
            vaiSozinho: false,
            festivais: ["Primavera Sound"],
            artistas: ["Metallica", "Foo Fighters"],
            generos: ["Rock", "Metal"]
        },
        {
            nome: "Inês Matos", id: "1005", telefone: "916789012",
            vaiSozinho: true,
            festivais: ["MEO Alive"],
            artistas: ["Tame Impala", "The Weeknd", "Dino D'Santiago"],
            generos: ["Indie", "Pop"]
        },
        {
            nome: "João Pinto", id: "1002", telefone: "913456789",
            vaiSozinho: false,
            festivais: ["Sumol Summer Fest"],
            artistas: ["Calvin Harris", "Martin Garrix"],
            generos: ["Eletrónica", "House"]
        }
    ];

    let filtroAtual = "todos";

    function normalizar(texto) {
        return texto.toLocaleLowerCase("pt-PT").trim();
    }

    function emComum(a, b) {
        const conjunto = b.map(normalizar);
        return a.filter(function (item) {
            return conjunto.includes(normalizar(item));
        });
    }

    function obterPedidosEnviados() {
        try {
            return JSON.parse(localStorage.getItem("pedidosEnviados")) || [];
        } catch (erro) {
            return [];
        }
    }

    function criarEtiqueta(texto, comum) {
        const etiqueta = document.createElement("span");
        etiqueta.className = "etiqueta" + (comum ? " comum" : "");
        etiqueta.textContent = texto;
        etiqueta.title = texto;
        return etiqueta;
    }

    // Desenhar os gostos no topo como botões selecionáveis + "Ver mais"
    function renderizarMeusGostos() {
        meusInteresses.innerHTML = "";

        const todosOsGostos = [
            ...eu.festivais.map(function (fest) {
                return { valor: fest, rotulo: "🎟 " + fest };
            }),
            ...eu.artistas.map(function (artista) {
                return { valor: artista, rotulo: "♫ " + artista };
            }),
            ...eu.generos.map(function (genero) {
                return { valor: genero, rotulo: genero };
            })
        ];

        const visiveis = mostrarTodosGostos
            ? todosOsGostos
            : todosOsGostos.slice(0, LIMITE_GOSTOS_VISIVEIS);

        visiveis.forEach(function (item) {
            const chave = normalizar(item.valor);
            const estaSelecionado = gostosSelecionados.has(chave);

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "etiqueta etiqueta-clicavel" + (estaSelecionado ? " selecionada" : "");
            btn.textContent = item.rotulo;
            btn.title = item.rotulo;
            btn.setAttribute("aria-pressed", String(estaSelecionado));

            btn.addEventListener("click", function () {
                if (gostosSelecionados.has(chave)) {
                    gostosSelecionados.delete(chave);
                } else {
                    gostosSelecionados.add(chave);
                }
                renderizarMeusGostos();
                atualizarLista();
            });

            meusInteresses.appendChild(btn);
        });

        const restantes = todosOsGostos.length - LIMITE_GOSTOS_VISIVEIS;

        if (restantes > 0) {
            const btnAlternar = document.createElement("button");
            btnAlternar.type = "button";
            btnAlternar.className = "botao-ver-mais";
            btnAlternar.textContent = mostrarTodosGostos
                ? "Ver menos"
                : "+" + restantes + " ver mais";

            btnAlternar.addEventListener("click", function () {
                mostrarTodosGostos = !mostrarTodosGostos;
                renderizarMeusGostos();
            });

            meusInteresses.appendChild(btnAlternar);
        }
    }

    // Calcular compatibilidade
    function calcular(user) {
        const artistas = emComum(user.artistas, eu.artistas);
        const generos = emComum(user.generos, eu.generos);
        const festivais = emComum(user.festivais || [], eu.festivais);

        return {
            user: user,
            artistas: artistas,
            generos: generos,
            festivais: festivais,
            pontos: artistas.length * 2 + festivais.length * 2 + generos.length
        };
    }

    function criarCartao(sugestao) {

        const user = sugestao.user;
        const total =
            sugestao.artistas.length +
            sugestao.generos.length +
            sugestao.festivais.length;

        const cartao = document.createElement("article");
        cartao.className = "pessoa";

        const topo = document.createElement("div");
        topo.className = "pessoa-topo";

        const avatar = document.createElement("div");
        avatar.className = "avatar-pessoa";
        avatar.textContent = user.nome.charAt(0);

        const info = document.createElement("div");
        info.className = "pessoa-info";

        const nome = document.createElement("h3");
        nome.textContent = user.nome;

        const descricao = document.createElement("p");
        descricao.textContent =
            total + (total === 1 ? " interesse em comum" : " interesses em comum") +
            (user.vaiSozinho ? " · Vai sozinho(a)" : "");

        info.appendChild(nome);
        info.appendChild(descricao);
        topo.appendChild(avatar);
        topo.appendChild(info);

        const etiquetas = document.createElement("div");
        etiquetas.className = "etiquetas";

        if (filtroAtual === "todos" || filtroAtual === "festivais") {
            sugestao.festivais.forEach(function (fest) {
                etiquetas.appendChild(criarEtiqueta("🎟 " + fest, true));
            });
        }

        if (filtroAtual !== "generos" && filtroAtual !== "festivais") {
            sugestao.artistas.forEach(function (artista) {
                etiquetas.appendChild(criarEtiqueta("♫ " + artista, true));
            });
        }

        if (filtroAtual !== "artistas" && filtroAtual !== "festivais") {
            sugestao.generos.forEach(function (genero) {
                etiquetas.appendChild(criarEtiqueta(genero, true));
            });
        }

        const acoes = document.createElement("div");
        acoes.className = "pessoa-acoes";

        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "botao-principal";

        const jaEnviado = obterPedidosEnviados().some(function (pedido) {
            return String(pedido.id) === String(user.id);
        });

        if (jaEnviado) {
            botao.textContent = "Pedido enviado";
            botao.disabled = true;
        } else {
            botao.textContent = "Adicionar";
            botao.addEventListener("click", function () {
                sessionStorage.setItem("destinatarioPedido", JSON.stringify({
                    nome: user.nome,
                    id: user.id,
                    telefone: user.telefone
                }));
                sessionStorage.setItem("paginaOrigemPedido", window.location.href);
                window.location.href = "../catia/pedido_amizade.html";
            });
        }

        acoes.appendChild(botao);

        cartao.appendChild(topo);
        cartao.appendChild(etiquetas);
        cartao.appendChild(acoes);

        return cartao;
    }

    // Devolve as sugestões para um dado filtro (respeita etiquetas e pesquisa)
    function obterSugestoes(filtro) {

        const termo = pesquisaPessoas
            ? normalizar(pesquisaPessoas.value)
            : "";

        return utilizadores
            .map(calcular)
            .filter(function (s) {
                // 1. Verificar filtro de categoria (Todos / Artistas / Géneros / Festivais / Vai sozinho)
                const correspondeFiltro =
                    (filtro === "artistas" && s.artistas.length > 0) ||
                    (filtro === "generos" && s.generos.length > 0) ||
                    (filtro === "festivais" && s.festivais.length > 0) ||
                    (filtro === "sozinho" && s.user.vaiSozinho) ||
                    (filtro === "todos" && (s.pontos > 0 || s.user.vaiSozinho));

                if (!correspondeFiltro) return false;

                // 2. Verificar se o utilizador tocou em uma ou mais etiquetas de "Os teus gostos"
                if (gostosSelecionados.size > 0) {
                    const gostosDaPessoa = [
                        ...s.user.artistas,
                        ...s.user.generos,
                        ...(s.user.festivais || [])
                    ].map(normalizar);

                    const temAlgumSelecionado = Array.from(gostosSelecionados).some(function (g) {
                        return gostosDaPessoa.includes(g);
                    });

                    if (!temAlgumSelecionado) return false;
                }

                // 3. Verificar barra de pesquisa por texto
                if (!termo) return true;

                const textoPessoa = normalizar(
                    [
                        s.user.nome,
                        ...s.user.artistas,
                        ...s.user.generos,
                        ...(s.user.festivais || [])
                    ].join(" ")
                );

                return textoPessoa.includes(termo);
            })
            .sort(function (a, b) {
                return b.pontos - a.pontos;
            });
    }

    // Mostra o número de resultados em cada botão de filtro
    function atualizarContagensFiltros() {
        filtros.forEach(function (botao) {
            let badge = botao.querySelector(".filtro-contagem");
            if (!badge) {
                badge = document.createElement("span");
                badge.className = "filtro-contagem";
                botao.appendChild(badge);
            }
            const n = obterSugestoes(botao.dataset.filtro).length;
            badge.textContent = n;
            botao.setAttribute("aria-label",
                botao.firstChild.textContent.trim() + ": " + n +
                (n === 1 ? " resultado" : " resultados"));
        });
    }

    function atualizarLista() {

        lista.innerHTML = "";

        const sugestoes = obterSugestoes(filtroAtual);

        atualizarContagensFiltros();

        sugestoes.forEach(function (sugestao) {
            lista.appendChild(criarCartao(sugestao));
        });

        contador.textContent =
            sugestoes.length + (sugestoes.length === 1
                ? " pessoa sugerida"
                : " pessoas sugeridas");

        semResultados.hidden = sugestoes.length !== 0;
    }

    // Eventos do modal de adicionar gosto
    btnAbrirModal.addEventListener("click", function () {
        inputNomeGosto.value = "";
        modalGosto.classList.add("show");
        inputNomeGosto.focus();
    });

    btnCancelarGosto.addEventListener("click", function () {
        modalGosto.classList.remove("show");
    });

    modalGosto.addEventListener("click", function (evento) {
        if (evento.target === modalGosto) {
            modalGosto.classList.remove("show");
        }
    });

    formGosto.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const categoria = selectTipoGosto.value;
        const novoItem = inputNomeGosto.value.trim();

        if (!novoItem) return;

        const jaExiste = eu[categoria].some(function (item) {
            return normalizar(item) === normalizar(novoItem);
        });

        if (!jaExiste) {
            eu[categoria].unshift(novoItem);
            try {
                sessionStorage.setItem("meusGostosBandy", JSON.stringify(eu));
            } catch (erro) {}
        }

        modalGosto.classList.remove("show");
        renderizarMeusGostos();
        atualizarLista();
    });

    filtros.forEach(function (botao) {
        botao.addEventListener("click", function () {

            filtros.forEach(function (item) {
                item.classList.remove("ativo");
            });

            botao.classList.add("ativo");
            filtroAtual = botao.dataset.filtro;

            atualizarLista();
        });
    });

    if (pesquisaPessoas) {
        pesquisaPessoas.addEventListener("input", atualizarLista);
    }

    renderizarMeusGostos();
    atualizarLista();

});