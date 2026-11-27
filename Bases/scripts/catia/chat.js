
/* BANDy - Chat */

/* =====================================================
   1. Identificar o contacto
===================================================== */

const params = new URLSearchParams(window.location.search);
let user = params.get("user");

if (user == null) {
    user = "maria";
}

/* Informações dos contactos */
let userName = "Maria";
let userAvatar = "M";

if (user === "maria") {
    userName = "Maria";
    userAvatar = "M";
} else if (user === "filipe") {
    userName = "Filipe";
    userAvatar = "F";
} else if (user === "ana") {
    userName = "Ana";
    userAvatar = "A";
} else if (user === "santiago") {
    userName = "Santiago";
    userAvatar = "S";
} else if (user === "martim") {
    userName = "Martim";
    userAvatar = "M";
}

/* Atualizar o cabeçalho */
document.getElementById("userName").textContent = userName;
document.getElementById("userAvatar").textContent = userAvatar;
document.getElementById("profileLink").href =
    "perfil_users.html?user=" + encodeURIComponent(user);

document.title = "Chat - " + userName;


/* =====================================================
   2. Elementos da página
===================================================== */

const messages = document.getElementById("messages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

const attachmentMenu = document.getElementById("attachmentMenu");
const festivalOverlay = document.getElementById("festivalOverlay");
const pointOverlay = document.getElementById("pointOverlay");
const inviteOverlay = document.getElementById("inviteOverlay");

/* Chave única para cada conversa */
const storageKey = "bandy_messages_" + user;


/* =====================================================
   3. Mensagens iniciais
===================================================== */

/*
   Estas mensagens são apenas mensagens de demonstração.
   São guardadas uma única vez.

   Depois disso, o Chat utiliza as mensagens guardadas
   no localStorage e não volta a substituir a conversa.
*/

function createInitialMessages() {
    const now = Date.now();

    if (user === "maria") {
        return [
            {
                type: "received",
                text: "Olá! Tudo bem?",
                time: "19:30",
                timestamp: now - 9 * 60000
            },
            {
                type: "sent",
                text: "Olá Maria! Sim, e contigo?",
                time: "19:32",
                timestamp: now - 8 * 60000
            },
            {
                type: "received",
                text: "Também estou bem! Já viste o cartaz do festival deste fim de semana?",
                time: "19:33",
                timestamp: now - 7 * 60000
            },
            {
                type: "sent",
                text: "Sim! Há vários artistas que quero ver!",
                time: "19:35",
                timestamp: now - 6 * 60000
            },
            {
                type: "received",
                text: "Podíamos ir juntas. O que achas?",
                time: "19:36",
                timestamp: now - 5 * 60000
            },
            {
                type: "sent",
                text: "Adorava! Já compraste os bilhetes?",
                time: "19:38",
                timestamp: now - 4 * 60000
            },
            {
                type: "received",
                text: "Ainda não, estava à espera de combinar contigo 😊",
                time: "19:40",
                timestamp: now - 3 * 60000
            },
            {
                type: "sent",
                text: "Então vamos comprar hoje!",
                time: "19:42",
                timestamp: now - 2 * 60000
            },
            {
                type: "received",
                text: "Perfeito! Até lá! 💚",
                time: "19:43",
                timestamp: now - 1 * 60000
            }
        ];
    }

    if (user === "filipe") {
        return [
            {
                type: "received",
                text: "Olá! Como estás?",
                time: "18:15",
                timestamp: now - 3 * 60000
            },
            {
                type: "sent",
                text: "Estou bem, e tu?",
                time: "18:18",
                timestamp: now - 2 * 60000
            },
            {
                type: "received",
                text: "Estás bem?",
                time: "18:20",
                timestamp: now - 1 * 60000
            }
        ];
    }

    if (user === "ana") {
        return [
            {
                type: "received",
                text: "Olá!",
                time: "17:30",
                timestamp: now - 2 * 60000
            },
            {
                type: "sent",
                text: "Olá Ana!",
                time: "17:32",
                timestamp: now - 1 * 60000
            }
        ];
    }

    if (user === "santiago") {
        return [
            {
                type: "received",
                text: "Como estás?",
                time: "16:00",
                timestamp: now - 2 * 60000
            },
            {
                type: "sent",
                text: "Tudo bem!",
                time: "16:05",
                timestamp: now - 1 * 60000
            }
        ];
    }

    if (user === "martim") {
        return [
            {
                type: "received",
                text: "Olá, tudo bem?",
                time: "15:25",
                timestamp: now - 2 * 60000
            },
            {
                type: "sent",
                text: "Sim!",
                time: "15:28",
                timestamp: now - 1 * 60000
            },
            {
                type: "received",
                text: "Ok!",
                time: "15:30",
                timestamp: now - 1 * 30000
            }
        ];
    }

    return [];
}


/* =====================================================
   4. Carregar e guardar mensagens
===================================================== */

/* Carregar mensagens guardadas */
function loadMessages() {
    try {
        const saved = localStorage.getItem(storageKey);

        if (saved !== null) {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
    }

    /* Se ainda não existir conversa, criar mensagens iniciais */
    const initialMessages = createInitialMessages();

    saveMessages(initialMessages);

    return initialMessages;
}


/* Guardar mensagens no formato partilhado com contactos.js */
function saveMessages(list) {
    try {
        const formattedMessages = list.map(item => {

            let text = "";

            if (item.type === "photo") {
                text = "📷 Fotografia";
            } else if (item.type === "invitation") {
                text = "📍 Convite: " + item.place;
            } else {
                text = item.text || "";
            }

            return {
                ...item,

                /* Campos usados por contactos.js */
                text: text,
                timestamp: item.timestamp || Date.now(),
                sender: item.type === "sent" ? "me" : "contact"
            };
        });

        localStorage.setItem(
            storageKey,
            JSON.stringify(formattedMessages)
        );

        /*
           O evento storage atualiza automaticamente
           outras páginas ou separadores.

           Este evento personalizado atualiza a página
           atual quando necessário.
        */
        window.dispatchEvent(
            new Event("mensagensAtualizadas")
        );

    } catch (error) {
        console.error("Erro ao guardar mensagens:", error);
    }
}


/* Mensagens da conversa atual */
let chatMessages = loadMessages();


/* =====================================================
   5. Hora atual
===================================================== */

function getCurrentTime() {
    return new Date().toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit"
    });
}


/* =====================================================
   6. Mostrar mensagens
===================================================== */

function showMessages() {

    messages.innerHTML = "";

    for (let i = 0; i < chatMessages.length; i++) {

        const item = chatMessages[i];

        const message = document.createElement("div");

        /* Fotografia */
        if (item.type === "photo") {

            message.className = "message sent photo-message";

            const image = document.createElement("img");
            image.src = item.photo;
            image.alt = "Fotografia enviada";

            message.appendChild(image);

            const time = document.createElement("span");
            time.textContent = item.time || "";

            message.appendChild(time);

        }

        /* Convite de ponto de encontro */
        else if (item.type === "invitation") {

            message.className = "message sent point-message";

            const content = document.createElement("div");
            content.className = "point-invitation";

            const title = document.createElement("strong");
            title.textContent = "Ponto de encontro";

            const festival = document.createElement("p");
            festival.textContent = "Festival: " + item.festival;

            const place = document.createElement("h3");
            place.textContent = item.place;

            const description = document.createElement("p");
            description.textContent =
                "Convite enviado a " + userName + ".";

            const status = document.createElement("span");
            status.className = "invitation-status";
            status.textContent = item.status;

            if (item.accepted === true) {
                status.classList.add("accepted");
            }

            content.appendChild(title);
            content.appendChild(festival);
            content.appendChild(place);
            content.appendChild(description);
            content.appendChild(status);

            /* Botão Ver Percurso */
            const routeButton = document.createElement("a");
            routeButton.className = "botao-ver-percurso";
            routeButton.href =
                "mapa.html?local=" +
                encodeURIComponent(item.place);
            routeButton.textContent = "Ver Percurso";

            content.appendChild(routeButton);
            message.appendChild(content);
        }

        /* Mensagem de texto */
        else {

            message.className = "message " + item.type;

            const paragraph = document.createElement("p");
            paragraph.textContent = item.text || "";

            const time = document.createElement("span");
            time.textContent = item.time || "";

            message.appendChild(paragraph);
            message.appendChild(time);
        }

        messages.appendChild(message);
    }

    messages.scrollTop = messages.scrollHeight;
}


/* Mostrar mensagens ao abrir o Chat */
showMessages();


/* =====================================================
   7. Enviar mensagem
===================================================== */

messageForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const text = messageInput.value.trim();

    if (text === "") {
        return;
    }

    const newMessage = {
        type: "sent",
        text: text,
        time: getCurrentTime(),
        timestamp: Date.now()
    };

    chatMessages.push(newMessage);

    /* Guardar para sincronizar com Contactos */
    saveMessages(chatMessages);

    showMessages();

    messageInput.value = "";
});


/* =====================================================
   8. Menu de anexos
===================================================== */

document.getElementById("attachButton")
    .addEventListener("click", function() {

        attachmentMenu.classList.toggle("show");
    });


/* =====================================================
   9. Abrir álbum
===================================================== */

document.getElementById("sendPhotoOption")
    .addEventListener("click", function() {

        sessionStorage.setItem(
            "bandyReturnUser",
            user
        );

        window.location.href =
            "album.html?return=chat.html";
    });


/* =====================================================
   10. Receber fotografia do álbum
===================================================== */

const selectedPhoto =
    sessionStorage.getItem("bandySelectedPhoto");

const returnUser =
    sessionStorage.getItem("bandyReturnUser");

if (
    selectedPhoto !== null &&
    (returnUser === null || returnUser === user)
) {

    const photoMessage = {
        type: "photo",
        photo: selectedPhoto,
        time: getCurrentTime(),
        timestamp: Date.now()
    };

    chatMessages.push(photoMessage);

    saveMessages(chatMessages);

    showMessages();

    sessionStorage.removeItem("bandySelectedPhoto");
    sessionStorage.removeItem("bandyReturnUser");
}


/* =====================================================
   11. Escolher Festival
===================================================== */

document.getElementById("markPointOption")
    .addEventListener("click", function() {

        attachmentMenu.classList.remove("show");
        festivalOverlay.classList.add("show");
    });


/* Fechar Festival */
function closeFestival() {
    festivalOverlay.classList.remove("show");
}

document.getElementById("closeFestival")
    .addEventListener("click", closeFestival);

document.getElementById("cancelFestival")
    .addEventListener("click", closeFestival);


/* Confirmar Festival e abrir escolha do Palco */
document.getElementById("confirmFestival")
    .addEventListener("click", function() {

        const selectedFestival =
            document.querySelector(
                'input[name="festival"]:checked'
            );

        if (selectedFestival === null) {
            alert("Escolhe primeiro um festival.");
            return;
        }

        sessionStorage.setItem(
            "festivalSelecionado",
            selectedFestival.value
        );

        closeFestival();

        pointOverlay.classList.add("show");
    });


/* =====================================================
   12. Escolher ponto de encontro
===================================================== */

/* Fechar painel de Palco */
function closePoint() {
    pointOverlay.classList.remove("show");
}

document.getElementById("closePoint")
    .addEventListener("click", closePoint);

document.getElementById("cancelPoint")
    .addEventListener("click", closePoint);


/* Enviar convite */
document.getElementById("confirmPoint")
    .addEventListener("click", function() {

        const selected = document.querySelector(
            'input[name="meetingPoint"]:checked'
        );

        if (selected === null) {
            alert("Escolhe primeiro um local.");
            return;
        }

        const selectedFestival =
            sessionStorage.getItem("festivalSelecionado");

        if (selectedFestival === null) {

            alert("Escolhe primeiro um festival.");

            closePoint();

            festivalOverlay.classList.add("show");

            return;
        }

        const invitation = {
            type: "invitation",
            festival: selectedFestival,
            place: selected.value,
            status: "A aguardar confirmação...",
            accepted: false,
            time: getCurrentTime(),
            timestamp: Date.now()
        };

        chatMessages.push(invitation);

        saveMessages(chatMessages);

        showMessages();

        closePoint();

        sessionStorage.removeItem("festivalSelecionado");


        /* Simular aceitação do convite */
        setTimeout(function() {

            invitation.status = "✓ Convite aceite!";
            invitation.accepted = true;

            saveMessages(chatMessages);

            showMessages();

            inviteOverlay.classList.add("show");

            let seconds = 3;

            const countdown =
                document.getElementById("countdown");

            countdown.textContent = seconds;

            const timer = setInterval(function() {

                seconds--;

                countdown.textContent = seconds;

                if (seconds <= 0) {

                    clearInterval(timer);

                    inviteOverlay.classList.remove("show");

                    invitation.status =
                        "✓ Encontro confirmado!";

                    invitation.time = getCurrentTime();
                    invitation.timestamp = Date.now();

                    saveMessages(chatMessages);

                    showMessages();
                }

            }, 1000);

        }, 3000);

    });
