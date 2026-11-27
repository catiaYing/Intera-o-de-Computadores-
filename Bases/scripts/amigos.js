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

    /* ===== Remover amigo / Deixar de seguir ===== */

    const pagina = document.querySelector(".pagina-amigos");
    const listaAmigos = document.querySelector(".lista-amigos");
    const cartoes = document.querySelectorAll(".cartao-amigo");
    const mensagemVazia = document.getElementById("sem-amigos");

    const modal = document.getElementById("modal-amigo");
    const modalTitulo = document.getElementById("modal-amigo-titulo");
    const modalTexto = document.getElementById("modal-amigo-texto");
    const btnSeguir = document.getElementById("acao-seguir");
    const btnRemover = document.getElementById("acao-remover");
    const btnConfirmar = document.getElementById("acao-confirmar");
    const btnCancelar = document.getElementById("acao-cancelar");
    const grupoOpcoes = document.getElementById("modal-amigo-opcoes");
    const grupoConfirmar = document.getElementById("modal-amigo-confirmar");

    function ler(chave) {
        try {
            return JSON.parse(localStorage.getItem(chave)) || [];
        } catch (erro) {
            return [];
        }
    }

    function guardar(chave, valor) {
        try {
            localStorage.setItem(chave, JSON.stringify(valor));
        } catch (erro) {}
    }

    function idDoCartao(cartao) {
        const link = cartao.querySelector(".link-perfil-amigo");
        return new URL(link.href, window.location.href).searchParams.get("user");
    }

    function nomeDoCartao(cartao) {
        return cartao.querySelector("h3").textContent;
    }

    function atualizarVazio() {
        const visiveis = Array.from(cartoes).filter(function (c) {
            return !c.hidden;
        }).length;
        mensagemVazia.hidden = visiveis !== 0;
    }

    function atualizarCartao(cartao) {
        const id = idDoCartao(cartao);
        const removido = ler("amigosRemovidos").includes(id);
        const naoSegue = ler("amigosNaoSeguidos").includes(id);

        cartao.hidden = removido;
        cartao.style.display = removido ? "none" : "";

        let etiqueta = cartao.querySelector(".estado-seguir");
        if (naoSegue && !removido) {
            if (!etiqueta) {
                etiqueta = document.createElement("p");
                etiqueta.className = "estado-seguir";
                etiqueta.textContent = "Não segues";
                cartao.querySelector(".info-amigo").appendChild(etiqueta);
            }
        } else if (etiqueta) {
            etiqueta.remove();
        }

        atualizarVazio();
    }

    let cartaoAtual = null;
    let acaoPendente = null;

    function fecharModal() {
        modal.classList.remove("show");
        cartaoAtual = null;
        acaoPendente = null;
    }

    function abrirModal(cartao) {
        cartaoAtual = cartao;
        acaoPendente = null;

        const id = idDoCartao(cartao);
        const naoSegue = ler("amigosNaoSeguidos").includes(id);

        modalTitulo.textContent = nomeDoCartao(cartao);
        modalTexto.textContent = "O que queres fazer?";
        btnSeguir.textContent = naoSegue ? "Voltar a seguir" : "Deixar de seguir";
        grupoOpcoes.hidden = false;
        grupoConfirmar.hidden = true;

        modal.classList.add("show");
    }

    function pedirConfirmacao(acao) {
        acaoPendente = acao;
        const nome = nomeDoCartao(cartaoAtual);

        if (acao === "remover") {
            modalTitulo.textContent = "Remover amigo?";
            modalTexto.textContent =
                nome + " deixa de aparecer na tua lista de amigos.";
            btnConfirmar.textContent = "Remover";
            grupoOpcoes.hidden = true;
            grupoConfirmar.hidden = false;
        } else {
            aplicarAcao();
        }
    }

    function aplicarAcao() {
        const id = idDoCartao(cartaoAtual);
        const cartao = cartaoAtual;

        if (acaoPendente === "remover") {
            const removidos = ler("amigosRemovidos");
            if (!removidos.includes(id)) removidos.push(id);
            guardar("amigosRemovidos", removidos);
        } else {
            let naoSeguidos = ler("amigosNaoSeguidos");
            if (naoSeguidos.includes(id)) {
                naoSeguidos = naoSeguidos.filter(function (x) { return x !== id; });
            } else {
                naoSeguidos.push(id);
            }
            guardar("amigosNaoSeguidos", naoSeguidos);
        }

        atualizarCartao(cartao);
        fecharModal();
    }

    cartoes.forEach(function (cartao) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "botao-opcoes-amigo";
        botao.textContent = "⋯";
        botao.setAttribute("aria-label", "Opções de " + nomeDoCartao(cartao));
        botao.title = "Opções";
        botao.addEventListener("click", function () {
            abrirModal(cartao);
        });
        cartao.querySelector(".acoes-amigo").appendChild(botao);

        atualizarCartao(cartao);
    });

    btnSeguir.addEventListener("click", function () {
        pedirConfirmacao("seguir");
    });

    btnRemover.addEventListener("click", function () {
        pedirConfirmacao("remover");
    });

    btnConfirmar.addEventListener("click", aplicarAcao);
    btnCancelar.addEventListener("click", fecharModal);
    document.getElementById("acao-fechar").addEventListener("click", fecharModal);

    modal.addEventListener("click", function (evento) {
        if (evento.target === modal) fecharModal();
    });
});
