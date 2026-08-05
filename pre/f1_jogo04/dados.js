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
    }
};

// ==========================================
// 3. CONFIGURAÇÃO DO JOGO ATUAL
// ==========================================
const JOGO_CONFIG = {
    nomeDoJogo: "Quem emite este som?",
    descricao: "Ouve o som com atenção e clica no animal correto!",
    textoDestaque: "Quem sou eu?",
    fraseIntermedia: "Clica no animal que faz este som:",

    areaAtiva: "pre",   
    anoAtivo: "pre",    
    
    caminhoIconsMenu: "../../icons/", 
    caminhoIconsJogos: "../../icons/ic_jogos_pre/",
    caminhoSonsSistema: "../../sons/", // Sons de acerto/erro/clique
    caminhoSonsAnimais: "../../sons/som_animais/", // Pasta dos sons dos animais

    sons: {
        acerto: "certo.mp3",
        erro: "erro.mp3",
        clique: "clique.mp3"
    },

    menuItens: [
        { id: "home", label: "Início", icon: "home.png", link: "/" },
        { id: "pre", label: "Pré-Escolar", icon: "iconpre.png", link: "/pre" },
        { id: "voltar", label: "Voltar", icon: "AUTO", link: "javascript:history.back()" } 
    ],

    instrucoes: {
        objetivo: "Ouvir o som reproduzido e identificar o animal correspondente entre as opções apresentadas.",
        comoJogar: [
            "Clica no botão de som no topo para ouvires o animal.",
            "Observa as três imagens de animais em baixo.",
            "Clica no animal que achas que faz aquele som.",
            "Se acertares, passas para o próximo desafio.",
            "Completa as 10 rondas para veres o teu resultado final."
        ],
        regras: [
            "Apenas uma imagem está correta.",
            "Podes ouvir o som as vezes que quiseres antes de responder."
        ],
        dicas: "Presta atenção aos detalhes do som: é um rugido, um pio, um latido ou um relincho?",
        desenvolvimento: [
            "Discriminação auditiva",
            "Identificação de seres vivos",
            "Raciocínio lógico",
            "Atenção e concentração"
        ]
    },

    relatorios: [
        { min: 9, max: 10, titulo: "És um mestre dos sons!", img: "taca_1.png" },
        { min: 7, max: 8, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 5, max: 6, titulo: "Estás quase lá!", img: "taca_3.png" },
        { min: 0, max: 4, titulo: "Continua a praticar!", img: "taca_4.png" }
    ]
};

// ==========================================
// 4. DADOS DO CONTEÚDO DO JOGO
// ==========================================
const DADOS_JOGO = {
    caminhoDomesticos: "../../img/animaisdomesticos/",
    caminhoSelvagens: "../../img/animaisselvagens/",
    somInstrucoes: "sonspre/instrucoes_sons.mp3", 
    
    // Lista de animais mapeada com base nas tuas imagens e sons
    itens: [
        // Domésticos
        { id: 1,  img: "boi.png",      som: "boi.mp3",      nome: "Boi",      pasta: "domesticos" },
        { id: 2,  img: "burro.png",    som: "burro.mp3",    nome: "Burro",    pasta: "domesticos" },
        { id: 3,  img: "cabra.png",    som: "cabra.mp3",    nome: "Cabra",    pasta: "domesticos" },
        { id: 4,  img: "cao.png",      som: "cao.mp3",      nome: "Cão",      pasta: "domesticos" },
        { id: 5,  img: "cavalo.png",   som: "cavalo.mp3",   nome: "Cavalo",   pasta: "domesticos" },
        { id: 6,  img: "galinha.png",  som: "galinha.mp3",  nome: "Galinha",  pasta: "domesticos" },
        { id: 7,  img: "galo.png",     som: "galo.mp3",     nome: "Galo",     pasta: "domesticos" },
        { id: 8,  img: "gato.png",     som: "gato.mp3",     nome: "Gato",     pasta: "domesticos" },
        { id: 9,  img: "ovelha.png",   som: "ovelha.mp3",   nome: "Ovelha",   pasta: "domesticos" },
        { id: 10, img: "porco.png",    som: "porco.mp3",    nome: "Porco",    pasta: "domesticos" },
        { id: 11, img: "vaca.png",     som: "vaca.mp3",     nome: "Vaca",     pasta: "domesticos" },
        { id: 12, img: "pato.png",     som: "pato.mp3",     nome: "Pato",     pasta: "domesticos" },

        // Selvagens
        { id: 13, img: "abelha.png",    som: "abelha.mp3",    nome: "Abelha",    pasta: "selvagens" },
        { id: 14, img: "elefante.png",  som: "elefante.mp3",  nome: "Elefante",  pasta: "selvagens" },
        { id: 15, img: "leao.png",      som: "leao.mp3",      nome: "Leão",      pasta: "selvagens" },
        { id: 16, img: "lobo.png",      som: "lobo.mp3",      nome: "Lobo",      pasta: "selvagens" },
        { id: 17, img: "macaco.png",    som: "macaco.mp3",    nome: "Macaco",    pasta: "selvagens" },
        { id: 18, img: "papagaio.png",  som: "papagaio.mp3",  nome: "Papagaio",  pasta: "selvagens" },
        { id: 19, img: "tigre.png",     som: "tigre.mp3",     nome: "Tigre",     pasta: "selvagens" },
        { id: 20, img: "urso.png",      som: "urso.mp3",      nome: "Urso",      pasta: "selvagens" },
        { id: 21, img: "zebra.png",     som: "zebra.mp3",     nome: "Zebra",     pasta: "selvagens" },
        { id: 22, img: "hiena.png",     som: "hiena.mp3",     nome: "Hiena",     pasta: "selvagens" },
        { id: 23, img: "hipopotamo.png",som: "hipopotamo.mp3",nome: "Hipopótamo",pasta: "selvagens" },
        { id: 24, img: "serpente.png",  som: "serpente.mp3",  nome: "Serpente",  pasta: "selvagens" }
    ]
};
