
document.addEventListener("DOMContentLoaded", function () {

    const downloadButton =
        document.getElementById("downloadButton");

    const infoButton =
        document.getElementById("infoButton");

    const infoModal =
        document.getElementById("infoModal");

    const closeModal =
        document.getElementById("closeModal");

    const modalOk =
        document.getElementById("modalOk");


    // Descarregar bilhete em PDF
    downloadButton.addEventListener("click", function () {

        window.print();

    });


    // Abrir informações do festival
    infoButton.addEventListener("click", function () {

        infoModal.classList.add("show");

    });


    // Fechar modal
    closeModal.addEventListener("click", function () {

        infoModal.classList.remove("show");

    });


    modalOk.addEventListener("click", function () {

        infoModal.classList.remove("show");

    });


    // Fechar ao clicar fora da janela
    infoModal.addEventListener("click", function (event) {

        if (event.target === infoModal) {
            infoModal.classList.remove("show");
        }

    });

});
