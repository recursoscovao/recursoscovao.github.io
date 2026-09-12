// ==========================================
// 3. CONFIGURAÇÃO DO JOGO DE GRAFISMOS
// ==========================================
const JOGO_CONFIG = {
    nomeDoJogo: "Traça o Caminho",
    descricao: "Usa o teu dedo para ligar os amigos seguindo o caminho tracejado!",
    
    areaAtiva: "pre",   
    anoAtivo: "pre",    

    caminhoIconsMenu: "../../icons/", 
    caminhoIconsJogos: "../../icons/ic_grafismos", // Ajusta se necessário
    caminhoSons: "../../sons/", 

    sons: {
        acerto: "certo.mp3",
        erro: "erro.mp3",
        clique: "clique.mp3"
    },

    menuItens: [
        { id: "home",   label: "Início",       icon: "home.png",    link: "/" },
        { id: "pre",    label: "Pré-Escolar",  icon: "iconpre.png", link: "/pre" },
        { id: "ano1",   label: "1º Ano",       icon: "icon1.png",   link: "/1" },
        { id: "voltar", label: "Voltar",       icon: "AUTO",        link: "javascript:history.back()" } 
    ],

    instrucoes: {
        objetivo: "Usa o rato ou o dedo para desenhar uma linha desde a figura da esquerda até à figura da direita, sem largar!",
        comoJogar: [
            "Toca na imagem da esquerda para começar.",
            "Sem levantar o dedo, segue a linha tracejada.",
            "Chega até à imagem da direita para ganhares a ronda."
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
    caminhoImagens: "../../img/grafismos/", // Cria esta pasta e põe lá as imagens
    somInstrucoes: "sonspre/f1jogo_grafismos.mp3",
    
    // Cada nível liga a imgA à imgB. 
    // tipo de caminho: "reta", "curva", ou "ziguezague"
    itens: [
        { id: 1,  imgA: "abelha.png",  imgB: "flor.png",   tipo: "reta" },
        { id: 2,  imgA: "rato.png",    imgB: "queijo.png", tipo: "curva" },
        { id: 3,  imgA: "sapo.png",    imgB: "lago.png",   tipo: "ziguezague" },
        { id: 4,  imgA: "cao.png",     imgB: "osso.png",   tipo: "reta" },
        { id: 5,  imgA: "macaco.png",  imgB: "banana.png", tipo: "curva" },
        { id: 6,  imgA: "passaro.png", imgB: "ninho.png",  tipo: "ziguezague" },
        { id: 7,  imgA: "coelho.png",  imgB: "cenoura.png",tipo: "curva" },
        { id: 8,  imgA: "gato.png",    imgB: "peixe.png",  tipo: "reta" },
        { id: 9,  imgA: "menino.png",  imgB: "bola.png",   tipo: "ziguezague" },
        { id: 10, imgA: "urso.png",    imgB: "mel.png",    tipo: "curva" }
    ]
};
