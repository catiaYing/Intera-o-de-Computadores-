
document.addEventListener("DOMContentLoaded", function () {

    // Guardar a página de origem
    const paginaAnterior = document.referrer;

    if (
        paginaAnterior &&
        !paginaAnterior.includes("album.html") &&
        !paginaAnterior.includes("camera.html") &&
        !paginaAnterior.includes("pedido_amizade.html")
    ) {
        sessionStorage.setItem("paginaOrigemPedido", paginaAnterior);
    }

    // Elementos do formulário
    const requestForm = document.getElementById("requestForm");
    const messageInput = document.getElementById("requestMessage");

    // Elementos da fotografia
    const photoInput = document.getElementById("photoInput");
    const photoModal = document.getElementById("photo-modal");

    const addPhotoButton = document.getElementById("addPhotoButton");
    const selectedPhotoContainer =
        document.getElementById("selectedPhotoContainer");

    const selectedAlbumPhoto =
        document.getElementById("selectedAlbumPhoto");

    const removeAlbumPhoto =
        document.getElementById("removeAlbumPhoto");

    // Modal de sucesso
    const successModal = document.getElementById("successModal");
    const successButton = document.getElementById("successButton");
    const errorModal = document.getElementById("errorModal");
    const errorButton = document.getElementById("errorButton");

    let selectedPhoto = null;

    // Mostrar fotografia no lugar de Adicionar foto
    function mostrarFotografia(foto) {

        selectedPhoto = foto;

        selectedAlbumPhoto.src = foto;

        addPhotoButton.style.display = "none";
        selectedPhotoContainer.style.display = "flex";

    }

    // Receber fotografia selecionada no álbum
    const fotoGuardada =
        sessionStorage.getItem("fotoPedidoAmizade");

    if (fotoGuardada) {

        mostrarFotografia(fotoGuardada);

        sessionStorage.removeItem("fotoPedidoAmizade");

    }

    // Selecionar fotografia do dispositivo
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

    // Remover fotografia
    removeAlbumPhoto.addEventListener("click", function () {

        selectedPhoto = null;

        selectedAlbumPhoto.src = "";

        selectedPhotoContainer.style.display = "none";
        addPhotoButton.style.display = "flex";

        photoInput.value = "";

        sessionStorage.removeItem("fotoPedidoAmizade");

    });

    // Enviar pedido de amizade
    requestForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const message = messageInput.value.trim();

        // Verificar mensagem
        if (message === "") {

            errorModal.style.display = "flex";
            return;

        }

        // Simular envio
        const pedido = {

            mensagem: message,

            fotografia: selectedPhoto,

            data: new Date().toISOString()

        };

        console.log("Pedido de amizade enviado:", pedido);

        // Mostrar sucesso
        successModal.style.display = "flex";

    });

    // Fechar modal de sucesso
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

        // Voltar à página onde o pedido começou
        const paginaOrigem = sessionStorage.getItem("paginaOrigemPedido");

        sessionStorage.removeItem("paginaOrigemPedido");

        if (paginaOrigem) {
            window.location.href = paginaOrigem;
        } else {
            window.location.href = "contactos.html";
        }

    });

});

// Fechar modal de erro
errorButton.addEventListener("click", function () {

    errorModal.style.display = "none";

    messageInput.focus();

});
