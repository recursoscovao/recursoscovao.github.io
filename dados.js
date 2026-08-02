const JOGO_CONFIG = {
    textos: {
        tituloLinha1: "MUNDO",
        tituloLinha2: "DOS JOGOS",
        subtitulo: "Atividades | Pré e 1º Ciclo",
        introNormal: "Escolhe o teu ano e ",
        introDestaque: "diverte-te!",
        rodape: "@recursos digitais"
    },
    caminhoIconsMenu: "icons/", 
    caminhoIconsJogos: "icons/", 
    iconesMenu: {
        logo: "jogo.png",
        controller: "controller.png" // Ícone que aparece antes de "Jogos em destaque"
    },
    // Categorias Principais (Os 5 Cards coloridos)
    listaAnos: [
        { nome: "Pré-Escolar", icon: "iconpre.png", link: "pre/", tema: "rosa" },
        { nome: "1º Ano", icon: "icon1.png", link: "1/", tema: "laranja" },
        { nome: "2º Ano", icon: "icon2.png", link: "2/", tema: "verde" },
        { nome: "3º Ano", icon: "icon3.png", link: "3/", tema: "azul" },
        { nome: "4º Ano", icon: "icon4.png", link: "4/", tema: "roxo" }
    ],
    // JOGOS EM DESTAQUE (A caixa branca de baixo)
    // Podes adicionar quantos quiseres aqui.
    listaDestaques: [
        { nome: "Rastros", icon: "rastros.png", link: "jd/rastros", estrelas: 5 },
        { nome: "Gatos&cães", icon: "gatos&caes.png", link: "jd/gatos&caes", estrelas: 5 },
        { nome: "Dominório", icon: "dominorio.png", link: "jd/dominorio", estrelas: 5 },
        { nome: "Semáforo", icon: "semaforo.png", link: "jd/semaforo", estrelas: 5 },
        { nome: "Quelhas", icon: "quelhas.png", link: "jd/quelhas", estrelas: 5 },
        { nome: "Pontuação", icon: "target.png", link: "jogos/pontos.html", estrelas: 5 }
    ],
    temaCores: {
        rosa: { fundo: "#F48FB1" },
        laranja: { fundo: "#FFB74D" },
        verde: { fundo: "#81C784" },
        azul: { fundo: "#64B5F6" },
        roxo: { fundo: "#BA68C8" }
    }
};
