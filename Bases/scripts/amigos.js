document.addEventListener("DOMContentLoaded", function () {
    const botoesMapa = document.querySelectorAll(".botao-mapa");
    const botoesChat = document.querySelectorAll(".botao-chat");

    botoesMapa.forEach(btn => {
        btn.addEventListener("mouseenter", function () {
            this.style.transform = "scale(1.03)";
        });
        btn.addEventListener("mouseleave", function () {
            this.style.transform = "scale(1)";
        });
    });

    botoesChat.forEach(btn => {
        btn.addEventListener("mouseenter", function () {
            this.style.transform = "scale(1.05)";
        });
        btn.addEventListener("mouseleave", function () {
            this.style.transform = "scale(1)";
        });
    });
});