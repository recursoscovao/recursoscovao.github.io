// ==========================================
// 1. BIBLIOTECA DE TEMAS (COMPLETA)
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
// 2. BIBLIOTECA DE CONTEÚDO (COMPLETA)
// ==========================================
const BIBLIOTECA_CONTEUDO = {
    "jd": { 
        "jd": { t1: "Jogos em", t2: "Destaque", sub: "Recursos Especiais", rodape: "&copy; Recursos Covão" } 
    },
    "pre": { 
        "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", rodape: "&copy; Recursos Covão" } 
    },
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
    nomeDoJogo: "Letras Mágicas",
    descricao: "Contorna a letra e vê a magia acontecer!",
    
    areaAtiva: "pre",   
    anoAtivo: "pre",    
    
    caminhoIconsMenu: "../../icons/", 
    caminhoIconsJogos: "../../icons/ic_jogos_pre/",
    caminhoSonsBase: "../../sons/", 

    sons: {
        acerto: "certo.mp3",
        clique: "clique.mp3",
    },

    coresMagicas: [
        { nome: "Azul", cor: "#007BFF" },
        { nome: "Verde", cor: "#28A745" },
        { nome: "Vermelho", cor: "#DC3545" },
        { nome: "Amarelo", cor: "#FFC107" }
    ],

    menuItens: [
        { id: "home", label: "Início", icon: "home.png", link: "/" },
        { id: "pre", label: "Pré-Escolar", icon: "iconpre.png", link: "/pre" },
        { id: "ano1", label: "1º Ano", icon: "icon1.png", link: "/1" },
        { id: "ano2", label: "2º Ano", icon: "icon2.png", link: "/2" },
        { id: "ano3", label: "3º Ano", icon: "icon3.png", link: "/3" },
        { id: "ano4", label: "4º Ano", icon: "icon4.png", link: "/4" },
        { id: "voltar", label: "Voltar", icon: "AUTO", link: "javascript:history.back()" } 
    ]
};

// ==========================================
// 4. DADOS DAS LETRAS (ALFABETO COMPLETO)
// ==========================================
const DADOS_JOGO = {
    caminhoRecursos: "../../img/letras/", 
    somInstrucoes: "sonspre/f1_jogo07.mp3",
    
    // Mapeamento rigoroso respeitando maiúsculas/minúsculas do teu GitHub
    itens: [
        { id: "A", img: "letra_A.png", som: "letra_A.mp3" },
        { id: "B", img: "Letra_B.png", som: "letra_B.mp3" },
        { id: "C", img: "Letra_c.png", som: "letra_C.mp3" },
        { id: "D", img: "letra_d.png", som: "letra_D.mp3" },
        { id: "E", img: "letra_e.png", som: "letra_E.mp3" },
        { id: "F", img: "letra_f.png", som: "letra_F.mp3" },
        { id: "G", img: "letra_g.png", som: "letra_G.mp3" },
        { id: "H", img: "letra_h.png", som: "letra_H.mp3" },
        { id: "I", img: "letra_i.png", som: "letra_I.mp3" },
        { id: "J", img: "letra_j.png", som: "letra_J.mp3" },
        { id: "K", img: "letra_k.png", som: "letra_K.mp3" },
        { id: "L", img: "letra_l.png", som: "letra_L.mp3" },
        { id: "M", img: "letra_m.png", som: "letra_M.mp3" },
        { id: "N", img: "letra_n.png", som: "letra_N.mp3" },
        { id: "O", img: "letra_o.png", som: "letra_O.mp3" },
        { id: "P", img: "letra_p.png", som: "letra_P.mp3" },
        { id: "Q", img: "letra_q.png", som: "letra_Q.mp3" },
        { id: "R", img: "letra_r.png", som: "letra_R.mp3" },
        { id: "S", img: "letra_s.png", som: "letra_S.mp3" },
        { id: "T", img: "letra_t.png", som: "letra_T.mp3" },
        { id: "U", img: "letra_u.png", som: "letra_U.mp3" },
        { id: "V", img: "letra_v.png", som: "letra_V.mp3" },
        { id: "W", img: "letra_w.png", som: "letra_W.mp3" },
        { id: "X", img: "letra_x.png", som: "letra_X.mp3" },
        { id: "Y", img: "letra_y.png", som: "letra_Y.mp3" },
        { id: "Z", img: "letra_z.png", som: "letra_Z.mp3" }
    ]
};
