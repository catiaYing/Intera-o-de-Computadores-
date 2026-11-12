"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const lista = document.getElementById("lista-pessoas");
    const contador = document.getElementById("contador");
    const semResultados = document.getElementById("sem-resultados");
    const meusInteresses = document.getElementById("meus-interesses");
    const filtros = document.querySelectorAll(".filtro");

    // Gostos do utilizador atual (simulado)
    const eu = {
        artistas: ["Tame Impala", "Arctic Monkeys", "Dino D'Santiago", "The Weeknd"],
        generos: ["Indie", "Rock", "Pop"]
    };

    // Utilizadores da plataforma (simulado)
    const utilizadores = [
        {
            nome: "Maria Costa", id: "1010", telefone: "918111222",
            artistas: ["Tame Impala", "Arctic Monkeys", "Billie Eilish"],
            generos: ["Indie", "Rock"]
        },
        {
            nome: "Pedro Lopes", id: "1003", telefone: "914567890",
            artistas: ["The Weeknd", "Dua Lipa"],
            generos: ["Pop", "R&B"]
        },
        {
            nome: "Sofia Ramos", id: "1004", telefone: "915678901",
            artistas: ["Dino D'Santiago", "Mallu Magalhães"],
            generos: ["Pop", "Fado"]
        },
        {
            nome: "Miguel Faria", id: "1006", telefone: "917890123",
            artistas: ["Metallica", "Foo Fighters"],
            generos: ["Rock", "Metal"]
        },
        {
            nome: "Inês Matos", id: "1005", telefone: "916789012",
            artistas: ["Tame Impala", "The Weeknd", "Dino D'Santiago"],
            generos: ["Indie", "Pop"]
        },
        {
            nome: "João Pinto", id: "1002", telefone: "913456789",
            artistas: ["Calvin Harris", "Martin Garrix"],
            generos: ["Eletrónica", "House"]
        }
    ];

    let filtroAtual = "todos";

    function normalizar(texto) {
        return texto.toLocaleLowerCase("pt-PT");
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
        return etiqueta;
    }

    // Calcular compatibilidade (artistas valem mais do que géneros)
    function calcular(user) {
        const artistas = emComum(user.artistas, eu.artistas);
        const generos = emComum(user.generos, eu.generos);

        return {
            user: user,
            artistas: artistas,
            generos: generos,
            pontos: artistas.length * 2 + generos.length
        };
    }

    function criarCartao(sugestao) {

        const user = sugestao.user;
        const total = sugestao.artistas.length + sugestao.generos.length;

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
            total + (total === 1 ? " interesse em comum" : " interesses em comum");

        info.appendChild(nome);
        info.appendChild(descricao);
        topo.appendChild(avatar);
        topo.appendChild(info);

        const etiquetas = document.createElement("div");
        etiquetas.className = "etiquetas";

        if (filtroAtual !== "generos") {
            sugestao.artistas.forEach(function (artista) {
                etiquetas.appendChild(criarEtiqueta("♫ " + artista, true));
            });
        }

        if (filtroAtual !== "artistas") {
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
                window.location.href = "../catia/pedido_amizade.html";
            });
        }

        acoes.appendChild(botao);

        cartao.appendChild(topo);
        cartao.appendChild(etiquetas);
        cartao.appendChild(acoes);

        return cartao;
    }

    function atualizarLista() {

        lista.innerHTML = "";

        const sugestoes = utilizadores
            .map(calcular)
            .filter(function (s) {
                if (filtroAtual === "artistas") return s.artistas.length > 0;
                if (filtroAtual === "generos") return s.generos.length > 0;
                return s.pontos > 0;
            })
            .sort(function (a, b) {
                return b.pontos - a.pontos;
            });

        sugestoes.forEach(function (sugestao) {
            lista.appendChild(criarCartao(sugestao));
        });

        contador.textContent =
            sugestoes.length + (sugestoes.length === 1
                ? " pessoa sugerida"
                : " pessoas sugeridas");

        semResultados.hidden = sugestoes.length !== 0;
    }

    // Mostrar os gostos do utilizador
    eu.artistas.forEach(function (artista) {
        meusInteresses.appendChild(criarEtiqueta("♫ " + artista, false));
    });
    eu.generos.forEach(function (genero) {
        meusInteresses.appendChild(criarEtiqueta(genero, false));
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

    atualizarLista();

});
