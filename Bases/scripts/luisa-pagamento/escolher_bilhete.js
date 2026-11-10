/* =====================================
   BANDy - Escolher bilhete
   选择票种、数量、计算总价
===================================== */

// 1. 获取 HTML 元素
const tipos = document.querySelectorAll(".tipo-bilhete");

const diminuir = document.getElementById("diminuir");
const aumentar = document.getElementById("aumentar");

const numeroBilhetes = document.getElementById("numeroBilhetes");
const precoTotal = document.getElementById("precoTotal");

const continuarCompra = document.getElementById("continuarCompra");


// 2. 默认选择 Passe Geral
let tipoSelecionado = "Passe Geral";
let precoUnitario = 120;
let quantidade = 1;


// 3. 统一更新数量和总价
function atualizarTotal() {

    // 单价 × 数量
    let total = precoUnitario * quantidade;

    numeroBilhetes.textContent = quantidade;

    // 葡萄牙欧元格式
    precoTotal.textContent = total.toLocaleString("pt-PT", {
        style: "currency",
        currency: "EUR"
    });

    // 不能减少到 0
    diminuir.disabled = quantidade === 1;

    // 最多购买 10 张
    aumentar.disabled = quantidade === 10;
}


// 4. 选择门票类型
tipos.forEach(function(botao) {

    botao.addEventListener("click", function() {

        // 取消之前的选中状态
        tipos.forEach(function(item) {
            item.classList.remove("selecionado");
        });

        // 当前按钮变成选中
        botao.classList.add("selecionado");

        // 读取 HTML 中的 data 属性
        tipoSelecionado = botao.dataset.tipo;
        precoUnitario = Number(botao.dataset.preco);

        atualizarTotal();
    });

});


// 5. 减少数量
diminuir.addEventListener("click", function() {

    if (quantidade > 1) {
        quantidade--;
        atualizarTotal();
    }

});


// 6. 增加数量
aumentar.addEventListener("click", function() {

    if (quantidade < 10) {
        quantidade++;
        atualizarTotal();
    }

});


// 7. 继续支付
continuarCompra.addEventListener("click", function() {

    // 把订单保存到当前浏览器会话
    const compra = {
        festival: document.getElementById("nomeFestival").textContent,
        tipo: tipoSelecionado,
        preco: precoUnitario,
        quantidade: quantidade,
        total: precoUnitario * quantidade
    };

    sessionStorage.setItem(
        "bandyCompra",
        JSON.stringify(compra)
    );

    // 进入你的 Pagamento
    window.location.href = "pagamento.html";
});


// 8. 首次打开时更新页面
atualizarTotal();
