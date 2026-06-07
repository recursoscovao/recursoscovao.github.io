// CONFIGURAÇÕES DE VISUAIS, CORES E ASSETS POR ÁREA TEMÁTICA
const BIBLIOTECA_TEMAS = {
    "portugues": { 
        corPagina: "#e9f0f8", 
        corPrimaria: "#5ba4e5", 
        corEscura: "#3d7db8", 
        corTexto: "#5d7082", 
        voltarMobile: "voltar_az.png",
        iconesAnos: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" }
    },
    "matematica": { 
        corPagina: "#e8f9f4", 
        corPrimaria: "#45cfa8", 
        corEscura: "#2ba886", 
        corTexto: "#45cfa8", 
        voltarMobile: "voltar_vr.png",
        iconesAnos: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" }
    },
    "estudo": { 
        corPagina: "#eae2e5", 
        corPrimaria: "#994d4d", 
        corEscura: "#6c3737", 
        corTexto: "#994d4d", 
        voltarMobile: "voltar_cs.png",
        iconesAnos: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" }
    },
    "pre": { 
        corPagina: "#fff5f7", 
        corPrimaria: "#e691a7", 
        corEscura: "#d54267", 
        corTexto: "#e691a7", 
        voltarMobile: "voltar_rs.png",
        iconesAnos: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" }
    }
};

// TEXTOS ADAPTADOS EXATAMENTE ÀS TUAS INDICAÇÕES DE IDENTIDADE
const BIBLIOTECA_CONTEUDO = {
    "pre": {
        "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", intro: "Brinca com os números, as cores e as formas!", rodape: "&copy; Pequenos Curiosos - Recursos Educativos" }
    },
    "ano1": {
        "portugues": { t1: "Pequenos", t2: "Leitores", sub: "Português | 1º Ano", intro: "Explora as letras, as palavras e diverte-te a ler!", rodape: "&copy; Pequenos Leitores - Recursos Educativos" },
        "matematica": { t1: "Pequenos", t2: "Matemáticos", sub: "Matemática | 1º Ano", intro: "Explora os números e diverte-te a contar!", rodape: "&copy; Pequenos Matemáticos - Recursos Educativos" },
        "estudo": { t1: "Pequenos", t2: "Exploradores", sub: "Estudo do Meio | 1º Ano", intro: "Explora o mundo à tua volta, o teu corpo e a natureza!", rodape: "&copy; Pequenos Exploradores - Recursos Educativos" }
    },
    "ano2": {
        "portugues": { t1: "Jovens", t2: "Leitores", sub: "Português | 2º Ano", intro: "Explora as palavras, as frases e diverte-te a ler!", rodape: "&copy; Jovens Leitores - Recursos Educativos" },
        "matematica": { t1: "Jovens", t2: "Matemáticos", sub: "Matemática | 2º Ano", intro: "Explora as operações e diverte-te a calcular!", rodape: "&copy; Jovens Matemáticos - Recursos Educativos" },
        "estudo": { t1: "Jovens", t2: "Investigadores", sub: "Estudo do Meio | 2º Ano", intro: "Investiga o mundo e a natureza!", rodape: "&copy; Jovens Investigadores - Recursos Educativos" }
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

// LISTAGEM INDIVIDUAL DE JOGOS DIRECIONADOS PARA AS SUBPASTAS FÍSICAS (Ex: 1/pt/, 1/em/)
const JOGOS_POR_ANO = {
    "pre": {
        "pre": [
            { nome: "Jogo das Cores", icon: "jogos/pre/cores.png", link: "pre/cores/" },
            { nome: "Quebra-Cabeças", icon: "jogos/pre/puzzle.png", link: "pre/puzzle/" }
        ]
    },
    "ano1": {
        "portugues": [
            { nome: "Sopa de Letras", icon: "jogos/ano1/sopa_letras.png", link: "1/pt/sopa/" },
            { nome: "Formar Palavras", icon: "jogos/ano1/letras.png", link: "1/pt/formar/" }
        ],
        "matematica": [
            { nome: "Conta os Animais", icon: "jogos/ano1/contar.png", link: "1/mat/contar/" },
            { nome: "Somar e Subtrair", icon: "jogos/ano1/calculo.png", link: "1/mat/calculo/" }
        ],
        "estudo": [
            { nome: "O Corpo Humano", icon: "jogos/ano1/corpo.png", link: "1/em/corpo/" },
            { nome: "Os Sentidos", icon: "jogos/ano1/sentidos.png", link: "1/em/sentidos/" }
        ]
    },
    "ano2": {
        "portugues": [
            { nome: "Construção de Frases", icon: "jogos/ano2/frases.png", link: "2/pt/frases/" }
        ],
        "matematica": [
            { nome: "Tabuada Divertida", icon: "jogos/ano2/tabuada.png", link: "2/mat/tabuada/" }
        ],
        "estudo": [
            { nome: "Estados da Água", icon: "jogos/ano2/agua.png", link: "2/em/agua/" }
        ]
    },
    "ano3": {
        "portugues": [
            { nome: "Interpretação", icon: "jogos/ano3/texto.png", link: "3/pt/interpretar/" }
        ],
        "matematica": [
            { nome: "Frações Simples", icon: "jogos/ano3/fracoes.png", link: "3/mat/fracoes/" }
        ],
        "estudo": [
            { nome: "Animais Vertebrados", icon: "jogos/ano3/animais.png", link: "3/em/animais/" }
        ]
    },
    "ano4": {
        "portugues": [
            { nome: "Gramática Mestre", icon: "jogos/ano4/gramatica.png", link: "4/pt/gramatica/" }
        ],
        "matematica": [
            { nome: "Grandes Números", icon: "jogos/ano4/numeros.png", link: "4/mat/numeros/" }
        ],
        "estudo": [
            { nome: "História de Portugal", icon: "jogos/ano4/historia.png", link: "4/em/historia/" }
        ]
    }
};
