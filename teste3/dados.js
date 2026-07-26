const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", voltarMobile: "voltar_rs.png" },
    "jd": { corPagina: "#f0f2f5", corPrimaria: "#6c757d", corEscura: "#495057", voltarMobile: "voltar_cin.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "jd": { "jd": { t1: "Jogos em", t2: "Destaque", sub: "Recursos Especiais", rodape: "&copy; Pequenos Curiosos" } },
    "pre": { "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", rodape: "&copy; Pequenos Curiosos" }, "jd": { t1: "Jogos em", t2: "Destaque", sub: "Desafios | Pré-Escolar", rodape: "&copy; Pequenos Curiosos" } },
    "ano1": { "portugues": { t1: "Pequenos", t2: "Leitores", sub: "Português | 1º Ano", rodape: "&copy; Pequenos Leitores" }, "matematica": { t1: "Pequenos", t2: "Matemáticos", sub: "Matemática | 1º Ano", rodape: "&copy; Pequenos Matemáticos" }, "estudo": { t1: "Pequenos", t2: "Exploradores", sub: "Estudo do Meio | 1º Ano", rodape: "&copy; Pequenos Exploradores" }, "jd": { t1: "Jogos em", t2: "Destaque", sub: "Desafios | 1º Ano", rodape: "&copy; Pequenos Curiosos" } },
    "ano2": { "portugues": { t1: "Jovens", t2: "Leitores", sub: "Português | 2º Ano", rodape: "&copy; Jovens Leitores" }, "matematica": { t1: "Jovens", t2: "Matemáticos", sub: "Matemática | 2º Ano", rodape: "&copy; Jovens Matemáticos" }, "estudo": { t1: "Jovens", t2: "Investigadores", sub: "Estudo do Meio | 2º Ano", rodape: "&copy; Jovens Investigadores" }, "jd": { t1: "Jogos em", t2: "Destaque", sub: "Desafios | 2º Ano", rodape: "&copy; Pequenos Curiosos" } },
    "ano3": { "portugues": { t1: "Super", t2: "Leitores", sub: "Português | 3º Ano", rodape: "&copy; Super Leitores" }, "matematica": { t1: "Super", t2: "Matemáticos", sub: "Matemática | 3º Ano", rodape: "&copy; Super Matemáticos" }, "estudo": { t1: "Super", t2: "Cientistas", sub: "Estudo do Meio | 3º Ano", rodape: "&copy; Super Cientistas" }, "jd": { t1: "Jogos em", t2: "Destaque", sub: "Desafios | 3º Ano", rodape: "&copy; Pequenos Curiosos" } },
    "ano4": { "portugues": { t1: "Mestres da", t2: "Leitura", sub: "Português | 4º Ano", rodape: "&copy; Mestres da Leitura" }, "matematica": { t1: "Mestre dos", t2: "Números", sub: "Matemática | 4º Ano", rodape: "&copy; Mestre dos Números" }, "estudo": { t1: "Mestres", t2: "do Mundo", sub: "Estudo do Meio | 4º Ano", rodape: "&copy; Mestres do Mundo" }, "jd": { t1: "Jogos em", t2: "Destaque", sub: "Desafios | 4º Ano", rodape: "&copy; Pequenos Curiosos" } }
};

const JOGO_CONFIG = {
    areaAtiva: "pre", 
    anoAtivo: "pre",        
    caminhoIconsMenu: "../icons/", 
    caminhoIconsJogos: "iconjogos/",
    caminhoImg: "img/",
    sons: { acerto: "sons/acerto.mp3", erro: "sons/erro.mp3", vitoria: "sons/vitoria.mp3" },
    iconesMenu: { home: "home.png", pre: "iconpre.png", jd: "icondestaque.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png", voltar: "voltar.png" },
    links: { home: "/", pre: "/pre", jd: "/destaques", ano1: "/1", ano2: "/2", ano3: "/3", ano4: "/4" },
    relatorios: [
        { min: 9, max: 10, titulo: "És um craque!", img: "taca_1.png" },
        { min: 7, max: 8, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 5, max: 6, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 4, titulo: "Continua a tentar!", img: "taca_4.png" }
    ],
    listaFases: [{
        tituloFase: "ANIMAIS DOMÉSTICOS",
        jogos: [{ nome: "Encontra o Par", desc: "Encontra o animal igual ao que aparece em destaque no topo.", icon: "abelha.png" }]
    }]
};

const JOGO_CATEGORIAS = {
    "animais": {
        itens: [
            { img: "elefante.png" }, { img: "caranguejo.png" }, { img: "coala.png" }, { img: "aguia.png" },
            { img: "aranha.png" }, { img: "canguru.png" }, { img: "foca.png" }, { img: "abelha.png" }
        ]
    }
};
