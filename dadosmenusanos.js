// O ÚNICO FICHEIRO DE DADOS PARA TODOS OS MENUS DOS ANOS
const MENUS_CONFIG = {
    "pre": {
        textos: {
            tituloLinha1: "Pequenos",
            tituloLinha2: "Curiosos",
            subtitulo: "Atividades | Pré-Escolar",
            intro: "Brinca com os números, as cores e as formas!",
            rodape: "&copy; Pequenos Curiosos - Recursos Educativos"
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
            voltar: "seta.png",         // Atualizado para o menu hambúrguer
            voltarMobile: "voltar_az.png" // Atualizado para o header
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
            azul: { borda: "#5ba4e5", fundo: "#e1f0ff" },
            verde: { borda: "#58bc8c", fundo: "#e8f7f0" }
        },
        listaJogos: [
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
            voltar: "seta.png",         // Atualizado para o menu hambúrguer
            voltarMobile: "voltar_az.png" // Atualizado para o header
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
            tituloLinha1: "Jovens",
            tituloLinha2: "Exploradores",
            subtitulo: "Atividades | 2º Ano",
            intro: "Prontos para novos Desafios?",
            rodape: "&copy; Jovens Exploradores - Recursos Educativos"
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
            voltar: "seta.png",         // Atualizado para o menu hambúrguer
            voltarMobile: "voltar_az.png" // Atualizado para o header
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
            azul: { borda: "#5ba4e5", fundo: "#e1f0ff" },
            verde: { borda: "#58bc8c", fundo: "#e8f7f0" },
            castanho: { borda: "#8b4513", fundo: "#ffe8cc" }
        },
        listaJogos: [
            { nome: "Português", icon: "pt.png", link: "2/pt/", tema: "azul" },
            { nome: "Matemática", icon: "mat.png", link: "2/mat/", tema: "verde" },
            { nome: "Estudo do Meio", icon: "em.png", link: "2/em/", tema: "castanho" }
        ]
    },
    "3": {
        textos: {
            tituloLinha1: "Super",
            tituloLinha2: "Exploradores",
            subtitulo: "Atividades | 3º Ano",
            intro: "Novas descobertas e muitas aventuras!",
            rodape: "&copy; Super Exploradores - Recursos Educativos"
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
            voltar: "seta.png",
            voltarMobile: "voltar_az.png"
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
            azul: { borda: "#5ba4e5", fundo: "#e1f0ff" },
            verde: { borda: "#58bc8c", fundo: "#e8f7f0" },
            castanho: { borda: "#8b4513", fundo: "#ffe8cc" }
        },
        listaJogos: [
            { nome: "Português", icon: "pt.png", link: "3/pt/", tema: "azul" },
            { nome: "Matemática", icon: "mat.png", link: "3/mat/", tema: "verde" },
            { nome: "Estudo do Meio", icon: "em.png", link: "3/em/", tema: "castanho" }
        ]
    },
    "4": {
        textos: {
            tituloLinha1: "Mestres",
            tituloLinha2: "Exploradores",
            subtitulo: "Atividades | 4º Ano",
            intro: "Rumo ao final do 1º Ciclo com sucesso!",
            rodape: "&copy; Mestres Exploradores - Recursos Educativos"
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
            voltar: "seta.png",
            voltarMobile: "voltar_az.png"
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
            azul: { borda: "#5ba4e5", fundo: "#e1f0ff" },
            verde: { borda: "#58bc8c", fundo: "#e8f7f0" },
            castanho: { borda: "#8b4513", fundo: "#ffe8cc" }
        },
        listaJogos: [
            { nome: "Português", icon: "pt.png", link: "4/pt/", tema: "azul" },
            { nome: "Matemática", icon: "mat.png", link: "4/mat/", tema: "verde" },
            { nome: "Estudo do Meio", icon: "em.png", link: "4/em/", tema: "castanho" }
        ]
    }
};
