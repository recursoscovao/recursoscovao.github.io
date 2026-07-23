// === CONFIGURAÇÃO MESTRE ===
const CONFIG_MESTRE = {
    ano: "pre",        
    area: "pre",  
    nomeJogo: "Chuva de Letras",
    categoriaAtiva: "maiusculas" // Define qual categoria carregar ao iniciar
};

// === CATEGORIAS DO JOGO ===
const JOGO_CATEGORIAS = {
    maiusculas: {
        nome: "Letras Maiúsculas",
        descricao: "Clica nas letras maiúsculas que aparecem!",
        imgCapa: "vogal_maiuscula.png",
        letras: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
        tipo: "upper"
    },
    minusculas: {
        nome: "Letras Minúsculas",
        descricao: "Clica nas letras minúsculas que aparecem!",
        imgCapa: "vogal_minuscula.png",
        letras: "abcdefghijklmnopqrstuvwxyz".split(""),
        tipo: "lower"
    }
};

// === BIBLIOTECA DE TEMAS ===
const BIBLIOTECA_TEMAS = {
    "portugues": { 
        corPagina: "#f0f4f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png" 
    },
    "matematica": { 
        corPagina: "#f0fdf4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png"
    },
    "estudo": { 
        corPagina: "#fdf2f2", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png"
    },
    "pre": { 
        corPagina: "#fff5f7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png"
    }
};

// === BIBLIOTECA DE CONTEÚDO ===
const BIBLIOTECA_CONTEUDO = {
    "pre": {
        "pre": { t1: "PEQUENOS", t2: "CURIOSOS", sub: "Atividades | Pré-Escolar", rodape: "© Pequenos Curiosos 2024" }
    },
    "ano1": {
        "portugues": { t1: "PEQUENOS", t2: "LEITORES", sub: "Português | 1º Ano", rodape: "© Pequenos Curiosos 2024" },
        "matematica": { t1: "PEQUENOS", t2: "MATEMÁTICOS", sub: "Matemática | 1º Ano", rodape: "© Pequenos Curiosos 2024" }
    }
};

// === CONFIGURAÇÕES GERAIS DO JOGO ===
const JOGO_CONFIG = {
    linkVoltar: "../",
    caminhoImg: "../../img/",    
    caminhoIcons: "../../icons/", 
    totalRondas: 10,
    
    sons: {
        acerto: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3",
        erro: "https://cdn.pixabay.com/audio/2022/03/10/audio_c330c67761.mp3",
        vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3"
    },

    iconesMenu: { 
        home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" 
    },

    links: { 
        home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1"
    },
    
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 50, max: 69, titulo: "Estás quase lá!", img: "taca_3.png" },
        { min: 0, max: 49, titulo: "Continua a tentar!", img: "taca_4.png" }
    ]
};
