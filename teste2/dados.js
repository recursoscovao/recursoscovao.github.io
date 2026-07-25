// ==========================================
// BIBLIOTECA GLOBAL (Temas e Textos)
// ==========================================

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png", corHamburger: "#5ba4e5" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png", corHamburger: "#45cfa8" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png", corHamburger: "#994D4D" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png", corHamburger: "#E691A7" },
    "jd": { corPagina: "#f0f2f5", corPrimaria: "#6c757d", corEscura: "#495057", corTexto: "#6c757d", voltarMobile: "voltar_cz.png", corHamburger: "#6c757d" }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": {
        "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", intro: "Brinca com os números, as cores e as formas!", rodape: "&copy; Pequenos Curiosos - Recursos Educativos" },
        "jd": { t1: "Jogos em", t2: "Destaque", sub: "Desafios | Pré-Escolar", intro: "Diverte-te com estes jogos especiais!", rodape: "&copy; Pequenos Curiosos - Recursos Educativos" }
    },
    "ano1": {
        "portugues": { t1: "Pequenos", t2: "Leitores", sub: "Português | 1º Ano", intro: "Explora as letras, as palavras e diverte-te a ler!", rodape: "&copy; Pequenos Leitores - Recursos Educativos" },
        "matematica": { t1: "Pequenos", t2: "Matemáticos", sub: "Matemática | 1º Ano", intro: "Explora os números e diverte-te a contar!", rodape: "&copy; Pequenos Matemáticos - Recursos Educativos" },
        "estudo": { t1: "Pequenos", t2: "Exploradores", sub: "Estudo do Meio | 1º Ano", intro: "Explora o mundo à tua volta, o teu corpo e a natureza!!", rodape: "&copy; Pequenos Exploradores - Recursos Educativos" },
        "jd": { t1: "Jogos em", t2: "Destaque", sub: "Desafios | 1º Ano", intro: "Diverte-te com estes jogos especiais!", rodape: "&copy; Pequenos Curiosos - Recursos Educativos" }
    },
    "ano2": {
        "portugues": { t1: "Jovens", t2: "Leitores", sub: "Português | 2º Ano", intro: "Explora as palavras, as frases e diverte-te a ler!", rodape: "&copy; Jovens Leitores - Recursos Educativos" },
        "matematica": { t1: "Jovens", t2: "Matemáticos", sub: "Matemática | 2º Ano", intro: "Explora as operações e diverte-te a calcular!", rodape: "&copy; Jovens Matemáticos - Recursos Educativos" },
        "estudo": { t1: "Jovens", t2: "Investigadores", sub: "Estudo do Meio | 2º Ano", intro: "Investiga o mundo, a natureza!!!", rodape: "&copy; Jovens Investigadores - Recursos Educativos" },
        "jd": { t1: "Jogos em", t2: "Destaque", sub: "Desafios | 2º Ano", intro: "Diverte-te com estes jogos especiais!", rodape: "&copy; Pequenos Curiosos - Recursos Educativos" }
    },
    "ano3": {
        "portugues": { t1: "Super", t2: "Leitores", sub: "Português | 3º Ano", intro: "Explora os textos e diverte-te a ler!", rodape: "&copy; Super Leitores - Recursos Educativos" },
        "matematica": { t1: "Super", t2: "Matemáticos", sub: "Matemática | 3º Ano", intro: "Explora as operações e diverte-te a calcular!", rodape: "&copy; Super Matemáticos - Recursos Educativos" },
        "estudo": { t1: "Super", t2: "Cientistas", sub: "Estudo do Meio | 3º Ano", intro: "Explora o passado, a natureza e o corpo humano!", rodape: "&copy; Super Cientistas - Recursos Educativos" },
        "jd": { t1: "Jogos em", t2: "Destaque", sub: "Desafios | 3º Ano", intro: "Diverte-te com estes jogos especiais!", rodape: "&copy; Pequenos Curiosos - Recursos Educativos" }
    },
    "ano4": {
        "portugues": { t1: "Mestres da", t2: "Leitura", sub: "Português | 4º Ano", intro: "Explora os livros e diverte-te a ler!", rodape: "&copy; Mestres da Leitura - Recursos Educativos" },
        "matematica": { t1: "Mestre dos", t2: "Números", sub: "Matemática | 4º Ano", intro: "Resolve os desafios e torna-te um Mestre!", rodape: "&copy; Mestre dos Números - Recursos Educativos" },
        "estudo": { t1: "Mestres", t2: "do Mundo", sub: "Estudo do Meio | 4º Ano", intro: "Explora a história, a geografia e os segredos do nosso país!", rodape: "&copy; Mestres do Mundo - Recursos Educativos" },
        "jd": { t1: "Jogos em", t2: "Destaque", sub: "Desafios | 4º Ano", intro: "Diverte-te com estes jogos especiais!", rodape: "&copy; Pequenos Curiosos - Recursos Educativos" }
    }
};

const JOGO_CONFIG = {
    areaAtiva: "jd", // Alterado para jd para testares
    anoAtivo: "jd",   // Alterado para jd para carregar o icondestaque.png
    caminhoIconsMenu: "../icons/", 
    caminhoIconsJogos: "iconjogos/",
    iconesMenu: {
        home: "home.png", pre: "iconpre.png", ano1: "icon1.png", 
        ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png", 
        jd: "icondestaque.png", voltar: "voltar.png"
    },
    links: {
        home: "/", 
        pre: "/pre",
        ano1: "/1",
        ano2: "/2",
        ano3: "/3",
        ano4: "/4"
    },
    listaFases: [
        {
            tituloFase: "JOGOS EM DESTAQUE",
            corEtiqueta: "#6c757d", 
            jogos: [
                { 
                    nome: "Estoura-Balão", 
                    desc: "Estoure desenhos correspondentes.", 
                    icon: "balao.png", 
                    link: "balao/", 
                    cor: "#495057" 
                }
            ]
        }
    ]
};
