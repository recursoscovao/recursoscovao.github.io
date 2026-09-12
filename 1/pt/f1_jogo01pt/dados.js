// ==========================================
// 3. CONFIGURAÇÃO DO JOGO ATUAL (GRAFISMOS)
// ==========================================
const JOGO_CONFIG = {
    nomeDoJogo: "Traça o Caminho",
    descricao: "Usa o teu dedo ou rato para ligar os animais seguindo o caminho tracejado!",
    
    // Como o jogo está na pasta /1/pt/, assumo que é 1º Ano de Português
    areaAtiva: "portugues",   
    anoAtivo: "ano1",    

    // CAMINHOS RETIFICADOS (Recua 3 pastas: f1_jogo01pt -> pt -> 1 -> raiz)
    caminhoIconsMenu: "../../../icons/", 
    caminhoIconsJogos: "../../../icons/ic_jogos_pre", // Ajusta se a pasta for diferente
    caminhoSons: "../../../sons/", 

    sons: {
        acerto: "certo.mp3",
        erro: "erro.mp3",
        clique: "clique.mp3"
    },

    menuItens: [
        { id: "home",   label: "Início",       icon: "home.png",    link: "/" },
        { id: "pre",    label: "Pré-Escolar",  icon: "iconpre.png", link: "/pre" },
        { id: "ano1",   label: "1º Ano",       icon: "icon1.png",   link: "/1" },
        { id: "ano2",   label: "2º Ano",       icon: "icon2.png",   link: "/2" },
        { id: "ano3",   label: "3º Ano",       icon: "icon3.png",   link: "/3" },
        { id: "ano4",   label: "4º Ano",       icon: "icon4.png",   link: "/4" },
        { id: "voltar", label: "Voltar",       icon: "AUTO",        link: "javascript:history.back()" } 
    ],

    instrucoes: {
        objetivo: "Usa o rato ou o dedo para desenhar uma linha desde o animal da esquerda até ao animal da direita, sem largar!",
        comoJogar: [
            "Toca no animal da esquerda para começar.",
            "Sem levantar o dedo, segue a linha tracejada.",
            "Chega até ao animal da direita para ganhares a ronda."
        ],
        regras: [
            "Tens de chegar perto da imagem de destino.",
            "Se largares antes do fim, tens de tentar de novo!"
        ],
        dicas: "Vai devagar para não saíres muito fora da linha!",
        desenvolvimento: [
            "Coordenação óculo-manual",
            "Motricidade fina",
            "Controlo do traço"
        ]
    },

    relatorios: [
        { min: 9, max: 10, titulo: "Mão Firme!",        img: "taca_1.png" },
        { min: 7, max: 8,  titulo: "Muito bem!",        img: "taca_2.png" },
        { min: 5, max: 6,  titulo: "Quase lá!",         img: "taca_3.png" },
        { min: 0, max: 4,  titulo: "Vamos treinar!",    img: "taca_4.png" }
    ]
};

// ==========================================
// 4. DADOS DO CONTEÚDO DO JOGO
// ==========================================
const DADOS_JOGO = {
    // CAMINHO RETIFICADO PARA A PASTA DE IMAGENS DO GITHUB
    caminhoImagens: "../../../img/animaisdomesticos/", 
    somInstrucoes: "sonspre/f1jogo_grafismos.mp3", // Ajusta se não tiveres este som
    
    // Ligações usando os ficheiros reais que tens no GitHub
    itens: [
        { id: 1,  imgA: "galinha.png", imgB: "pintainho.png", tipo: "reta" },       // Mãe e filho
        { id: 2,  imgA: "pato.png",    imgB: "patinho.png",   tipo: "curva" },      // Pai e filho
        { id: 3,  imgA: "cao.png",     imgB: "cao1.png",      tipo: "ziguezague" }, // Cão para Cão
        { id: 4,  imgA: "gato.png",    imgB: "gato1.png",     tipo: "reta" },       // Gato para Gato
        { id: 5,  imgA: "vaca.png",    imgB: "boi.png",       tipo: "curva" },
        { id: 6,  imgA: "cabra.png",   imgB: "ovelha.png",    tipo: "ziguezague" },
        { id: 7,  imgA: "cavalo.png",  imgB: "burro.png",     tipo: "reta" },
        { id: 8,  imgA: "porco.png",   imgB: "galo.png",      tipo: "curva" },
        { id: 9,  imgA: "peru.png",    imgB: "galinha.png",   tipo: "ziguezague" },
        { id: 10, imgA: "coelho.png",  imgB: "gato.png",      tipo: "reta" }
    ]
};
