// ========================================
// BANDy - Opções do Perfil
// ========================================


// ===== 1. IDENTIFICAR A SECÇÃO =====

const parametros = new URLSearchParams(
    window.location.search
);

const secao = parametros.get("secao");


// ===== 2. SECÇÕES DISPONÍVEIS =====

const secoes = {
    notificacoes: "Notificações",
    metodos: "Métodos de pagamento",
    definicoes: "Definições",
    dados: "Dados pessoais"
};


// ===== 3. MOSTRAR A SECÇÃO ESCOLHIDA =====

if (!Object.prototype.hasOwnProperty.call(secoes, secao)) {

    // Voltar ao Perfil de Rodrigo
    window.location.replace(
        "rodrigo/perfil.html"
    );

} else {

    document.getElementById(
        "titulo-pagina"
    ).textContent = secoes[secao];

    document.title = secoes[secao] + " - BANDy";

    document.getElementById(
        "pagina-" + secao
    ).hidden = false;

}


// ========================================
// 4. GUARDAR E LER PREFERÊNCIAS
// ========================================

// Guardar informações no navegador.
function guardar(chave, valor) {

    try {
        localStorage.setItem(chave, valor);

    } catch (erro) {
        console.warn(
            "Não foi possível guardar a preferência.",
            erro
        );
    }

}


// Ler informações guardadas.
function ler(chave, padrao) {

    try {

        const valor = localStorage.getItem(chave);

        return valor === null ? padrao : valor;

    } catch (erro) {

        return padrao;

    }

}


// ========================================
// 5. NOTIFICAÇÕES
// ========================================

const botaoLidas = document.getElementById(
    "marcar-lidas"
);

const estadoNotificacoes = document.getElementById(
    "estado-notificacoes"
);


// Atualizar estado das notificações.
function atualizarNotificacoes() {

    const lidas =
        ler("bandy_notificacoes_lidas", "false") === "true";

    document.querySelectorAll(
        ".notificacao"
    ).forEach(function(item) {

        item.classList.toggle("lida", lidas);

    });

    botaoLidas.disabled = lidas;

    estadoNotificacoes.textContent = lidas
        ? "Todas as notificações estão marcadas como lidas."
        : "";

}


// Marcar notificações como lidas.
botaoLidas.addEventListener("click", function() {

    guardar(
        "bandy_notificacoes_lidas",
        "true"
    );

    atualizarNotificacoes();

});

atualizarNotificacoes();


// ========================================
// 6. DEFINIÇÕES
// ========================================

const notificacoesAtivas = document.getElementById(
    "ativar-notificacoes"
);

const perfilPrivado = document.getElementById(
    "perfil-privado"
);

const ocultarDados = document.getElementById(
    "ocultar-dados"
);

const estadoDefinicoes = document.getElementById(
    "estado-definicoes"
);

const estadoDados = document.getElementById(
    "estado-dados"
);


// Carregar preferências de notificações.
notificacoesAtivas.checked =
    ler("bandy_avisos_ativos", "true") === "true";


// Guardar preferência de notificações.
notificacoesAtivas.addEventListener(
    "change",
    function() {

        guardar(
            "bandy_avisos_ativos",
            String(notificacoesAtivas.checked)
        );

        estadoDefinicoes.textContent =
            "Preferência guardada neste navegador.";

    }
);


// ========================================
// 7. PRIVACIDADE
// ========================================

// Atualizar os dois controlos de privacidade.
function atualizarPrivacidade() {

    const privado =
        ler("bandy_perfil_privado", "false") === "true";

    perfilPrivado.checked = privado;

    ocultarDados.checked = privado;

    estadoDados.textContent = privado
        ? "Perfil privado ativado."
        : "Perfil privado desativado.";

}


// Alterar privacidade nas Definições.
perfilPrivado.addEventListener(
    "change",
    function() {

        guardar(
            "bandy_perfil_privado",
            String(perfilPrivado.checked)
        );

        atualizarPrivacidade();

        estadoDefinicoes.textContent =
            "Preferência de privacidade guardada.";

    }
);


// Alterar privacidade nos Dados Pessoais.
ocultarDados.addEventListener(
    "change",
    function() {

        guardar(
            "bandy_perfil_privado",
            String(ocultarDados.checked)
        );

        atualizarPrivacidade();

    }
);


// Carregar a privacidade ao abrir a página.
atualizarPrivacidade();
