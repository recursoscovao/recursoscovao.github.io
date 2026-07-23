// === CONFIGURAÇÃO MESTRE ===
const CONFIG_MESTRE = {
    ano: "pre",        
    area: "pre", // "pre", "portugues", "matematica", "estudo"
    nomeJogo: "Encontra o Par",
    categoriaAtiva: "animais" 
};

// === CATEGORIAS DO JOGO ===
const JOGO_CATEGORIAS = {
    maiusculas: {
        nome: "Letras Maiúsculas",
        descricao: "Encontra a letra igual à de cima.",
        imgCapa: "https://cdn-icons-png.flaticon.com/512/388/388451.png",
        itens: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => ({ id: l, valor: l, tipo: 'texto' })),
        tipo: "upper"
    },
    animais: {
        nome: "Animais Curiosos",
        descricao: "Observa com atenção e encontra o par igual!",
        imgCapa: "https://cdn-icons-png.flaticon.com/512/809/809052.png", // Abelha
        itens: [
            { id: 1, valor: "https://cdn-icons-png.flaticon.com/512/822/822102.png", tipo: 'img' }, // Arara
            { id: 2, valor: "https://cdn-icons-png.flaticon.com/512/3069/3069172.png", tipo: 'img' }, // Elefante
            { id: 3, valor: "https://cdn-icons-png.flaticon.com/512/2622/2622055.png", tipo: 'img' }, // Jacaré
            { id: 4, valor: "https://cdn-icons-png.flaticon.com/512/3069/3069186.png", tipo: 'img' }, // Coala
            { id: 5, valor: "https://cdn-icons-png.flaticon.com/512/1141/1141771.png", tipo: 'img' }, // Caranguejo
            { id: 6, valor: "https://cdn-icons-png.flaticon.com/512/3069/3069209.png", tipo: 'img' }, // Gorila
            { id: 7, valor: "https://cdn-icons-png.flaticon.com/512/427/427503.png", tipo: 'img' },  // Águia
            { id: 8, valor: "https://cdn-icons-png.flaticon.com/512/809/809052.png", tipo: 'img' }   // Abelha
        ]
    }
};

// === BIBLIOTECA DE TEMAS ===
const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#f0f7ff", corCard: "#e8f1f9", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corHamburger: "#5ba4e5", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#f0fdf9", corCard: "#e8fbf4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corHamburger: "#45cfa8", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#fffaf2", corCard: "#fef6e8", corPrimaria: "#ed9d3e", corEscura: "#c57e2d", corHamburger: "#ed9d3e", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#fff5f7", corCard: "#ffffff", corPrimaria: "#E691A7", corEscura: "#D54267", corHamburger: "#E691A7", voltarMobile: "voltar_rs.png" }
};

// === BIBLIOTECA DE CONTEÚDO (COMPLETA) ===
const BIBLIOTECA_CONTEUDO = {
    "pre": { "pre": { t1: "PEQUENOS", t2: "CURIOSOS", sub: "Atividades | Pré-Escolar", rodape: "© Pequenos Curiosos 2024" } },
    "ano1": {
        "portugues": { t1: "PEQUENOS", t2: "LEITORES", sub: "Português | 1º Ano", rodape: "© Pequenos Leitores 2024" },
        "matematica": { t1: "PEQUENOS", t2: "MATEMÁTICOS", sub: "Matemática | 1º Ano", rodape: "© Pequenos Matemáticos 2024" },
        "estudo": { t1: "PEQUENOS", t2: "EXPLORADORES", sub: "Estudo do Meio | 1º Ano", rodape: "© Pequenos Exploradores 2024" }
    },
    "ano2": {
        "portugues": { t1: "jOVENS", t2: "LEITORES", sub: "Português | 2º Ano", rodape: "© Pequenos Leitores 2024" },
        "matematica": { t1: "jOVENS", t2: "MATEMÁTICOS", sub: "Matemática | 2º Ano", rodape: "© Pequenos Matemáticos 2024" },
        "estudo": { t1: "jOVENS", t2: "EXPLORADORES", sub: "Estudo do Meio | 2º Ano", rodape: "© Pequenos Exploradores 2024" }
    },
    "ano3": {
        "portugues": { t1: "SUPER", t2: "LEITORES", sub: "Português | 3º Ano", rodape: "© Pequenos Leitores 2024" },
        "matematica": { t1: "SUPER", t2: "MATEMÁTICOS", sub: "Matemática | 3º Ano", rodape: "© Pequenos Matemáticos 2024" },
        "estudo": { t1: "SUPER", t2: "EXPLORADORES", sub: "Estudo do Meio | 3º Ano", rodape: "© Pequenos Exploradores 2024" }
    },
    "ano4": {
        "portugues": { t1: "MESTRES", t2: "LEITORES", sub: "Português | 4º Ano", rodape: "© Pequenos Leitores 2024" },
        "matematica": { t1: "MESTRES", t2: "MATEMÁTICOS", sub: "Matemática | 4º Ano", rodape: "© Pequenos Matemáticos 2024" },
        "estudo": { t1: "MESTRES", t2: "EXPLORADORES", sub: "Estudo do Meio | 4º Ano", rodape: "© Pequenos Exploradores 2024" }
    }
};

// === CONFIGURAÇÕES GERAIS ===
const JOGO_CONFIG = {
    caminhoIcons: "../../icons/", 
    caminhoImg: "../../img/",
    totalRondas: 10,
    sons: {
        acerto: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3",
        erro: "https://cdn.pixabay.com/audio/2022/03/10/audio_c330c67761.mp3",
        vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3"
    },
    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    links: { home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4" },
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque!", img: "https://cdn-icons-png.flaticon.com/512/3112/3112946.png" },
        { min: 0, max: 89, titulo: "Muito bem!", img: "https://cdn-icons-png.flaticon.com/512/3112/3112946.png" }
    ]
};
