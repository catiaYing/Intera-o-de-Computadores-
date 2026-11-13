
/* BANDy - Chat + Festivais + Mapa 2D */

// 1. Utilizador da conversa

const params = new URLSearchParams(window.location.search);

const contactos = {
    maria: ["Maria", "M"],
    filipe: ["Filipe", "F"],
    ana: ["Ana", "A"],
    santiago: ["Santiago", "S"],
    martim: ["Martim", "M"]
};

let user =
    params.get("user") ||
    sessionStorage.getItem("bandyReturnUser") ||
    "maria";

if (!contactos[user]) {
    user = "maria";
}

const userName = contactos[user][0];

document.getElementById("userName").textContent = userName;
document.getElementById("userAvatar").textContent = contactos[user][1];

document.getElementById("profileLink").href =
    "perfil_users.html?user=" + user;

document.title = "Chat - " + userName;


// 2. Festival atual

const festivaisValidos = [
    "alive",
    "kalorama",
    "primavera"
];

const festivalURL = params.get("festival");

if (festivaisValidos.includes(festivalURL)) {
    localStorage.setItem("festivalMapa", festivalURL);
}

let festivalAtualChat =
    festivaisValidos.includes(festivalURL)
        ? festivalURL
        : (
            festivaisValidos.includes(
                localStorage.getItem("festivalMapa")
            )
                ? localStorage.getItem("festivalMapa")
                : "alive"
        );


// 3. Correspondência entre palcos e mapa

const pontosMapa = {
    "Palco X": "palco-x",
    "Side Stage": "side-stage",
    "Palco Y": "palco-y",
    "Palco Z": "palco-z"
};


// 4. Mensagens iniciais

const mensagensIniciais = {

    maria: [
        {
            type: "received",
            text: "Olá! Tudo bem?",
            time: "19:30"
        },
        {
            type: "sent",
            text: "Olá Maria! Sim, e contigo?",
            time: "19:32"
        },
        {
            type: "received",
            text: "Também estou bem! Já viste o cartaz do festival deste fim de semana?",
            time: "19:33"
        },
        {
            type: "sent",
            text: "Sim! Há vários artistas que quero ver!",
            time: "19:35"
        },
        {
            type: "received",
            text: "Podíamos ir juntas. O que achas?",
            time: "19:36"
        },
        {
            type: "sent",
            text: "Adorava! Já compraste os bilhetes?",
            time: "19:38"
        },
        {
            type: "received",
            text: "Ainda não, estava à espera de combinar contigo 😊",
            time: "19:40"
        },
        {
            type: "sent",
            text: "Então vamos comprar hoje!",
            time: "19:42"
        },
        {
            type: "received",
            text: "Perfeito! Até lá! 💚",
            time: "19:43"
        }
    ],

    filipe: [
        {
            type: "received",
            text: "Olá! Como estás?",
            time: "18:15"
        },
        {
            type: "sent",
            text: "Estou bem, e tu?",
            time: "18:18"
        },
        {
            type: "received",
            text: "Estás bem?",
            time: "18:20"
        }
    ],

    ana: [
        {
            type: "received",
            text: "Olá!",
            time: "17:30"
        },
        {
            type: "sent",
            text: "Olá Ana!",
            time: "17:32"
        }
    ],

    santiago: [
        {
            type: "received",
            text: "Como estás?",
            time: "16:00"
        },
        {
            type: "sent",
            text: "Tudo bem!",
            time: "16:05"
        }
    ],

    martim: [
        {
            type: "received",
            text: "Olá, tudo bem?",
            time: "15:25"
        },
        {
            type: "sent",
            text: "Sim!",
            time: "15:28"
        },
        {
            type: "received",
            text: "Ok!",
            time: "15:30"
        }
    ]
};


// 5. Mensagens

let chatMessages = mensagensIniciais[user].slice();


// 6. Elementos HTML

const messages = document.getElementById("messages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

const attachmentMenu =
    document.getElementById("attachmentMenu");

const festivalOverlay =
    document.getElementById("festivalOverlay");

const pointOverlay =
    document.getElementById("pointOverlay");

const inviteOverlay =
    document.getElementById("inviteOverlay");


// 7. Funções auxiliares

function getCurrentTime() {
    return new Date().toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function conviteAceite(item) {
    return item.accepted === true ||
        /aceite|confirmado/i.test(
            String(item.status || "")
        );
}


// 8. Link para o Mapa 2D

function criarLinkMapa(item) {

    const ponto = pontosMapa[item.place] || item.ponto;

    if (!ponto) {
        return null;
    }

    const festival =
        festivaisValidos.includes(item.festival)
            ? item.festival
            : festivalAtualChat;

    const dados = new URLSearchParams({
        festival: festival,
        ponto: ponto,
        origem: "chat",
        user: user
    });

    const link = document.createElement("a");

    link.className = "botao-ver-percurso";

    link.href =
        "../luisa-mapa/mapa2d.html?" + dados.toString();

    link.textContent = "📍 Ver percurso →";

    link.addEventListener("click", function() {

        localStorage.setItem("festivalMapa", festival);
        localStorage.setItem("pontoMapa", ponto);

    });

    return link;
}


// 9. Mostrar mensagens

function showMessages() {

    messages.innerHTML = "";

    for (const item of chatMessages) {

        const message = document.createElement("div");

        if (item.type === "photo") {

            message.className =
                "message sent photo-message";

            const image = document.createElement("img");

            image.src = item.photo;
            image.alt = "Fotografia enviada";

            message.appendChild(image);

        } else if (item.type === "invitation") {

            message.className =
                "message sent point-message";

            const content = document.createElement("div");
            content.className = "point-invitation";

            const title = document.createElement("strong");
            title.textContent = "Ponto de encontro";

            const place = document.createElement("h3");
            place.textContent =
                item.place || "Ponto de encontro";

            const description = document.createElement("p");
            description.textContent =
                "Convite enviado a " + userName + ".";

            const status = document.createElement("span");
            status.className = "invitation-status";

            status.textContent =
                item.status || "A aguardar confirmação...";

            if (conviteAceite(item)) {
                status.classList.add("accepted");
            }

            content.appendChild(title);
            content.appendChild(place);
            content.appendChild(description);
            content.appendChild(status);

            if (conviteAceite(item)) {

                const link = criarLinkMapa(item);

                if (link) {
                    content.appendChild(link);
                }
            }

            message.appendChild(content);

        } else {

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


// 10. Enviar mensagem

showMessages();

messageForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const texto = messageInput.value.trim();

    if (!texto) {
        return;
    }

    chatMessages.push({
        type: "sent",
        text: texto,
        time: getCurrentTime()
    });

    showMessages();

    messageInput.value = "";
});


// 11. Menu de anexos

document.getElementById("attachButton")
    .addEventListener("click", function() {

        attachmentMenu.classList.toggle("show");

    });


// 12. Enviar fotografia

document.getElementById("sendPhotoOption")
    .addEventListener("click", function() {

        sessionStorage.setItem("bandyReturnUser", user);

        window.location.href =
            "album.html?return=chat.html";

    });

const selectedPhoto =
    sessionStorage.getItem("bandySelectedPhoto");

const returnUser =
    sessionStorage.getItem("bandyReturnUser");

if (
    selectedPhoto !== null &&
    (returnUser === null || returnUser === user)
) {

    chatMessages.push({
        type: "photo",
        photo: selectedPhoto,
        time: getCurrentTime()
    });

    showMessages();

    sessionStorage.removeItem("bandySelectedPhoto");
    sessionStorage.removeItem("bandyReturnUser");
}


// ==========================================
// 13. ESCOLHER FESTIVAL - NOVO
// ==========================================

// Abrir a escolha do festival

document.getElementById("markPointOption")
    .addEventListener("click", function() {

        attachmentMenu.classList.remove("show");

        // Selecionar o festival atual
        const opcao = document.querySelector(
            'input[name="festivalChoice"][value="' +
            festivalAtualChat + '"]'
        );

        if (opcao) {
            opcao.checked = true;
        }

        festivalOverlay.classList.add("show");
    });


// Fechar o modal

function fecharFestival() {
    festivalOverlay.classList.remove("show");
}

document.getElementById("closeFestival")
    .addEventListener("click", fecharFestival);

document.getElementById("cancelFestival")
    .addEventListener("click", fecharFestival);


// Confirmar o festival

document.getElementById("confirmFestival")
    .addEventListener("click", function() {

        const selecionado = document.querySelector(
            'input[name="festivalChoice"]:checked'
        );

        if (!selecionado) {
            alert("Escolhe um festival.");
            return;
        }

        festivalAtualChat = selecionado.value;

        localStorage.setItem(
            "festivalMapa",
            festivalAtualChat
        );

        // Depois de escolher o festival,
        // abrir a escolha do palco

        fecharFestival();

        pointOverlay.classList.add("show");
    });


// ==========================================
// 14. ESCOLHER PONTO DE ENCONTRO
// ==========================================

function closePoint() {
    pointOverlay.classList.remove("show");
}

document.getElementById("closePoint")
    .addEventListener("click", closePoint);

document.getElementById("cancelPoint")
    .addEventListener("click", closePoint);


// 15. Enviar convite

document.getElementById("confirmPoint")
    .addEventListener("click", function() {

        const selected = document.querySelector(
            'input[name="meetingPoint"]:checked'
        );

        if (!selected) {
            alert("Escolhe primeiro um local.");
            return;
        }

        const ponto = pontosMapa[selected.value];

        if (!ponto) {
            alert("Ponto de encontro inválido.");
            return;
        }

        const invitation = {

            type: "invitation",

            place: selected.value,

            ponto: ponto,

            festival: festivalAtualChat,

            status: "A aguardar confirmação...",

            accepted: false
        };

        chatMessages.push(invitation);

        showMessages();

        closePoint();

        selected.checked = false;


        // Simulação da aceitação do convite

        setTimeout(function() {

            invitation.accepted = true;
            invitation.status = "✓ Convite aceite!";

            showMessages();

            inviteOverlay.classList.add("show");

            let seconds = 3;

            const countdown =
                document.getElementById("countdown");

            countdown.textContent = seconds;

            const timer = setInterval(function() {

                seconds--;

                countdown.textContent =
                    Math.max(0, seconds);

                if (seconds <= 0) {

                    clearInterval(timer);

                    inviteOverlay.classList.remove("show");

                    invitation.status =
                        "✓ Encontro confirmado!";

                    showMessages();
                }

            }, 1000);

        }, 3000);

    });


console.log("BANDy Chat + Festival + Mapa - v7");
