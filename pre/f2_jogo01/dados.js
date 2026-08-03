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
    nomeDoJogo: "A minha Sombra",
    descricao: "Arrasta as imagens para a sua sombra sombra!",
    
    areaAtiva: "pre",   
    anoAtivo: "pre",    
    
    caminhoIconsMenu: "../../icons/", 
    caminhoIconsJogos: "../../icons/ic_jogos_pre",
    caminhoSons: "../../sons/", // Nova pasta para os sons

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
        objetivo: "Observa atentamente o animal apresentado no topo do ecrã e encontra a imagem igual entre as várias opções. Clica ou toca no animal correto para avançares para a ronda seguinte.",
        comoJogar: [
            "Observa o animal que aparece no topo do ecrã.",
            "Analisa todas as imagens apresentadas.",
            "Encontra a imagem exatamente igual ao modelo.",
            "Clica ou toca no animal correto.",
            "Se acertares, passas para a próxima ronda.",
            "Se errares, o jogo mostra a resposta certa antes de avançar.",
            "Completa as 10 rondas para ver os resultados."
        ],
        regras: [
            "Existe apenas uma resposta correta em cada ronda.",
            "Observa com atenção antes de responder.",
            "Não há limite de tempo."
        ],
        dicas: "Observa cuidadosamente a forma do animal, as cores e os detalhes (orelhas, patas, asas, cauda, etc.). Alguns animais podem ser muito parecidos.",
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
    caminhoImagens: "../../img/objetos/",
    somInstrucoes: "sonspre/f2_jogo01.mp3", // Alterado para buscar f1jogo02.mp3
    itens: [
          { id: 1, img: "afia.png", nome: "Afia" },
        { id: 2, img: "anel.png", nome: "Anel" },
        { id: 3, img: "balde.png", nome: "Balde" },
        { id: 4, img: "bola.png", nome: "Bola" },
        { id: 5, img: "bola1.png", nome: "Bola de Praia" },
        { id: 6, img: "boneca.png", nome: "Boneca" },
        { id: 7, img: "borracha.png", nome: "Borracha" },
        { id: 8, img: "caneta.png", nome: "Caneta" },
        { id: 9, img: "capa.png", nome: "Capa" },
        { id: 10, img: "cesto.png", nome: "Cesto" },
        { id: 11, img: "cola.png", nome: "Cola" },
        { id: 12, img: "colher.png", nome: "Colher" },
        { id: 13, img: "copo.png", nome: "Copo" },
        { id: 14, img: "dedal.png", nome: "Dedal" },
        { id: 15, img: "escova.png", nome: "Escova" },
        { id: 16, img: "esquadro.png", nome: "Esquadro" },
        { id: 17, img: "estojo.png", nome: "Estojo" },
        { id: 18, img: "folha.png", nome: "Folha" },
        { id: 19, img: "garfo.png", nome: "Garfo" },
        { id: 20, img: "garrafa.png", nome: "Garrafa" },
        { id: 21, img: "isqueiro.png", nome: "Isqueiro" },
        { id: 22, img: "lapis.png", nome: "Lápis" },
        { id: 23, img: "livro.png", nome: "Livro" },
        { id: 24, img: "mochila.png", nome: "Mochila" },
        { id: 25, img: "oculos.png", nome: "Óculos" },
        { id: 26, img: "pa.png", nome: "Pá" },
        { id: 27, img: "panela.png", nome: "Panela" },
        { id: 28, img: "pincel.png", nome: "Pincel" },
        { id: 29, img: "regua.png", nome: "Régua" },
        { id: 30, img: "tesoura.png", nome: "Tesoura" },
        { id: 31, img: "vassoura.png", nome: "Vassoura" },
        { id: 32, img: "vela.png", nome: "Vela" }
    ]
};
