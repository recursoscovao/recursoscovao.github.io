// ==========================================
// 1. BIBLIOTECA DE TEMAS
// ==========================================
const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png" },
    "jd": { corPagina: "#f0f2f5", corPrimaria: "#6c757d", corEscura: "#495057", corTexto: "#6c757d", voltarMobile: "voltar_cin.png" }
};

// ==========================================
// 2. BIBLIOTECA DE CONTEÚDO (Textos Automáticos)
// ==========================================
const BIBLIOTECA_CONTEUDO = {
    "jd": { "jd": { t1: "Jogos em", t2: "Destaque", sub: "Recursos Especiais", rodape: "&copy; Recursos Covão" } },
    "pre": { "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", rodape: "&copy; Recursos Covão" } },
    "ano1": { 
        "portugues": { t1: "Pequenos", t2: "Leitores", sub: "1º Ano | Português", rodape: "&copy; Recursos Covão" },
        "matematica": { t1: "Pequenos", t2: "Matemáticos", sub: "1º Ano | Matemática", rodape: "&copy; Recursos Covão" },
        "estudo": { t1: "Pequenos", t2: "Exploradores", sub: "1º Ano | Estudo do Meio", rodape: "&copy; Recursos Covão" }
    },
    "ano2": { 
        "portugues": { t1: "Jovens", t2: "Leitores", sub: "2º Ano | Português", rodape: "&copy; Recursos Covão" },
        "matematica": { t1: "Jovens", t2: "Matemáticos", sub: "2º Ano | Matemática", rodape: "&copy; Recursos Covão" },
        "estudo": { t1: "Jovens", t2: "Exploradores", sub: "2º Ano | Estudo do Meio", rodape: "&copy; Recursos Covão" }
    },
    "ano3": { 
        "portugues": { t1: "Exploradores", t2: "Leitores", sub: "3º Ano | Português", rodape: "&copy; Recursos Covão" },
        "matematica": { t1: "Exploradores", t2: "Cálculos", sub: "3º Ano | Matemática", rodape: "&copy; Recursos Covão" },
        "estudo": { t1: "Exploradores", t2: "do Mundo", sub: "3º Ano | Estudo do Meio", rodape: "&copy; Recursos Covão" }
    },
    "ano4": { 
        "portugues": { t1: "Mestres", t2: "da Língua", sub: "4º Ano | Português", rodape: "&copy; Recursos Covão" },
        "matematica": { t1: "Mestres", t2: "do Cálculo", sub: "4º Ano | Matemática", rodape: "&copy; Recursos Covão" },
        "estudo": { t1: "Mestres", t2: "do Mundo", sub: "4º Ano | Estudo do Meio", rodape: "&copy; Recursos Covão" }
    }
};

// ==========================================
// 3. CONFIGURAÇÃO DO JOGO ATUAL
// ==========================================
const JOGO_CONFIG = {
    nomeDoJogo: "Ligue as Sombras",
    descricao: "Liga cada fruto à sua sombra correspondente!",
    fraseInstrucao: "Clica no fruto e depois na sombra certa.",
    
    areaAtiva: "pre",   
    anoAtivo: "pre",    
    
    caminhoIconsMenu: "../../icons/", 
    caminhoIconsJogos: "../../icons/ic_jogos_pre/",
    caminhoSonsBase: "../../sons/", 

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
        objetivo: "Identificar as formas dos frutos através das suas sombras.",
        comoJogar: [
            "Clica no ponto ao lado de um fruto (coluna esquerda).",
            "Clica no ponto ao lado da sombra correta (coluna direita).",
            "Uma linha será desenhada se a ligação estiver certa.",
            "Liga os 4 frutos para passares à próxima ronda."
        ],
        regras: ["Só podes ligar um fruto a uma sombra.", "O jogo termina após 3 rondas completas."],
        dicas: "Observa bem o contorno do fruto (se tem folha, se é redondo ou comprido).",
        desenvolvimento: ["Discriminação Visual", "Atenção", "Raciocínio Geométrico"]
    },

    relatorios: [
        { min: 10, max: 12, titulo: "És um mestre das sombras!", img: "taca_1.png" },
        { min: 7, max: 9, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 0, max: 6, titulo: "Continua a tentar!", img: "taca_4.png" }
    ]
};

// ==========================================
// 4. DADOS DO CONTEÚDO DO JOGO
// ==========================================
const DADOS_JOGO = {
    caminhoImagens: "../../img/frutos/",
    somInstrucoes: "sonspre/f1_jogo06.mp3", 
    
    itens: [
        { id: 1,  img: "amora.png", nome: "Amora" },
        { id: 2,  img: "ananas.png", nome: "Ananás" },
        { id: 3,  img: "banana.png", nome: "Banana" },
        { id: 4,  img: "castanha.png", nome: "Castanha" },
        { id: 5,  img: "cereja.png", nome: "Cereja" },
        { id: 6,  img: "diospiro.png", nome: "Dióspiro" },
        { id: 7,  img: "figo.png", nome: "Figo" },
        { id: 8,  img: "goiaba.png", nome: "Goiaba" },
        { id: 9,  img: "kiwi.png", nome: "Kiwi" },
        { id: 10, img: "laranja.png", nome: "Laranja" },
        { id: 11, img: "limao.png", nome: "Limão" },
        { id: 12, img: "maca.png", nome: "Maçã" },
        { id: 13, img: "maracuja.png", nome: "Maracujá" },
        { id: 14, img: "melancia.png", nome: "Melancia" },
        { id: 15, img: "melao.png", nome: "Melão" },
        { id: 16, img: "mirtilo.png", nome: "Mirtilo" },
        { id: 17, img: "morango.png", nome: "Morango" },
        { id: 18, img: "papaia.png", nome: "Papaia" },
        { id: 19, img: "pera.png", nome: "Pêra" },
        { id: 20, img: "pessego.png", nome: "Pêssego" },
        { id: 21, img: "roma.png", nome: "Romã" }
    ]
};
