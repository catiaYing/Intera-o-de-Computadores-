/* =====================================
   BANDy - MB WAY
   第二个页面：手机号和授权弹窗
===================================== */

// 1. 获取HTML元素
const form = document.getElementById("form-mbway");
const numero = document.getElementById("numero");

// 三个弹窗
const erro = document.getElementById("erro-dialog");
const aguardar = document.getElementById("aguardar-dialog");
const sucesso = document.getElementById("sucesso-dialog");


// 2. 验证手机号码
form.addEventListener("submit", function(event) {

    // 阻止表单刷新页面
    event.preventDefault();

    // 格式要求：9位数字，第一位是9
    let valido = /^9[0-9]{8}$/.test(numero.value.trim());

    if (valido) {

        // 格式正确：打开等待授权弹窗
        numero.removeAttribute("aria-invalid");
        aguardar.showModal();

    } else {

        // 格式错误：输入框变红并弹出提示
        numero.setAttribute("aria-invalid", "true");
        erro.showModal();
    }

});


// 3. 点击 Corrigir，关闭错误弹窗
document.getElementById("fechar-erro").onclick = function() {

    erro.close();
    numero.focus();

};


// 4. 模拟 MB WAY 授权成功
document.getElementById("autorizar").onclick = function() {

    aguardar.close();
    sucesso.showModal();

};


// 5. 取消等待授权
document.getElementById("cancelar-aguardar").onclick = function() {

    aguardar.close();

};


// 6. 点击 OK，进入最终确认页面
document.getElementById("terminar").onclick = function() {

    // 只保存支付方式，不保存手机号码
    sessionStorage.setItem("bandyMetodo", "mbway");

    window.location.href = "confirmacao.html";

};


// 7. 用户修改号码时清除错误状态
numero.addEventListener("input", function() {

    numero.removeAttribute("aria-invalid");

});
