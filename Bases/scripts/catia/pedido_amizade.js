
document.addEventListener("DOMContentLoaded", function () {

    // guardar a pagina origem

    const paginaAnterior = document.referrer;

    if (
        paginaAnterior &&
        !paginaAnterior.includes("album.html") &&
        !paginaAnterior.includes("camera.html") &&
        !paginaAnterior.includes("pedido_amizade.html")
    ) {
        sessionStorage.setItem("paginaOrigemPedido", paginaAnterior);
    }

    // formulario

    const requestForm = document.getElementById("requestForm");
    const messageInput = document.getElementById("requestMessage");

    // elementos da foto

    const photoInput = document.getElementById("photoInput");
    const photoModal = document.getElementById("photo-modal");

    const addPhotoButton = document.getElementById("addPhotoButton");

    const selectedPhotoContainer =
        document.getElementById("selectedPhotoContainer");

    const selectedAlbumPhoto =
        document.getElementById("selectedAlbumPhoto");

    const removeAlbumPhoto =
        document.getElementById("removeAlbumPhoto");

    // modais

    const successModal = document.getElementById("successModal");
    const successButton = document.getElementById("successButton");

    const errorModal = document.getElementById("errorModal");
    const errorButton = document.getElementById("errorButton");

    let selectedPhoto = null;

    // mostrar foto

    function mostrarFotografia(foto) {

        selectedPhoto = foto;

        selectedAlbumPhoto.src = foto;

        addPhotoButton.style.display = "none";
        selectedPhotoContainer.style.display = "flex";
    }

    // receber foto do album

    const fotoGuardada =
        sessionStorage.getItem("fotoPedidoAmizade");

    if (fotoGuardada) {

        mostrarFotografia(fotoGuardada);

        sessionStorage.removeItem("fotoPedidoAmizade");
    }

     // selecionar foto

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

    // remover foto

    removeAlbumPhoto.addEventListener("click", function () {

        selectedPhoto = null;

        selectedAlbumPhoto.src = "";

        selectedPhotoContainer.style.display = "none";
        addPhotoButton.style.display = "flex";

        photoInput.value = "";

        sessionStorage.removeItem("fotoPedidoAmizade");
    });

    // pedido de amizade

    requestForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const message = messageInput.value.trim();

        // Verificar se existe mensagem
        if (message === "") {

            errorModal.style.display = "flex";
            return;
        }

        // Recuperar o destinatário escolhido
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

        // Registar como eniado
        // Só depois de validar e enviar

        if (destinatario && destinatario.id) {

            let pedidosEnviados = [];

            try {
                pedidosEnviados = JSON.parse(
                    localStorage.getItem("pedidosEnviados")
                ) || [];
            } catch (error) {
                pedidosEnviados = [];
            }

            const jaExiste = pedidosEnviados.some(
                p => String(p.id) === String(destinatario.id)
            );

            if (!jaExiste) {

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

        // Limpar formulário
        requestForm.reset();

        selectedPhoto = null;

        selectedAlbumPhoto.src = "";

        selectedPhotoContainer.style.display = "none";
        addPhotoButton.style.display = "flex";

        photoInput.value = "";

        sessionStorage.removeItem("fotoPedidoAmizade");
        sessionStorage.removeItem("destinatarioPedido");

        // Voltar à página de origem
        const paginaOrigem =
            sessionStorage.getItem("paginaOrigemPedido");

        sessionStorage.removeItem("paginaOrigemPedido");

        if (paginaOrigem) {

            window.location.href = paginaOrigem;

        } else {

            window.location.href = "novos_amigos.html";
        }
    });

   
    // ERRO

    errorButton.addEventListener("click", function () {

        errorModal.style.display = "none";

        messageInput.focus();
    });

});
