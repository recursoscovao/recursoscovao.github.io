const JOGO_CONFIG = {
    anoAtivo: "ano2", 
    textos: {
        tituloLinha1: "JOVENS",
        tituloLinha2: "EXPLORADORES",
        subtitulo: "ATIVIDADES | 2º ANO",
        intro: "O que vamos aprender hoje?",
        rodape: "&copy; Jovens Exploradores - Recursos Educativos"
    },
    caminhoIconsMenu: "../icons/", 
    caminhoIconsJogos: "../icons/", 
    iconesMenu: {
        home: "home.png",
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png", 
        ano3: "icon3.png",
        ano4: "icon4.png",
        voltar: "voltar_az.png",
        controller: "jogo.png"
    },
    links: {
        home: "../index.html", 
        pre: "../pre/index.html",
        ano1: "../1/index.html",
        ano2: "./index.html",
        ano3: "../3/index.html",
        ano4: "../4/index.html"
    },
    temaCores: {
        azul: { borda: "#5ba4e5", fundo: "#e1f0ff", texto: "#0066ff" },
        verde: { borda: "#58bc8c", fundo: "#e8f7f0", texto: "#008e4d" },
        castanho: { borda: "#e2922e", fundo: "#fff5e6", texto: "#c15d00" }
    },
    listaJogos: [
        { nome: "Português", icon: "pt.png", link: "pt/", tema: "azul" },
        { nome: "Matemática", icon: "mat.png", link: "mat/", tema: "verde" },
        { nome: "Estudo do Meio", icon: "em.png", link: "em/", tema: "castanho" },
    ],
    // ADICIONE ESTA LISTA DE DESTAQUES
    listaDestaques: [
        { nome: "Quebra-Cabeças", icon: "puzzle.png", link: "jogos/puzzle.html", estrelas: 4 },
        { nome: "Memória", icon: "memory.png", link: "jogos/memoria.html", estrelas: 5 },
        { nome: "Labirintos", icon: "maze.png", link: "jogos/labirintos.html", estrelas: 4 },
        { nome: "Desafios", icon: "trophy.png", link: "jogos/desafios.html", estrelas: 5 },
        { nome: "Aventuras", icon: "rocket.png", link: "jogos/aventuras.html", estrelas: 5 },
        { nome: "Pontuação", icon: "target.png", link: "jogos/pontos.html", estrelas: 5 }
    ]
};
