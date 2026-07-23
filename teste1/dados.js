// === CONFIGURAÇÃO MESTRE ===
const CONFIG_MESTRE = {
    ano: "pre",        
    area: "pre",  // Altera para "portugues", "matematica", "estudo" ou "pre"
    nomeJogo: "Chuva de Letras",
    categoriaAtiva: "maiusculas" 
};

// === CATEGORIAS DO JOGO ===
const JOGO_CATEGORIAS = {
    maiusculas: {
        nome: "Letras Maiúsculas",
        descricao: "Encontra a letra igual à que aparece em cima.",
        imgCapa: "https://cdn-icons-png.flaticon.com/512/388/388451.png", // Exemplo Bee/Abelha
        letras: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
        tipo: "upper"
    },
    minusculas: {
        nome: "Letras Minúsculas",
        descricao: "Encontra a letra igual à que aparece em cima.",
        imgCapa: "https://cdn-icons-png.flaticon.com/512/388/388451.png",
        letras: "abcdefghijklmnopqrstuvwxyz".split(""),
        tipo: "lower"
    }
};

// === BIBLIOTECA DE TEMAS (CORES DA IMAGEM) ===
const BIBLIOTECA_TEMAS = {
    "portugues": { 
        corPagina: "#e9f2fb",      
        corCard: "#f0f7ff",        
        corPrimaria: "#5ba4e5",    
        corEscura: "#3d7db8", 
        voltarMobile: "voltar_az.png" 
    },
    "matematica": { 
        corPagina: "#e9fbf4", 
        corCard: "#f0fdf9",        
        corPrimaria: "#45cfa8",    
        corEscura: "#2BA886", 
        voltarMobile: "voltar_vr.png"
    },
    "estudo": { 
        corPagina: "#fef5e7", 
        corCard: "#fffaf2",        
        corPrimaria: "#ed9d3e",    
        corEscura: "#c57e2d", 
        voltarMobile: "voltar_cs.png"
    },
    "pre": { 
        corPagina: "#fff5f7", 
        corCard: "#ffffff", 
        corPrimaria: "#E691A7", 
        corEscura: "#D54267", 
        voltarMobile: "voltar_rs.png"
    }
};

// === BIBLIOTECA DE CONTEÚDO ===
const BIBLIOTECA_CONTEUDO = {
    "pre": {
        "pre": { t1: "PEQUENOS", t2: "CURIOSOS", sub: "Atividades | Pré-Escolar", rodape: "© Pequenos Curiosos 2024" }
    },
    "ano1": {
        "portugues": { t1: "PEQUENOS", t2: "LEITORES", sub: "Português | 1º Ano", rodape: "© Pequenos Curiosos 2024" },
        "matematica": { t1: "PEQUENOS", t2: "MATEMÁTICOS", sub: "Matemática | 1º Ano", rodape: "© Pequenos Curiosos 2024" },
        "estudo": { t1: "PEQUENOS", t2: "EXPLORADORES", sub: "Estudo do Meio | 1º Ano", rodape: "© Pequenos Curiosos 2024" }
    }
};

// === CONFIGURAÇÕES GERAIS ===
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
    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png" },
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque!", img: "https://cdn-icons-png.flaticon.com/512/3112/3112946.png" },
        { min: 0, max: 89, titulo: "Muito bem!", img: "https://cdn-icons-png.flaticon.com/512/3112/3112946.png" }
    ]
};
