document.addEventListener("DOMContentLoaded", function () {
    const botoesAdicionar = document.querySelectorAll(".botao-adicionar");

    botoesAdicionar.forEach(botao => {
        botao.addEventListener("click", function (e) {
            e.stopPropagation();
            if (!this.classList.contains("enviado")) {
                this.classList.add("enviado");
                this.textContent = "✓";
                this.setAttribute("aria-label", "Pedido Enviado");
            }
        });
    });
});