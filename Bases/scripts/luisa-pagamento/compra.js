
/* =====================================
   BANDy - Dados da compra
   自动更新门票信息和订单总价
===================================== */

// 1. 读取购票页面保存的数据
const dadosCompra = sessionStorage.getItem("bandyCompra");

if (dadosCompra !== null) {

    const compra = JSON.parse(dadosCompra);

    // 2. 计算订单金额
    const preco = Number(compra.preco);
    const quantidade = Number(compra.quantidade);
    const total = preco * quantidade;

    // 把价格转换成葡萄牙欧元格式
    const totalFormatado = total.toLocaleString("pt-PT", {
        style: "currency",
        currency: "EUR"
    });


    // 3. 更新支付页面的 Total
    const valorTotal = document.querySelector(".resumo .total strong");

    if (valorTotal !== null) {
        valorTotal.textContent = totalFormatado;
    }


    // 4. 更新音乐节名称
    // 主要用于 pagamento.html
    const festival = document.getElementById("festival-compra");

    if (festival !== null) {
        festival.textContent = compra.festival;
    }


    // 5. 更新门票类型和数量
    const bilhete = document.getElementById("bilhete-compra");

    if (bilhete !== null) {

        bilhete.textContent =
            compra.tipo + " · " + quantidade +
            (quantidade === 1 ? " unidade" : " unidades");

    }


    // 6. 更新 PayPal 确认弹窗里的金额
    const textoPaypal = document.querySelector("#confirmar-paypal p");

    if (textoPaypal !== null) {

        textoPaypal.textContent =
            "Pretendes confirmar o pagamento de " +
            totalFormatado + " com PayPal?";

    }

}
