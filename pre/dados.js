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
        { nome: "As Metades", icon: "metades_peixe.png", link: "metades_peixe/", jogadas: 0 },
        { nome: "Vamos Contar Metades", icon: "metades_contar.png", link: "metades_contar/", jogadas: 0 },
        { nome: "Formas Metades", icon: "metades_formas.png", link: "metades_formas/", jogadas: 0 },
        { nome: "Cores Mágicas Metades", icon: "metades_cores.png", link: "metades_cores/", jogadas: 0 },
        { nome: "Objetos Metades", icon: "metades_objetos.png", link: "metades_objetos/", jogadas: 0 },
        { nome: "Transportes Metades", icon: "metades_transportes.png", link: "metades_transportes/", jogadas: 0 },
        { nome: "Animais Metades", icon: "metades_animais.png", link: "metades_animais/", jogadas: 0 },
        { nome: "Metades Divertidas", icon: "metades_divertidas.png", link: "metades_divertidas/", jogadas: 0 }
    ]
};
