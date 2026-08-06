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
    "pre": { "pre": { t1: "Pequenos", t2: "Escritores", sub: "Grafismo | Letras", rodape: "&copy; Recursos Covão" } },
    "ano1": { 
        "portugues": { t1: "Pequenos", t2: "Leitores", sub: "1º Ano | Português", rodape: "&copy; Recursos Covão" },
        "matematica": { t1: "Pequenos", t2: "Matemáticos", sub: "1º Ano | Matemática", rodape: "&copy; Recursos Covão" },
        "estudo": { t1: "Pequenos", t2: "Exploradores", sub: "1º Ano | Estudo do Meio", rodape: "&copy; Recursos Covão" }
    },
    "ano2": { 
        "portugues": { t1: "Jovens", t2: "Leitores", sub: "2º Ano | Português", rodape: "&copy; Recursos Covão" },
        "matematica": { t1: "Jovens", t2: "Matemáticos", sub: "2º Ano | Matemática", rodape: "&copy; Recursos Covão" },
        "estudo": { t1: "Jovens", t2: "Exploradores", sub: "2º Ano | Estudo do Meio", rodape: "&copy; Recursos Covão" }
    }
};

// ==========================================
// 3. CONFIGURAÇÃO DO JOGO ATUAL
// ==========================================
const JOGO_CONFIG = {
    nomeDoJogo: "Letras Mágicas",
    descricao: "Contorna as letras seguindo os números!",
    
    areaAtiva: "pre",   
    anoAtivo: "pre",    
    
    caminhoIconsMenu: "../../icons/", 
    caminhoIconsJogos: "../../icons/ic_jogos_pre/",
    caminhoSonsBase: "../../sons/", 

    sons: {
        acerto: "certo.mp3",
        clique: "clique.mp3",
    },

    coresMagicas: [
        { nome: "Azul", cor: "#5ba4e5" },
        { nome: "Verde", cor: "#45cfa8" },
        { nome: "Vermelho", cor: "#ff5a5f" },
        { nome: "Amarelo", cor: "#ffc107" }
    ],

    menuItens: [
        { id: "home", label: "Início", icon: "home.png", link: "/" },
        { id: "pre", label: "Pré-Escolar", icon: "iconpre.png", link: "/pre" },
        { id: "voltar", label: "Voltar", icon: "AUTO", link: "javascript:history.back()" } 
    ],

    relatorios: [
        { min: 1, max: 100, titulo: "És um mestre da escrita!", img: "taca_1.png" }
    ]
};

// ==========================================
// 4. DADOS DO CONTEÚDO (ALFABETO PROGRAMADO)
// ==========================================
const DADOS_JOGO = {
    somInstrucoes: "sonspre/f1_jogo07.mp3",
    alfabeto: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    
    // Coordenadas para desenhar as letras (A-Z)
    bibliotecaLetras: {
        "A": {
            viewBox: "0 0 100 120",
            corpo: "M50,10 L15,110 L35,110 L42,85 L58,85 L65,110 L85,110 Z M50,35 L45,70 L55,70 Z",
            guias: [
                { d: "M50,15 L22,105", label: "1", lx: 44, ly: 25 },
                { d: "M50,15 L78,105", label: "2", lx: 56, ly: 38 },
                { d: "M40,78 L60,78", label: "3", lx: 34, ly: 82 }
            ]
        },
        "B": {
            viewBox: "0 0 100 120",
            corpo: "M25,10 V110 H55 A25,25 0 0 0 55,65 A20,20 0 0 0 55,10 Z M40,25 H50 A10,10 0 0 1 50,45 H40 Z M40,65 H55 A15,15 0 0 1 55,95 H40 Z",
            guias: [
                { d: "M30,15 V105", label: "1", lx: 22, ly: 25 },
                { d: "M30,15 C75,15 75,55 30,55", label: "2", lx: 60, ly: 25 },
                { d: "M30,55 C85,55 85,105 30,105", label: "3", lx: 65, ly: 75 }
            ]
        },
        "C": {
            viewBox: "0 0 100 120",
            corpo: "M80,30 A40,40 0 1 0 80,90 L85,105 A55,55 0 1 1 85,15 Z",
            guias: [
                { d: "M80,25 A40,40 0 1 0 80,95", label: "1", lx: 85, ly: 20 }
            ]
        }
        // ... as restantes letras seguem esta lógica de coordenadas
    }
};
