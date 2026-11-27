document.addEventListener("DOMContentLoaded", () => {

    const searchForm = document.querySelector(".search-form");
    const searchInput = document.querySelector(
        '.search-form input[type="search"]'
    );
    const searchButton = document.querySelector(
        '.search-form button[type="button"]'
    );
    const conversationList = document.querySelector(
        ".conversation-list"
    );

    if (!searchInput || !conversationList) {
        console.error(
            "Não foi possível encontrar os elementos da pesquisa."
        );
        return;
    }

    let rows = Array.from(
        conversationList.querySelectorAll(
            ".conversation-row[data-user-id]"
        )
    );

    /* Ler contactos adicionados através dos pedidos de amizade */
    function getNewContacts() {
        try {
            const value = JSON.parse(
                localStorage.getItem("bandy_novos_contactos") || "[]"
            );
            return Array.isArray(value) ? value : [];
        } catch (error) {
            return [];
        }
    }

    function saveNewContacts(list) {
        try {
            localStorage.setItem(
                "bandy_novos_contactos",
                JSON.stringify(list)
            );
        } catch (error) {
            console.error("Erro ao guardar novos contactos:", error);
        }
    }

    /* Criar a linha de contacto com o mesmo formato dos contactos existentes */
    function addContactRow(contact) {
        const userId = String(contact.id || "");
        if (!userId) return;

        const existing = rows.find(
            row => String(row.dataset.userId) === userId
        );
        if (existing) return;

        const name = String(contact.nome || contact.name || "Novo contacto");
        const avatar = name.trim().charAt(0).toUpperCase() || "?";

        const row = document.createElement("div");
        row.className = "conversation-row";
        row.dataset.userId = userId;
        row.dataset.removed = "false";

        const profileLink = document.createElement("a");
        profileLink.className = "conversation";
        profileLink.href = "perfil_users.html?user=" + encodeURIComponent(userId);

        const avatarElement = document.createElement("div");
        avatarElement.className = "avatar";
        avatarElement.textContent = avatar;

        const info = document.createElement("div");
        info.className = "conversation-info";

        const top = document.createElement("div");
        top.className = "conversation-top";

        const heading = document.createElement("h2");
        heading.textContent = name;

        const time = document.createElement("span");
        time.className = "time";
        time.dataset.messageTime = "";

        top.appendChild(heading);
        top.appendChild(time);

        const preview = document.createElement("p");
        preview.className = "last-message";
        preview.dataset.messagePreview = "";

        info.appendChild(top);
        info.appendChild(preview);
        profileLink.appendChild(avatarElement);
        profileLink.appendChild(info);

        const chatLink = document.createElement("a");
        chatLink.className = "chat-button";
        chatLink.href = "chat.html?user=" + encodeURIComponent(userId);
        chatLink.setAttribute("aria-label", "Abrir chat com " + name);
        chatLink.textContent = "💬";

        row.appendChild(profileLink);
        row.appendChild(chatLink);
        conversationList.appendChild(row);

        rows.push(row);
    }

    /* Mostrar contactos já guardados, sem duplicar os contactos fixos */
    getNewContacts().forEach(addContactRow);

    /* Processar o novo contacto 2 segundos depois de entrar em Contactos */
    setTimeout(function () {
        let pending = null;
        try {
            pending = JSON.parse(
                localStorage.getItem("bandy_contacto_pendente") || "null"
            );
        } catch (error) {
            pending = null;
        }

        if (!pending || !pending.id) return;

        const newContacts = getNewContacts();
        const pendingId = String(pending.id);
        const existingIndex = newContacts.findIndex(
            contact => String(contact.id) === pendingId
        );

        if (existingIndex >= 0) {
            newContacts[existingIndex] = {
                ...newContacts[existingIndex],
                ...pending,
                id: pendingId
            };
        } else {
            newContacts.push({ ...pending, id: pendingId });
        }

        saveNewContacts(newContacts);
        addContactRow(pending);
        localStorage.removeItem("bandy_contacto_pendente");

        updateRemovedFriends();
        updateLastMessages();
    }, 2000);

    /* Mensagem quando não existem contactos */
    const noResults = document.createElement("p");

    noResults.textContent = "Nenhum contacto encontrado.";
    noResults.style.display = "none";
    noResults.style.textAlign = "center";
    noResults.style.color = "#77786D";
    noResults.style.padding = "20px";

    conversationList.insertAdjacentElement(
        "afterend",
        noResults
    );

    /* Normalizar texto para pesquisa */
    function normalizeText(text) {
        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    /* Obter lista de amigos removidos */
    function getRemovedFriends() {
        try {
            const value = JSON.parse(
                localStorage.getItem(
                    "bandy_amigos_removidos"
                ) || "[]"
            );

            return Array.isArray(value)
                ? value.map(String)
                : [];

        } catch (error) {
            return [];
        }
    }

    /* Atualizar contactos removidos */
    function updateRemovedFriends() {
        const removed = getRemovedFriends();

        rows.forEach(row => {
            const userId = String(row.dataset.userId);

            if (removed.includes(userId)) {
                row.style.display = "none";
                row.dataset.removed = "true";
            } else {
                row.dataset.removed = "false";
            }
        });

        searchContacts();
    }

    /*
     * Ler mensagens guardadas no Chat.
     *
     * Chave principal:
     * bandy_messages_maria
     * bandy_messages_filipe
     * bandy_messages_ana
     * etc.
     *
     * Formato esperado:
     * [
     *   {
     *     text: "Olá!",
     *     timestamp: 1730000000000,
     *     sender: "me"
     *   }
     * ]
     */

    function getChatMessages(userId) {

        const keys = [
            "bandy_messages_" + userId,
            "bandy_chat_" + userId,
            "chat_" + userId,
            "messages_" + userId
        ];

        for (const key of keys) {

            const raw = localStorage.getItem(key);

            if (!raw) continue;

            try {

                const parsed = JSON.parse(raw);

                if (Array.isArray(parsed)) {
                    return parsed;
                }

                if (
                    parsed &&
                    Array.isArray(parsed.messages)
                ) {
                    return parsed.messages;
                }

            } catch (error) {
                // Ignorar valores que não sejam JSON.
            }
        }

        return [];
    }

    /* Obter texto da mensagem */
    function getMessageText(message) {

        if (typeof message === "string") {
            return message;
        }

        if (!message || typeof message !== "object") {
            return "";
        }

        return String(
            message.text ??
            message.content ??
            message.message ??
            message.body ??
            ""
        );
    }

    /* Obter data da mensagem */
    function getMessageDate(message) {

        if (!message || typeof message !== "object") {
            return null;
        }

        const value =
            message.timestamp ??
            message.time ??
            message.date ??
            message.createdAt;

        if (!value) {
            return null;
        }

        const date = typeof value === "number"
            ? new Date(value)
            : new Date(value);

        return Number.isNaN(date.getTime())
            ? null
            : date;
    }

    /* Formatar hora da mensagem */
    function formatMessageTime(date) {

        if (!date) {
            return "";
        }

        const now = new Date();

        const sameDay =
            date.toDateString() === now.toDateString();

        if (sameDay) {

            return date.toLocaleTimeString(
                "pt-PT",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
        }

        const yesterday = new Date(now);

        yesterday.setDate(
            now.getDate() - 1
        );

        if (
            date.toDateString() ===
            yesterday.toDateString()
        ) {
            return "Ontem";
        }

        return date.toLocaleDateString(
            "pt-PT",
            {
                day: "2-digit",
                month: "2-digit"
            }
        );
    }

    /* Atualizar última mensagem de cada contacto */
    function updateLastMessages() {

        rows.forEach(row => {

            const userId = String(
                row.dataset.userId
            );

            const preview = row.querySelector(
                "[data-message-preview]"
            );

            const timeElement = row.querySelector(
                "[data-message-time]"
            );

            const messages = getChatMessages(userId);

            if (!messages.length) {
                return;
            }

            const lastMessage =
                messages[messages.length - 1];

            const text = getMessageText(
                lastMessage
            );

            const date = getMessageDate(
                lastMessage
            );

            if (preview) {
                preview.textContent = text;
            }

            if (timeElement && date) {
                timeElement.textContent =
                    formatMessageTime(date);
            }
        });
    }

    /* Pesquisa de contactos */
    function searchContacts() {

        const searchValue = normalizeText(
            searchInput.value
        );

        let found = 0;

        rows.forEach(row => {

            const nameElement = row.querySelector(
                ".conversation-top h2"
            );

            if (!nameElement) {
                return;
            }

            const name = normalizeText(
                nameElement.textContent
            );

            const removed =
                row.dataset.removed === "true";

            const matches =
                name.includes(searchValue) &&
                !removed;

            row.style.display =
                matches ? "" : "none";

            if (matches) {
                found++;
            }
        });

        noResults.style.display =
            found === 0 ? "block" : "none";
    }

    /* Botão de pesquisa */
    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchContacts
        );
    }

    /* Pesquisa através de Enter */
    if (searchForm) {

        searchForm.addEventListener(
            "submit",
            event => {
                event.preventDefault();
                searchContacts();
            }
        );
    }

    /* Pesquisa enquanto escreve */
    searchInput.addEventListener(
        "input",
        searchContacts
    );

    /* Atualizar quando outra página modifica localStorage */
    window.addEventListener(
        "storage",
        event => {

            if (
                event.key ===
                "bandy_amigos_removidos"
            ) {
                updateRemovedFriends();
            }

            if (
                event.key &&
                (
                    event.key.startsWith(
                        "bandy_messages_"
                    ) ||
                    event.key.startsWith(
                        "bandy_chat_"
                    ) ||
                    event.key.startsWith(
                        "chat_"
                    ) ||
                    event.key.startsWith(
                        "messages_"
                    )
                )
            ) {
                updateLastMessages();
            }
        }
    );

    /* Atualizar quando o perfil remove um amigo */
    window.addEventListener(
        "amizadesAtualizadas",
        updateRemovedFriends
    );

    /* Atualizar quando o Chat envia uma mensagem */
    window.addEventListener(
        "mensagensAtualizadas",
        updateLastMessages
    );

    /* Atualizar ao abrir a página */
    updateRemovedFriends();
    updateLastMessages();

});