/* =====================================
   BANDy - PayPal
   第四个页面：模拟支付确认
===================================== */

// 1. 获取确认弹窗
const dialogo = document.getElementById("confirmar-paypal");


// 2. 点击 Continuar，打开确认弹窗
document.getElementById("continuar-paypal").onclick = function() {

    dialogo.showModal();

};


// 3. 点击 Cancelar，关闭弹窗
document.getElementById("cancelar-paypal").onclick = function() {

    dialogo.close();

};


// 4. 点击 Confirmar，进入购买确认页面
document.getElementById("confirmar-pagamento").onclick = function() {

    // 保存模拟支付方式
    sessionStorage.setItem("bandyMetodo", "paypal");

    window.location.href = "confirmacao.html";

};
