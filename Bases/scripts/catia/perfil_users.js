
const CHAVE_AMIGOS_REMOVIDOS = "bandy_amigos_removidos";

/* =========================
   Dados dos perfis
========================= */

const perfis = {
    maria: {
        nome: "Maria",
        avatar: "M",
        id: "@maria_123",
        fotos: 3,
        amigos: 4,
        favoritos: 5,
        fotografias: ["Foto 1", "Foto 2", "Foto 3"],
        artistas: ["Taylor Swift", "The Weeknd", "Dua Lipa"],
        musicas: ["Cruel Summer", "Blinding Lights", "Levitating"]
    },

    filipe: {
        nome: "Filipe",
        avatar: "F",
        id: "@filipe_456",
        fotos: 4,
        amigos: 8,
        favoritos: 6,
        fotografias: ["Foto 1", "Foto 2", "Foto 3", "Foto 4"],
        artistas: ["Drake", "The Weeknd", "Travis Scott"],
        musicas: ["One Dance", "Starboy", "Goosebumps"]
    },

    ana: {
        nome: "Ana",
        avatar: "A",
        id: "@ana_789",
        fotos: 5,
        amigos: 12,
        favoritos: 7,
        fotografias: ["Foto 1", "Foto 2", "Foto 3", "Foto 4", "Foto 5"],
        artistas: ["Olivia Rodrigo", "Sabrina Carpenter", "Billie Eilish"],
        musicas: ["drivers license", "Espresso", "Birds of a Feather"]
    },

    santiago: {
        nome: "Santiago",
        avatar: "S",
        id: "@santiago_321",
        fotos: 2,
        amigos: 6,
        favoritos: 4,
        fotografias: ["Foto 1", "Foto 2"],
        artistas: ["Coldplay", "Imagine Dragons", "Maroon 5"],
        musicas: ["Viva La Vida", "Believer", "Memories"]
    },

    martim: {
        nome: "Martim",
        avatar: "M",
        id: "@martim_654",
        fotos: 3,
        amigos: 9,
        favoritos: 5,
        fotografias: ["Foto 1", "Foto 2", "Foto 3"],
        artistas: ["Ed Sheeran", "Justin Bieber", "Bruno Mars"],
        musicas: ["Perfect", "Love Yourself", "Talking to the Moon"]
    }
};


/* =========================
   Identificar o perfil atual
========================= */

const parametros = new URLSearchParams(window.location.search);

const userId = parametros.get("user") || "maria";

const perfil = perfis[userId] || perfis.maria;


/* =========================
   Atualizar informações
   do perfil
========================= */

function atualizarPerfil() {

    const avatar = document.getElementById("profileAvatar");
    const nome = document.getElementById("profileName");
    const id = document.getElementById("profileId");

    if (avatar) {
        avatar.textContent = perfil.avatar;
    }

    if (nome) {
        nome.textContent = perfil.nome;
    }

    if (id) {
        id.textContent = perfil.id;
    }

    document.title = "Perfil - " + perfil.nome;

    // Estatísticas
    const photoCount = document.getElementById("photoCount");
    const friendCount = document.getElementById("friendCount");
    const favoriteCount = document.getElementById("favoriteCount");

    if (photoCount) {
        photoCount.textContent = perfil.fotos;
    }

    if (friendCount) {
        friendCount.textContent = perfil.amigos;
    }

    if (favoriteCount) {
        favoriteCount.textContent = perfil.favoritos;
    }

    // Fotografias
    const photoGrid = document.getElementById("photoGrid");

    if (photoGrid) {
        photoGrid.innerHTML = "";

        perfil.fotografias.forEach((foto, index) => {
            const elemento = document.createElement("div");

            elemento.className = "photo-placeholder";
            elemento.textContent = foto;

            photoGrid.appendChild(elemento);
        });
    }

    // Artistas favoritos
    const artistsList = document.getElementById("artistsList");

    if (artistsList) {
        artistsList.innerHTML = "";

        perfil.artistas.forEach(artista => {
            const elemento = document.createElement("div");

            elemento.className = "favorite-item";
            elemento.textContent = artista;

            artistsList.appendChild(elemento);
        });
    }

    // Músicas favoritas
    const songsList = document.getElementById("songsList");

    if (songsList) {
        songsList.innerHTML = "";

        perfil.musicas.forEach(musica => {
            const elemento = document.createElement("div");

            elemento.className = "favorite-item";
            elemento.textContent = musica;

            songsList.appendChild(elemento);
        });
    }

    // Botão Chat: direcionar para o utilizador correto
    const profileChat = document.getElementById("profileChat");

    if (profileChat) {
        profileChat.href = "chat.html?user=" + userId;
        profileChat.dataset.userId = userId;
    }

    // QR Code
    const qrUserId = document.getElementById("qrUserId");

    if (qrUserId) {
        qrUserId.textContent = perfil.id;
    }

    // Denúncia
    const reportTitle = document.getElementById("reportTitle");

    if (reportTitle) {
        reportTitle.textContent = "Denunciar " + perfil.nome;
    }

    // Mensagem de remoção
    const removeMessage = document.getElementById(
        "removeFriendMessage"
    );

    if (removeMessage) {
        removeMessage.textContent =
            "Queres mesmo remover " + perfil.nome +
            " dos teus amigos?";
    }

    const successMessage = document.getElementById(
        "removeFriendSuccessMessage"
    );

    if (successMessage) {
        successMessage.textContent =
            perfil.nome + " foi removido(a) dos teus amigos.";
    }
}


/* =========================
   Amigos removidos
========================= */

function obterAmigosRemovidos() {
    try {
        return JSON.parse(
            localStorage.getItem(CHAVE_AMIGOS_REMOVIDOS) || "[]"
        );
    } catch (error) {
        return [];
    }
}


function guardarAmigosRemovidos(lista) {
    localStorage.setItem(
        CHAVE_AMIGOS_REMOVIDOS,
        JSON.stringify(lista)
    );

    atualizarContactos();

    window.dispatchEvent(
        new CustomEvent("amizadesAtualizadas")
    );
}


function amigoFoiRemovido(id) {
    return obterAmigosRemovidos().includes(String(id));
}


function removerAmigo(id) {
    id = String(id);

    const removidos = obterAmigosRemovidos();

    if (!removidos.includes(id)) {
        removidos.push(id);
    }

    guardarAmigosRemovidos(removidos);
}


function adicionarAmigo(id) {
    id = String(id);

    const removidos = obterAmigosRemovidos();

    const atualizados = removidos.filter(
        item => item !== id
    );

    guardarAmigosRemovidos(atualizados);
}


function alternarAmigo(id) {
    if (amigoFoiRemovido(id)) {
        adicionarAmigo(id);
        return false;
    }

    removerAmigo(id);
    return true;
}


/* =========================
   Atualizar contactos
========================= */

function encontrarCartaoContacto(elemento) {
    return elemento.closest(
        ".conversation-row, .contact-card, .contact-item, " +
        ".contacto, .contact, li, article"
    );
}


function atualizarContactos() {
    const removidos = obterAmigosRemovidos();

    document.querySelectorAll('a[href*="user="]').forEach(link => {

        const url = new URL(link.href, window.location.href);
        const id = url.searchParams.get("user");

        if (!id) return;

        const cartao = encontrarCartaoContacto(link);

        if (!cartao) return;

        if (removidos.includes(String(id))) {
            cartao.style.display = "none";
        } else {
            cartao.style.display = "";
        }
    });
}


/* =========================
   Copiar ligação do perfil
========================= */

function copiarLink() {
    const link = window.location.href;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link)
            .then(() => {
                alert("Ligação copiada!");
            })
            .catch(() => {
                copiarLinkFallback(link);
            });
    } else {
        copiarLinkFallback(link);
    }
}


function copiarLinkFallback(link) {
    const campo = document.createElement("textarea");

    campo.value = link;
    campo.style.position = "fixed";
    campo.style.opacity = "0";

    document.body.appendChild(campo);

    campo.select();

    try {
        document.execCommand("copy");
        alert("Ligação copiada!");
    } catch (error) {
        alert("Não foi possível copiar a ligação.");
    }

    campo.remove();
}


/* =========================
   QR Code
========================= */

function abrirQR() {
    const modal = document.getElementById("qrModal");

    if (modal) {
        modal.style.display = "flex";
    }
}


function fecharQR() {
    const modal = document.getElementById("qrModal");

    if (modal) {
        modal.style.display = "none";
    }
}


/* =========================
   Denúncia
========================= */

function abrirDenuncia() {
    const modal = document.getElementById("reportModal");

    if (modal) {
        modal.style.display = "flex";
    }

    const menu = document.querySelector(".menu");

    if (menu) {
        menu.removeAttribute("open");
    }
}


function fecharDenuncia() {
    const modal = document.getElementById("reportModal");

    if (modal) {
        modal.style.display = "none";
    }
}


function fecharSucesso() {
    const modal = document.getElementById("successModal");

    if (modal) {
        modal.style.display = "none";
    }
}


/* =========================
   Remover amigo
========================= */

function fecharMenuPerfil() {
    const menu = document.querySelector(".menu");

    if (menu) {
        menu.removeAttribute("open");
    }
}


function mostrarModalRemoverAmigo() {
    fecharMenuPerfil();

    const modal = document.getElementById("removeFriendModal");

    const mensagem = document.getElementById(
        "removeFriendMessage"
    );

    if (mensagem) {
        mensagem.textContent =
            "Queres mesmo remover " + perfil.nome +
            " dos teus amigos?";
    }

    if (modal) {
        modal.style.display = "flex";
    } else {
        if (confirm("Queres remover " + perfil.nome + " dos teus amigos?")) {
            concluirRemocaoAmigo(userId, perfil.nome);
        }
    }
}


function fecharModalRemoverAmigo() {
    const modal = document.getElementById("removeFriendModal");

    if (modal) {
        modal.style.display = "none";
    }
}


function concluirRemocaoAmigo(id, nome) {
    removerAmigo(id);

    fecharModalRemoverAmigo();

    const successModal = document.getElementById(
        "removeFriendSuccessModal"
    );

    const successMessage = document.getElementById(
        "removeFriendSuccessMessage"
    );

    if (successMessage) {
        successMessage.textContent =
            nome + " foi removido(a) dos teus amigos.";
    }

    if (successModal) {
        successModal.style.display = "flex";
    } else {
        alert(nome + " foi removido(a) dos teus amigos.");
    }

    window.setTimeout(function() {
        window.location.href = "contactos.html";
    }, 900);
}


function alternarAmizade() {
    mostrarModalRemoverAmigo();
}


/* =========================
   Inicialização
========================= */

document.addEventListener("DOMContentLoaded", function() {

    // Carregar o perfil correspondente ao URL
    atualizarPerfil();

    // Atualizar contactos
    atualizarContactos();

    // Botões de cancelar remoção
    const cancelButton = document.getElementById(
        "cancelRemoveFriend"
    );

    const cancelButton2 = document.getElementById(
        "cancelRemoveFriendButton"
    );

    const confirmButton = document.getElementById(
        "confirmRemoveFriendButton"
    );

    const removeModal = document.getElementById(
        "removeFriendModal"
    );

    if (cancelButton) {
        cancelButton.addEventListener(
            "click",
            fecharModalRemoverAmigo
        );
    }

    if (cancelButton2) {
        cancelButton2.addEventListener(
            "click",
            fecharModalRemoverAmigo
        );
    }

    if (confirmButton) {
        confirmButton.addEventListener("click", function() {
            concluirRemocaoAmigo(userId, perfil.nome);
        });
    }

    // Clicar fora da janela fecha a confirmação
    if (removeModal) {
        removeModal.addEventListener("click", function(event) {
            if (event.target === removeModal) {
                fecharModalRemoverAmigo();
            }
        });
    }

    // Enviar denúncia
    const reportForm = document.getElementById("reportForm");

    if (reportForm) {
        reportForm.addEventListener("submit", function(event) {
            event.preventDefault();

            fecharDenuncia();

            const successModal = document.getElementById(
                "successModal"
            );

            if (successModal) {
                successModal.style.display = "flex";
            }

            reportForm.reset();
        });
    }

    // Fechar QR ao clicar fora
    const qrModal = document.getElementById("qrModal");

    if (qrModal) {
        qrModal.addEventListener("click", function(event) {
            if (event.target === qrModal) {
                fecharQR();
            }
        });
    }

    // Atualizar se outra página modificar amigos
    window.addEventListener("amizadesAtualizadas", function() {
        atualizarContactos();
    });

    // Atualizar se outra aba modificar amigos
    window.addEventListener("storage", function(event) {
        if (event.key === CHAVE_AMIGOS_REMOVIDOS) {
            atualizarContactos();
        }
    });
});
