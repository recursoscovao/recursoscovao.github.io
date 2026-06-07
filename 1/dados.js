const JOGO_CONFIG = {
    textos: {
        tituloLinha1: "Pequenos",
        tituloLinha2: "Exploradores",
        subtitulo: "Atividades | 1º Ano",
        intro: "O que vamos aprender hoje?",
        rodape: "&copy; Pequenos Exploradores - Recursos Educativos"
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
        voltar: "voltar.png",
        voltarMobile: "voltar_az.png" // Adicionado aqui
    },
    links: {
        home: "/jogos", 
        pre: "/jogos/pre",
        ano1: "/jogos/1",
        ano2: "/jogos/2",
        ano3: "/jogos/3",
        ano4: "/jogos/4"
    },
    temaCores: {
        azul: { borda: "#5ba4e5", fundo: "#e1f0ff" },
        verde: { borda: "#58bc8c", fundo: "#e8f7f0" },
        castanho: { borda: "#8b4513", fundo: "#ffe8cc" }
    },
    listaJogos: [
        { nome: "Português", icon: "pt.png", link: "pt/", tema: "azul" },
        { nome: "Matemática", icon: "mat.png", link: "mat/", tema: "verde" },
        { nome: "Estudo do Meio", icon: "em.png", link: "em/", tema: "castanho" },
    ]
};
