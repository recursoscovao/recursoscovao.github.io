// ==========================================
// 1. BIBLIOTECA DE TEMAS (Cores e Estilos)
// ==========================================
const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", voltarMobile: "voltar_rs.png" },
    "jd": { corPagina: "#f0f2f5", corPrimaria: "#E691A7", corEscura: "#D54267", voltarMobile: "voltar_rs.png" }
};

// ==========================================
// 2. BIBLIOTECA DE CONTEÚDO (Textos)
// ==========================================
const BIBLIOTECA_CONTEUDO = {
    "jd": {
        "jd": { 
            t1: "Pequenos", 
            t2: "Curiosos", 
            sub: "Animais | Encontra o Par", 
            intro: "Consegues encontrar o animal igual ao que está em destaque?", 
            rodape: "&copy; Pequenos Curiosos - Recursos Educativos" 
        }
    },
    "pre": {
        "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", intro: "Vamos brincar e aprender!", rodape: "&copy; Pequenos Curiosos" }
    }
    // Podes adicionar ano1, ano2, etc, se precisares
};

// ==========================================
// 3. CONFIGURAÇÃO GLOBAL DO JOGO
// ==========================================
const JOGO_CONFIG = {
    areaAtiva: "jd", 
    anoAtivo: "jd",        
    caminhoIconsMenu: "../icons/", 
    caminhoIconsJogos: "iconjogos/", // Pasta onde estão: abelha.png, elefante.png, etc.
    caminhoImg: "img/",             // Pasta onde estão: lampada.png e as taças (taca_1.png...)
    
    sons: {
        acerto: "sons/acerto.mp3",
        erro: "sons/erro.mp3",
        vitoria: "sons/vitoria.mp3"
    },

    iconesMenu: {
        home: "home.png", 
        pre: "iconpre.png", 
        jd: "icondestaque.png", 
        ano1: "icon1.png", 
        ano2: "icon2.png", 
        ano3: "icon3.png", 
        ano4: "icon4.png", 
        voltar: "voltar.png"
    },

    links: {
        home: "/", 
        pre: "/pre",
        jd: "/destaques",
        ano1: "/1",
        ano2: "/2",
        ano3: "/3",
        ano4: "/4"
    },

    // Relatórios de Pontuação (As Taças)
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 50, max: 69, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 49, titulo: "Continua a tentar!", img: "taca_4.png" }
    ],

    listaFases: [
        {
            tituloFase: "ANIMAIS DOMÉSTICOS",
            corEtiqueta: "#E691A7", 
            jogos: [
                { 
                    nome: "Encontra o Par", 
                    desc: "Observa o animal em destaque e encontra o seu par igual na grelha.", 
                    icon: "abelha.png"
                }
            ]
        }
    ]
};

// ==========================================
// 4. CATEGORIAS E QUESTÕES (Onde o Jogo vai ler)
// ==========================================
const JOGO_CATEGORIAS = {
    "animais": {
        descricao: "Encontra o animal igual!",
        itens: [
            { img: "abelha.png" },
            { img: "elefante.png" },
            { img: "caranguejo.png" },
            { img: "coala.png" },
            { img: "aguia.png" },
            { img: "aranha.png" },
            { img: "canguru.png" },
            { img: "foca.png" }
        ]
    }
};
