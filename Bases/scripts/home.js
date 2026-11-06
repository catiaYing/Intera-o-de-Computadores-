
"use strict";

window.addEventListener("load", principal);

function principal() {

    let cartazes = [
        "cartaz.png",
        "cartaz2.png",
        "cartaz3.png",
        "cartaz4.png"
    ];

    let imagem = document.getElementById("cartaz");
    let pontos = document.querySelectorAll(".pontos span");

    for (let i = 0; i < pontos.length; i++) {

        pontos[i].addEventListener("click", function() {

            imagem.src = cartazes[i];

            for (let j = 0; j < pontos.length; j++) {
                pontos[j].classList.remove("ativo");
            }

            pontos[i].classList.add("ativo");

        });

    }

}
