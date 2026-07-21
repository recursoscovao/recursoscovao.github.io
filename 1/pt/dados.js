const JOGO_CONFIG = {
    areaAtiva: "portugues", // Escolha: "portugues", "matematica", "estudo" ou "pre"
    anoAtivo: "ano1",      // Escolha: "pre", "ano1", "ano2", "ano3", "ano4"
    
    caminhoIconsMenu: "../../icons/", 
    caminhoIconsJogos: "iconjogos/",
    
    iconesMenu: {
        home: "home.png", pre: "iconpre.png", ano1: "icon1.png", 
        ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png", voltar: "voltar.png"
    },
    
    links: {
        home: "../../index.html", pre: "../../pre/index.html", 
        ano1: "../../1/index.html", ano2: "../../2/index.html",
        ano3: "../../3/index.html", ano4: "../../4/index.html"
    },
    
    // Define aqui as tuas 9 fases (ou mais)
    listaFases: [
        {
            tituloFase: "FASE 1: SONS, LETRAS E FORMAS BÁSICAS",
            corEtiqueta: "#E91E63", 
            jogos: [
                { nome: "Estoura-Balão", desc: "Estoure desenhos correspondentes.", icon: "balao.png", link: "balao/", cor: "#C2185B" },
                { nome: "Letra Inicial", desc: "Qual é a primeira letra desse desenho?", icon: "lapis.png", link: "letra-in/", cor: "#D32F2F" },
                { nome: "Toupeira das Letras", desc: "Bata nas toupeiras corretas.", icon: "rato.png", link: "toupeira/", cor: "#E64A19" }
            ]
        },
        {
            tituloFase: "FASE 2: DESCOBERTAS E SEQUÊNCIAS",
            corEtiqueta: "#FF9800",
            jogos: [
                { nome: "Abre a Caixa Quiz", desc: "Abra presentes surpresa e resolva o quiz.", icon: "caixa.png", link: "caixa/", cor: "#F57C00" },
                { nome: "Combinação Mágica", desc: "Relacione as iniciais com cada desenho.", icon: "puzzle.png", link: "combina/", cor: "#1976D2" },
                { nome: "Comboio de Letras", desc: "Complete as sequências no trem.", icon: "trem.png", link: "trem/", cor: "#0097A7" }
            ]
        }
        // Podes continuar a adicionar FASE 3, 4, etc aqui...
    ]
};
