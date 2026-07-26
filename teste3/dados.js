const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", voltarMobile: "voltar_rs.png" },
    "jd": { corPagina: "#f0f2f5", corPrimaria: "#6c757d", voltarMobile: "voltar_cin.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "jd": { "jd": { t1: "Jogos em", t2: "Destaque", sub: "Recursos Especiais", rodape: "&copy; Pequenos Curiosos" } },
    "pre": { "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Pré-Escolar", rodape: "&copy; Pequenos Curiosos" } },
    "ano1": { "portugues": { t1: "Pequenos", t2: "Leitores", sub: "1º Ano", rodape: "&copy; 1º Ano" } }
};

const JOGO_CONFIG = {
    areaAtiva: "jd", 
    anoAtivo: "jd",        
    caminhoIconsMenu: "icons/", 
    caminhoIconsJogos: "iconjogos/",
    iconesMenu: {
        home: "home.png", 
        pre: "iconpre.png", 
        jd: "icondestaque.png", 
        ano1: "icon1.png", 
        ano2: "icon2.png", 
        ano3: "icon3.png", 
        ano4: "icon4.png"
    },
    links: {
        home: "index.html", 
        pre: "#",
        jd: "#",
        ano1: "#",
        ano2: "#",
        ano3: "#",
        ano4: "#"
    },
    relatorios: [
        { min: 9, max: 10, titulo: "És um craque!", img: "taca_1.png" },
        { min: 7, max: 8, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 5, max: 6, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 4, titulo: "Continua a tentar!", img: "taca_4.png" }
    ],
    listaFases: [
        {
            jogos: [
                { nome: "Encontrar o Par", desc: "Encontra os pares dos animais domésticos.", icon: "par_animais.png" }
            ]
        }
    ]
};

const DADOS_JOGO_MEMORIA = {
    caminhoImagens: "img/animaisdomesticos/",
    itens: [
        { id: 1, img: "cao.png" },
        { id: 2, img: "gato.png" },
        { id: 3, img: "coelho.png" },
        { id: 4, img: "hamster.png" },
        { id: 5, img: "peixe.png" },
        { id: 6, img: "passaro.png" },
        { id: 7, img: "tartaruga.png" },
        { id: 8, img: "porquinho.png" }
    ]
};
