// ==========================================
// CONFIGURAÇÃO E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0;
let itemDestaque = null, simuInterval;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.clique);
const audioInstrucoes = new Audio(JOGO_CONFIG.caminhoSons + "instrucoes.mp3");

// Estilos específicos para o jogo
const gameStyle = document.createElement('style');
gameStyle.innerHTML = `
    .destaque-box {
        width: 180px; height: 180px; background: #fff; border-radius: 30px; 
        border: 3.5px dashed var(--primary-color); display: flex; align-items: center; justify-content: center;
        margin-bottom: 20px; position: relative;
    }
    /* Animal pequeno e centralizado */
    .destaque-box img { max-width: 65% !important; max-height: 65% !important; object-fit: contain; }

    .opcao-card {
        background: white; border: 3px solid #f0f0f0; border-radius: 15px; 
        aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; 
        cursor: pointer; transition: 0.2s; position: relative;
    }
    .opcao-card img { width: 80%; height: 80%; object-fit: contain; }
    
    /* Ícones de feedback (V e X) */
    .feedback-icon {
        position: absolute; font-size: 3.5rem; z-index: 10;
        filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));
        pointer-events: none;
    }
    .icon-v { color: #8cc63f; }
    .icon-x { color: #ff5a5f; }

    /* Botões da Capa */
    .btn-jogo-audio { width: 65px; height: 65px; cursor: pointer; transition: 0.2s; }
    .btn-jogo-play { 
        flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); 
        color: white; border: none; font-size: 1.5rem; font-weight: 900; 
        cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        display: flex; align-items: center; justify-content: center; gap: 15px;
    }
`;
document.head.appendChild(gameStyle);

// ==========================================
// CAPA E ÁUDIO
// ==========================================
function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h2>`;

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-hand" style="position:absolute; font-size:3rem; z-index:100; pointer-events:none; display:none;">👆</div>
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:15px;">
            <div class="destaque-box"><img id="simu-destaque" src=""></div>
            <div style="display:flex; gap:10px;">
                <div id="simu-opt-0" class="opcao-card" style="width:70px;"><img src=""></div>
                <div id="simu-opt-1" class="opcao-card" style="width:70px;"><img src=""></div>
                <div id="simu-opt-2" class="opcao-card" style="width:70px;"><img src=""></div>
            </div>
            <p style="color:var(--text-grey); font-weight:800; text-align:center;">${JOGO_CONFIG.descricao}</p>
        </div>
    `;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-jogo-audio" onclick="tocarAudioInstrucoes()">
        <button class="btn-jogo-play" onclick="iniciarJogo()"><i class="fas fa-play"></i> JOGAR</button>
    `;
    correrSimulacao();
}

function tocarAudioInstrucoes() {
    somClique.play();
    audioInstrucoes.currentTime = 0;
    audioInstrucoes.play().catch(() => {});
}

function correrSimulacao() {
    clearInterval(simuInterval);
    const hand = document.getElementById('simu-hand');
    const animar = () => {
        const itens = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5).slice(0,3);
        const certoIdx = Math.floor(Math.random() * 3);
        if(!document.getElementById('simu-destaque')) return;
        document.getElementById('simu-destaque').src = DADOS_JOGO.caminhoImagens + itens[certoIdx].img;
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
            hand.style.top = (target.top - container.top + 30) + "px";
            hand.style.left = (target.left - container.left + 30) + "px";
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
// LÓGICA DO JOGO
// ==========================================
function iniciarJogo() {
    clearInterval(simuInterval); audioInstrucoes.pause();
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0;
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);

    const area = document.getElementById('game-content');
    const todos = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todos[0];
    let selecao = todos.slice(0, 10);
    if (!selecao.find(i => i.id === itemDestaque.id)) selecao[0] = itemDestaque;
    opcoesRonda = selecao.sort(() => Math.random() - 0.5);

    const isPortrait = window.innerHeight > window.innerWidth;
    area.innerHTML = `
        <div class="destaque-box"><img src="${DADOS_JOGO.caminhoImagens + itemDestaque.img}"></div>
        <div style="display:grid; grid-template-columns: repeat(${isPortrait?3:5}, 1fr); gap:10px; width:100%; max-width:650px;">
            ${opcoesRonda.map(item => `
                <div class="opcao-card" id="card-${item.id}" onclick="verificarResposta(${item.id}, this)">
                    <img src="${DADOS_JOGO.caminhoImagens + item.img}">
                </div>
            `).join('')}
        </div>
    `;
}

function verificarResposta(id, el) {
    if (!jogoAtivo) return;
    document.querySelectorAll('.opcao-card').forEach(c => c.style.pointerEvents = 'none');

    if (id === itemDestaque.id) {
        certos++; somAcerto.play();
        el.style.borderColor = "#8cc63f";
        el.innerHTML += '<i class="fas fa-check feedback-icon icon-v"></i>'; // Adiciona o V
    } else {
        erros++; somErro.play();
        el.style.borderColor = "#ff5a5f";
        el.innerHTML += '<i class="fas fa-times feedback-icon icon-x"></i>'; // Adiciona o X
        const correto = document.getElementById(`card-${itemDestaque.id}`);
        if(correto) correto.style.borderColor = "#8cc63f";
    }
    setTimeout(() => { rondaAtual++; proximaRonda(); }, 1500);
}

function darAjuda() {
    if (!jogoAtivo) return;
    somClique.play();
    const correto = document.getElementById(`card-${itemDestaque.id}`);
    if (correto) {
        correto.style.borderColor = "var(--primary-color)";
        correto.animate([{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(1)'}], {duration:500, iterations:2});
    }
}

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, rel);
}
