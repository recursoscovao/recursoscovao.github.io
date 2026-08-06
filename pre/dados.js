// ==========================================
// BIBLIOTECA GLOBAL (Temas e Textos)
// ==========================================

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png", corHamburger: "#5ba4e5" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png", corHamburger: "#45cfa8" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png", corHamburger: "#994D4D" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png", corHamburger: "#E691A7" }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": {
        "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", intro: "Brinca com os números, as cores e as formas!", rodape: "&copy; Pequenos Curiosos - Recursos Educativos" }
    },
    "ano1": {
        "portugues": { t1: "Pequenos", t2: "Leitores", sub: "Português | 1º Ano", intro: "Explora as letras, as palavras e diverte-te a ler!", rodape: "&copy; Pequenos Leitores - Recursos Educativos" },
        "matematica": { t1: "Pequenos", t2: "Matemáticos", sub: "Matemática | 1º Ano", intro: "Explora os números e diverte-te a contar!", rodape: "&copy; Pequenos Matemáticos - Recursos Educativos" },
        "estudo": { t1: "Pequenos", t2: "Exploradores", sub: "Estudo do Meio | 1º Ano", intro: "Explora o mundo à tua volta, o teu corpo e a natureza!!", rodape: "&copy; Pequenos Exploradores - Recursos Educativos" }
    },
    "ano2": {
        "portugues": { t1: "Jovens", t2: "Leitores", sub: "Português | 2º Ano", intro: "Explora as palavras, as frases e diverte-te a ler!", rodape: "&copy; Jovens Leitores - Recursos Educativos" },
        "matematica": { t1: "Jovens", t2: "Matemáticos", sub: "Matemática | 2º Ano", intro: "Explora as operações e diverte-te a calcular!", rodape: "&copy; Jovens Matemáticos - Recursos Educativos" },
        "estudo": { t1: "Jovens", t2: "Investigadores", sub: "Estudo do Meio | 2º Ano", intro: "Investiga o mundo, a natureza!!!", rodape: "&copy; Jovens Investigadores - Recursos Educativos" }
    },
    "ano3": {
        "portugues": { t1: "Super", t2: "Leitores", sub: "Português | 3º Ano", intro: "Explora os textos e diverte-te a ler!", rodape: "&copy; Super Leitores - Recursos Educativos" },
        "matematica": { t1: "Super", t2: "Matemáticos", sub: "Matemática | 3º Ano", intro: "Explora as operações e diverte-te a calcular!", rodape: "&copy; Super Matemáticos - Recursos Educativos" },
        "estudo": { t1: "Super", t2: "Cientistas", sub: "Estudo do Meio | 3º Ano", intro: "Explora o passado, a natureza e o corpo humano!", rodape: "&copy; Super Cientistas - Recursos Educativos" }
    },
    "ano4": {
        "portugues": { t1: "Mestres da", t2: "Leitura", sub: "Português | 4º Ano", intro: "Explora os livros e diverte-te a ler!", rodape: "&copy; Mestres da Leitura - Recursos Educativos" },
        "matematica": { t1: "Mestre dos", t2: "Números", sub: "Matemática | 4º Ano", intro: "Resolve os desafios e torna-te um Mestre!", rodape: "&copy; Mestre dos Números - Recursos Educativos" },
        "estudo": { t1: "Mestres", t2: "do Mundo", sub: "Estudo do Meio | 4º Ano", intro: "Explora a história, a geografia e os segredos do nosso país!", rodape: "&copy; Mestres do Mundo - Recursos Educativos" }
    }
};

const JOGO_CONFIG = {
    areaAtiva: "pre", 
    anoAtivo: "pre",      
    caminhoIconsMenu: "../icons/", 
    caminhoIconsJogos: "../icons/ic_jogos_pre/",
    iconesMenu: {
        home: "home.png", pre: "iconpre.png", ano1: "icon1.png", 
        ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png", voltar: "voltar.png"
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
            tituloFase: "CLICAR E IDENTIFICAR",
            corEtiqueta: "#E91E63", 
            jogos: [
                { nome: "Encontra o Animal", desc: "Encontra o animal Doméstico.", icon: "f1_jogo01.png", link: "f1_jogo01/", cor: "#C2185B" },
                { nome: "Encontra o Animal", desc: "Encontra o animal Selvagem", icon: "f1_jogo02.png", link: "f1_jogo02/", cor: "#D32F2F" },
                { nome: "Sombras Mágicas", desc: "Qual é a sombra correta.", icon: "f1_jogo03.png", link: "f1_jogo03/", cor: "#E64A19" },
                { nome: "Quem Sou eu", desc: "Ouve e clica no animal certo.", icon: "f1_jogo04.png", link: "f1_jogo04/", cor: "#C2185B" },
                { nome: "Liga as Sombras", desc: "Liga as frutas à sua sombra.", icon: "f1_jogo05.png", link: "f1_jogo05/", cor: "#D32F2F" },
                { nome: "Letra Inicial", desc: "Qual é a primeira letra desse desenho?", icon: "lapis.png", link: "letra-in/", cor: "#D32F2F" },
                { nome: "Toupeira das Letras", desc: "Bata nas toupeiras corretas.", icon: "rato.png", link: "toupeira/", cor: "#E64A19" }
            ]
        },
        {
            tituloFase: "SONS, LETRAS E FORMAS BÁSICAS",
            corEtiqueta: "#FF9800",
            jogos: [
                { nome: "A minha Sombra", desc: "Arrasta as imagens para a sua sombra.", icon: "f2_jogo01.png", link: "f2_jogo01/", cor: "#C2185B" },
                { nome: "Letra Inicial", desc: "Qual é a primeira letra desse desenho?", icon: "lapis.png", link: "letra-in/", cor: "#D32F2F" },
                { nome: "Toupeira das Letras", desc: "Bata nas toupeiras corretas.", icon: "rato.png", link: "toupeira/", cor: "#E64A19" },
                { nome: "Estoura-Balão", desc: "Estoure desenhos correspondentes.", icon: "balao.png", link: "balao/", cor: "#C2185B" },
                { nome: "Letra Inicial", desc: "Qual é a primeira letra desse desenho?", icon: "lapis.png", link: "letra-in/", cor: "#D32F2F" },
                { nome: "Toupeira das Letras", desc: "Bata nas toupeiras corretas.", icon: "rato.png", link: "toupeira/", cor: "#E64A19" }
            ]
        },
        {
            tituloFase: "NÚMEROS E QUANTIDADES",
            corEtiqueta: "#3F51B5",
            jogos: [
                { nome: "Contar Objetos", desc: "Quantos elementos vês no ecrã?", icon: "f3_jogo01.png", link: "f3_jogo01/", cor: "#303F9F" },
                { nome: "Maior ou Menor", desc: "Onde estão mais elementos?", icon: "f3_jogo02.png", link: "f3_jogo02/", cor: "#3949AB" },
                { nome: "Puzzle Numérico", desc: "Ordena os números do 1 ao 10.", icon: "f3_jogo03.png", link: "f3_jogo03/", cor: "#5C6BC0" },
                { nome: "Dominó das Cores", desc: "Associa o número à cor correta.", icon: "f3_jogo04.png", link: "f3_jogo04/", cor: "#303F9F" },
                { nome: "Sequência Lógica", desc: "O que vem a seguir na fila?", icon: "f3_jogo05.png", link: "f3_jogo05/", cor: "#3949AB" }
            ]
        },
        {
            tituloFase: "DESCOBRIR O MUNDO",
            corEtiqueta: "#4CAF50",
            jogos: [
                { nome: "O Meu Corpo", desc: "Identifica as partes do corpo humano.", icon: "f4_jogo01.png", link: "f4_jogo01/", cor: "#388E3C" },
                { nome: "Reciclagem", desc: "Coloca o lixo no ecoponto certo.", icon: "f4_jogo02.png", link: "f4_jogo02/", cor: "#2E7D32" },
                { nome: "As Estações", desc: "Veste o boneco conforme o tempo.", icon: "f4_jogo03.png", link: "f4_jogo03/", cor: "#1B5E20" },
                { nome: "Habitats Animais", desc: "Onde vive cada animal?", icon: "f4_jogo04.png", link: "f4_jogo04/", cor: "#388E3C" },
                { nome: "Cuidar das Plantas", desc: "O que precisam as flores para crescer?", icon: "f4_jogo05.png", link: "f4_jogo05/", cor: "#2E7D32" }
            ]
        }
    ]
};
