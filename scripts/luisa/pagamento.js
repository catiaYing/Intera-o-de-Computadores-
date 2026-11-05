/* ==========================================
   PARTE 1 — 选择支付方式页面
========================================== */

// 找到第一个页面的三个支付方式按钮
const botoes = document.querySelectorAll(".metodo");

// 找到 Continuar 按钮和提示文字
const continuar = document.getElementById("continuar");
const mensagem = document.getElementById("mensagem");

// 保存用户当前选择的支付方式
let metodoSelecionado = "";


/* 只有当前页面存在 Continuar 按钮时才执行
   这样打开 mbway.html 时就不会报错 */
if (continuar !== null) {

    // 给每个支付方式按钮添加点击事件
    botoes.forEach(function(botao) {

        botao.addEventListener("click", function() {

            // 判断用户是不是点击了已经选中的按钮
            let jaSelecionado =
                botao.classList.contains("selecionado");

            // 先取消所有按钮的选中状态
            botoes.forEach(function(b) {
                b.classList.remove("selecionado");
                b.setAttribute("aria-pressed", "false");
            });

            if (jaSelecionado) {

                // 第二次点击相同按钮：取消选择
                metodoSelecionado = "";

                // Continuar 重新变灰
                continuar.disabled = true;

            } else {

                // 点击新的按钮：选中它
                botao.classList.add("selecionado");
                botao.setAttribute("aria-pressed", "true");

                // 记录选中的支付方式
                metodoSelecionado = botao.dataset.metodo;

                // 启用 Continuar
                continuar.disabled = false;
            }

            // 清除之前的提示
            mensagem.textContent = "";

        });

    });


    /* ===== 点击 Continuar ===== */

    continuar.addEventListener("click", function() {

        if (metodoSelecionado === "mbway") {

            // 跳转到同一个文件夹中的 mbway.html
            window.location.href = "mbway.html";

        } else if (metodoSelecionado === "cartao") {

            // 第三个页面尚未完成
            mensagem.textContent =
                "Pagamento por cartão em desenvolvimento.";

        } else if (metodoSelecionado === "paypal") {

            // 第四个页面尚未完成
            mensagem.textContent =
                "Pagamento por PayPal em desenvolvimento.";
        }

    });

}


/* ==========================================
   PARTE 2 — MB WAY 页面
========================================== */

// 查找 MB WAY 的表单
const formMbway = document.getElementById("form-mbway");

// 只有在 mbway.html 中才执行这部分代码
if (formMbway !== null) {

    // 获取电话号码输入框
    const numero = document.getElementById("numero");

    // 获取完成操作后的提示区域
    const resultado = document.getElementById("resultado");

    // 获取三个弹窗
    const erro = document.getElementById("erro-dialog");
    const aguardar = document.getElementById("aguardar-dialog");
    const sucesso = document.getElementById("sucesso-dialog");

    // 获取三个弹窗中的按钮
    const fecharErro = document.getElementById("fechar-erro");
    const autorizar = document.getElementById("autorizar");
    const cancelar = document.getElementById("cancelar-aguardar");
    const terminar = document.getElementById("terminar");


    /* ==================================
       2.1 验证手机号码
    ================================== */

    // 用户点击 Confirmar pagamento
    formMbway.addEventListener("submit", function(event) {

        // 阻止浏览器默认提交表单或刷新页面
        event.preventDefault();

        // 取得用户输入的电话号码
        // trim() 去除开头和结尾的空格
        let telefone = numero.value.trim();

        // 检查：必须以9开头，总共9位数字
        let formatoValido = /^9[0-9]{8}$/.test(telefone);

        if (formatoValido) {

            // 电话号码格式正确
            numero.setAttribute("aria-invalid", "false");

            // 清除之前的提示
            resultado.textContent = "";

            // 打开等待授权弹窗
            aguardar.showModal();

        } else {

            // 电话号码格式错误，输入框变红
            numero.setAttribute("aria-invalid", "true");

            // 清除之前的结果
            resultado.textContent = "";

            // 打开 Dados inválidos 弹窗
            erro.showModal();
        }

    });


    /* ==================================
       2.2 关闭错误弹窗
    ================================== */

    // 用户点击 Corrigir
    fecharErro.addEventListener("click", function() {

        // 关闭错误弹窗
        erro.close();

        // 让光标回到电话号码输入框
        numero.focus();

    });


    /* ==================================
       2.3 模拟完成 MB WAY 授权
    ================================== */

    // 用户点击等待弹窗中的 Continuar
    autorizar.addEventListener("click", function() {

        // 关闭等待授权弹窗
        aguardar.close();

        // 显示授权成功弹窗
        // 这一步仅模拟授权，没有连接真实 MB WAY
        sucesso.showModal();

    });


    /* ==================================
       2.4 取消授权等待
    ================================== */

    // 用户点击 Cancelar
    cancelar.addEventListener("click", function() {

        // 关闭等待弹窗，回到输入页面
        aguardar.close();

    });


    /* ==================================
       2.5 授权完成，点击 OK
    ================================== */

    terminar.addEventListener("click", function() {

        // 关闭授权成功弹窗
        sucesso.close();

        // 暂时显示完成提示
        resultado.textContent =
            "Autorização demonstrada com sucesso. " +
            "Nenhum pagamento real foi efetuado.";

        // 等第五个页面完成后，改成：
        // window.location.href = "confirmacao.html";

    });


    /* ==================================
       2.6 用户重新输入电话号码
    ================================== */

    numero.addEventListener("input", function() {

        // 清除红色边框
        numero.setAttribute("aria-invalid", "false");

        // 清除之前的成功提示
        resultado.textContent = "";

    });

}
