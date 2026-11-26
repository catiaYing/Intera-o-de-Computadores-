
/* BANDy - Confirmação */

// Regista a compra concluída para aparecer em "Os meus bilhetes"
(function registarCompra() {
    try {
        const guardada = sessionStorage.getItem("bandyCompra");

        // Sem compra ou já registada (evita duplicados ao recarregar)
        if (!guardada || sessionStorage.getItem("bandyCompraRegistada") === guardada) {
            return;
        }

        const compra = JSON.parse(guardada);
        const bilhetes = JSON.parse(localStorage.getItem("bilhetesComprados")) || [];

        bilhetes.push({
            id: Date.now(),
            festival: compra.festival,
            tipo: compra.tipo,
            preco: Number(compra.preco),
            quantidade: Number(compra.quantidade),
            total: Number(compra.total) || Number(compra.preco) * Number(compra.quantidade)
        });

        localStorage.setItem("bilhetesComprados", JSON.stringify(bilhetes));
        sessionStorage.setItem("bandyCompraRegistada", guardada);
    } catch (erro) {
        console.error("Não foi possível registar a compra", erro);
    }
})();

// 查看数字门票
document.getElementById("verBilhete").addEventListener("click", function() {
    window.location.href = "../catia/bilhete_digital.html";
});

// 查看门票列表
document.getElementById("verFestivais").addEventListener("click", function() {
    window.location.href = "../catia/bilhetes.html";
});
