// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0; 
let itemDestaque = null, opcoesRonda = [], simuInterval;
let audioInstrucoes = null; // Variável para controlar o áudio das instruções

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO) 
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    /* [ESTILOS GERAIS - CONFIGURAÇÃO PADRÃO] */
    :root { 
        --grid-cols: 4;      /* Valor padrão para evitar fila única */
        --card-size: 130px; 
        --dest-size: 180px; 
    }

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
        margin-bottom: 15px; flex-shrink: 0; 
    }
    .destaque-box img { max-width: 65%; max-height: 65%; object-fit: contain; }
    
    .opcao-card {
        background: white; border: 3px solid #f0f0f0; border-radius: 15px; 
        width: var(--card-size); height: var(--card-size);
        display: flex; align-items: center; justify-content: center; 
        cursor: pointer; position: relative; transition: 0.2s;
    }
    .opcao-card:active { transform: scale(0.95); }
    .opcao-card img { width: 80%; height: 80%; object-fit: contain; }
    
    .feedback-icon { position: absolute; font-size: 3rem; z-index: 10; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3)); pointer-events: none; }
    .icon-v { color: #8cc63f; } .icon-x { color: #ff5a5f; }

    /* A. PC / TABLET LANDSCAPE / PAINÉIS */
    @media screen and (min-width: 1025px), (min-width: 768px) and (orientation: landscape) {
        :root { --grid-cols: 6; --card-size: 130px; --dest-size: 160px; }
        .shell-body { padding: 20px !important; justify-content: center !important; }
    }

    /* B. TABLET VERTICAL (PORTRAIT) - FORÇANDO GRELHA */
    @media screen and (min-width: 501px) and (max-width: 1024px) and (orientation: portrait) {
        :root { 
            --grid-cols: 4 !important;      /* Garante 4 colunas */
            --card-size: 140px;   
            --dest-size: 200px;   
        }
        .shell-body { padding: 30px 40px !important; justify-content: center !important; }
    }

    /* C. TELEMÓVEL VERTICAL (PORTRAIT) */
    @media screen and (max-width: 500px) and (orientation: portrait) {
        :root { --grid-cols: 3 !important; --card-size: 85px; --dest-size: 140px; }
        .shell-body { padding: 15px 15px !important; justify-content: center !important; }
    }

    /* D. TELEMÓVEL HORIZONTAL (LANDSCAPE) */
    @media screen and (max-height: 500px) and (orientation: landscape) {
        :root { --grid-cols: 6 !important; --card-size: 70px; --dest-size: 110px; }
        .shell-body { padding: 10px 15px !important; }
    }
`;
document.head.appendChild(style);

// ==========================================
// 3. LÓGICA DE CAPA E SIMULAÇÃO
// ==========================================
function tocarAudioInstrucoes() {
    // Para o som do clique se estiver a tocar e reinicia
    somClique.pause();
    somClique.currentTime = 0;
    somClique.play();

    // Cancela qualquer narração de voz do sistema que esteja a correr
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    // Se o áudio já estiver a tocar, para-o e volta ao início
    if (audioInstrucoes) {
        audioInstrucoes.pause();
        audioInstrucoes.currentTime = 0;
    } else {
        // Se ainda não foi criado, cria o objeto de áudio
        audioInstrucoes = new Audio(JOGO_CONFIG.caminhoSons + DADOS_JOGO.somInstrucoes);
    }

    // Tenta tocar o ficheiro de áudio
    audioInstrucoes.play().catch(() => {
        // Fallback: Se o áudio falhar, usa a voz do sistema
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
    ajudasUsadas = 0; 
    proximaRonda(); 
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);

    const area = document.getElementById('game-content');
    
    const todos = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todos[0];
    
    let selecao = todos.slice(0, 12);
    if (!selecao.find(i => i.id === itemDestaque.id)) selecao[0] = itemDestaque;
    
    opcoesRonda = selecao.sort(() => Math.random() - 0.5);

    // Adicionado style max-width para garantir que a grelha respeita o contentor
    area.innerHTML = `
        <div class="destaque-box"><img src="${DADOS_JOGO.caminhoImagens + itemDestaque.img}"></div>
        <div style="display:grid; grid-template-columns: repeat(var(--grid-cols), 1fr); gap:12px; width:100%; max-width:fit-content; justify-items:center;">
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
    ajudasUsadas++; 
    somClique.play();
    const correto = document.getElementById(`card-${itemDestaque.id}`);
    if (correto) {
        correto.style.borderColor = "var(--primary-color)";
        correto.animate([{transform:'scale(1)'},{transform:'scale(1.1)'},{transform:'scale(1)'}], {duration:500, iterations:2});
    }
}

function finalizarJogo() {
    jogoAtivo = false;
    // Para o áudio das instruções se ainda estiver a tocar ao acabar o jogo
    if(audioInstrucoes) audioInstrucoes.pause();
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, ajudasUsadas, rel);
}
