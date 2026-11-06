
document.addEventListener("DOMContentLoaded", function () {

    const photoBoxes = document.querySelectorAll(".photo-box");
    const confirmButton = document.getElementById("confirmAlbum");

    let selectedPhoto = null;

    // Mostrar a primeira fotografia
    const primeiraFoto = "../../media/catia/1.png";

    const image = document.createElement("img");
    image.src = primeiraFoto;
    image.alt = "Fotografia 1";

    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "cover";
    image.style.borderRadius = "inherit";

    // Colocar fotografia no primeiro quadrado
    photoBoxes[0].appendChild(image);

    // Selecionar fotografia
    photoBoxes.forEach((box, index) => {

        box.addEventListener("click", function () {

            // Não permitir selecionar quadrados vazios
            const img = box.querySelector("img");

            if (!img) return;

            photoBoxes.forEach(item => {
                item.classList.remove("selected");
            });

            box.classList.add("selected");

            selectedPhoto = img.src;

        });

    });

    // Confirmar fotografia
    confirmButton.addEventListener("click", function () {

        if (!selectedPhoto) {
            alert("Seleciona uma fotografia primeiro.");
            return;
        }

        // Guardar a fotografia selecionada
        sessionStorage.setItem(
            "fotoPedidoAmizade",
            selectedPhoto
        );

        // Voltar à página de pedido
        window.location.href = "pedido_amizade.html";

    });

});

