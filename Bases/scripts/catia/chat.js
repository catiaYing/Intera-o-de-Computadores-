
/* BANDy - Chat */

// Identificar o contacto
const params = new URLSearchParams(window.location.search);
let user = params.get("user");

if (user == null) {
    user = "maria";
}

// Informações dos contactos
let userName = "Maria";
let userAvatar = "M";

if (user == "maria") {
    userName = "Maria";
    userAvatar = "M";
} else if (user == "filipe") {
    userName = "Filipe";
    userAvatar = "F";
} else if (user == "ana") {
    userName = "Ana";
    userAvatar = "A";
} else if (user == "santiago") {
    userName = "Santiago";
    userAvatar = "S";
} else if (user == "martim") {
    userName = "Martim";
    userAvatar = "M";
}

// Atualizar o cabeçalho
document.getElementById("userName").textContent = userName;
document.getElementById("userAvatar").textContent = userAvatar;
document.getElementById("profileLink").href = "perfil_users.html?user=" + user;

document.title = "Chat - " + userName;


// Mensagens iniciais de cada contacto
let mariaMessages = [
    { type: "received", text: "Olá! Tudo bem?", time: "19:30" },
    { type: "sent", text: "Olá Maria! Sim, e contigo?", time: "19:32" },
    { type: "received", text: "Também estou bem! Já viste o cartaz do festival deste fim de semana?", time: "19:33" },
    { type: "sent", text: "Sim! Há vários artistas que quero ver!", time: "19:35" },
    { type: "received", text: "Podíamos ir juntas. O que achas?", time: "19:36" },
    { type: "sent", text: "Adorava! Já compraste os bilhetes?", time: "19:38" },
    { type: "received", text: "Ainda não, estava à espera de combinar contigo 😊", time: "19:40" },
    { type: "sent", text: "Então vamos comprar hoje!", time: "19:42" },
    { type: "received", text: "Perfeito! Até lá! 💚", time: "19:43" }
];

let filipeMessages = [
    { type: "received", text: "Olá! Como estás?", time: "18:15" },
    { type: "sent", text: "Estou bem, e tu?", time: "18:18" },
    { type: "received", text: "Estás bem?", time: "18:20" }
];

let anaMessages = [
    { type: "received", text: "Olá!", time: "17:30" },
    { type: "sent", text: "Olá Ana!", time: "17:32" }
];

let santiagoMessages = [
    { type: "received", text: "Como estás?", time: "16:00" },
    { type: "sent", text: "Tudo bem!", time: "16:05" }
];

let martimMessages = [
    { type: "received", text: "Olá, tudo bem?", time: "15:25" },
    { type: "sent", text: "Sim!", time: "15:28" },
    { type: "received", text: "Ok!", time: "15:30" }
];


// Escolher as mensagens do contacto atual
let chatMessages = mariaMessages;

if (user == "maria") {
    chatMessages = mariaMessages;
} else if (user == "filipe") {
    chatMessages = filipeMessages;
} else if (user == "ana") {
    chatMessages = anaMessages;
} else if (user == "santiago") {
    chatMessages = santiagoMessages;
} else if (user == "martim") {
    chatMessages = martimMessages;
}



// Elementos da página
const messages = document.getElementById("messages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

const attachmentMenu = document.getElementById("attachmentMenu");
const pointOverlay = document.getElementById("pointOverlay");
const inviteOverlay = document.getElementById("inviteOverlay");


// Obter a hora atual
function getCurrentTime() {
    return new Date().toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit"
    });
}




// Mostrar mensagens
function showMessages() {

    messages.innerHTML = "";

    for (let i = 0; i < chatMessages.length; i++) {

        let item = chatMessages[i];

        let message = document.createElement("div");

        if (item.type == "photo") {

            message.className = "message sent photo-message";

            let image = document.createElement("img");
            image.src = item.photo;
            image.alt = "Fotografia enviada";

            message.appendChild(image);

        } else if (item.type == "invitation") {

            message.className = "message sent point-message";

            let content = document.createElement("div");
            content.className = "point-invitation";

            let title = document.createElement("strong");
            title.textContent = "Ponto de encontro";

            let place = document.createElement("h3");
            place.textContent = item.place;

            let description = document.createElement("p");
            description.textContent = "Convite enviado a " + userName + ".";

            let status = document.createElement("span");
            status.className = "invitation-status";
            status.textContent = item.status;

            if (item.accepted == true) {
                status.classList.add("accepted");
            }

            content.appendChild(title);
            content.appendChild(place);
            content.appendChild(description);
            content.appendChild(status);

            message.appendChild(content);

        } else {

            message.className = "message " + item.type;

            let paragraph = document.createElement("p");
            paragraph.textContent = item.text;

            let time = document.createElement("span");
            time.textContent = item.time;

            message.appendChild(paragraph);
            message.appendChild(time);
        }

        messages.appendChild(message);
    }

    messages.scrollTop = messages.scrollHeight;
}


// Mostrar mensagens iniciais
showMessages();


// Enviar mensagem
messageForm.addEventListener("submit", function(event) {

    event.preventDefault();

    let text = messageInput.value.trim();

    if (text == "") {
        return;
    }

    let newMessage = {
        type: "sent",
        text: text,
        time: getCurrentTime()
    };

    chatMessages.push(newMessage);

   
    showMessages();

    messageInput.value = "";
});


// Abrir e fechar menu de anexos
document.getElementById("attachButton").addEventListener("click", function() {
    attachmentMenu.classList.toggle("show");
});


// Abrir álbum
document.getElementById("sendPhotoOption").addEventListener("click", function() {

    sessionStorage.setItem("bandyReturnUser", user);

    window.location.href = "album.html?return=chat.html";
});


// Receber fotografia do álbum
let selectedPhoto = sessionStorage.getItem("bandySelectedPhoto");
let returnUser = sessionStorage.getItem("bandyReturnUser");

if (selectedPhoto != null && (returnUser == null || returnUser == user)) {

    let photoMessage = {
        type: "photo",
        photo: selectedPhoto,
        time: getCurrentTime()
    };

    chatMessages.push(photoMessage);


    showMessages();

    sessionStorage.removeItem("bandySelectedPhoto");
    sessionStorage.removeItem("bandyReturnUser");
}


// Abrir painel de ponto de encontro
document.getElementById("markPointOption").addEventListener("click", function() {

    attachmentMenu.classList.remove("show");
    pointOverlay.classList.add("show");
});


// Fechar painel
function closePoint() {
    pointOverlay.classList.remove("show");
}

document.getElementById("closePoint").addEventListener("click", closePoint);
document.getElementById("cancelPoint").addEventListener("click", closePoint);


// Enviar convite
document.getElementById("confirmPoint").addEventListener("click", function() {

    let selected = document.querySelector('input[name="meetingPoint"]:checked');

    if (selected == null) {
        alert("Escolhe primeiro um local.");
        return;
    }

    let invitation = {
        type: "invitation",
        place: selected.value,
        status: "A aguardar confirmação...",
        accepted: false
    };

    chatMessages.push(invitation);

   
    showMessages();

    closePoint();


    // Simular aceitação do convite
    setTimeout(function() {

        invitation.status = "✓ Convite aceite!";
        invitation.accepted = true;

      
        showMessages();

        inviteOverlay.classList.add("show");

        let seconds = 3;
        let countdown = document.getElementById("countdown");

        countdown.textContent = seconds;

        let timer = setInterval(function() {

            seconds--;
            countdown.textContent = seconds;

            if (seconds <= 0) {

                clearInterval(timer);

                inviteOverlay.classList.remove("show");

                invitation.status = "✓ Encontro confirmado!";

               
                showMessages();
            }

        }, 1000);

    }, 3000);

});
