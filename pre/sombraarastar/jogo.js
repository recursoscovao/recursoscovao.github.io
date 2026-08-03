// ==========================================
// 1. ESTADO GLOBAL
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0;
let itensNaRonda = [], encaixados = 0;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// ==========================================
// 2. CSS INJETADO (Estilos de Arrastar)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .game-board { display: flex; flex-direction: column; align-items: center; gap: 40px; width: 100%; padding: 20px; }
    
    .drag-container, .drop-container { 
        display: flex; justify-content: center; gap: 15px; width: 100%; flex-wrap: wrap; 
    }

    .drag-item {
        width: 100px; height: 100px; background: white; border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1); cursor: grab;
        display: flex; align-items: center; justify-content: center;
        touch-action: none; z-index: 10; transition: transform 0.2s;
    }
    .drag-item:active { cursor: grabbing; transform: scale(1.1); }
    .drag-item img { max-width: 80%; max-height: 80%; pointer-events: none; }

    .drop-slot {
        width: 110px; height: 110px; border: 3px dashed #ccc; border-radius: 20px;
        display: flex; align-items: center; justify-content: center;
        background: rgba(255,255,255,0.5); position: relative;
    }
    .drop-slot img { max-width: 75%; max-height: 75%; filter: brightness(0); opacity: 0.3; }
    
    /* Quando o item é encaixado corretamente */
    .slot-filled { border: 3px solid #8cc63f; background: #f0fff0; }
    .slot-filled img { filter: none !important; opacity: 1 !important; transition: 0.5s; }

    .dragging { opacity: 0.5; }
    
    @media (max-width: 600px) {
        .drag-item, .drop-slot { width: 80px; height: 80px; }
    }
`;
document.head.appendChild(style);

// ==========================================
// 3. LOGICA DE INÍCIO E SIMULAÇÃO
// ==========================================
function mostrarCapa() {
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="text-align:center; padding: 20px;">
            <div style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">
                <div class="drag-item"><img src="${DADOS_JOGO.caminhoImagens}bola.png"></div>
                <div style="font-size:2rem; align-self:center;">➡️</div>
                <div class="drop-slot"><img src="${DADOS_JOGO.caminhoImagens}bola.png"></div>
            </div>
            <p style="color:var(--text-grey); font-weight:800;">${JOGO_CONFIG.descricao}</p>
        </div>`;
    
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `<button class="btn-play-rect" onclick="iniciarJogo()"><i class="fas fa-play"></i> JOGAR</button>`;
}

function iniciarJogo() {
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0;
    proximaRonda();
}

// ==========================================
// 4. LÓGICA DAS RONDAS
// ==========================================
function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    encaixados = 0;
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);

    // Selecionar 4 itens aleatórios
    itensNaRonda = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5).slice(0, 4);
    
    // Ordem aleatória para os itens de arrastar e para as sombras
    const itensDrag = [...itensNaRonda].sort(() => Math.random() - 0.5);
    const itensDrop = [...itensNaRonda].sort(() => Math.random() - 0.5);

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div class="game-board">
            <div class="drag-container" id="origin">
                ${itensDrag.map(item => `
                    <div class="drag-item" draggable="true" id="drag-${item.id}" ondragstart="drag(event)">
                        <img src="${DADOS_JOGO.caminhoImagens + item.img}">
                    </div>
                `).join('')}
            </div>
            
            <hr style="width:80%; border:1px solid #eee; margin:0;">

            <div class="drop-container">
                ${itensDrop.map(item => `
                    <div class="drop-slot" id="slot-${item.id}" ondrop="drop(event)" ondragover="allowDrop(event)">
                        <img src="${DADOS_JOGO.caminhoImagens + item.img}">
                    </div>
                `).join('')}
            </div>
        </div>`;
}

// ==========================================
// 5. FUNÇÕES DE DRAG & DROP
// ==========================================
function allowDrop(ev) { ev.preventDefault(); }

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    somClique.play();
}

function drop(ev) {
    ev.preventDefault();
    const dragId = ev.dataTransfer.getData("text"); // Ex: drag-15
    const slotId = ev.currentTarget.id; // Ex: slot-15
    
    const realIdDrag = dragId.split('-')[1];
    const realIdSlot = slotId.split('-')[1];

    if (realIdDrag === realIdSlot) {
        // ACERTO
        const dragEl = document.getElementById(dragId);
        const slotEl = document.getElementById(slotId);
        
        somAcerto.play();
        dragEl.style.visibility = "hidden"; // Esconde o original
        slotEl.classList.add('slot-filled');
        
        encaixados++;
        if (encaixados === 4) {
            certos++; // Ganha 1 ponto por ronda completa
            setTimeout(() => {
                rondaAtual++;
                proximaRonda();
            }, 1000);
        }
    } else {
        // ERRO
        somErro.play();
        const slotEl = document.getElementById(slotId);
        slotEl.style.borderColor = "#ff5a5f";
        setTimeout(() => slotEl.style.borderColor = "#ccc", 500);
    }
}

function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++;
    // Encontrar um item que ainda não foi encaixado
    const drags = document.querySelectorAll('.drag-item[style*="visibility: visible"], .drag-item:not([style*="visibility"])');
    if (drags.length > 0) {
        const id = drags[0].id.split('-')[1];
        const slot = document.getElementById('slot-' + id);
        slot.style.boxShadow = "0 0 15px var(--primary-color)";
        setTimeout(() => slot.style.boxShadow = "none", 2000);
    }
}

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, ajudasUsadas, rel);
}

mostrarCapa();
