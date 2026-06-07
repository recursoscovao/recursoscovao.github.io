const JOGO_CONFIG = {
    areaAtiva: "pre", // Escolha: "portugues", "matematica", "estudo" ou "pre"
    anoAtivo: "pre",      // Escolha: "pre", "ano1", "ano2", "ano3", "ano4"
    
    caminhoIconsMenu: "../icons/", 
    caminhoIconsJogos: "../icons/ic_jogos_pre/", 
    
    iconesMenu: {
        home: "home.png", pre: "iconpre.png", ano1: "icon1.png", 
        ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png", 
        voltar: "seta.png"
    },
    
    links: {
        home: "/",        
        pre: "/pre",      
        ano1: "/1",       
        ano2: "/2",       
        ano3: "/3",       
        ano4: "/4"        
    },
    
    listaJogos: [
        { nome: "As Metades", icon: "aaaa.png", link: "metades_peixe/", jogadas: 21 },
        { nome: "Vamos Contar Metades", icon: "aaaa.png", link: "metades_contar/", jogadas: 42 },
        { nome: "Formas Metades", icon: "aaaa.png", link: "metades_formas/", jogadas: 18 },
        { nome: "Cores Mágicas Metades", icon: "aaaa.png", link: "metades_cores/", jogadas: 35 },
        { nome: "Objetos Metades", icon: "aaaa.png", link: "metades_objetos/", jogadas: 28 },
        { nome: "Transportes Metades", icon: "aaaa.png", link: "metades_transportes/", jogadas: 15 },
        { nome: "Animais Metades", icon: "aaaa.png", link: "metades_animais/", jogadas: 50 },
        { nome: "Metades Divertidas", icon: "aaaa.png", link: "metades_divertidas/", jogadas: 22 }
    ]
};
