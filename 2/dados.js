const JOGO_CONFIG = {
    // MODIFICA AQUI: "pre", "ano1", "ano2", "ano3" ou "ano4"
    anoAtivo: "ano2", 

    textos: {
        tituloLinha1: "JOVENS",
        tituloLinha2: "EXPLORADORES",
        subtitulo: "ATIVIDADES | 2º ANO", // Podes automatizar isto no JS se quiseres
        intro: "O que vamos aprender hoje?",
        rodape: "&copy; Jovens Exploradores - Recursos Educativos"
    },
    caminhoIconsMenu: "../icons/", 
    caminhoIconsJogos: "../icons/", 
    iconesMenu: {
        home: "home.png",
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png", // Ícone da tartaruga
        ano3: "icon3.png",
        ano4: "icon4.png",
        voltar: "voltar_az.png"
    },
    links: {
        home: "../", 
        pre: "../pre/",
        ano1: "../1/",
        ano2: "./",
        ano3: "../3/",
        ano4: "../4/"
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
    ]
};
