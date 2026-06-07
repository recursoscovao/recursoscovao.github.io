const JOGO_CONFIG = {
    textos: {
        tituloLinha1: "Mundo",
        tituloLinha2: "dos jogos",
        subtitulo: "Atividades | Pré e 1º Ciclo",
        intro: "Escolhe o teu ano e diverte-te!",
        rodape: "&copy; Mundo do Jogos - Recursos Educativos"
    },
    caminhoIconsMenu: "icons/", 
    caminhoIconsJogos: "icons/", 
    iconesMenu: {
        logo: "jogo.png", 
        home: "home.png",
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png",
        voltar: "voltar.png"
    },
    links: {
        home: "index.html", 
        pre: "menu.html?ano=pre",
        ano1: "menu.html?ano=1",
        ano2: "menu.html?ano=2",
        ano3: "menu.html?ano=3",
        ano4: "menu.html?ano=4"
    },
    temaCores: {
        rosa: { borda: "#FFFFFF", fundo: "#E691A7" },
        laranja: { borda: "#FFFFFF", fundo: "#E6A75A" },
        verde: { borda: "#FFFFFF", fundo: "#45CFA8" },
        azul: { borda: "#FFFFFF", fundo: "#5EA2E6" },
        roxo: { borda: "#FFFFFF", fundo: "#8A81E6" }
    },
    listaJogos: [
        { nome: "Pré-Escolar", icon: "iconpre.png", link: "menu.html?ano=pre", tema: "rosa" },
        { nome: "1º Ano",      icon: "icon1.png",   link: "menu.html?ano=1",   tema: "laranja" },
        { nome: "2º Ano",      icon: "icon2.png",   link: "menu.html?ano=2",   tema: "verde" },
        { nome: "3º Ano",      icon: "icon3.png",   link: "menu.html?ano=3",   tema: "azul" },
        { nome: "4º Ano",      icon: "icon4.png",   link: "menu.html?ano=4",   tema: "roxo" }
    ]
};
