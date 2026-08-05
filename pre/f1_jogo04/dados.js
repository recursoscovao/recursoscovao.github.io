// ==========================================
// 1. BIBLIOTECA DE TEMAS E CONTEÚDO
// ==========================================
const BIBLIOTECA_TEMAS = {
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": { "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Quem faz este som?", rodape: "&copy; Pequenos Curiosos" } }
};

// ==========================================
// 2. CONFIGURAÇÃO DO JOGO
// ==========================================
const JOGO_CONFIG = {
    nomeDoJogo: "Quem sou eu?",
    descricao: "Ouve o som e clica no animal correto!",
    areaAtiva: "pre",   
    anoAtivo: "pre",    
    caminhoIconsMenu: "../../icons/", 
    caminhoSons: "../../sons/", 
    caminhoSonsAnimais: "../../sons/sonsanimais/", // Caminho exato do seu GitHub

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

    relatorios: [
        { min: 9, max: 10, titulo: "És um mestre dos sons!", img: "taca_1.png" },
        { min: 7, max: 8, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 0, max: 6, titulo: "Continua a praticar!", img: "taca_4.png" }
    ]
};

// ==========================================
// 3. DADOS DO CONTEÚDO (LISTA COMPLETA)
// ==========================================
const DADOS_JOGO = {
    somInstrucoes: "sonspre/f1jogo03.mp3", 
    itens: [
        // DOMÉSTICOS (Conforme a sua pasta animaisdomesticos)
        { id: 1, img: "cao.png", som: "cao.mp3", nome: "Cão", pasta: "animaisdomesticos" },
        { id: 2, img: "gato.png", som: "gato.mp3", nome: "Gato", pasta: "animaisdomesticos" },
        { id: 3, img: "coelho.png", som: "coelho.mp3", nome: "Coelho", pasta: "animaisdomesticos" },
        { id: 4, img: "galinha.png", som: "galinha.mp3", nome: "Galinha", pasta: "animaisdomesticos" },
        { id: 5, img: "galo.png", som: "galo.mp3", nome: "Galo", pasta: "animaisdomesticos" },
        { id: 6, img: "pato.png", som: "pato.mp3", nome: "Pato", pasta: "animaisdomesticos" },
        { id: 7, img: "peru.png", som: "peru.mp3", nome: "Peru", pasta: "animaisdomesticos" },
        { id: 8, img: "porco.png", som: "porco.mp3", nome: "Porco", pasta: "animaisdomesticos" },
        { id: 9, img: "ovelha.png", som: "ovelha.mp3", nome: "Ovelha", pasta: "animaisdomesticos" },
        { id: 10, img: "burro.png", som: "burro.mp3", nome: "Burro", pasta: "animaisdomesticos" },
        { id: 11, img: "pombo.png", som: "pombo.mp3", nome: "Pombo", pasta: "animaisdomesticos" },
        { id: 12, img: "cabra.png", som: "cabra.mp3", nome: "Cabra", pasta: "animaisdomesticos" },

        // SELVAGENS (Conforme a sua pasta animaisselvagens)
        { id: 13, img: "abelha.png", som: "abelha.mp3", nome: "Abelha", pasta: "animaisselvagens" },
        { id: 14, img: "abutre.png", som: "abutre.mp3", nome: "Abutre", pasta: "animaisselvagens" },
        { id: 15, img: "aguia.png", som: "aguia.mp3", nome: "Águia", pasta: "animaisselvagens" },
        { id: 16, img: "aranha.png", som: "aranha.mp3", nome: "Aranha", pasta: "animaisselvagens" },
        { id: 17, img: "avestruz.png", som: "avestruz.mp3", nome: "Avestruz", pasta: "animaisselvagens" },
        { id: 18, img: "baleia.png", som: "baleia.mp3", nome: "Baleia", pasta: "animaisselvagens" },
        { id: 19, img: "borboleta.png", som: "borboleta.mp3", nome: "Borboleta", pasta: "animaisselvagens" },
        { id: 20, img: "canguru.png", som: "canguru.mp3", nome: "Canguru", pasta: "animaisselvagens" },
        { id: 21, img: "caracol.png", som: "caracol.mp3", nome: "Caracol", pasta: "animaisselvagens" },
        { id: 22, img: "caranguejo.png", som: "caranguejo.mp3", nome: "Caranguejo", pasta: "animaisselvagens" },
        { id: 23, img: "coala.png", som: "coala.mp3", nome: "Coala", pasta: "animaisselvagens" },
        { id: 24, img: "crocodilo.png", som: "crocodilo.mp3", nome: "Crocodilo", pasta: "animaisselvagens" },
        { id: 25, img: "elefante.png", som: "elefante.mp3", nome: "Elefante", pasta: "animaisselvagens" },
        { id: 26, img: "foca.png", som: "foca.mp3", nome: "Foca", pasta: "animaisselvagens" },
        { id: 27, img: "formiga.png", som: "formiga.mp3", nome: "Formiga", pasta: "animaisselvagens" },
        { id: 28, img: "girafa.png", som: "girafa.mp3", nome: "Girafa", pasta: "animaisselvagens" },
        { id: 29, img: "gorila.png", som: "gorila.mp3", nome: "Gorila", pasta: "animaisselvagens" },
        { id: 30, img: "hiena.png", som: "hiena.mp3", nome: "Hiena", pasta: "animaisselvagens" },
        { id: 31, img: "hipopotamo.png", som: "hipopotamo.mp3", nome: "Hipopótamo", pasta: "animaisselvagens" },
        { id: 32, img: "leao.png", som: "leao.mp3", nome: "Leão", pasta: "animaisselvagens" },
        { id: 33, img: "lobo.png", som: "lobo.mp3", nome: "Lobo", pasta: "animaisselvagens" },
        { id: 34, img: "morcego.png", som: "morcego.mp3", nome: "Morcego", pasta: "animaisselvagens" },
        { id: 35, img: "panda.png", som: "panda.mp3", nome: "Panda", pasta: "animaisselvagens" },
        { id: 36, img: "papagaio.png", som: "papagaio.mp3", nome: "Papagaio", pasta: "animaisselvagens" },
        { id: 37, img: "peixe.png", som: "peixe.mp3", nome: "Peixe", pasta: "animaisselvagens" },
        { id: 38, img: "polvo.png", som: "polvo.mp3", nome: "Polvo", pasta: "animaisselvagens" },
        { id: 39, img: "raia.png", som: "raia.mp3", nome: "Raia", pasta: "animaisselvagens" }
    ]
};
