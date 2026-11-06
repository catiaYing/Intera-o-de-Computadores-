document.addEventListener("DOMContentLoaded", function () {

    const nomePerfil = document.getElementById("nome-perfil");
    const utilizadorPerfil = document.getElementById("utilizador-perfil");
    const avatar = document.getElementById("avatar");
    const mensagem = document.getElementById("mensagem");

    const botaoEditar = document.getElementById("editar-perfil");
    const modal = document.getElementById("modal-edicao");
    const formulario = document.getElementById("form-edicao");
    const campoNome = document.getElementById("campo-nome");
    const campoUtilizador = document.getElementById("campo-utilizador");
    const botaoCancelar = document.getElementById("cancelar-edicao");

    function obterIniciais(nome) {

        const partes = nome.trim().split(/\s+/);

        if (partes.length === 1) {
            return partes[0].charAt(0).toUpperCase();
        }

        return (
            partes[0].charAt(0) +
            partes[partes.length - 1].charAt(0)
        ).toUpperCase();
    }

    function guardarPerfil(nome, utilizador) {

        try {
            sessionStorage.setItem("bandyNome", nome);
            sessionStorage.setItem("bandyUtilizador", utilizador);
        } catch (erro) {
        }
    }

    function mostrarPerfil(nome, utilizador) {

        nomePerfil.textContent = nome;
        utilizadorPerfil.textContent = "@" + utilizador;
        avatar.textContent = obterIniciais(nome);
    }

    function fecharModal() {

        modal.classList.remove("show");
        campoNome.setAttribute("aria-invalid", "false");
        campoUtilizador.setAttribute("aria-invalid", "false");
    }

    try {

        const nomeGuardado = sessionStorage.getItem("bandyNome");
        const utilizadorGuardado = sessionStorage.getItem("bandyUtilizador");

        if (nomeGuardado && utilizadorGuardado) {
            mostrarPerfil(nomeGuardado, utilizadorGuardado);
        }

    } catch (erro) {
    }

    botaoEditar.addEventListener("click", function () {

        campoNome.value = nomePerfil.textContent;
        campoUtilizador.value = utilizadorPerfil.textContent.replace("@", "");

        modal.classList.add("show");
        campoNome.focus();
    });

    botaoCancelar.addEventListener("click", fecharModal);

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {
            fecharModal();
        }
    });

    formulario.addEventListener("submit", function (event) {

        event.preventDefault();

        const nome = campoNome.value.trim();
        const utilizador = campoUtilizador.value
            .trim()
            .replace(/\s+/g, "-")
            .toLowerCase();

        campoNome.setAttribute("aria-invalid", nome === "" ? "true" : "false");
        campoUtilizador.setAttribute("aria-invalid", utilizador === "" ? "true" : "false");

        if (nome === "" || utilizador === "") return;

        mostrarPerfil(nome, utilizador);
        guardarPerfil(nome, utilizador);
        fecharModal();

        mensagem.textContent = "Perfil atualizado com sucesso.";
    });

    document.querySelectorAll("[data-em-breve]").forEach(function (item) {

        item.addEventListener("click", function (event) {

            event.preventDefault();

            mensagem.textContent = "Esta secção ainda está em desenvolvimento.";
        });
    });

});
