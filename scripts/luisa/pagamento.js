/* =====================================
   BANDy - Escolher Pagamento
   第一个页面：选择支付方式
===================================== */

// 1. 获取HTML中的按钮
const botoes = document.querySelectorAll(".metodo");
const continuar = document.getElementById("continuar");

// 记录用户选择的支付方式
let escolhido = "";

// 开始新的支付流程时，清除旧的模拟结果
sessionStorage.removeItem("bandyMetodo");


// 2. 选择或取消支付方式
botoes.forEach(function(botao) {

    botao.addEventListener("click", function() {

        // 如果再次点击同一个按钮，就取消选择
        if (escolhido === botao.dataset.metodo) {
            escolhido = "";
        } else {
            escolhido = botao.dataset.metodo;
        }

        // 更新三个按钮的颜色和选择状态
        botoes.forEach(function(b) {

            let ativo = b.dataset.metodo === escolhido;

            b.classList.toggle("selecionado", ativo);
            b.setAttribute("aria-pressed", ativo);
        });

        // 未选择时，Continuar 按钮变灰
        continuar.disabled = escolhido === "";

    });

});


// 3. 点击 Continuar，跳转到对应页面
continuar.addEventListener("click", function() {

    if (escolhido !== "") {
        window.location.href = escolhido + ".html";
    }

});
