const JOGO_CONFIG = {
    textos: {
        tituloLinha1: "Pequenos",
        tituloLinha2: "Exploradores",
        subtitulo: "ATIVIDADES | 1º ANO",
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
        voltar: "voltar_az.png",
        voltarMobile: "voltar_az.png" 
    },
    links: {
        home: "../", 
        pre: "../pre/",
        ano1: "./",
        ano2: "../2/",
        ano3: "../3/",
        ano4: "../4/"
    },
    temaCores: {
        azul: { borda: "#5ba4e5", fundo: "#e1f0ff", seta: "#007bff" },
        verde: { borda: "#58bc8c", fundo: "#e8f7f0", seta: "#28a745" },
        castanho: { borda: "#e2922e", fundo: "#fff5e6", seta: "#d35400" }
    },
    listaJogos: [
        { nome: "Português", icon: "pt.png", link: "pt/", tema: "azul" },
        { nome: "Matemática", icon: "mat.png", link: "mat/", tema: "verde" },
        { nome: "Estudo do Meio", icon: "em.png", link: "em/", tema: "castanho" },
    ]
};
