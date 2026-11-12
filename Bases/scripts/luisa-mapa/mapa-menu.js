/* BANDy - Menu de mapas */

const seletorFestival = document.getElementById("festival");
const seletorPonto = document.getElementById("ponto");

seletorFestival.value = festivalAtual;
seletorPonto.value = pontoAtual;

seletorFestival.addEventListener("change", function() {
    festivalAtual = seletorFestival.value;
    pontoAtual = "palco-x";
    pontoLivre = null;

    seletorPonto.value = pontoAtual;

    guardar();
    atualizarTitulo();
    links();
});

seletorPonto.addEventListener("change", function() {
    escolherPonto(seletorPonto.value);
});

atualizarTitulo();
links();
