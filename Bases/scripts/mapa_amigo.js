"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const festivais = {
        alive: {
            nome: "NOS Alive",
            origem: [12, 85],
            entrada: [12, 85],
            corredor: 45,
            palcos: {
                "Palco X": [20, 20],
                "Side Stage": [80, 20],
                "Palco Y": [75, 65],
                "Palco Z": [35, 55]
            }
        },
        kalorama: {
            nome: "MEO Kalorama",
            origem: [50, 90],
            entrada: [50, 90],
            corredor: 52,
            palcos: {
                "Palco X": [75, 18],
                "Side Stage": [20, 30],
                "Palco Y": [25, 65],
                "Palco Z": [75, 70]
            }
        },
        primavera: {
            nome: "Primavera Sound",
            origem: [85, 85],
            entrada: [85, 85],
            corredor: 45,
            palcos: {
                "Palco X": [18, 65],
                "Side Stage": [70, 20],
                "Palco Y": [25, 25],
                "Palco Z": [65, 60]
            }
        }
    };

    const dadosAmigos = {
        maria: {
            nome: "Maria Costa",
            dist: "45m",
            zona: "Junto ao Palco X",
            festival: "alive",
            pontoProximo: "palco-x",
            x: 26,
            y: 20
        },
        filipe: {
            nome: "Filipe Machado",
            dist: "120m",
            zona: "Zona de Comida",
            festival: "alive",
            pontoProximo: "palco-y",
            x: 74,
            y: 65
        },
        ana: {
            nome: "Ana Silva",
            dist: "310m",
            zona: "Perto do Side Stage",
            festival: "alive",
            pontoProximo: "side-stage",
            x: 76,
            y: 20
        },
        santiago: {
            nome: "Santiago Ramos",
            dist: "10m",
            zona: "Corredor Principal",
            festival: "alive",
            pontoProximo: "palco-z",
            x: 24,
            y: 85
        },
        martim: {
            nome: "Martim Dias",
            dist: "456m",
            zona: "Palco Z",
            festival: "alive",
            pontoProximo: "palco-z",
            x: 37,
            y: 55
        }
    };

    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user") || "maria";
    const amigo = dadosAmigos[userId] || dadosAmigos.maria;

    const festivalId = festivais[amigo.festival] ? amigo.festival : "alive";
    const festival = festivais[festivalId];

    const mapa = document.getElementById("mapa-recinto");
    const nomeFestival = document.getElementById("nome-festival");
    const marcadores = document.getElementById("marcadores");
    const inicio = document.getElementById("origem");
    const entrada = document.getElementById("local-entrada");
    const pontoAmigo = document.getElementById("ponto-amigo");
    const rota = document.getElementById("linha-rota");

    const destinoNome = document.getElementById("destino-amigo-nome");
    const detalhe = document.getElementById("detalhe-localizacao");
    const btnAR = document.getElementById("ir-ar-amigo");
    const btnChat = document.getElementById("ir-chat-amigo");

    function colocar(elemento, pos) {
        elemento.style.left = pos[0] + "%";
        elemento.style.top = pos[1] + "%";
    }

    mapa.className = "mapa-recinto " + festivalId;
    nomeFestival.textContent = festival.nome;

    colocar(inicio, festival.origem);
    colocar(entrada, festival.entrada);
    entrada.style.transform = "translate(-50%, 14px)";

    marcadores.innerHTML = "";
    for (const nomePalco in festival.palcos) {
        const tag = document.createElement("span");
        tag.className = "marcador palco";
        tag.textContent = nomePalco;
        colocar(tag, festival.palcos[nomePalco]);
        marcadores.appendChild(tag);
    }

    const primeiroNome = amigo.nome.split(" ")[0];
    colocar(pontoAmigo, [amigo.x, amigo.y]);
    pontoAmigo.textContent = "📍 " + primeiroNome + " (" + amigo.dist + ")";

    const pontos = festivalId === "kalorama"
        ? [
            festival.origem,
            [festival.origem[0], festival.corredor],
            [amigo.x, festival.corredor],
            [amigo.x, amigo.y]
        ]
        : [
            festival.origem,
            [festival.corredor, festival.origem[1]],
            [festival.corredor, amigo.y],
            [amigo.x, amigo.y]
        ];

    rota.setAttribute(
        "points",
        pontos.map(function (p) { return p[0] + "," + p[1]; }).join(" ")
    );

    destinoNome.textContent = amigo.nome + " · " + amigo.dist;
    detalhe.textContent =
        amigo.nome + " está a " + amigo.dist + " de ti (" + amigo.zona + ").";

    const arParams = new URLSearchParams({
        festival: festivalId,
        ponto: amigo.pontoProximo
    });
    btnAR.href = "luisa-mapa/mapaAR.html?" + arParams.toString();

    btnChat.href = "catia/chat.html?amigo=" + encodeURIComponent(userId);

});