document.addEventListener("DOMContentLoaded", function () {

    const botaoSincronizar = document.getElementById("sincronizar");
    const interruptor = document.getElementById("interruptor-partilha");
    const mensagem = document.getElementById("mensagem");
    const ultimaSincronizacao = document.getElementById("ultima-sincronizacao");

    const valorRitmo = document.getElementById("valor-ritmo");
    const valorPassos = document.getElementById("valor-passos");
    const valorCalorias = document.getElementById("valor-calorias");
    const valorSono = document.getElementById("valor-sono");

    function aleatorio(minimo, maximo) {
        return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
    }

    function formatarPassos(numero) {
        return String(numero).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    function horaAtual() {

        const agora = new Date();

        const horas = String(agora.getHours()).padStart(2, "0");
        const minutos = String(agora.getMinutes()).padStart(2, "0");

        return horas + ":" + minutos;
    }

    botaoSincronizar.addEventListener("click", function () {

        botaoSincronizar.disabled = true;
        botaoSincronizar.textContent = "A sincronizar...";
        mensagem.textContent = "";

        setTimeout(function () {

            valorRitmo.textContent = aleatorio(60, 110);
            valorPassos.textContent = formatarPassos(aleatorio(3000, 15000));
            valorCalorias.textContent = aleatorio(200, 900);
            valorSono.textContent = (aleatorio(50, 90) / 10)
                .toFixed(1)
                .replace(".", ",");

            ultimaSincronizacao.textContent =
                "Última sincronização: hoje, " + horaAtual();

            botaoSincronizar.disabled = false;
            botaoSincronizar.textContent = "Sincronizar pulseira";
            mensagem.textContent = "Dados atualizados com sucesso.";

        }, 1200);
    });

    try {

        if (sessionStorage.getItem("bandyPartilhaSaude") === "true") {
            interruptor.setAttribute("aria-pressed", "true");
        }

    } catch (erro) {
    }

    interruptor.addEventListener("click", function () {

        const ativo = interruptor.getAttribute("aria-pressed") !== "true";

        interruptor.setAttribute("aria-pressed", String(ativo));

        try {
            sessionStorage.setItem("bandyPartilhaSaude", String(ativo));
        } catch (erro) {
        }

        mensagem.textContent = ativo
            ? "Os teus amigos já podem ver os teus dados."
            : "Os teus dados de saúde estão privados.";
    });

});
