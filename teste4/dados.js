// ==========================================
// BIBLIOTECA GLOBAL (Temas e Textos)
// ==========================================

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png", corHamburger: "#5ba4e5" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png", corHamburger: "#45cfa8" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png", corHamburger: "#994D4D" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png", corHamburger: "#E691A7" },
    "jd": { corPagina: "#f0f2f5", corPrimaria: "#6c757d", corEscura: "#495057", corTexto: "#6c757d", voltarMobile: "voltar_cin.png", corHamburger: "#6c757d" }
};

const BIBLIOTECA_CONTEUDO = {
    "jd": { "jd": { t1: "Jogos em", t2: "Destaque", sub: "Recursos Especiais", intro: "Descobre os nossos jogos!", rodape: "&copy; Pequenos Curiosos - Recursos Educativos" } },
    "pre": { "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", intro: "Brinca e aprende!", rodape: "&copy; Pequenos Curiosos - Recursos Educativos" } },
    "ano1": { 
        "portugues": { t1: "Pequenos", t2: "Leitores", sub: "Português | 1º Ano", intro: "Explora as letras!", rodape: "&copy; Pequenos Leitores" },
        "matematica": { t1: "Pequenos", t2: "Matemáticos", sub: "Matemática | 1º Ano", intro: "Explora os números!", rodape: "&copy; Pequenos Matemáticos" }
    },
    "ano2": { 
        "portugues": { t1: "Jovens", t2: "Leitores", sub: "Português | 2º Ano", intro: "Lê e diverte-te!", rodape: "&copy; Jovens Leitores" },
        "matematica": { t1: "Jovens", t2: "Matemáticos", sub: "Matemática | 2º Ano", intro: "Calcula e aprende!", rodape: "&copy; Jovens Matemáticos" }
    }
};

// ==========================================
// CONFIGURAÇÃO DO JOGO ATUAL
// ==========================================

const JOGO_CONFIG = {
    areaAtiva: "pre", 
    anoAtivo: "pre",        
    caminhoIconsMenu: "../icons/", 
    caminhoIconsJogos: "../icons/",
    iconesMenu: {
        home: "home.png", pre: "iconpre.png", jd: "icondestaque.png", 
        ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png"
    },
    links: {
        home: "../", pre: "../pre", jd: "../destaques", 
        ano1: "../1", ano2: "../2", ano3: "../3", ano4: "../4"
    },
    relatorios: [
        { min: 9, max: 10, titulo: "És um craque!", img: "taca_1.png" },
        { min: 7, max: 8, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 5, max: 6, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 4, titulo: "Continua a tentar!", img: "taca_4.png" }
    ],
    
    // MANTIDO: O index.html utiliza esta estrutura para o ecrã inicial.
    // NOTA: O campo 'desc' e o conteúdo visual do 'card-meio' são substituídos 
    // dinamicamente pela animação e manual detalhado definidos no ficheiro 'jogo.js'.
    listaFases: [
        {
            jogos: [
                { 
                    nome: "Encontrar o Par", 
                    desc: "A carregar instruções detalhadas do jogo...", 
                    icon: "par_animais.png" 
                }
            ]
        }
    ]
};

// ==========================================
// DADOS ESPECÍFICOS DO JOGO (CONTEÚDO)
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
