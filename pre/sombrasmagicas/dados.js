// ==========================================
// 1. BIBLIOTECA DE TEMAS
// ==========================================
const BIBLIOTECA_TEMAS = {
    "portugues": { 
        corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", 
        corTexto: "#5d7082", voltarMobile: "voltar_az.png" 
    },
    "matematica": { 
        corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", 
        corTexto: "#45cfa8", voltarMobile: "voltar_vr.png" 
    },
    "estudo": { 
        corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", 
        corTexto: "#994D4D", voltarMobile: "voltar_cs.png" 
    },
    "pre": { 
        corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", 
        corTexto: "#E691A7", voltarMobile: "voltar_rs.png" 
    },
    "jd": { 
        corPagina: "#f0f2f5", corPrimaria: "#6c757d", corEscura: "#495057", 
        corTexto: "#6c757d", voltarMobile: "voltar_cin.png" 
    }
};

// ==========================================
// 2. BIBLIOTECA DE CONTEÚDO (Textos Automáticos)
// ==========================================
const BIBLIOTECA_CONTEUDO = {
    "jd": { 
        "jd": { t1: "Jogos em", t2: "Destaque", sub: "Recursos Especiais", rodape: "&copy; Pequenos Curiosos" } 
    },
    "pre": { 
        "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", rodape: "&copy; Pequenos Curiosos" } 
    },
    "ano1": { 
        "portugues": { t1: "Pequenos", t2: "Leitores", sub: "1º Ano | Português", rodape: "&copy; Pequenos Leitores" },
        "matematica": { t1: "Pequenos", t2: "Matemáticos", sub: "1º Ano | Matemática", rodape: "&copy; Pequenos Matemáticos" },
        "estudo": { t1: "Pequenos", t2: "Exploradores", sub: "1º Ano | Estudo do Meio", rodape: "&copy; Pequenos Exploradores" }
    },
    "ano2": { 
        "portugues": { t1: "Jovens", t2: "Leitores", sub: "2º Ano | Português", rodape: "&copy; Jovens Leitores" },
        "matematica": { t1: "Jovens", t2: "Matemáticos", sub: "2º Ano | Matemática", rodape: "&copy; Jovens Matemáticos" },
        "estudo": { t1: "Jovens", t2: "Exploradores", sub: "2º Ano | Estudo do Meio", rodape: "&copy; Jovens Exploradores" }
    },
    "ano3": { 
        "portugues": { t1: "Exploradores", t2: "Leitores", sub: "3º Ano | Português", rodape: "&copy; Exploradores" },
        "matematica": { t1: "Exploradores", t2: "Cálculos", sub: "3º Ano | Matemática", rodape: "&copy; Exploradores" },
        "estudo": { t1: "Exploradores", t2: "do Mundo", sub: "3º Ano | Estudo do Meio", rodape: "&copy; Exploradores" }
    },
    "ano4": { 
        "portugues": { t1: "Mestres", t2: "da Língua", sub: "4º Ano | Português", rodape: "&copy; Mestres Curiosos" },
        "matematica": { t1: "Mestres", t2: "do Cálculo", sub: "4º Ano | Matemática", rodape: "&copy; Mestres Curiosos" },
        "estudo": { t1: "Mestres", t2: "do Mundo", sub: "4º Ano | Estudo do Meio", rodape: "&copy; Mestres Curiosos" }
    }
};

// ==========================================
// 3. CONFIGURAÇÃO DO JOGO ATUAL
// ==========================================
const JOGO_CONFIG = {
    nomeDoJogo: "Sombras Mágicas",
    descricao: "Faz corresponder a fruta à sua sombra",
    
    areaAtiva: "pre",   
    anoAtivo: "pre",    
    
    caminhoIconsMenu: "../../icons/", 
    caminhoIconsJogos: "../../icons/ic_jogos_pre",
    caminhoSons: "../../sons/", 

    sons: {
        acerto: "certo.mp3",
        erro: "erro.mp3",
        clique: "clique.mp3"
    },

    menuItens: [
        { id: "home", label: "Início", icon: "home.png", link: "/" },
        { id: "pre", label: "Pré-Escolar", icon: "iconpre.png", link: "/pre" },
        { id: "ano1", label: "1º Ano", icon: "icon1.png", link: "/1" },
        { id: "ano2", label: "2º Ano", icon: "icon2.png", link: "/2" },
        { id: "ano3", label: "3º Ano", icon: "icon3.png", link: "/3" },
        { id: "ano4", label: "4º Ano", icon: "icon4.png", link: "/4" },
        { id: "voltar", label: "Voltar", icon: "AUTO", link: "javascript:history.back()" } 
    ],

    instrucoes: {
        objetivo: "Observa atentamente a fruta apresentada no topo do ecrã e encontra a imagem igual entre as várias opções. Clica ou toca na fruta correta para avançares para a ronda seguinte.",
        comoJogar: [
            "Observa a fruta que aparece no topo do ecrã.",
            "Analisa todas as imagens apresentadas.",
            "Encontra a imagem exatamente igual ao modelo.",
            "Clica ou toca na fruta correta.",
            "Se acertares, passas para a próxima ronda.",
            "Se errares, o jogo mostra a resposta certa antes de avançar.",
            "Completa as 10 rondas para ver os resultados."
        ],
        regras: [
            "Existe apenas uma resposta correta em cada ronda.",
            "Observa com atenção antes de responder.",
            "Não há limite de tempo."
        ],
        dicas: "Observa cuidadosamente a cor, o formato e as sementes de cada fruta. Algumas podem ter cores semelhantes!",
        desenvolvimento: [
            "Atenção e concentração",
            "Memória visual",
            "Capacidade de observação",
            "Discriminação visual"
        ]
    },

    relatorios: [
        { min: 9, max: 10, titulo: "És um craque!", img: "taca_1.png" },
        { min: 7, max: 8, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 5, max: 6, titulo: "Estás quase lá!", img: "taca_3.png" },
        { min: 0, max: 4, titulo: "Continua a tentar!", img: "taca_4.png" }
    ]
};

// ==========================================
// 4. DADOS DO CONTEÚDO DO JOGO
// ==========================================
const DADOS_JOGO = {
    caminhoImagens: "../../img/frutos/",
    itens: [
        { id: 1, img: "morango.png", nome: "Morango" },
        { id: 2, img: "mirtilo.png", nome: "Mirtilo" },
        { id: 3, img: "pessego.png", nome: "Pêssego" },
        { id: 4, img: "amora.png", nome: "Amora" },
        { id: 5, img: "melao.png", nome: "Melão" },
        { id: 6, img: "maracuja.png", nome: "Maracujá" },
        { id: 7, img: "limao.png", nome: "Limão" },
        { id: 8, img: "goiaba.png", nome: "Goiaba" },
        { id: 9, img: "figo.png", nome: "Figo" },
        { id: 10, img: "diospiro.png", nome: "Dióspiro" },
        { id: 11, img: "castanha.png", nome: "Castanha" },
        { id: 12, img: "roma.png", nome: "Romã" },
        { id: 13, img: "cereja.png", nome: "Cereja" },
        { id: 14, img: "melancia.png", nome: "Melancia" },
        { id: 15, img: "ananas.png", nome: "Ananás" },
        { id: 16, img: "kiwi.png", nome: "Kiwi" },
        { id: 17, img: "uvas.png", nome: "Uvas" },
        { id: 18, img: "papaia.png", nome: "Papaia" },
        { id: 19, img: "banana.png", nome: "Banana" },
        { id: 20, img: "maca.png", nome: "Maçã" },
        { id: 21, img: "laranja.png", nome: "Laranja" },
        { id: 22, img: "pera.png", nome: "Pêra" }
    ]
};
