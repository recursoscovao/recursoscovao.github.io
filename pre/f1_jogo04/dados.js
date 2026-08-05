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
    nomeDoJogo: "Quem sou eu",
    descricao: "Ouve o som e descobre qual é o animal!",
    textoDestaque: "Quem sou eu?",
    fraseIntermedia: "Clica no animal correto:",

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
        objetivo: "Identificar o animal através do som.",
        comoJogar: ["Clica no botão de áudio.", "Escolhe o animal correto."],
        regras: ["Uma resposta correta.", "Podes ouvir várias vezes."],
        dicas: "Escuta com atenção!",
        desenvolvimento: ["Perceção Auditiva", "Atenção"]
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
    caminhoSonsAnimais: "../../sons/sonsanimais/", // Corrigido para plural conforme imagem
    somInstrucoes: "sonspre/f1_jogo04.mp3", 
    
    itens: [
        { id: 1,  img: "boi.png", som: "vaca.mp3", pasta: "domesticos" },
        { id: 2,  img: "burro.png", som: "burro.mp3", pasta: "domesticos" },
        { id: 3,  img: "cabra.png", som: "cabra.mp3", pasta: "domesticos" },
        { id: 4,  img: "cao.png", som: "cao.mp3", pasta: "domesticos" },
        { id: 5,  img: "cao1.png", som: "cao.mp3", pasta: "domesticos" },
        { id: 6,  img: "cavalo.png", som: "burro.mp3", pasta: "domesticos" }, 
        { id: 7,  img: "coelho.png", som: "coelho.mp3", pasta: "domesticos" },
        { id: 8,  img: "galinha.png", som: "galinha.mp3", pasta: "domesticos" },
        { id: 9,  img: "galo.png", som: "galo.mp3", pasta: "domesticos" },
        { id: 10, img: "gato.png", som: "gato.mp3", pasta: "domesticos" },
        { id: 11, img: "gato1.png", som: "gato.mp3", pasta: "domesticos" },
        { id: 12, img: "ovelha.png", som: "ovelha.mp3", pasta: "domesticos" },
        { id: 13, img: "patinho.png", som: "pato.mp3", pasta: "domesticos" },
        { id: 14, img: "pato.png", som: "pato.mp3", pasta: "domesticos" },
        { id: 15, img: "peru.png", som: "peru.mp3", pasta: "domesticos" },
        { id: 16, img: "pintainho.png", som: "galinha.mp3", pasta: "domesticos" },
        { id: 17, img: "porco.png", som: "porco.mp3", pasta: "domesticos" },
        { id: 18, img: "vaca.png", som: "vaca.mp3", pasta: "domesticos" },
        { id: 19, img: "abelha.png", som: "abelha.mp3", pasta: "selvagens" },
        { id: 20, img: "abutre.png", som: "abutre.mp3", pasta: "selvagens" },
        { id: 21, img: "aguia.png", som: "aguia.mp3", pasta: "selvagens" },
        { id: 22, img: "aranha.png", som: "aranha.mp3", pasta: "selvagens" },
        { id: 23, img: "avestruz.png", som: "avestruz.mp3", pasta: "selvagens" },
        { id: 24, img: "baleia.png", som: "baleia.mp3", pasta: "selvagens" },
        { id: 25, img: "borboleta.png", som: "borboleta.mp3", pasta: "selvagens" },
        { id: 26, img: "canguru.png", som: "canguru.mp3", pasta: "selvagens" },
        { id: 27, img: "caracol.png", som: "caracol.mp3", pasta: "selvagens" },
        { id: 28, img: "caranguejo.png", som: "caranguejo.mp3", pasta: "selvagens" },
        { id: 29, img: "coala.png", som: "coala.mp3", pasta: "selvagens" },
        { id: 30, img: "crocodilo.png", som: "crocodilo.mp3", pasta: "selvagens" },
        { id: 31, img: "elefante.png", som: "elefante.mp3", pasta: "selvagens" },
        { id: 32, img: "foca.png", som: "foca.mp3", pasta: "selvagens" },
        { id: 33, img: "formiga.png", som: "formiga.mp3", pasta: "selvagens" },
        { id: 34, img: "girafa.png", som: "girafa.mp3", pasta: "selvagens" },
        { id: 35, img: "gorila.png", som: "gorila.mp3", pasta: "selvagens" },
        { id: 36, img: "hiena.png", som: "hiena.mp3", pasta: "selvagens" },
        { id: 37, img: "hipopotamo.png", som: "hipopotamo.mp3", pasta: "selvagens" },
        { id: 38, img: "leao.png", som: "leao.mp3", pasta: "selvagens" },
        { id: 39, img: "lobo.png", som: "lobo.mp3", pasta: "selvagens" },
        { id: 40, img: "macaco.png", som: "macaco.mp3", pasta: "selvagens" },
        { id: 41, img: "morcego.png", som: "morcego.mp3", pasta: "selvagens" },
        { id: 42, img: "panda.png", som: "panda.mp3", pasta: "selvagens" },
        { id: 43, img: "papagaio.png", som: "papagaio.mp3", pasta: "selvagens" },
        { id: 44, img: "peixe.png", som: "peixe.mp3", pasta: "selvagens" },
        { id: 45, img: "polvo.png", som: "polvo.mp3", pasta: "selvagens" },
        { id: 46, img: "pombo.png", som: "pombo.mp3", pasta: "selvagens" },
        { id: 47, img: "raia.png", som: "raia.mp3", pasta: "selvagens" },
        { id: 48, img: "raposa.png", som: "raposa.mp3", pasta: "selvagens" },
        { id: 49, img: "rato.png", som: "rato.mp3", pasta: "selvagens" },
        { id: 50, img: "rinosseronte.png", som: "rinosseronte.mp3", pasta: "selvagens" },
        { id: 51, img: "tartaruga.png", som: "tartaruga.mp3", pasta: "selvagens" },
        { id: 52, img: "texugo.png", som: "texugo.mp3", pasta: "selvagens" },
        { id: 53, img: "tigre.png", som: "tigre.mp3", pasta: "selvagens" },
        { id: 54, img: "tubarao.png", som: "tubarao.mp3", pasta: "selvagens" },
        { id: 55, img: "tucano.png", som: "tucano.mp3", pasta: "selvagens" },
        { id: 56, img: "urso.png", som: "urso.mp3", pasta: "selvagens" },
        { id: 57, img: "zebra.png", som: "zebra.mp3", pasta: "selvagens" }
    ]
};
