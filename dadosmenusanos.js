// O ÚNICO FICHEIRO DE DADOS PARA TODOS OS MENUS DOS ANOS
const MENUS_CONFIG = {
    "pre": {
        textos: {
            tituloLinha1: "Pequenos",
            tituloLinha2: "Exploradores",
            subtitulo: "Atividades | Pré-Escolar",
            intro: "Escolhe um jogo para começares a brincar!",
            rodape: "&copy; Pequenos Exploradores - Recursos Educativos"
        },
        caminhoIconsMenu: "icons/", 
        caminhoIconsJogos: "icons/", 
        iconesMenu: {
            home: "home.png",
            pre: "iconpre.png",
            ano1: "icon1.png",
            ano2: "icon2.png",
            ano3: "icon3.png",
            ano4: "icon4.png",
            voltar: "voltar.png",
            voltarMobile: "voltar_az.png"
        },
        links: {
            home: "index.html", // Caminho para a tua página inicial real
            ano1: "menu.html?ano=1",
            ano2: "menu.html?ano=2",
            ano3: "menu.html?ano=3",
            ano4: "menu.html?ano=4"
        },
        temaCores: {
            azul: { borda: "#5ba4e5", fundo: "#e1f0ff" },
            verde: { borda: "#58bc8c", fundo: "#e8f7f0" }
        },
        listaJogos: [
            // No Pré, a lista já aponta direto para as pastas dos jogos lúdicos
            { nome: "Jogo das Cores", icon: "cores.png", link: "pre/cores/", tema: "azul" },
            { nome: "Quebra-Cabeças", icon: "puzzle.png", link: "pre/puzzle/", tema: "verde" }
        ]
    },
    "1": {
        textos: {
            tituloLinha1: "Pequenos",
            tituloLinha2: "Exploradores",
            subtitulo: "Atividades | 1º Ano",
            intro: "O que vamos aprender hoje?",
            rodape: "&copy; Pequenos Exploradores - Recursos Educativos"
        },
        caminhoIconsMenu: "icons/", 
        caminhoIconsJogos: "icons/", 
        iconesMenu: {
            home: "home.png",
            pre: "iconpre.png",
            ano1: "icon1.png",
            ano2: "icon2.png",
            ano3: "icon3.png",
            ano4: "icon4.png",
            voltar: "voltar.png",
            voltarMobile: "voltar_az.png"
        },
        links: {
            home: "index.html", 
            pre: "menu.html?ano=pre",
            ano2: "menu.html?ano=2",
            ano3: "menu.html?ano=3",
            ano4: "menu.html?ano=4"
        },
        temaCores: {
            azul: { borda: "#5ba4e5", fundo: "#e1f0ff" },
            verde: { borda: "#58bc8c", fundo: "#e8f7f0" },
            castanho: { borda: "#8b4513", fundo: "#ffe8cc" }
        },
        listaJogos: [
            { nome: "Português", icon: "pt.png", link: "1/pt/", tema: "azul" },
            { nome: "Matemática", icon: "mat.png", link: "1/mat/", tema: "verde" },
            { nome: "Estudo do Meio", icon: "em.png", link: "1/em/", tema: "castanho" }
        ]
    },
    "2": {
        textos: {
            tituloLinha1: "Pequenos",
            tituloLinha2: "Exploradores",
            subtitulo: "Atividades | 2º Ano",
            intro: "Pronto para novos desafios do 2º Ano?",
            rodape: "&copy; Pequenos Exploradores - Recursos Educativos"
        },
        caminhoIconsMenu: "icons/", 
        caminhoIconsJogos: "icons/", 
        iconesMenu: {
            home: "home.png",
            pre: "iconpre.png",
            ano1: "icon1.png",
            ano2: "icon2.png",
            ano3: "icon3.png",
            ano4: "icon4.png",
            voltar: "voltar.png",
            voltarMobile: "voltar_az.png"
        },
        links: {
            home: "index.html", 
            pre: "menu.html?ano=pre",
            ano1: "menu.html?ano=1",
            ano3: "menu.html?ano=3",
            ano4: "menu.html?ano=4"
        },
        temaCores: {
            azul: { borda: "#5ba4e5", fundo: "#e1f0ff" },
            verde: { borda: "#58bc8c", fundo: "#e8f7f0" },
            castanho: { borda: "#8b4513", fundo: "#ffe8cc" }
        },
        listaJogos: [
            { nome: "Português", icon: "pt.png", link: "2/pt/", tema: "azul" },
            { nome: "Matemática", icon: "mat.png", link: "2/mat/", tema: "verde" },
            { nome: "Estudo do Meio", icon: "em.png", link: "2/em/", tema: "castanho" }
        ]
    }
    // NOTA: Para o 3º e 4º ano, basta copiares o bloco do "2" e mudares os caminhos dos links ("3/pt/", etc.)
};
