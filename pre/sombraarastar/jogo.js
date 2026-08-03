// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0;
let itensNaRonda = [], encaixadosNaRonda = 0, simuInterval;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (MAXIMIZAR ESPAÇO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    :root {
        --item-size: 130px;
        --slot-size: 140px;
    }

    /* Ajuste para ecrãs pequenos */
    @media screen and (max-width: 600px) {
        :root { --item-size: 85px; --slot-size: 95px; }
        .game-board { gap: 15px !important; }
    }

    .shell-body { padding: 5px !important; display: flex; flex-direction: column; }
    
    .game-board { 
        flex: 1; display: flex; flex-direction: column; 
        justify-content: space-evenly; align-items: center; 
        width: 100%; height: 100%; 
    }
    
    .drag-container, .drop-container { 
        display: flex; justify-content: center; gap: 15px; 
        width: 100%; flex-wrap: wrap; padding: 10px;
    }

    .drag-item {
        width: var(--item-size); height: var(--item-size); 
        background: white; border-radius: 20px;
        box-shadow: 0 6px 0px rgba(0,0,0,0.1); cursor: grab;
        display: flex; align-items: center; justify-content: center;
        touch-action: none; transition: transform 0.2s;
        border: 3px solid #eee;
    }
    .drag-item img { max-width: 80%; max-height: 80%; pointer-events: none; }

    .drop-slot {
        width: var(--slot-size); height: var(--slot-size); 
        border: 4px dashed #ccc; border-radius: 25px;
        display: flex; align-items: center; justify-content: center;
        background: rgba(255,255,255,0.3); transition: all 0.3s;
    }
    .drop-slot img { max-width: 75%; max-height: 75%; filter: brightness(0); opacity: 0.2; pointer-events: none; }
    
    .slot-filled { border: 4px solid #8cc63f !important; background: #f0fff0 !important; }
    .slot-filled img { filter: none !important; opacity: 1 !important; animation: popIn 0.4s cubic-bezier(0.17, 0.67, 0.83, 1.67); }

    @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }

    /* Estilo Botão Jogar Rigoroso */
    .btn-play-rect { 
        flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); 
        color: white; border: none; font-size: 1.5rem; font-weight: 900; 
        text-transform: uppercase; cursor: pointer; display: flex; 
        align-items: center; justify-content: center; gap: 15px; 
        box-shadow: 0 6px 0 var(--corEscura); transition: 0.1s;
    }
    .btn-play-rect:active { transform: translateY(3px); box-shadow: 0 3px 0 var(--corEscura); }

    .help-pulse { 
        border: 5px solid var(--primary-color) !important; 
        animation: pulseHelp 0.8s infinite alternate; 
    }
    @keyframes pulseHelp { from { transform: scale(1); } to { transform: scale(1.1); } }

    #simu-hand { position: absolute; font-size: 3.5rem; z-index: 1000; pointer-events: none; transition: all 1.2s ease-in-out; }
`;
document.head.appendChild(style);

// ==========================================
// 3. AUDIO E SIMULAÇÃO DE COMO JOGAR
// ==========================================
function tocarAudioInstrucoes() {
    somClique.play();
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance("Arrasta cada objeto colorido para cima da sua sombra cinzenta. Se errares, tenta outra vez!");
    utter.lang = 'pt-PT'; synth.speak(utter);
}

function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div id="simu-hand" style="display:none;">👆</div>
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:40px;">
            <div id="simu-drag-box" class="drag-item" style="position:relative;"><img src="${DADOS_JOGO.caminhoImagens}bola.png"></div>
            <div id="simu-drop-box" class="drop-slot"><img src="${DADOS_JOGO.caminhoImagens}bola.png"></div>
            <p style="color:var(--text-grey); font-weight:800; font-size:1.1rem; text-align:center;">${JOGO_CONFIG.descricao}</p>
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
    const dragBox = document.getElementById('simu-drag-box');
    const dropBox = document.getElementById('simu-drop-box');
    
    const animar = () => {
        if (!hand || !dragBox || !dropBox) return;
        const rectStart = dragBox.getBoundingClientRect();
        const rectEnd = dropBox.getBoundingClientRect();
        const container = document.getElementById('game-content').getBoundingClientRect();

        // Reset
        dropBox.classList.remove('slot-filled');
        dragBox.style.visibility = "visible";
        hand.style.display = "block";
        hand.style.opacity = "0";
        hand.style.top = (rectStart.top - container.top + 50) + "px";
        hand.style.left = (rectStart.left - container.left + 50) + "px";

        setTimeout(() => {
            hand.style.opacity = "1";
            setTimeout(() => {
                // Mover para o destino
                hand.style.top = (rectEnd.top - container.top + 40) + "px";
                hand.style.left = (rectEnd.left - container.left + 40) + "px";
                dragBox.style.transition = "all 1.2s ease-in-out";
                dragBox.style.top = (rectEnd.top - rectStart.top) + "px";
                dragBox.style.left = (rectEnd.left - rectStart.left) + "px";

                setTimeout(() => {
                    dropBox.classList.add('slot-filled');
                    dragBox.style.visibility = "hidden";
                    setTimeout(() => {
                        hand.style.opacity = "0";
                        // Reset posições para o próximo ciclo
                        dragBox.style.transition = "none";
                        dragBox.style.top = "0"; dragBox.style.left = "0";
                    }, 500);
                }, 1200);
            }, 600);
        }, 500);
    };

    animar();
    simuInterval = setInterval(animar, 5000);
}

// ==========================================
// 4. LÓGICA DE JOGO
// ==========================================
function iniciarJogo() {
    clearInterval(simuInterval);
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0;
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    encaixadosNaRonda = 0;
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);

    itensNaRonda = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5).slice(0, 4);
    const itensDrag = [...itensNaRonda].sort(() => Math.random() - 0.5);
    const itensDrop = [...itensNaRonda].sort(() => Math.random() - 0.5);

    document.getElementById('game-content').innerHTML = `
        <div class="game-board">
            <div class="drag-container">
                ${itensDrag.map(it => `
                    <div class="drag-item" draggable="true" id="drag-${it.id}" ondragstart="drag(event)">
                        <img src="${DADOS_JOGO.caminhoImagens + it.img}">
                    </div>`).join('')}
            </div>
            <div class="drop-container">
                ${itensDrop.map(it => `
                    <div class="drop-slot" id="slot-${it.id}" ondrop="drop(event)" ondragover="allowDrop(event)">
                        <img src="${DADOS_JOGO.caminhoImagens + it.img}">
                    </div>`).join('')}
            </div>
        </div>`;
}

// ==========================================
// 5. DRAG & DROP E AJUDA
// ==========================================
function allowDrop(ev) { ev.preventDefault(); }

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    somClique.play();
}

function drop(ev) {
    ev.preventDefault();
    const dragId = ev.dataTransfer.getData("text");
    const slotId = ev.currentTarget.id;
    
    const idDrag = dragId.replace('drag-', '');
    const idSlot = slotId.replace('slot-', '');

    if (idDrag === idSlot) {
        somAcerto.play();
        document.getElementById(dragId).style.visibility = "hidden";
        const slot = document.getElementById(slotId);
        slot.classList.add('slot-filled');
        encaixadosNaRonda++;
        
        if (encaixadosNaRonda === 4) {
            certos++;
            setTimeout(() => { rondaAtual++; proximaRonda(); }, 1200);
        }
    } else {
        erros++; // ERRO IMEDIATO
        somErro.play();
        Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
        const slot = document.getElementById(slotId);
        slot.style.borderColor = "#ff5a5f";
        setTimeout(() => { if(!slot.classList.contains('slot-filled')) slot.style.borderColor = "#ccc"; }, 600);
    }
}

function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++;
    somClique.play();

    const itensRestantes = Array.from(document.querySelectorAll('.drag-item')).filter(el => el.style.visibility !== 'hidden');
    
    if (itensRestantes.length > 0) {
        const itemAjuda = itensRestantes[0];
        const id = itemAjuda.id.replace('drag-', '');
        const slotAjuda = document.getElementById('slot-' + id);

        itemAjuda.classList.add('help-pulse');
        slotAjuda.classList.add('help-pulse');

        setTimeout(() => {
            itemAjuda.classList.remove('help-pulse');
            slotAjuda.classList.remove('help-pulse');
        }, 2500);
    }
}

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, ajudasUsadas, rel);
}

mostrarCapa();
