document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    const user = userParam ? userParam.toLowerCase() : null;

    // se eAmigo: true  -----> é amigo 
    // se eAmigo: false -> Não é amigo 
    const dadosUtilizadores = {
        // amigos
        maria: { 
            avatar: "MC", 
            nome: "Maria Costa", 
            tag: "@maria_costa", 
            dist: "A 45m de ti 📍", 
            bio: "Adoro música ao vivo!", 
            artistas: "Coldplay, Imagine Dragons",
            festival: "MEO Sudoeste",
            eAmigo: true 
        },
        filipe: { 
            avatar: "FM", 
            nome: "Filipe Machado", 
            tag: "@filipe_machado", 
            dist: "A 120m de ti 📍", 
            bio: "Adoro festivais de verão!!", 
            artistas: "Red Hot Chili Peppers, Harry Styles",
            festival: "MEO Sudoeste",
            eAmigo: true 
        },
        ana: { 
            avatar: "AS", 
            nome: "Ana Silva", 
            tag: "@ana_silva", 
            dist: "A 310m de ti 📍", 
            bio: "Adoro rock", 
            artistas: "The Beatles, Queen",
            festival: "Paredes de Coura",
            eAmigo: true 
        },
        santiago: {
            avatar: "SR",
            nome: "Santiago Ramos",
            tag: "@santigo_ramos",
            dist: "A 10m de ti 📍",
            bio: "Gosto de ouvir música ao vivo",
            artistas: "Taylor Swift, Olivia Rodrigo",
            festival: "Paredes de Coura",
            eAmigo: true
        },
        martim: {
            avatar: "MD",
            nome: "Martim Dias",
            tag: "@martim_dias",
            dist: "A 456m de ti",
            bio: "Adoro conhecer pessoas novas",
            artistas: "Kanye West",
            festival: "Rock In Rio Lisboa",
            eAmigo: true
        },
        // pessoas perto
        joao: { 
            avatar: "JS", 
            nome: "João Santos", 
            tag: "@joao_santos", 
            dist: "A 20m de ti 📍", 
            bio: "Fã de Indie Rock e Eletrónica", 
            artistas: "Arctic Monkeys",
            festival: "Rock In Rio Lisboa",
            eAmigo: false 
        },
        rita: { 
            avatar: "RP", 
            nome: "Rita Pereira", 
            tag: "@rita_pereira", 
            dist: "A 45m de ti 📍", 
            bio: "Sempre na primeira fila", 
            artistas: "Florence + The Machine",
            festival: "MEO Sudoeste",
            eAmigo: false 
        },
        tiago: { 
            avatar: "TL", 
            nome: "Tiago Lopes", 
            tag: "@tiago_lopes", 
            dist: "A 120m de ti 📍", 
            bio: "Festivais, amigos e boa música", 
            artistas: "Foo Fighters, Coldplay",
            festival: "NOS Alive",
            eAmigo: false 
        },
        beatriz: { 
            avatar: "BM", 
            nome: "Beatriz Martins", 
            tag: "@bea_martins", 
            dist: "A 180m de ti 📍", 
            bio: "Adoro ir a festivais com os meus amigos", 
            artistas: "Dua Lipa, The Weeknd, Ed Sheeran",
            festival: "NOS Alive",
            eAmigo: false 
        },
        goncalo: { 
            avatar: "GN", 
            nome: "Gonçalo Neves", 
            tag: "@goncalo_neves", 
            dist: "A 210m de ti 📍", 
            bio: "Por mais festivais", 
            artistas: "Xutos & Pontapés",
            festival: "Rock In Rio Lisboa",
            eAmigo: false 
        }
    };

    const btnPrincipal = document.getElementById("btn-principal-perfil");
    const linkChat = document.getElementById("link-chat-direto");

    if (user && dadosUtilizadores[user]) {
        const u = dadosUtilizadores[user];

        if (document.getElementById("avatar")) document.getElementById("avatar").textContent = u.avatar;
        if (document.getElementById("nome-perfil")) document.getElementById("nome-perfil").textContent = u.nome;
        if (document.getElementById("utilizador-perfil")) document.getElementById("utilizador-perfil").textContent = u.tag;
        if (document.querySelector(".distancia-perfil")) document.querySelector(".distancia-perfil").textContent = u.dist;
        if (document.getElementById("bio-perfil")) document.getElementById("bio-perfil").textContent = u.bio;
        if (document.getElementById("artistas-perfil")) document.getElementById("artistas-perfil").textContent = u.artistas;
        if (document.getElementById("festival-perfil")) document.getElementById("festival-perfil").textContent = u.festival;

        if (linkChat) {
            linkChat.setAttribute("href", "catia/chat.html?amigo=" + user);
        }

        if (btnPrincipal) {
            if (u.eAmigo) {
                // Se é amigo mostra mapa
                btnPrincipal.textContent = "🗺️ Mapa";
                btnPrincipal.setAttribute("href", "mapa.html?user=" + user);
                btnPrincipal.className = "botao-principal-publico";
                btnPrincipal.onclick = null;
            } else {
                // se for pessoa perto mostra adicionar 
                btnPrincipal.textContent = "+ Adicionar";
                btnPrincipal.setAttribute("href", "#");
                btnPrincipal.className = "botao-adicionar-publico";
                btnPrincipal.onclick = function (e) {
                    e.preventDefault();
                    if (!this.classList.contains("enviado")) {
                        this.textContent = "✓ Pedido Enviado";
                        this.classList.add("enviado");
                    }
                };
            }
        }
    }
});