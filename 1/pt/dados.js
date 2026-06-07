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
        home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", 
        ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4"
    },
    
    listaJogos: [
        { nome: "Primeira Letra", icon: "primeira_letra.png", link: "primeira_letra/" },
        { nome: "Conta as Sílabas", icon: "conta_silabas.png", link: "conta_silabas/" },
        { nome: "Ordena Sílabas", icon: "silabas.png", link: "silabas/" },
        { nome: "Forma Palavras", icon: "liga_letras.png", link: "liga_letras/" },
        { nome: "Corta Sílabas", icon: "divisao_silabica.png", link: "divisao_silabica/" },
        { nome: "Ordem Alfabética", icon: "ordenar.png", link: "ordenar/" },
        { nome: "Descobre a Palavra", icon: "forca.png", link: "forca/" },
        { nome: "Sopa de Letras", icon: "sopa_letras.png", link: "sopa_letras/" },
        { nome: "Copia Palavras", icon: "copia_palavras.png", link: "copia_palavras/" }
        // ... adicione os restantes
    ]
};
