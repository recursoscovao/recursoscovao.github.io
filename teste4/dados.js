// ==========================================
// 1. BIBLIOTECA DE TEMAS (Cores e Ícones de Navegação)
// ==========================================
const BIBLIOTECA_TEMAS = {
    "portugues": { 
        corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", 
        corTexto: "#5d7082", voltarMobile: "voltar_az.png", corHamburger: "#5ba4e5" 
    },
    "matematica": { 
        corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", 
        corTexto: "#45cfa8", voltarMobile: "voltar_vr.png", corHamburger: "#45cfa8" 
    },
    "estudo": { 
        corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", 
        corTexto: "#994D4D", voltarMobile: "voltar_cs.png", corHamburger: "#994D4D" 
    },
    "pre": { 
        corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", 
        corTexto: "#E691A7", voltarMobile: "voltar_rs.png", corHamburger: "#E691A7" 
    },
    "jd": { 
        corPagina: "#f0f2f5", corPrimaria: "#6c757d", corEscura: "#495057", 
        corTexto: "#6c757d", voltarMobile: "voltar_cin.png", corHamburger: "#6c757d" 
    }
};

// ==========================================
// 2. BIBLIOTECA DE CONTEÚDO (Textos Automáticos)
// ==========================================
const BIBLIOTECA_CONTEUDO = {
    "jd": { "jd": { t1: "Jogos em", t2: "Destaque", sub: "Recursos Especiais", rodape: "&copy; Pequenos Curiosos" } },
    "pre": { "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", rodape: "&copy; Pequenos Curiosos" } },
    "ano1": { 
        "portugues": { t1: "Pequenos", t2: "Leitores", sub: "1º Ano | Português", rodape: "&copy; Pequenos Leitores" },
        "matematica": { t1: "Pequenos", t2: "Matemáticos", sub: "1º Ano | Matemática", rodape: "&copy; Pequenos Matemáticos" }
    },
    "ano2": { 
        "portugues": { t1: "Jovens", t2: "Leitores", sub: "2º Ano | Português", rodape: "&copy; Jovens Leitores" },
        "matematica": { t1: "Jovens", t2: "Matemáticos", sub: "2º Ano | Matemática", rodape: "&copy; Jovens Matemáticos" }
    },
    "ano3": { 
        "portugues": { t1: "Exploradores", t2: "Leitores", sub: "3º Ano | Português", rodape: "&copy; Exploradores" },
        "matematica": { t1: "Exploradores", t2: "Cálculos", sub: "3º Ano | Matemática", rodape: "&copy; Exploradores" }
    },
    "ano4": { 
        "portugues": { t1: "Mestres", t2: "da Língua", sub: "4º Ano | Português", rodape: "&copy; Mestres Curiosos" },
        "matematica": { t1: "Mestres", t2: "do Cálculo", sub: "4º Ano | Matemática", rodape: "&copy; Mestres Curiosos" }
    }
};

// ==========================================
// 3. CONFIGURAÇÃO DO JOGO ATUAL
// ==========================================
const JOGO_CONFIG = {
    // TÍTULO DO JOGO (Para aparecer no index.html e na aba do navegador)
    nomeDoJogo: "Encontrar o Par: Animais",

    // ESTADO ATIVO (Muda isto para alterar o tema e os textos automáticos)
    areaAtiva: "pre",   // Opções: "portugues", "matematica", "estudo", "pre", "jd"
    anoAtivo: "pre",    // Opções: "pre", "ano1", "ano2", "ano3", "ano4"
    
    // CAMINHOS DE PASTAS
    caminhoIconsMenu: "../icons/", 
    caminhoIconsJogos: "../icons/",

    // ESTRUTURA DO MENU HAMBÚRGUER (Apenas o que deve aparecer)
    // Nota: O ícone do 'voltar' é definido dinamicamente pela áreaAtiva
    menuItens: [
        { id: "home", label: "Início", icon: "home.png", link: "../" },
        { id: "pre", label: "Pré-Escolar", icon: "iconpre.png", link: "../pre" },
        { id: "ano1", label: "1º Ano", icon: "icon1.png", link: "../1" },
        { id: "ano2", label: "2º Ano", icon: "icon2.png", link: "../2" },
        { id: "ano3", label: "3º Ano", icon: "icon3.png", link: "../3" },
        { id: "ano4", label: "4º Ano", icon: "icon4.png", link: "../4" },
        { id: "voltar", label: "Voltar", icon: "AUTO", link: "javascript:history.back()" } 
    ],

    // RELATÓRIO FINAL (Troféus por pontuação)
    relatorios: [
        { min: 9, max: 10, titulo: "És um craque!", img: "taca_1.png" },
        { min: 7, max: 8, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 5, max: 6, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 4, titulo: "Continua a tentar!", img: "taca_4.png" }
    ]
};

// ==========================================
// 4. DADOS DO CONTEÚDO DO JOGO (Imagens e IDs)
// ==========================================
const DADOS_JOGO = {
    caminhoImagens: "../img/animaisdomesticos/",
    itens: [
        { id: 1, img: "galo.png", nome: "Galo" },
        { id: 2, img: "galinha.png", nome: "Galinha" },
        { id: 3, img: "cabra.png", nome: "Cabra" },
        { id: 4, img: "ovelha.png", nome: "Ovelha" },
        { id: 5, img: "burro.png", nome: "Burro" },
        { id: 6, img: "peru.png", nome: "Peru" },
        { id: 7, img: "porco.png", nome: "Porco" },
        { id: 8, img: "vaca.png", nome: "Vaca" },
        { id: 9, img: "pato.png", nome: "Pato" },
        { id: 10, img: "gato.png", nome: "Gato" },
        { id: 11, img: "cao.png", nome: "Cão" },
        { id: 12, img: "cavalo.png", nome: "Cavalo" }
    ]
};
