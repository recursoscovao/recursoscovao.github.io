// ==========================================
// 1. ESTADO GLOBAL
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0;
let itensNaRonda = [], encaixadosNaRonda = 0;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// ==========================================
// 2. CSS INJETADO (Rigoroso com a Estética)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .btn-play-rect { 
        flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); 
        color: white; border: none; font-size: 1.5rem; font-weight: 900; 
        text-transform: uppercase; cursor: pointer; display: flex; 
        align-items: center; justify-content: center; gap: 15px; 
        box-shadow: 0 5px 0 var(--dark-color); transition: 0.1s;
    }
    .btn-play-rect:active { transform: translateY(3px); box-shadow: 0 2px 0 var(--dark-color); }
    .btn-audio-circle { width: 65px; height: 65px; cursor: pointer; flex-shrink: 0; }

    .game-board { display: flex; flex-direction: column; align-items: center; gap: 30px; width: 100%; }
    
    .drag-container, .drop-container { 
        display: flex; justify-content: center; gap: 15px; width: 100%; flex-wrap: wrap; 
    }

    .drag-item {
        width: 100px; height: 100px; background: white; border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1); cursor: grab;
        display: flex; align-items: center; justify-content: center;
        touch-action: none; transition: transform 0.2s, border 0.3s;
        border: 3px solid transparent;
    }
    .drag-item img { max-width: 80%; max-height: 80%; pointer-events: none; }

    .drop-slot {
        width: 110px; height: 110px; border: 3px dashed #ccc; border-radius: 20px;
        display: flex; align-items: center; justify-content: center;
        background: rgba(255,255,255,0.4); transition: all 0.3s;
    }
    .drop-slot img { max-width: 75%; max-height: 75%; filter: brightness(0); opacity: 0.25; pointer-events: none; }
    
    .slot-filled { border: 3px solid #8cc63f !important; background: #f0fff0 !important; }
    .slot-filled img { filter: none !important; opacity: 1 !important; }

    .help-pulse { 
        border: 4px solid var(--primary-color) !important; 
        animation: pulseHelp 0.6s infinite alternate; 
    }
    @keyframes pulseHelp { from { transform: scale(1); } to { transform: scale(1.1); } }
`;
document.head.appendChild(style);

// ==========================================
// 3. LÓGICA DE CAPA E RONDAS
// ==========================================
function mostrarCapa() {
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
            <div style="display:flex; gap:15px;">
                <div class="drag-item"><img src="${DADOS_JOGO.caminhoImagens}bola.png"></div>
                <div class="drop-slot"><img src="${DADOS_JOGO.caminhoImagens}bola.png"></div>
            </div>
            <p style="color:var(--text-grey); font-weight:800; text-align:center;">${JOGO_CONFIG.descricao}</p>
        </div>`;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="somClique.play()">
        <button class="btn-play-rect" onclick="iniciarJogo()"><i class="fas fa-play"></i> JOGAR</button>`;
}

function iniciarJogo() {
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
                ${itensDrag.map(it => `<div class="drag-item" draggable="true" id="drag-${it.id}" ondragstart="drag(event)"><img src="${DADOS_JOGO.caminhoImagens + it.img}"></div>`).join('')}
            </div>
            <div style="width:90%; height:2px; background:#eee;"></div>
            <div class="drop-container">
                ${itensDrop.map(it => `<div class="drop-slot" id="slot-${it.id}" ondrop="drop(event)" ondragover="allowDrop(event)"><img src="${DADOS_JOGO.caminhoImagens + it.img}"></div>`).join('')}
            </div>
        </div>`;
}

// ==========================================
// 4. DRAG & DROP E AJUDA
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
        erros++; // Conta erro imediatamente
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

    // Encontra um item que ainda está visível (não encaixado)
    const itensRestantes = Array.from(document.querySelectorAll('.drag-item')).filter(el => el.style.visibility !== 'hidden');
    
    if (itensRestantes.length > 0) {
        const itemAjuda = itensRestantes[0];
        const id = itemAjuda.id.replace('drag-', '');
        const slotAjuda = document.getElementById('slot-' + id);

        // Destaca o Objeto E a Sombra simultaneamente
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
