/* =====================================
   BANDy - Pagamento por Cartão
   第三个页面：银行卡表单验证
===================================== */

// 1. 获取HTML元素
const form = document.getElementById("form-cartao");

const nome = document.getElementById("nome-cartao");
const numero = document.getElementById("numero-cartao");
const validade = document.getElementById("validade");
const cvv = document.getElementById("cvv");

// 错误弹窗和成功弹窗
const erro = document.getElementById("erro-cartao");
const sucesso = document.getElementById("sucesso-cartao");

// 保存出错的输入框
let campoErrado = null;


// 2. 通用错误函数
function mostrarErro(campo, mensagem) {

    campoErrado = campo;

    // 输入框边框变红
    campo.setAttribute("aria-invalid", "true");

    // 显示具体错误信息
    document.getElementById("texto-erro-cartao").textContent = mensagem;

    // 打开错误弹窗
    erro.showModal();
}


// 3. 用户点击 Confirmar pagamento
form.addEventListener("submit", function(event) {

    // 阻止表单刷新
    event.preventDefault();

    // 去掉卡号中的空格
    let cartao = numero.value.replace(/\s/g, "");

    // 检查有效期的 MM/AA 格式
    let data = /^(\d{2})\/(\d{2})$/.exec(validade.value);

    // 当前日期
    let hoje = new Date();


    // 4. 验证姓名
    if (nome.value.trim() === "") {
        mostrarErro(nome, "Introduz o nome do titular.");
        return;
    }


    // 5. 验证卡号：16位数字
    if (!/^\d{16}$/.test(cartao)) {
        mostrarErro(numero, "Introduz 16 dígitos no número do cartão.");
        return;
    }


    // 6. 验证有效期
    if (!data ||
        Number(data[1]) < 1 ||
        Number(data[1]) > 12 ||
        2000 + Number(data[2]) < hoje.getFullYear() ||
        (2000 + Number(data[2]) === hoje.getFullYear() &&
         Number(data[1]) < hoje.getMonth() + 1)) {

        mostrarErro(validade, "Introduz uma validade correta (MM/AA).");
        return;
    }


    // 7. 验证CVV：3或4位数字
    if (!/^\d{3,4}$/.test(cvv.value)) {
        mostrarErro(cvv, "Introduz um CVV de 3 ou 4 dígitos.");
        return;
    }


    // 8. 格式检查通过，显示确认弹窗
    sucesso.showModal();

});


// 9. 重新输入时，清除红色边框
form.querySelectorAll("input").forEach(function(campo) {

    campo.addEventListener("input", function() {
        campo.removeAttribute("aria-invalid");
    });

});


// 10. 点击 Corrigir
document.getElementById("corrigir-cartao").onclick = function() {

    erro.close();
    campoErrado.focus();

};


// 11. 点击 OK，进入最终确认页面
document.getElementById("terminar-cartao").onclick = function() {

    // 清除表单内的测试数据
    form.reset();

    // 只保存支付方式，不保存银行卡信息
    sessionStorage.setItem("bandyMetodo", "cartao");

    window.location.href = "confirmacao.html";

};


/* 输入时自动整理银行卡信息 */

// 1. 卡号：只接受数字，每4位加空格
numero.addEventListener("input", function() {
    let digitos = numero.value.replace(/\D/g, "").slice(0, 16);
    numero.value = digitos.replace(/(.{4})/g, "$1 ").trim();
});

// 2. 有效期：自动加入 /
validade.addEventListener("input", function() {
    let digitos = validade.value.replace(/\D/g, "").slice(0, 4);

    if (digitos.length > 2) {
        validade.value = digitos.slice(0, 2) + "/" + digitos.slice(2);
    } else {
        validade.value = digitos;
    }
});

// 3. CVV：只接受最多4位数字
cvv.addEventListener("input", function() {
    cvv.value = cvv.value.replace(/\D/g, "").slice(0, 4);
});

