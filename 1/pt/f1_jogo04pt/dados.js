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
// 2. BIBLIOTECA DE CONTEÚDO
// ==========================================
const BIBLIOTECA_CONTEUDO = {
    "jd": {
        "jd": { t1: "Jogos em", t2: "Destaque", sub: "Recursos Especiais", rodape: "© Pequenos Curiosos" }
    },
    "pre": {
        "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", rodape: "© Pequenos Curiosos" }
    },
    "ano1": {
        "portugues": { t1: "Pequenos", t2: "Leitores", sub: "1º Ano | Português", rodape: "© Pequenos Leitores" },
        "matematica": { t1: "Pequenos", t2: "Matemáticos", sub: "1º Ano | Matemática", rodape: "© Pequenos Matemáticos" },
        "estudo": { t1: "Pequenos", t2: "Exploradores", sub: "1º Ano | Estudo do Meio", rodape: "© Pequenos Exploradores" }
    },
    "ano2": {
        "portugues": { t1: "Jovens", t2: "Leitores", sub: "2º Ano | Português", rodape: "© Jovens Leitores" },
        "matematica": { t1: "Jovens", t2: "Matemáticos", sub: "2º Ano | Matemática", rodape: "© Jovens Matemáticos" },
        "estudo": { t1: "Jovens", t2: "Exploradores", sub: "2º Ano | Estudo do Meio", rodape: "© Jovens Exploradores" }
    },
    "ano3": {
        "portugues": { t1: "Exploradores", t2: "Leitores", sub: "3º Ano | Português", rodape: "© Exploradores" },
        "matematica": { t1: "Exploradores", t2: "Cálculos", sub: "3º Ano | Matemática", rodape: "© Exploradores" },
        "estudo": { t1: "Exploradores", t2: "do Mundo", sub: "3º Ano | Estudo do Meio", rodape: "© Exploradores" }
    },
    "ano4": {
        "portugues": { t1: "Mestres", t2: "da Língua", sub: "4º Ano | Português", rodape: "© Mestres Curiosos" },
        "matematica": { t1: "Mestres", t2: "do Cálculo", sub: "4º Ano | Matemática", rodape: "© Mestres Curiosos" },
        "estudo": { t1: "Mestres", t2: "do Mundo", sub: "4º Ano | Estudo do Meio", rodape: "© Mestres Curiosos" }
    }
};

// ==========================================
// 3. CONFIGURAÇÃO DO JOGO ATUAL
// ==========================================
const JOGO_CONFIG = {
    nomeDoJogo: "Completa a Palavra",
    descricao: "Arrasta ou clica na letra correta para completar a palavra!",
    
    areaAtiva: "portugues",   
    anoAtivo: "ano1",    

    caminhoIconsMenu: "../../../icons/", 
    caminhoIconsJogos: "../../../icons/ic_jogos_1ano/", 
    caminhoSons: "../../../sons/", 
    caminhoImg: "../../../img/animaisdomesticos/",

    sons: {
        acerto: "acerto.mp3",
        erro: "erro.mp3",
        clique: "clique.mp3"
    },

    menuItens: [
        { id: "home",   label: "Início",       icon: "home.png",    link: "/" },
        { id: "pre",    label: "Pré-Escolar",  icon: "iconpre.png", link: "/pre" },
        { id: "ano1",   label: "1º Ano",       icon: "icon1.png",   link: "/1" },
        { id: "ano2",   label: "2º Ano",       icon: "icon2.png",   link: "/2" },
        { id: "ano3",   label: "3º Ano",       icon: "icon3.png",   link: "/3" },
        { id: "ano4",   label: "4º Ano",       icon: "icon4.png",   link: "/4" },
        { id: "voltar", label: "Voltar",       icon: "AUTO",        link: "javascript:history.back()" } 
    ],

    relatorios: [
        { min: 9, max: 10, titulo: "Fantástico! És um Mestre!", img: "taca_1.png" },
        { min: 7, max: 8,  titulo: "Excelente trabalho!",      img: "taca_2.png" },
        { min: 5, max: 6,  titulo: "Quase lá!",              img: "taca_3.png" },
        { min: 0, max: 4,  titulo: "Vamos treinar!",           img: "taca_4.png" }
    ],

    categorias: {
        animais: {
            nome: "Animais",
            exemplo: "Gato",
            exemploImg: "gato.png",
            itens: [
                { nome: "Gato", img: "gato.png" },
                { nome: "Pato", img: "pato.png" },
                { nome: "Cão", img: "cao.png" },
                { nome: "Vaca", img: "vaca.png" },
                { nome: "Galinha", img: "galinha.png" },
                { nome: "Cavalo", img: "cavalo.png" },
                { nome: "Porco", img: "porco.png" },
                { nome: "Coelho", img: "coelho.png" },
                { nome: "Ovelha", img: "ovelha.png" },
                { nome: "Cabra", img: "cabra.png" }
            ]
        }
    }
};

const DADOS_JOGO = {
    titulo: "Completa a Palavra",
    somInstrucoes: "sons1ano/f1_jogo03pt.mp3"
};
