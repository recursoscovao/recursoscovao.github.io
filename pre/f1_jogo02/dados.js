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
// 2. BIBLIOTECA DE CONTEÚDO (Textos Automáticos)
// ==========================================
const BIBLIOTECA_CONTEUDO = {
    "jd": { 
        "jd": { t1: "Jogos em", t2: "Destaque", sub: "Recursos Especiais", rodape: "&copy; Pequenos Curiosos" } 
    },
    "pre": { 
        "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", rodape: "&copy; Pequenos Curiosos" } 
    },
    "ano1": { 
        "portugues": { t1: "Pequenos", t2: "Leitores", sub: "1º Ano | Português", rodape: "&copy; Pequenos Leitores" },
        "matematica": { t1: "Pequenos", t2: "Matemáticos", sub: "1º Ano | Matemática", rodape: "&copy; Pequenos Matemáticos" },
        "estudo": { t1: "Pequenos", t2: "Exploradores", sub: "1º Ano | Estudo do Meio", rodape: "&copy; Pequenos Exploradores" }
    },
    "ano2": { 
        "portugues": { t1: "Jovens", t2: "Leitores", sub: "2º Ano | Português", rodape: "&copy; Jovens Leitores" },
        "matematica": { t1: "Jovens", t2: "Matemáticos", sub: "2º Ano | Matemática", rodape: "&copy; Jovens Matemáticos" },
        "estudo": { t1: "Jovens", t2: "Exploradores", sub: "2º Ano | Estudo do Meio", rodape: "&copy; Jovens Exploradores" }
    },
    "ano3": { 
        "portugues": { t1: "Exploradores", t2: "Leitores", sub: "3º Ano | Português", rodape: "&copy; Exploradores" },
        "matematica": { t1: "Exploradores", t2: "Cálculos", sub: "3º Ano | Matemática", rodape: "&copy; Exploradores" },
        "estudo": { t1: "Exploradores", t2: "do Mundo", sub: "3º Ano | Estudo do Meio", rodape: "&copy; Exploradores" }
    },
    "ano4": { 
        "portugues": { t1: "Mestres", t2: "da Língua", sub: "4º Ano | Português", rodape: "&copy; Mestres Curiosos" },
        "matematica": { t1: "Mestres", t2: "do Cálculo", sub: "4º Ano | Matemática", rodape: "&copy; Mestres Curiosos" },
        "estudo": { t1: "Mestres", t2: "do Mundo", sub: "4º Ano | Estudo do Meio", rodape: "&copy; Mestres Curiosos" }
    }
};

// ==========================================
// 3. CONFIGURAÇÃO DO JOGO ATUAL
// ==========================================
const JOGO_CONFIG = {
    nomeDoJogo: "Encontrar o Animal",
    descricao: "Identifica o animal igual ao modelo em destaque!",
    
    areaAtiva: "pre",   
    anoAtivo: "pre",    
    
    caminhoIconsMenu: "../../icons/", 
    caminhoIconsJogos: "../../icons/ic_jogos_pre",
    caminhoSons: "../../sons/", // Nova pasta para os sons

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
        objetivo: "Observa atentamente o animal apresentado no topo do ecrã e encontra a imagem igual entre as várias opções. Clica ou toca no animal correto para avançares para a ronda seguinte.",
        comoJogar: [
            "Observa o animal que aparece no topo do ecrã.",
            "Analisa todas as imagens apresentadas.",
            "Encontra a imagem exatamente igual ao modelo.",
            "Clica ou toca no animal correto.",
            "Se acertares, passas para a próxima ronda.",
            "Se errares, o jogo mostra a resposta certa antes de avançar.",
            "Completa as 10 rondas para ver os resultados."
        ],
        regras: [
            "Existe apenas uma resposta correta em cada ronda.",
            "Observa com atenção antes de responder.",
            "Não há limite de tempo."
        ],
        dicas: "Observa cuidadosamente a forma do animal, as cores e os detalhes (orelhas, patas, asas, cauda, etc.). Alguns animais podem ser muito parecidos.",
        desenvolvimento: [
            "Atenção e concentração",
            "Memória visual",
            "Capacidade de observação",
            "Discriminação visual"
        ]
    },

    relatorios: [
        { min: 9, max: 10, titulo: "És um craque!", img: "taca_1.png" },
        { min: 7, max: 8, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 5, max: 6, titulo: "Estás quase lá!", img: "taca_3.png" },
        { min: 0, max: 4, titulo: "Continua a tentar!", img: "taca_4.png" }
    ]
};

// ==========================================
// 4. DADOS DO CONTEÚDO DO JOGO
// ==========================================
const DADOS_JOGO = {
    caminhoImagens: "../../img/animaisselvagens/",
    somInstrucoes: "sonspre/f1jogo02.mp3", // CAMINHO DO SOM ADICIONADO AQUI
    itens: [
 { id: 1, img: "formiga.png", nome: "Formiga" },
    { id: 2, img: "tartaruga.png", nome: "Tartaruga" },
    { id: 3, img: "morcego.png", nome: "Morcego" },
    { id: 4, img: "hiena.png", nome: "Hiena" },
    { id: 5, img: "panda.png", nome: "Panda" },
    { id: 6, img: "urso.png", nome: "Urso" },
    { id: 7, img: "rinoceronte.png", nome: "Rinoceronte" },
    { id: 8, img: "elefante.png", nome: "Elefante" },
    { id: 9, img: "leao.png", nome: "Leão" },
    { id: 10, img: "coala.png", nome: "Coala" },
    { id: 11, img: "tubarao.png", nome: "Tubarão" },
    { id: 12, img: "tucano.png", nome: "Tucano" },
    { id: 13, img: "baleia.png", nome: "Baleia" },
    { id: 14, img: "caracol.png", nome: "Caracol" },
    { id: 15, img: "girafa.png", nome: "Girafa" },
    { id: 16, img: "lobo.png", nome: "Lobo" },
    { id: 17, img: "avestruz.png", nome: "Avestruz" },
    { id: 18, img: "tigre.png", nome: "Tigre" },
    { id: 19, img: "rato.png", nome: "Rato" },
    { id: 20, img: "pombo.png", nome: "Pombo" },
    { id: 21, img: "canguru.png", nome: "Canguru" },
    { id: 22, img: "texugo.png", nome: "Texugo" },
    { id: 23, img: "foca.png", nome: "Foca" },
    { id: 24, img: "peixe.png", nome: "Peixe" },
    { id: 25, img: "polvo.png", nome: "Polvo" },
    { id: 26, img: "aranha.png", nome: "Aranha" },
    { id: 27, img: "borboleta.png", nome: "Borboleta" },
    { id: 28, img: "raposa.png", nome: "Raposa" },
    { id: 29, img: "abutre.png", nome: "Abutre" },
    { id: 30, img: "zebra.png", nome: "Zebra" },
    { id: 31, img: "aguia.png", nome: "Águia" },
    { id: 32, img: "macaco.png", nome: "Macaco" },
    { id: 33, img: "hipopotamo.png", nome: "Hipopótamo" },
    { id: 34, img: "gorila.png", nome: "Gorila" },
    { id: 35, img: "crocodilo.png", nome: "Crocodilo" },
    { id: 36, img: "raia.png", nome: "Raia" },
    { id: 37, img: "papagaio.png", nome: "Papagaio" },
    { id: 38, img: "caranguejo.png", nome: "Caranguejo" },
    { id: 39, img: "abelha.png", nome: "Abelha" }
    ]
};

// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0; // Adicionado ajudasUsadas
let itemDestaque = null, opcoesRonda = [], simuInterval;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    /* [ESTILOS GERAIS - COMUNS A TODOS] */
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; }
    .status-pill { background: #6c757d; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 1.1rem; }
    .score-group { display: flex; gap: 10px; }
    .score-box { padding: 5px 12px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1.1rem; min-width: 60px; justify-content: center; }
    .box-v { background: #8cc63f; box-shadow: 0 3px 0 #6da32f; }
    .box-x { background: #ff5a5f; box-shadow: 0 3px 0 #d44348; }

    .btn-play-rect { 
        flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); 
        color: white; border: none; font-size: 1.5rem; font-weight: 900; 
        text-transform: uppercase; cursor: pointer; display: flex; 
        align-items: center; justify-content: center; gap: 15px; 
        box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: 0.2s;
    }
    .btn-audio-circle { width: 65px; height: 65px; cursor: pointer; flex-shrink: 0; }

    .destaque-box {
        width: var(--dest-size); height: var(--dest-size); background: #fff; border-radius: 30px; 
        border: 3.5px dashed var(--primary-color); display: flex; align-items: center; justify-content: center;
        margin-bottom: 15px;
    }
    .destaque-box img { max-width: 60%; max-height: 60%; object-fit: contain; }
    
    .opcao-card {
        background: white; border: 3px solid #f0f0f0; border-radius: 15px; 
        width: var(--card-size); height: var(--card-size);
        display: flex; align-items: center; justify-content: center; 
        cursor: pointer; position: relative;
    }
    .opcao-card img { width: 80%; height: 80%; object-fit: contain; }
    
    .feedback-icon { position: absolute; font-size: 3rem; z-index: 10; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3)); pointer-events: none; }
    .icon-v { color: #8cc63f; } .icon-x { color: #ff5a5f; }

/* ============================================================
       A. PC / TABLET LANDSCAPE
       ============================================================ */
    @media screen and (min-width: 1025px), (min-width: 768px) and (orientation: landscape) {
        :root { 
            --grid-cols: 6; 
            --card-size: 135px; 
            --dest-size: 160px; 
        }

        .shell-body {
            padding-top: 10px !important;    
            padding-bottom: 10px !important; 
            justify-content: center !important; 
        }

        .destaque-box { 
            margin-top: 0px;      
            margin-bottom: 30px;  
        }
    }
    /* [FIM PC / TABLET LANDSCAPE] */

    /* ============================================================
       B. TELEMÓVEL VERTICAL (PORTRAIT)
       ============================================================ */
    @media screen and (max-width: 500px) and (orientation: portrait) {
        :root { 
            --grid-cols: 3; 
            --card-size: 90px; 
            --dest-size: 150px; 
        }
    }
    /* [FIM TELEMÓVEL VERTICAL] */

    /* ============================================================
       C. TELEMÓVEL HORIZONTAL (LANDSCAPE)
       ============================================================ */
    @media screen and (max-height: 500px) and (orientation: landscape) {
        :root { 
            --grid-cols: 6; 
            --card-size: 75px; 
            --dest-size: 120px; 
        }
    }
    /* [FIM TELEMÓVEL HORIZONTAL] */
`;
document.head.appendChild(style);

// ==========================================
// 3. LÓGICA DE CAPA E SIMULAÇÃO
// ==========================================
function tocarAudioInstrucoes() {
    somClique.play();
    // ALTERADO PARA IR BUSCAR O SOM DEFINIDO NOS DADOS_JOGO
    const audioInst = new Audio(JOGO_CONFIG.caminhoSons + DADOS_JOGO.somInstrucoes);
    audioInst.play().catch(() => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance("Olha para o animal em cima e encontra-o em baixo. Clica na lâmpada se precisares de ajuda!");
        utter.lang = 'pt-PT'; synth.speak(utter);
    });
}

function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div id="simu-hand" style="position:absolute; font-size:3rem; z-index:100; pointer-events:none; display:none;">👆</div>
        <div style="display:flex; flex-direction:column; align-items:center;">
            <div class="destaque-box"><img id="simu-destaque" src=""></div>
            <div style="display:flex; gap:8px;">
                <div class="opcao-card" style="width:70px; height:70px;" id="simu-opt-0"><img src=""></div>
                <div class="opcao-card" style="width:70px; height:70px;" id="simu-opt-1"><img src=""></div>
                <div class="opcao-card" style="width:70px; height:70px;" id="simu-opt-2"><img src=""></div>
            </div>
            <p style="color:var(--text-grey); font-weight:800; text-align:center; margin-top:15px; font-size:0.9rem;">${JOGO_CONFIG.descricao}</p>
        </div>`;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="tocarAudioInstrucoes()">
        <button class="btn-play-rect" onclick="iniciarJogo()"><i class="fas fa-play"></i> JOGAR</button>`;
    
    correrSimulacao();
}

function correrSimulacao() {
    clearInterval(simuInterval);
    const hand = document.getElementById('simu-hand');
    const animar = () => {
        const itens = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5).slice(0,3);
        const certoIdx = Math.floor(Math.random() * 3);
        const imgD = document.getElementById('simu-destaque');
        if(!imgD) return;
        imgD.src = DADOS_JOGO.caminhoImagens + itens[certoIdx].img;
        itens.forEach((it, i) => { 
            const card = document.getElementById(`simu-opt-${i}`);
            card.querySelector('img').src = DADOS_JOGO.caminhoImagens + it.img;
            card.style.borderColor = "#f0f0f0";
        });
        const container = document.getElementById('game-content').getBoundingClientRect();
        hand.style.display = "block"; hand.style.opacity = "0"; hand.style.top = "80%"; hand.style.left = "80%";
        setTimeout(() => {
            const target = document.getElementById(`simu-opt-${certoIdx}`).getBoundingClientRect();
            hand.style.transition = "all 0.8s ease-in-out"; hand.style.opacity = "1";
            hand.style.top = (target.top - container.top + 25) + "px";
            hand.style.left = (target.left - container.left + 25) + "px";
            setTimeout(() => { 
                const opt = document.getElementById(`simu-opt-${certoIdx}`);
                if(opt) opt.style.borderColor = "#8cc63f";
                setTimeout(() => { hand.style.opacity = "0"; }, 500);
            }, 900);
        }, 200);
    };
    animar(); simuInterval = setInterval(animar, 4000);
}

// ==========================================
// 4. LÓGICA DE JOGO (12 ANIMAIS RANDOM)
// ==========================================
function iniciarJogo() { 
    clearInterval(simuInterval); 
    jogoAtivo = true; 
    rondaAtual = 1; 
    certos = 0; 
    erros = 0; 
    ajudasUsadas = 0; // Reset das ajudas
    proximaRonda(); 
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    
    // Chama a função do Engine no index.html para mostrar o status
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);

    const area = document.getElementById('game-content');
    
    const todos = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todos[0];
    
    let selecao = todos.slice(0, 12);
    if (!selecao.find(i => i.id === itemDestaque.id)) selecao[0] = itemDestaque;
    
    opcoesRonda = selecao.sort(() => Math.random() - 0.5);

    area.innerHTML = `
        <div class="destaque-box"><img src="${DADOS_JOGO.caminhoImagens + itemDestaque.img}"></div>
        <div style="display:grid; grid-template-columns: repeat(var(--grid-cols), 1fr); gap:8px; width:fit-content;">
            ${opcoesRonda.map(item => `
                <div class="opcao-card" id="card-${item.id}" onclick="verificarResposta(${item.id}, this)">
                    <img src="${DADOS_JOGO.caminhoImagens + item.img}">
                </div>`).join('')}
        </div>`;
}

function verificarResposta(id, el) {
    if (!jogoAtivo) return;
    document.querySelectorAll('.opcao-card').forEach(c => c.style.pointerEvents = 'none');

    if (id === itemDestaque.id) {
        certos++; somAcerto.play();
        el.style.borderColor = "#8cc63f";
        el.innerHTML += '<i class="fas fa-check feedback-icon icon-v"></i>';
    } else {
        erros++; somErro.play();
        el.style.borderColor = "#ff5a5f";
        el.innerHTML += '<i class="fas fa-times feedback-icon icon-x"></i>';
        const correto = document.getElementById(`card-${itemDestaque.id}`);
        if(correto) correto.style.borderColor = "#8cc63f";
    }
    setTimeout(() => { rondaAtual++; proximaRonda(); }, 1500);
}

function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++; // Conta a ajuda utilizada
    somClique.play();
    const correto = document.getElementById(`card-${itemDestaque.id}`);
    if (correto) {
        correto.style.borderColor = "var(--primary-color)";
        correto.animate([{transform:'scale(1)'},{transform:'scale(1.1)'},{transform:'scale(1)'}], {duration:500, iterations:2});
    }
}

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    
    // Agora chama a função do Engine no index.html passando as ajudas
    Engine.showResults(certos, erros, ajudasUsadas, rel);
}
