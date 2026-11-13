/* =====================================
   BANDy - Pagamento PayPal
   模拟 PayPal 支付确认
===================================== */

// 1. 获取弹窗
const dialogo = document.getElementById("confirmar-paypal");


// 2. 点击 Continuar
document.getElementById("continuar-paypal").addEventListener("click", function() {

    // 如果没有选择过门票，返回选票页面
    if (!sessionStorage.getItem("bandyCompra")) {
        window.location.href = "escolher_bilhete.html";
        return;
    }

    // 显示确认弹窗
    dialogo.showModal();

});


// 3. 点击 Cancelar
document.getElementById("cancelar-paypal").addEventListener("click", function() {

    // 关闭弹窗
    dialogo.close();

});


// 4. 点击 Confirmar
document.getElementById("confirmar-pagamento").addEventListener("click", function() {

    // 保存模拟支付方式
    sessionStorage.setItem("bandyMetodo", "paypal");

    // 进入最终购买确认页面
    window.location.href = "confirmacao.html";

});
