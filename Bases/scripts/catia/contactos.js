
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector(".search-form");
    const searchInput = document.querySelector('.search-form input[type="search"]');
    const searchButton = document.querySelector('.search-form button[type="button"]');
    const conversationList = document.querySelector(".conversation-list");

    if (!searchInput || !conversationList) {
        console.error("Não foi possível encontrar os elementos da pesquisa.");
        return;
    }

    const conversations = Array.from(
        conversationList.querySelectorAll(".conversation")
    );

    // Mensagem apresentada quando não existem resultados
    const noResults = document.createElement("p");
    noResults.textContent = "Nenhum contacto encontrado.";
    noResults.style.display = "none";
    noResults.style.textAlign = "center";
    noResults.style.color = "#77786D";
    noResults.style.padding = "20px";

    conversationList.insertAdjacentElement("afterend", noResults);

    // Remover acentos e ignorar maiúsculas/minúsculas
    function normalizeText(text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    // Pesquisar contactos pelo nome
    function searchContacts() {
        const searchValue = normalizeText(searchInput.value);
        let found = 0;

        conversations.forEach(contact => {
            const nameElement = contact.querySelector(".conversation-top h2");

            if (!nameElement) return;

            const contactName = normalizeText(nameElement.textContent);

            const matches = contactName.includes(searchValue);

            contact.style.display = matches ? "" : "none";

            if (matches) {
                found++;
            }
        });

        noResults.style.display = found === 0 ? "block" : "none";
    }

    // Clicar no botão Pesquisar
    if (searchButton) {
        searchButton.addEventListener("click", searchContacts);
    }

    // Pesquisar ao carregar Enter
    if (searchForm) {
        searchForm.addEventListener("submit", event => {
            event.preventDefault();
            searchContacts();
        });
    }

    // Atualizar resultados enquanto escreve
    searchInput.addEventListener("input", searchContacts);
});
