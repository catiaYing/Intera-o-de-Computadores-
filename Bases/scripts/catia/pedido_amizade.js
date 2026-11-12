
document.addEventListener("DOMContentLoaded", function () {

    // Guardar a pagina de origem

    const paginaAnterior = document.referrer;

    if (paginaAnterior) {

        try {

            const urlAnterior = new URL(paginaAnterior);

            // Guardar apenas paginas do mesmo site
            if (
                urlAnterior.origin === window.location.origin &&
                !urlAnterior.pathname.includes("album.html") &&
                !urlAnterior.pathname.includes("camera.html") &&
                !urlAnterior.pathname.includes("pedido_amizade.html")
            ) {

                const paginaOrigem =
                    urlAnterior.pathname +
                    urlAnterior.search +
                    urlAnterior.hash;

                sessionStorage.setItem(
                    "paginaOrigemPedido",
                    paginaOrigem
                );
            }

        } catch (error) {
            console.log("Não foi possível guardar a página de origem.");
        }
    }


    // Formulario

    const requestForm = document.getElementById("requestForm");
    const messageInput = document.getElementById("requestMessage");


    // Elementos da foto

    const photoInput = document.getElementById("photoInput");
    const photoModal = document.getElementById("photo-modal");

    const addPhotoButton = document.getElementById("addPhotoButton");

    const selectedPhotoContainer =
        document.getElementById("selectedPhotoContainer");

    const selectedAlbumPhoto =
        document.getElementById("selectedAlbumPhoto");

    const removeAlbumPhoto =
        document.getElementById("removeAlbumPhoto");


    // Modais

    const successModal = document.getElementById("successModal");
    const successButton = document.getElementById("successButton");

    const errorModal = document.getElementById("errorModal");
    const errorButton = document.getElementById("errorButton");


    let selectedPhoto = null;


    // Mostrar foto

    function mostrarFotografia(foto) {

        selectedPhoto = foto;

        selectedAlbumPhoto.src = foto;

        addPhotoButton.style.display = "none";
        selectedPhotoContainer.style.display = "flex";
    }


    // Receber foto do album

    const fotoGuardada =
        sessionStorage.getItem("fotoPedidoAmizade");

    if (fotoGuardada) {

        mostrarFotografia(fotoGuardada);

        sessionStorage.removeItem("fotoPedidoAmizade");
    }


    // Selecionar foto

    photoInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            alert("Por favor, seleciona uma imagem válida.");

            this.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            mostrarFotografia(event.target.result);
        };

        reader.readAsDataURL(file);

        photoModal.checked = false;
    });


    // Remover foto

    removeAlbumPhoto.addEventListener("click", function () {

        selectedPhoto = null;

        selectedAlbumPhoto.src = "";

        selectedPhotoContainer.style.display = "none";
        addPhotoButton.style.display = "flex";

        photoInput.value = "";

        sessionStorage.removeItem("fotoPedidoAmizade");
    });


    // Pedido de amizade

    requestForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const message = messageInput.value.trim();

        // Verificar se existe mensagem

        if (message === "") {

            errorModal.style.display = "flex";
            return;
        }


        // Recuperar o destinatario escolhido

        const destinatarioGuardado =
            sessionStorage.getItem("destinatarioPedido");

        let destinatario = null;

        if (destinatarioGuardado) {

            try {
                destinatario = JSON.parse(destinatarioGuardado);
            } catch (error) {
                destinatario = null;
            }
        }


        // Criar pedido

        const pedido = {

            destinatario: destinatario,

            mensagem: message,

            fotografia: selectedPhoto,

            data: new Date().toISOString()
        };

        console.log("Pedido de amizade enviado:", pedido);


        // Registar pedido enviado

        if (destinatario && destinatario.id) {

            let pedidosEnviados = [];

            try {

                pedidosEnviados = JSON.parse(
                    localStorage.getItem("pedidosEnviados")
                ) || [];

            } catch (error) {

                pedidosEnviados = [];
            }

            let jaExiste = false;

            for (let i = 0; i < pedidosEnviados.length; i++) {

                if (pedidosEnviados[i].id == destinatario.id) {
                    jaExiste = true;
                }
            }

            if (jaExiste == false) {

                pedidosEnviados.push({

                    id: String(destinatario.id),

                    nome: destinatario.nome,

                    data: pedido.data
                });
            }

            localStorage.setItem(
                "pedidosEnviados",
                JSON.stringify(pedidosEnviados)
            );
        }


        // Mostrar sucesso

        successModal.style.display = "flex";

    });


    // SUCESSO

    successButton.addEventListener("click", function () {

        successModal.style.display = "none";


        // Limpar formulario

        requestForm.reset();

        selectedPhoto = null;

        selectedAlbumPhoto.src = "";

        selectedPhotoContainer.style.display = "none";
        addPhotoButton.style.display = "flex";

        photoInput.value = "";

        sessionStorage.removeItem("fotoPedidoAmizade");
        sessionStorage.removeItem("destinatarioPedido");


        // Voltar para a pagina anterior

        let paginaOrigem = sessionStorage.getItem("paginaOrigemPedido");

        // Se não existir uma página anterior, voltar para contactos

        if (!paginaOrigem) {
            paginaOrigem = "contactos.html";
        }

        sessionStorage.removeItem("paginaOrigemPedido");

        window.location.href = paginaOrigem;

    });


    // ERRO

    errorButton.addEventListener("click", function () {

        errorModal.style.display = "none";

        messageInput.focus();
    });

});
