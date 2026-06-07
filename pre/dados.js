const JOGO_CONFIG = {
    areaAtiva: "pre", // Escolha: "portugues", "matematica", "estudo" ou "pre"
    anoAtivo: "pre",      // Escolha: "pre", "ano1", "ano2", "ano3", "ano4"
    
    caminhoIconsMenu: "../icons/", 
    caminhoIconsJogos: "../icons/ic_jogos_pre/", // Caminho alterado para apontar para a subpasta correta
    
    iconesMenu: {
        home: "home.png", pre: "iconpre.png", ano1: "icon1.png", 
        ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png", voltar: "voltar.png"
    },
    
    links: {
        home: "/",        // Removido "/jogos"
        pre: "/pre",      // Removido "/jogos"
        ano1: "/1",       // Removido "/jogos"
        ano2: "/2",       // Removido "/jogos"
        ano3: "/3",       // Removido "/jogos"
        ano4: "/4"        // Removido "/jogos"
    },
    
    listaJogos: [
        { nome: "O meu par?", icon: "aaaa.png", link: "encontraopar/" },
        { nome: "Monstro Comilão", icon: "aaaa.png", link: "monstrocomilao/" },
        { nome: "Colorir", icon: "aaaa.png", link: "pinta/" },
        { nome: "Não tenho par!", icon: "aaaa.png", link: "sem_par/" },
        { nome: "Sombras Mágicas", icon: "aaaa.png", link: "sombrasmagicas/" },
        { nome: "Labirinto", icon: "aaaa.png", link: "labirinto/" },
        { nome: "Chuva de Letras", icon: "aaaa.png", link: "chuva_letras/" },
        { nome: "As metades", icon: "aaaa.png", link: "metade/" }
        // ... adicione os restantes
    ]
};
