document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    const user = userParam ? userParam.toLowerCase() : null;

    // se eAmigo: true  -----> é amigo 
    // se eAmigo: false -> Não é amigo 
    const dadosUtilizadores = {
        // amigos
        maria: { 
            foto: "MC", 
            nome: "Maria Costa", 
            tag: "@maria_costa", 
            dist: "A 45m de ti 📍", 
            bio: "Adoro música ao vivo!", 
            artistas: "Coldplay, Imagine Dragons",
            festival: "MEO Sudoeste",
            eAmigo: true 
        },
        filipe: { 
            foto: "FM", 
            nome: "Filipe Machado", 
            tag: "@filipe_machado", 
            dist: "A 120m de ti 📍", 
            bio: "Adoro festivais de verão!!", 
            artistas: "Red Hot Chili Peppers, Harry Styles",
            festival: "MEO Sudoeste",
            eAmigo: true 
        },
        ana: { 
            foto: "AS", 
            nome: "Ana Silva", 
            tag: "@ana_silva", 
            dist: "A 310m de ti 📍", 
            bio: "Adoro rock", 
            artistas: "The Beatles, Queen",
            festival: "Paredes de Coura",
            eAmigo: true 
        },
        santiago: {
            foto: "SR",
            nome: "Santiago Ramos",
            tag: "@santigo_ramos",
            dist: "A 10m de ti 📍",
            bio: "Gosto de ouvir música ao vivo",
            artistas: "Taylor Swift, Olivia Rodrigo",
            festival: "Paredes de Coura",
            eAmigo: true
        },
        martim: {
            foto: "MD",
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
            foto: "JS", 
            nome: "João Santos", 
            tag: "@joao_santos", 
            dist: "A 20m de ti 📍", 
            bio: "Fã de Indie Rock e Eletrónica", 
            artistas: "Arctic Monkeys",
            festival: "Rock In Rio Lisboa",
            eAmigo: false 
        },
        rita: { 
            foto: "RP", 
            nome: "Rita Pereira", 
            tag: "@rita_pereira", 
            dist: "A 45m de ti 📍", 
            bio: "Sempre na primeira fila", 
            artistas: "Florence + The Machine",
            festival: "MEO Sudoeste",
            eAmigo: false 
        },
        tiago: { 
            foto: "TL", 
            nome: "Tiago Lopes", 
            tag: "@tiago_lopes", 
            dist: "A 120m de ti 📍", 
            bio: "Festivais, amigos e boa música", 
            artistas: "Foo Fighters, Coldplay",
            festival: "NOS Alive",
            eAmigo: false 
        },
        beatriz: { 
            foto: "BM", 
            nome: "Beatriz Martins", 
            tag: "@bea_martins", 
            dist: "A 180m de ti 📍", 
            bio: "Adoro ir a festivais com os meus amigos", 
            artistas: "Dua Lipa, The Weeknd, Ed Sheeran",
            festival: "NOS Alive",
            eAmigo: false 
        },
        goncalo: { 
            foto: "GN", 
            nome: "Gonçalo Neves", 
            tag: "@goncalo_neves", 
            dist: "A 210m de ti 📍", 
            bio: "Por mais festivais", 
            artistas: "Xutos & Pontapés",
            festival: "Rock In Rio Lisboa",
            eAmigo: false 
        }
    };

    const botaoExtra = document.getElementById("botao-extra");
    const botaoChat = document.getElementById("chat");

    if (user && dadosUtilizadores[user]) {
        const u = dadosUtilizadores[user];

        if (document.getElementById("foto-perfil")) document.getElementById("foto-perfil").textContent = u.foto;
        if (document.getElementById("nome-perfil")) document.getElementById("nome-perfil").textContent = u.nome;
        if (document.getElementById("utilizador-perfil")) document.getElementById("utilizador-perfil").textContent = u.tag;
        if (document.querySelector("distancia")) document.querySelector("distancia").textContent = u.dist;
        if (document.getElementById("bio-perfil")) document.getElementById("bio-perfil").textContent = u.bio;
        if (document.getElementById("artistas-perfil")) document.getElementById("artistas-perfil").textContent = u.artistas;
        if (document.getElementById("festival-perfil")) document.getElementById("festival-perfil").textContent = u.festival;

        if (botaoChat) {
            botaoChat.setAttribute("href", "catia/chat.html?amigo=" + user);
        }

        if (botaoExtra) {
            if (u.eAmigo) {
                // Se é amigo mostra mapa
                botaoExtra.textContent = "🗺️ Mapa";
                botaoExtra.setAttribute("href", "mapa.html?user=" + user);
                botaoExtra.className = "botao-mapa";
                botaoExtra.onclick = null;
            } else {
                // se for pessoa perto mostra adicionar 
                botaoExtra.textContent = "+ Adicionar";
                botaoExtra.setAttribute("href", "#");
                botaoExtra.className = "botao-adicionar";
                botaoExtra.onclick = function (e) {
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