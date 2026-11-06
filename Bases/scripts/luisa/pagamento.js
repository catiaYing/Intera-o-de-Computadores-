
/* =====================================
   BANDy - Escolher Pagamento
   选择支付方式并跳转
===================================== */

// 1. 获取页面元素
const botoes = document.querySelectorAll(".metodo");
const continuar = document.getElementById("continuar");

// 保存用户选择的支付方式
let escolhido = "";

// 清除上一次模拟支付的状态
sessionStorage.removeItem("bandyMetodo");


// 2. 选择或取消支付方式
botoes.forEach(function(botao) {

    botao.addEventListener("click", function() {

        // 再次点击已选中的方式，就取消选择
        if (escolhido === botao.dataset.metodo) {
            escolhido = "";
        } else {
            escolhido = botao.dataset.metodo;
        }

        // 更新三个按钮的选择状态
        botoes.forEach(function(b) {

            let ativo = b.dataset.metodo === escolhido;

            b.classList.toggle("selecionado", ativo);
            b.setAttribute("aria-pressed", String(ativo));

        });

        // 没有选择时不能继续
        continuar.disabled = escolhido === "";

    });

});


// 3. 点击 Continuar 跳转
continuar.addEventListener("click", function() {

    if (escolhido !== "") {

        window.location.href = escolhido + ".html";

    }

});
