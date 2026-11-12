
/* ==========================================
   BANDy - Chat
   Ligação ao Mapa 2D
   ========================================== */


// 1. CONTACTO ATUAL

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

document.getElementById("userName").textContent =
    userName;

document.getElementById("userAvatar").textContent =
    contactos[user][1];

document.getElementById("profileLink").href =
    "perfil_users.html?user=" + user;

document.title = "Chat - " + userName;


// 2. FESTIVAL ATUAL

const festivaisValidos = [
    "alive",
    "kalorama",
    "primavera"
];

const festivalURL = params.get("festival");

if (festivaisValidos.includes(festivalURL)) {
    localStorage.setItem("festivalMapa", festivalURL);
}

let festivalAtualChat = "alive";

if (festivaisValidos.includes(festivalURL)) {
    festivalAtualChat = festivalURL;
} else {
    const guardado = localStorage.getItem("festivalMapa");

    if (festivaisValidos.includes(guardado)) {
        festivalAtualChat = guardado;
    }
}


// 3. PONTOS DE ENCONTRO

const pontosMapa = {
    "Palco X": "palco-x",
    "Side Stage": "side-stage",
    "Palco Y": "palco-y",
    "Palco Z": "palco-z"
};


// 4. MENSAGENS INICIAIS

const mensagensIniciais = {

    maria: [
        { type: "received", text: "Olá! Tudo bem?", time: "19:30" },
        { type: "sent", text: "Olá Maria! Sim, e contigo?", time: "19:32" },
        { type: "received", text: "Também estou bem! Já viste o cartaz do festival deste fim de semana?", time: "19:33" },
        { type: "sent", text: "Sim! Há vários artistas que quero ver!", time: "19:35" },
        { type: "received", text: "Podíamos ir juntas. O que achas?", time: "19:36" },
        { type: "sent", text: "Adorava! Já compraste os bilhetes?", time: "19:38" },
        { type: "received", text: "Ainda não, estava à espera de combinar contigo 😊", time: "19:40" },
        { type: "sent", text: "Então vamos comprar hoje!", time: "19:42" },
        { type: "received", text: "Perfeito! Até lá! 💚", time: "19:43" }
    ],

    filipe: [
        { type: "received", text: "Olá! Como estás?", time: "18:15" },
        { type: "sent", text: "Estou bem, e tu?", time: "18:18" },
        { type: "received", text: "Estás bem?", time: "18:20" }
    ],

    ana: [
        { type: "received", text: "Olá!", time: "17:30" },
        { type: "sent", text: "Olá Ana!", time: "17:32" }
    ],

    santiago: [
        { type: "received", text: "Como estás?", time: "16:00" },
        { type: "sent", text: "Tudo bem!", time: "16:05" }
    ],

    martim: [
        { type: "received", text: "Olá, tudo bem?", time: "15:25" },
        { type: "sent", text: "Sim!", time: "15:28" },
        { type: "received", text: "Ok!", time: "15:30" }
    ]
};


// 5. HISTÓRICO DO CHAT

const chaveChat = "bandyChat_" + user;

let chatMessages = mensagensIniciais[user].slice();

try {
    const guardadas = JSON.parse(
        sessionStorage.getItem(chaveChat)
    );

    if (Array.isArray(guardadas)) {
        chatMessages = guardadas;
    }

} catch (erro) {
    chatMessages = mensagensIniciais[user].slice();
}

function guardarMensagens() {

    try {
        sessionStorage.setItem(
            chaveChat,
            JSON.stringify(chatMessages)
        );
    } catch (erro) {
        // Continuar sem guardar.
    }
}


// 6. ELEMENTOS

const messages =
    document.getElementById("messages");

const messageForm =
    document.getElementById("messageForm");

const messageInput =
    document.getElementById("messageInput");

const attachmentMenu =
    document.getElementById("attachmentMenu");

const pointOverlay =
    document.getElementById("pointOverlay");

const inviteOverlay =
    document.getElementById("inviteOverlay");


// 7. HORA

function getCurrentTime() {

    return new Date().toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit"
    });
}


// 8. VERIFICAR CONVITE

function conviteAceite(item) {

    return (
        item.accepted === true ||
        /aceite|confirmado/i.test(
            String(item.status || "")
        )
    );
}


// 9. CRIAR LINK PARA O MAPA

function criarLinkMapa(item) {

    const ponto =
        pontosMapa[item.place] ||
        item.ponto;

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
        "../luisa-mapa/mapa2d.html?" +
        dados.toString();

    link.textContent = "📍 Ver percurso →";

    // Estilo direto para garantir visibilidade

    link.style.display = "flex";
    link.style.alignItems = "center";
    link.style.justifyContent = "center";
    link.style.width = "100%";
    link.style.minHeight = "48px";
    link.style.marginTop = "14px";
    link.style.padding = "12px";
    link.style.backgroundColor = "#D7FF00";
    link.style.color = "#171923";
    link.style.borderRadius = "12px";
    link.style.fontSize = "14px";
    link.style.fontWeight = "bold";
    link.style.textDecoration = "none";
    link.style.textAlign = "center";

    link.addEventListener("click", function() {

        localStorage.setItem(
            "festivalMapa",
            festival
        );

        localStorage.setItem(
            "pontoMapa",
            ponto
        );
    });

    return link;
}


// 10. MOSTRAR MENSAGENS

function showMessages() {

    messages.innerHTML = "";

    for (const item of chatMessages) {

        const message = document.createElement("div");

        // FOTOGRAFIA

        if (item.type === "photo") {

            message.className =
                "message sent photo-message";

            const image = document.createElement("img");

            image.src = item.photo;
            image.alt = "Fotografia enviada";

            message.appendChild(image);
        }

        // CONVITE

        else if (item.type === "invitation") {

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

            // BOTÃO VER PERCURSO

            if (conviteAceite(item)) {

                const link = criarLinkMapa(item);

                if (link) {
                    content.appendChild(link);
                }
            }

            message.appendChild(content);
        }

        // TEXTO

        else {

            message.className =
                "message " + item.type;

            const paragraph =
                document.createElement("p");

            paragraph.textContent = item.text || "";

            const time =
                document.createElement("span");

            time.textContent = item.time || "";

            message.appendChild(paragraph);
            message.appendChild(time);
        }

        messages.appendChild(message);
    }

    messages.scrollTop = messages.scrollHeight;
}


// Mostrar mensagens iniciais

showMessages();


// 11. ENVIAR TEXTO

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

    guardarMensagens();
    showMessages();

    messageInput.value = "";
});


// 12. MENU DE ANEXOS

document.getElementById("attachButton")
    .addEventListener("click", function() {

        attachmentMenu.classList.toggle("show");
    });


// 13. ENVIAR FOTOGRAFIA

document.getElementById("sendPhotoOption")
    .addEventListener("click", function() {

        sessionStorage.setItem(
            "bandyReturnUser",
            user
        );

        guardarMensagens();

        window.location.href =
            "album.html?return=chat.html";
    });


// Recuperar fotografia selecionada

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

    guardarMensagens();
    showMessages();

    sessionStorage.removeItem("bandySelectedPhoto");
    sessionStorage.removeItem("bandyReturnUser");
}


// 14. ABRIR PAINEL DE ENCONTRO

document.getElementById("markPointOption")
    .addEventListener("click", function() {

        attachmentMenu.classList.remove("show");

        pointOverlay.classList.add("show");
    });


// 15. FECHAR PAINEL

function closePoint() {
    pointOverlay.classList.remove("show");
}

document.getElementById("closePoint")
    .addEventListener("click", closePoint);

document.getElementById("cancelPoint")
    .addEventListener("click", closePoint);


// 16. ENVIAR CONVITE

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

        guardarMensagens();
        showMessages();
        closePoint();

        // Permitir escolher outro ponto depois

        selected.checked = false;


        // 17. SIMULAR ACEITAÇÃO

        setTimeout(function() {

            invitation.accepted = true;
            invitation.status = "✓ Convite aceite!";

            guardarMensagens();
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

                    guardarMensagens();
                    showMessages();
                }

            }, 1000);

        }, 3000);
    });


console.log("BANDy Chat + Mapa 2D - versao 6");
