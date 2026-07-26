// ==========================================
// BIBLIOTECA GLOBAL (Temas e Textos)
// ==========================================
// Estas bibliotecas controlam o aspeto visual e textos do Header/Footer
const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png", corHamburger: "#5ba4e5" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png", corHamburger: "#45cfa8" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png", corHamburger: "#994D4D" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png", corHamburger: "#E691A7" },
    "jd": { corPagina: "#f0f2f5", corPrimaria: "#6c757d", corEscura: "#495057", corTexto: "#6c757d", voltarMobile: "voltar_cin.png", corHamburger: "#6c757d" }
};

const BIBLIOTECA_CONTEUDO = {
    "jd": { "jd": { t1: "Jogos em", t2: "Destaque", sub: "Recursos Especiais", intro: "Descobre os nossos jogos!", rodape: "&copy; Recursos Educativos" } },
    "pre": { "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", intro: "Brinca e aprende!", rodape: "&copy; Recursos Educativos" } },
    "ano1": { "portugues": { t1: "Pequenos", t2: "Leitores", sub: "Português | 1º Ano", intro: "Aprende a ler!", rodape: "&copy; Recursos Educativos" }, "matematica": { t1: "Pequenos", t2: "Matemáticos", sub: "Matemática | 1º Ano", intro: "Aprende a contar!", rodape: "&copy; Recursos Educativos" } },
    "ano2": { "portugues": { t1: "Jovens", t2: "Leitores", sub: "Português | 2º Ano", intro: "Lê e interpreta!", rodape: "&copy; Recursos Educativos" }, "matematica": { t1: "Jovens", t2: "Matemáticos", sub: "Matemática | 2º Ano", intro: "Calcula com alegria!", rodape: "&copy; Recursos Educativos" } },
    "ano3": { "portugues": { t1: "Super", t2: "Leitores", sub: "Português | 3º Ano", intro: "Domina a gramática!", rodape: "&copy; Recursos Educativos" }, "matematica": { t1: "Super", t2: "Matemáticos", sub: "Matemática | 3º Ano", intro: "Multiplica o saber!", rodape: "&copy; Recursos Educativos" } },
    "ano4": { "portugues": { t1: "Mestres da", t2: "Leitura", sub: "Português | 4º Ano", intro: "Leitura avançada!", rodape: "&copy; Recursos Educativos" }, "matematica": { t1: "Mestre dos", t2: "Números", sub: "Matemática | 4º Ano", intro: "Desafios matemáticos!", rodape: "&copy; Recursos Educativos" } }
};

// ==========================================
// CONFIGURAÇÃO DO JOGO ATUAL
// ==========================================
const JOGO_CONFIG = {
    areaAtiva: "jd",        // Define a cor do tema (portugues, matematica, estudo, pre, jd)
    anoAtivo: "jd",         // Define os textos do cabeçalho
    caminhoIconsMenu: "../icons/", 
    caminhoIconsJogos: "../icons/",
    iconesMenu: { home: "home.png", pre: "iconpre.png", jd: "icondestaque.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    links: { home: "../", pre: "../pre", jd: "../destaques", ano1: "../1", ano2: "../2", ano3: "../3", ano4: "../4" },
    
    // Resultados finais (Pontuação de 0 a 10)
    relatorios: [
        { min: 9, max: 10, titulo: "És um craque!", img: "taca_1.png" },
        { min: 7, max: 8, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 5, max: 6, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 4, titulo: "Continua a tentar!", img: "taca_4.png" }
    ],

    // MANTIDO: O index.html precisa desta estrutura para carregar o ecrã inicial
    listaFases: [
        {
            jogos: [
                { 
                    nome: "Encontrar o Par", 
                    desc: "Observa a imagem em destaque e encontra o par correspondente na grelha abaixo. Consegues acertar em todos?", 
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
    // IDs devem ser únicos para a lógica de validação funcionar corretamente
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
