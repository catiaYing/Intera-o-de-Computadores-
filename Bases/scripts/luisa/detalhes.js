// ========================================
// BANDy - Detalhes do Festival
// ========================================


// ===== 1. DADOS DOS FESTIVAIS =====

// Dados de demonstração utilizados no projeto.

const festivais = {

    "MEO Alive": {
        data: "10 – 12 Junho 2027",
        local: "Algés, Lisboa",
        genero: "Pop, Rock e Indie",

        descricao:
            "Vive três dias de música ao vivo, " +
            "concertos e experiências inesquecíveis. " +
            "Descobre novos artistas e partilha " +
            "momentos especiais com os teus amigos.",

        artistas: [
            "Cartaz a anunciar"
        ],

        preco: 45
    },


    "Primavera Sound": {
        data: "12 – 14 Junho 2027",
        local: "Porto",
        genero: "Indie, Rock e Alternativa",

        descricao:
            "Descobre uma programação diversificada " +
            "de música alternativa e desfruta de uma " +
            "experiência cultural única na cidade do Porto.",

        artistas: [
            "Cartaz a anunciar"
        ],

        preco: 75
    },


    "Sumol Summer Fest": {
        data: "3 – 4 Julho 2027",
        local: "Ericeira",
        genero: "Hip-Hop, Pop e Música Urbana",

        descricao:
            "Combina música, praia e diversão num " +
            "festival de verão cheio de energia. " +
            "Desfruta de concertos e bons momentos " +
            "com os teus amigos.",

        artistas: [
            "Cartaz a anunciar"
        ],

        preco: 45
    },


    "Meo Kalorama": {
        data: "29 Agosto 2027",
        local: "Lisboa",
        genero: "Pop, Rock e Eletrónica",

        descricao:
            "Descobre uma experiência que reúne " +
            "música, arte e cultura, com diferentes " +
            "estilos musicais num ambiente vibrante.",

        artistas: [
            "Cartaz a anunciar"
        ],

        preco: 65
    }

};


// ===== 2. IDENTIFICAR O FESTIVAL =====

// Exemplo:
// detalhes.html?festival=MEO%20Alive

const parametros = new URLSearchParams(
    window.location.search
);

const nomeFestival = parametros.get("festival");

const festival = festivais[nomeFestival];


// ===== 3. VALIDAR FESTIVAL =====

if (!festival) {

    // Se o festival não existir,
    // voltar à página de pesquisa.

    window.location.replace(
        "../rodrigo/pesquisar.html"
    );

} else {

    mostrarDetalhes();

}


// ===== 4. MOSTRAR INFORMAÇÕES =====

function mostrarDetalhes() {

    // Nome na capa
    document.getElementById(
        "nome-capa"
    ).textContent = nomeFestival;


    // Nome principal
    document.getElementById(
        "nome-festival"
    ).textContent = nomeFestival;


    // Data
    document.getElementById(
        "data-festival"
    ).textContent = festival.data;


    // Localização
    document.getElementById(
        "local-festival"
    ).textContent = festival.local;


    // Género musical
    document.getElementById(
        "genero-festival"
    ).textContent = festival.genero;


    // Descrição
    document.getElementById(
        "descricao-festival"
    ).textContent = festival.descricao;


    // Preço mínimo
    document.getElementById(
        "preco-festival"
    ).textContent =
        "Desde " +
        festival.preco.toFixed(2).replace(".", ",") +
        " €";


    // Mostrar artistas
    mostrarArtistas();


    // Configurar botão de compra
    configurarCompra();

}


// ===== 5. MOSTRAR ARTISTAS =====

function mostrarArtistas() {

    const lista = document.getElementById(
        "lista-artistas"
    );

    lista.replaceChildren();

    festival.artistas.forEach(function(nomeArtista) {

        const elemento = document.createElement(
            "span"
        );

        elemento.className = "artista";

        elemento.textContent = nomeArtista;

        lista.appendChild(elemento);

    });

}


// ===== 6. CONTINUAR PARA BILHETES =====

function configurarCompra() {

    const botao = document.getElementById(
        "comprar"
    );

    botao.addEventListener("click", function() {

        const destino = new URL(
            "../rodrigo/selecionar_bilhete.html",
            window.location.href
        );

        // Enviar o festival escolhido
        destino.searchParams.set(
            "festival",
            nomeFestival
        );

        window.location.href = destino.href;

    });

}
