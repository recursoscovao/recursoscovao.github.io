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
    "pre": { 
        "pre": { 
            t1: "Quem", 
            t2: "Sou Eu?", 
            sub: "Atividades | Pré-Escolar", 
            rodape: "&copy; Pequenos Curiosos" 
        } 
    }
};

// ==========================================
// 3. CONFIGURAÇÃO DO JOGO
// ==========================================
const JOGO_CONFIG = {
    nomeDoJogo: "Quem Sou Eu?",
    descricao: "Ouve com atenção o nome do animal e escolhe a imagem correta!",
    
    areaAtiva: "pre",   
    anoAtivo: "pre",    
    
    caminhoIconsMenu: "../../icons/", 
    caminhoSons: "../../sons/somanimais/", // Pasta dos nomes dos animais
    caminhoSonsSistema: "../../sons/",      // Pasta para acerto.mp3, erro.mp3, etc

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
        objetivo: "Identificar animais através da audição do seu nome.",
        comoJogar: [
            "Clica no botão 'Jogar' para começar.",
            "Ouve o nome do animal que vai soar automaticamente.",
            "Se precisares de ouvir outra vez, clica no ícone do som no topo.",
            "Clica na imagem do animal correspondente ao que ouviste.",
            "Completa as 10 rondas para veres o teu resultado."
        ],
        regras: [
            "Tenta acertar à primeira para melhor pontuação.",
            "Podes ouvir o som as vezes que quiseres.",
            "Não há tempo limite."
        ],
        dicas: "Concentra-te bem no som. Se tiveres dúvidas, clica no altifalante para repetir o nome.",
        desenvolvimento: [
            "Discriminação auditiva",
            "Vocabulário de animais",
            "Associação som-imagem"
        ]
    },

    relatorios: [
        { min: 9, max: 10, titulo: "És um Especialista!", img: "taca_1.png" },
        { min: 7, max: 8, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 5, max: 6, titulo: "Estás quase lá!", img: "taca_3.png" },
        { min: 0, max: 4, titulo: "Continua a praticar!", img: "taca_4.png" }
    ]
};

// ==========================================
// 4. DADOS DO CONTEÚDO (TODOS OS ANIMAIS)
// ==========================================
const DADOS_JOGO = {
    somInstrucoes: "sonspre/instrucoes_quemsoueu.mp3", // Som da capa
    // Nota: A propriedade 'pasta' ajuda o script a saber em que diretório procurar a imagem
    itens: [
        // --- ANIMAIS DOMÉSTICOS ---
        { id: 1, img: "boi.png", som: "boi.mp3", pasta: "animaisdomesticos" },
        { id: 2, img: "burro.png", som: "burro.mp3", pasta: "animaisdomesticos" },
        { id: 3, img: "cabra.png", som: "cabra.mp3", pasta: "animaisdomesticos" },
        { id: 4, img: "cao.png", som: "cao.mp3", pasta: "animaisdomesticos" },
        { id: 5, img: "cavalo.png", som: "cavalo.mp3", pasta: "animaisdomesticos" },
        { id: 6, img: "coelho.png", som: "coelho.mp3", pasta: "animaisdomesticos" },
        { id: 7, img: "galinha.png", som: "galinha.mp3", pasta: "animaisdomesticos" },
        { id: 8, img: "galo.png", som: "galo.mp3", pasta: "animaisdomesticos" },
        { id: 9, img: "gato.png", som: "gato.mp3", pasta: "animaisdomesticos" },
        { id: 10, img: "ovelha.png", som: "ovelha.mp3", pasta: "animaisdomesticos" },
        { id: 11, img: "patinho.png", som: "pato.mp3", pasta: "animaisdomesticos" },
        { id: 12, img: "pato.png", som: "pato.mp3", pasta: "animaisdomesticos" },
        { id: 13, img: "peru.png", som: "peru.mp3", pasta: "animaisdomesticos" },
        { id: 14, img: "pintainho.png", som: "galo.mp3", pasta: "animaisdomesticos" },
        { id: 15, img: "porco.png", som: "porco.mp3", pasta: "animaisdomesticos" },
        { id: 16, img: "vaca.png", som: "vaca.mp3", pasta: "animaisdomesticos" },

        // --- ANIMAIS SELVAGENS ---
        { id: 17, img: "abelha.png", som: "abelha.mp3", pasta: "animaisselvagens" },
        { id: 18, img: "abutre.png", som: "abutre.mp3", pasta: "animaisselvagens" },
        { id: 19, img: "aguia.png", som: "aguia.mp3", pasta: "animaisselvagens" },
        { id: 20, img: "aranha.png", som: "aranha.mp3", pasta: "animaisselvagens" },
        { id: 21, img: "avestruz.png", som: "avestruz.mp3", pasta: "animaisselvagens" },
        { id: 22, img: "baleia.png", som: "baleia.mp3", pasta: "animaisselvagens" },
        { id: 23, img: "borboleta.png", som: "borboleta.mp3", pasta: "animaisselvagens" },
        { id: 24, img: "canguru.png", som: "canguru.mp3", pasta: "animaisselvagens" },
        { id: 25, img: "caracol.png", som: "caracol.mp3", pasta: "animaisselvagens" },
        { id: 26, img: "caranguejo.png", som: "caranguejo.mp3", pasta: "animaisselvagens" },
        { id: 27, img: "coala.png", som: "coala.mp3", pasta: "animaisselvagens" },
        { id: 28, img: "crocodilo.png", som: "crocodilo.mp3", pasta: "animaisselvagens" },
        { id: 29, img: "elefante.png", som: "elefante.mp3", pasta: "animaisselvagens" },
        { id: 30, img: "foca.png", som: "foca.mp3", pasta: "animaisselvagens" },
        { id: 31, img: "formiga.png", som: "formiga.mp3", pasta: "animaisselvagens" },
        { id: 32, img: "girafa.png", som: "girafa.mp3", pasta: "animaisselvagens" },
        { id: 33, img: "gorila.png", som: "gorila.mp3", pasta: "animaisselvagens" },
        { id: 34, img: "hiena.png", som: "hiena.mp3", pasta: "animaisselvagens" },
        { id: 35, img: "hipopotamo.png", som: "hipopotamo.mp3", pasta: "animaisselvagens" },
        { id: 36, img: "leao.png", som: "leao.mp3", pasta: "animaisselvagens" },
        { id: 37, img: "lobo.png", som: "lobo.mp3", pasta: "animaisselvagens" },
        { id: 38, img: "macaco.png", som: "macaco.mp3", pasta: "animaisselvagens" },
        { id: 39, img: "morcego.png", som: "morcego.mp3", pasta: "animaisselvagens" },
        { id: 40, img: "panda.png", som: "panda.mp3", pasta: "animaisselvagens" },
        { id: 41, img: "papagaio.png", som: "papagaio.mp3", pasta: "animaisselvagens" },
        { id: 42, img: "peixe.png", som: "peixe.mp3", pasta: "animaisselvagens" },
        { id: 43, img: "polvo.png", som: "polvo.mp3", pasta: "animaisselvagens" },
        { id: 44, img: "pombo.png", som: "pombo.mp3", pasta: "animaisselvagens" },
        { id: 45, img: "raia.png", som: "raia.mp3", pasta: "animaisselvagens" },
        { id: 46, img: "raposa.png", som: "raposa.mp3", pasta: "animaisselvagens" },
        { id: 47, img: "rinosseronte.png", som: "rinosseronte.mp3", pasta: "animaisselvagens" },
        { id: 48, img: "tartaruga.png", som: "tartaruga.mp3", pasta: "animaisselvagens" },
        { id: 49, img: "texugo.png", som: "texugo.mp3", pasta: "animaisselvagens" },
        { id: 50, img: "tigre.png", som: "tigre.mp3", pasta: "animaisselvagens" },
        { id: 51, img: "tubarao.png", som: "tubarao.mp3", pasta: "animaisselvagens" },
        { id: 52, img: "tucano.png", som: "tucano.mp3", pasta: "animaisselvagens" },
        { id: 53, img: "urso.png", som: "urso.mp3", pasta: "animaisselvagens" },
        { id: 54, img: "zebra.png", som: "zebra.mp3", pasta: "animaisselvagens" }
    ]
};
