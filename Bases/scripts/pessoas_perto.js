document.addEventListener("DOMContentLoaded", function () {
    // procura todos os botoes para adicionar como amigo 
    const botoes = document.querySelectorAll(".botao-adicionar, article button");

    let pedidosEnviados = [];
    try {
        pedidosEnviados = JSON.parse(localStorage.getItem("pedidosEnviados")) || [];
    } catch (e) {
        pedidosEnviados = [];
    }

    botoes.forEach(botao => {
        const cartao = botao.closest("article") || botao.parentElement;
        const linkPerfil = cartao ? cartao.querySelector('a[href*="user="]') : null;
        const nomeElemento = cartao ? cartao.querySelector("h3") : null;

        if (!linkPerfil) return;

        // Extrai o utilizador e o nome
        const href = linkPerfil.getAttribute("href") || "";
        const queryString = href.includes("?") ? href.split("?")[1] : "";
        const userId = new URLSearchParams(queryString).get("user");
        const nomePessoa = nomeElemento ? nomeElemento.textContent.trim() : userId;

        // Se ja tinhas feito o  pedido marca com um certo 
        const jaEnviado = pedidosEnviados.some(p => String(p.id) === String(userId));
        if (jaEnviado) {
            botao.classList.add("enviado");
            botao.textContent = "✓";
            botao.setAttribute("aria-label", "Pedido Enviado");
        }

        // ao carrgear no mais gurada e vai para a pagina do enviar pedido 
        botao.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (this.classList.contains("enviado")) return;

            sessionStorage.setItem(
                "destinatarioPedido",
                JSON.stringify({
                    id: userId,
                    nome: nomePessoa
                })
            );

            window.location.href = "catia/pedido_amizade.html";
        });
    });
});
