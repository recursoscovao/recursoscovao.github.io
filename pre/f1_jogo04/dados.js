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
        "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", rodape: "&copy; Recursos Covão" } 
    }
};

// ==========================================
// 3. CONFIGURAÇÃO DO JOGO ATUAL
// ==========================================
const JOGO_CONFIG = {
    nomeDoJogo: "Quem sou eu?",
    descricao: "Ouve o som e descobre qual é o animal!",
    textoDestaque: "Quem sou eu?",
    fraseIntermedia: "Clica no animal que ouviste::",

    areaAtiva: "pre",   
    anoAtivo: "pre",    
    
    caminhoIconsMenu: "../../icons/", 
    caminhoIconsJogos: "../../icons/ic_jogos_pre/",
    caminhoSonsSistema: "../../sons/", 
    caminhoSonsAnimais: "../../sons/somanimais/", // Corrigido para a pasta exata da imagem

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
        objetivo: "Identificar o animal através do som que ele emite.",
        comoJogar: [
            "Clica no botão de áudio no topo para ouvir o som.",
            "Observa as 3 opções de animais em baixo.",
            "Escolhe o animal correto.",
            "Acerta em 10 animais para terminar o jogo."
        ],
        regras: [
            "Apenas uma resposta está correta.",
            "Podes ouvir o som as vezes que quiseres."
        ],
        dicas: "Escuta bem! Alguns animais têm sons parecidos.",
        desenvolvimento: ["Perceção Auditiva", "Conhecimento do Mundo", "Atenção"]
    },

    relatorios: [
        { min: 9, max: 10, titulo: "És um especialista!", img: "taca_1.png" },
        { min: 7, max: 8, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 5, max: 6, titulo: "Estás quase lá!", img: "taca_3.png" },
        { min: 0, max: 4, titulo: "Continua a tentar!", img: "taca_4.png" }
    ]
};

// ==========================================
// 4. DADOS DO CONTEÚDO DO JOGO
// ==========================================
const DADOS_JOGO = {
    caminhoDomesticos: "../../img/animaisdomesticos/",
    caminhoSelvagens: "../../img/animaisselvagens/",
    somInstrucoes: "sonspre/f1jogo04.mp3", // Atualizado conforme solicitado
    
    itens: [
        // DOMÉSTICOS (Mapeado rigorosamente com base nas tuas imagens)
        { id: 1,  img: "boi.png",       som: "vaca.mp3",      nome: "Boi",        pasta: "domesticos" },
        { id: 2,  img: "burro.png",     som: "burro.mp3",     nome: "Burro",      pasta: "domesticos" },
        { id: 3,  img: "cabra.png",     som: "cabra.mp3",     nome: "Cabra",      pasta: "domesticos" },
        { id: 4,  img: "cao.png",       som: "cao.mp3",       nome: "Cão",        pasta: "domesticos" },
        { id: 5,  img: "cao1.png",      som: "cao.mp3",       nome: "Cão",        pasta: "domesticos" },
        { id: 6,  img: "cavalo.png",    som: "burro.mp3",     nome: "Cavalo",     pasta: "domesticos" }, 
        { id: 7,  img: "coelho.png",    som: "coelho.mp3",    nome: "Coelho",     pasta: "domesticos" },
        { id: 8,  img: "galinha.png",   som: "galinha.mp3",   nome: "Galinha",    pasta: "domesticos" },
        { id: 9,  img: "galo.png",      som: "galo.mp3",      nome: "Galo",       pasta: "domesticos" },
        { id: 10, img: "gato.png",      som: "gato.mp3",      nome: "Gato",       pasta: "domesticos" },
        { id: 11, img: "gato1.png",     som: "gato.mp3",      nome: "Gato",       pasta: "domesticos" },
        { id: 12, img: "ovelha.png",    som: "ovelha.mp3",    nome: "Ovelha",     pasta: "domesticos" },
        { id: 13, img: "patinho.png",   som: "pato.mp3",      nome: "Patinho",    pasta: "domesticos" },
        { id: 14, img: "pato.png",      som: "pato.mp3",      nome: "Pato",       pasta: "domesticos" },
        { id: 15, img: "peru.png",      som: "peru.mp3",      nome: "Peru",       pasta: "domesticos" },
        { id: 16, img: "pintainho.png", som: "galinha.mp3",   nome: "Pintainho",  pasta: "domesticos" },
        { id: 17, img: "porco.png",     som: "porco.mp3",     nome: "Porco",      pasta: "domesticos" },
        { id: 18, img: "vaca.png",      som: "vaca.mp3",      nome: "Vaca",       pasta: "domesticos" },

        // SELVAGENS (Mapeado rigorosamente com base nas tuas imagens)
        { id: 19, img: "abelha.png",      som: "abelha.mp3",      nome: "Abelha",      pasta: "selvagens" },
        { id: 20, img: "abutre.png",      som: "abutre.mp3",      nome: "Abutre",      pasta: "selvagens" },
        { id: 21, img: "aguia.png",       som: "aguia.mp3",       nome: "Águia",       pasta: "selvagens" },
        { id: 22, img: "aranha.png",      som: "aranha.mp3",      nome: "Aranha",      pasta: "selvagens" },
        { id: 23, img: "avestruz.png",    som: "avestruz.mp3",    nome: "Avestruz",    pasta: "selvagens" },
        { id: 24, img: "baleia.png",      som: "baleia.mp3",      nome: "Baleia",      pasta: "selvagens" },
        { id: 25, img: "borboleta.png",   som: "borboleta.mp3",   nome: "Borboleta",   pasta: "selvagens" },
        { id: 26, img: "canguru.png",     som: "canguru.mp3",     nome: "Canguru",     pasta: "selvagens" },
        { id: 27, img: "caracol.png",     som: "caracol.mp3",     nome: "Caracol",     pasta: "selvagens" },
        { id: 28, img: "caranguejo.png",  som: "caranguejo.mp3",  nome: "Caranguejo",  pasta: "selvagens" },
        { id: 29, img: "coala.png",       som: "coala.mp3",       nome: "Coala",       pasta: "selvagens" },
        { id: 30, img: "crocodilo.png",   som: "crocodilo.mp3",   nome: "Crocodilo",   pasta: "selvagens" },
        { id: 31, img: "elefante.png",    som: "elefante.mp3",    nome: "Elefante",    pasta: "selvagens" },
        { id: 32, img: "foca.png",        som: "foca.mp3",        nome: "Foca",        pasta: "selvagens" },
        { id: 33, img: "formiga.png",     som: "formiga.mp3",     nome: "Formiga",     pasta: "selvagens" },
        { id: 34, img: "girafa.png",      som: "girafa.mp3",      nome: "Girafa",      pasta: "selvagens" },
        { id: 35, img: "gorila.png",      som: "gorila.mp3",      nome: "Gorila",      pasta: "selvagens" },
        { id: 36, img: "hiena.png",       som: "hiena.mp3",       nome: "Hiena",       pasta: "selvagens" },
        { id: 37, img: "hipopotamo.png",  som: "hipopotamo.mp3",  nome: "Hipopótamo",  pasta: "selvagens" },
        { id: 38, img: "leao.png",        som: "leao.mp3",        nome: "Leão",        pasta: "selvagens" },
        { id: 39, img: "lobo.png",        som: "lobo.mp3",        nome: "Lobo",        pasta: "selvagens" },
        { id: 40, img: "macaco.png",      som: "macaco.mp3",      nome: "Macaco",      pasta: "selvagens" },
        { id: 41, img: "morcego.png",     som: "morcego.mp3",     nome: "Morcego",     pasta: "selvagens" },
        { id: 42, img: "panda.png",       som: "panda.mp3",       nome: "Panda",       pasta: "selvagens" },
        { id: 43, img: "papagaio.png",    som: "papagaio.mp3",    nome: "Papagaio",    pasta: "selvagens" },
        { id: 44, img: "peixe.png",       som: "peixe.mp3",       nome: "Peixe",       pasta: "selvagens" },
        { id: 45, img: "polvo.png",       som: "polvo.mp3",       nome: "Polvo",       pasta: "selvagens" },
        { id: 46, img: "pombo.png",       som: "pombo.mp3",       nome: "Pombo",       pasta: "selvagens" },
        { id: 47, img: "raia.png",        som: "raia.mp3",        nome: "Raia",        pasta: "selvagens" },
        { id: 48, img: "raposa.png",      som: "raposa.mp3",      nome: "Raposa",      pasta: "selvagens" },
        { id: 49, img: "rato.png",        som: "rato.mp3",        nome: "Rato",        pasta: "selvagens" },
        { id: 50, img: "rinosseronte.png", som: "rinosseronte.mp3", nome: "Rinoceronte", pasta: "selvagens" },
        { id: 51, img: "tartaruga.png",   som: "tartaruga.mp3",   nome: "Tartaruga",   pasta: "selvagens" },
        { id: 52, img: "texugo.png",      som: "texugo.mp3",      nome: "Texugo",      pasta: "selvagens" },
        { id: 53, img: "tigre.png",       som: "tigre.mp3",       nome: "Tigre",       pasta: "selvagens" },
        { id: 54, img: "tubarao.png",     som: "tubarao.mp3",     nome: "Tubarão",     pasta: "selvagens" },
        { id: 55, img: "tucano.png",      som: "tucano.mp3",      nome: "Tucano",      pasta: "selvagens" },
        { id: 56, img: "urso.png",        som: "urso.mp3",        nome: "Urso",        pasta: "selvagens" },
        { id: 57, img: "zebra.png",       som: "zebra.mp3",       nome: "Zebra",       pasta: "selvagens" }
    ]
};
