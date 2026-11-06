
"use strict";

window.addEventListener("load", principal);

function principal() {

    let cartazes = [
        "../media/cartaz.png",
        "../media/cartaz2.png",
        "../media/cartaz3.png",
        "../media/cartaz4.png"
    ];

    let imagem = document.getElementById("cartaz");
    let pontos = document.querySelectorAll(".pontos span");

    let indiceAtual = 0;
    let inicioX = 0;
    let fimX = 0;

    function mudarCartaz(indice) {

        indiceAtual = indice;

        imagem.src = cartazes[indiceAtual];

        for (let j = 0; j < pontos.length; j++) {
            pontos[j].classList.remove("ativo");
        }

        pontos[indiceAtual].classList.add("ativo");
    }

    // Clicar nos pontos para mudar de cartaz
    for (let i = 0; i < pontos.length; i++) {

        pontos[i].addEventListener("click", function() {
            mudarCartaz(i);
        });

    }

    // Guardar a posição inicial do toque
    imagem.addEventListener("touchstart", function(event) {
        inicioX = event.touches[0].clientX;
    });

    // Mudar de cartaz ao deslizar
    imagem.addEventListener("touchend", function(event) {

        fimX = event.changedTouches[0].clientX;

        if (inicioX - fimX > 50) {

            if (indiceAtual < cartazes.length - 1) {
                mudarCartaz(indiceAtual + 1);
            }

        } else if (fimX - inicioX > 50) {

            if (indiceAtual > 0) {
                mudarCartaz(indiceAtual - 1);
            }

        }

    });

}
