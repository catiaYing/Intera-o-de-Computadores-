document.addEventListener("DOMContentLoaded", function () {

    // Formulário
    const requestForm = document.getElementById("requestForm");
    const messageInput = document.getElementById("requestMessage");

    // Fotografia
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

    // Mostrar fotografia
    function mostrarFotografia(foto) {
        selectedPhoto = foto;

        selectedAlbumPhoto.src = foto;
        addPhotoButton.style.display = "none";
        selectedPhotoContainer.style.display = "flex";
    }

    // Receber fotografia do álbum
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

        if (message === "") {
            errorModal.style.display = "flex";
            return;
        }

        // Recuperar destinatário escolhido
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

        if (!destinatario || !destinatario.id) {
            alert("Não foi possível identificar o destinatário.");
            return;
        }

        const dataPedido = new Date().toISOString();

        const pedido = {
            destinatario: destinatario,
            mensagem: message,
            fotografia: selectedPhoto,
            data: dataPedido
        };

        console.log("Pedido de amizade enviado:", pedido);

        // Recuperar amigos/pedidos já enviados
        let pedidosEnviados = [];

        try {
            pedidosEnviados =
                JSON.parse(localStorage.getItem("pedidosEnviados")) || [];

            if (!Array.isArray(pedidosEnviados)) {
                pedidosEnviados = [];
            }
        } catch (error) {
            pedidosEnviados = [];
        }

        // Evitar duplicados
        const jaExiste = pedidosEnviados.some(function (amigo) {
            return String(amigo.id) === String(destinatario.id);
        });

        if (!jaExiste) {
            pedidosEnviados.push({
                id: String(destinatario.id),
                nome: destinatario.nome,
                telefone: destinatario.telefone || "",
                data: dataPedido
            });
        }

        // Guardar pedidos enviados
        try {
            localStorage.setItem(
                "pedidosEnviados",
                JSON.stringify(pedidosEnviados)
            );
        } catch (error) {
            console.error("Erro ao guardar contacto:", error);
            alert("Não foi possível guardar o contacto.");
            return;
        }

        // Guardar contacto pendente para aparecer em Contactos
        try {
            localStorage.setItem(
                "bandy_contacto_pendente",
                JSON.stringify({
                    id: String(destinatario.id),
                    nome: String(
                        destinatario.nome ||
                        destinatario.name ||
                        "Novo contacto"
                    ),
                    telefone: destinatario.telefone || "",
                    data: dataPedido
                })
            );
        } catch (error) {
            console.error("Erro ao guardar contacto pendente:", error);
            alert("Não foi possível guardar o contacto.");
            return;
        }

        // Mostrar confirmação
        successModal.style.display = "flex";
    });

    // OK da janela de sucesso
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

        // Ir para Contactos
        window.location.href = "contactos.html";
    });

    // OK da janela de erro
    errorButton.addEventListener("click", function () {
        errorModal.style.display = "none";
        messageInput.focus();
    });

});