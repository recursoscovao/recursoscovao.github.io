// ============================================================
// === INÍCIO SECÇÃO 1: ESTADO GLOBAL E SONS ===
// ============================================================
let jogoAtivo = false;
let modoJogo = 'CPU';     
let nivelJogo = 1;        
let matchScore = [0, 0];  
let turnoAtual = 0;       
let tabuleiro = [];       
let selectedPiece = null; 
let simuInterval;         

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");
// === FIM SECÇÃO 1 ===

// ============================================================
// === INÍCIO SECÇÃO 2: CONFIGURAÇÃO VISUAL / CSS ===
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    #game-content { 
        display: flex; flex-direction: column; align-items: center; 
        width: 100%; height: auto; min-height: 450px;
        padding: 20px 10px; box-sizing: border-box; 
    }

    #simu-container { 
        width: 100%; display: flex; align-items: center; justify-content: center; 
        min-height: 200px; margin-bottom: 20px; 
    }

    #capa-menu-principal, #nivel-select-container { 
        width: 100%; display: flex; flex-direction: column; align-items: center; gap: 15px; 
    }

    .capa-btn-row, .nivel-row { 
        display: flex; flex-direction: row; gap: 12px; width: 100%; max-width: 500px; justify-content: center; 
    }
    
    .btn-capa-small { flex: 1; height: 55px; border-radius: 15px; border: none; color: white; font-weight: 900; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 0 rgba(0,0,0,0.1); text-transform: uppercase; }
    .btn-inform { width: 55px; height: 55px; border-radius: 15px; background: white; border: 2px solid #eee; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 0 rgba(0,0,0,0.05); }
    .btn-inform img { width: 60%; height: 60%; object-fit: contain; }

    /* INSTRUÇÕES PREMIUM */
    #instrucoes-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: transform 0.5s ease; transform: translateY(100%); visibility: hidden; overflow-y: auto; }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: sticky; top: 20px; float: right; margin-right: 25px; font-size: 3rem; color: #ff5a5f; cursor: pointer; font-weight: 900; z-index: 10001; }
    .inst-content { max-width: 700px; margin: 0 auto; text-align: left; padding: 60px 25px; }

    /* TABULEIRO: Usa vmin para nunca transbordar */
    .grid-board { 
        display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; 
        background: #bbb; padding: 6px; border-radius: 12px; margin: auto; 
        width: fit-content; box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
    }
    .cell { 
        width: var(--cell-size); height: var(--cell-size); 
        background: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; 
    }
    .piece { width: 85%; height: 85%; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    .piece.white { background: radial-gradient(circle at 30% 30%, #fff, #ddd); border: 1px solid #eee; }
    .piece.black { background: radial-gradient(circle at 30% 30%, #555, #111); }

    /* --- RESPONSIVIDADE TOTAL --- */
    
    /* PC / TABLET HORIZONTAL */
    @media screen and (orientation: landscape) {
        :root { --cell-size: min(50px, 10vh); }
        #game-content { flex-direction: row; gap: 40px; justify-content: center; }
        #simu-container { width: auto; flex: none; margin-bottom: 0; }
        #capa-menu-principal, #nivel-select-container { width: 280px; }
        .capa-btn-row, .nivel-row { flex-direction: column; }
    }

    /* TABLET / TELEMÓVEL VERTICAL */
    @media screen and (orientation: portrait) {
        :root { --cell-size: min(60px, 11vw); }
        #game-content { flex-direction: column; }
        .capa-btn-row { flex-direction: column; padding: 0 20px; }
        .btn-inform { width: 100%; height: 60px; order: -1; }
        .btn-capa-small { height: 65px; width: 100%; }
        .nivel-row { flex-direction: row; padding: 0 20px; }
    }

    .blinking { animation: blinker 1.5s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.4; } }
`;
document.head.appendChild(style);
// === FIM SECÇÃO 2 ===

// [Funções mostrarCapa, mostrarNiveis, toggleInstructions permanecem com a tua lógica mas atualizadas para o novo CSS]

function toggleInstructions() { 
    somClique.play(); 
    const p = document.getElementById('instrucoes-panel');
    const isOpening = !p.classList.contains('open');
    p.classList.toggle('open');
    document.body.style.overflow = isOpening ? 'hidden' : 'auto';
}

function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; font-size:1.2rem;">${JOGO_CONFIG.nomeDoJogo.toUpperCase()}</h2>`;
    
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `<span class="close-x" onclick="toggleInstructions()">&times;</span><div class="inst-content"><h2 class="inst-header">Como Jogar</h2><p>Leva uma peça até à última linha adversária para vencer!</p></div>`;
        document.body.appendChild(panel);
    }

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board"></div></div>
        <div id="capa-menu-principal">
            <div class="capa-btn-row">
                <div class="btn-inform" onclick="toggleInstructions()"><img src="${JOGO_CONFIG.caminhoIconsMenu}inform.png"></div>
                <button class="btn-capa-small" style="background:var(--primary-color);" onclick="mostrarNiveis('CPU')"><i class="fas fa-robot"></i> COMPUTADOR</button>
                <button class="btn-capa-small" style="background:#6c757d;" onclick="mostrarNiveis('PVP')"><i class="fas fa-users"></i> 2 JOGADORES</button>
            </div>
        </div>
    `;
    iniciarSimulacao();
}

function mostrarNiveis(modo) {
    somClique.play();
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board"></div></div>
        <div id="nivel-select-container">
            <p style="font-weight:800; color:#888; text-transform:uppercase; margin-bottom:5px;">Dificuldade:</p>
            <div class="nivel-row">
                <button class="btn-capa-small" onclick="setModo('${modo}', 1)" style="background:#8cc63f;">FÁCIL</button>
                <button class="btn-capa-small" onclick="setModo('${modo}', 2)" style="background:#ff5a5f;">DIFÍCIL</button>
            </div>
            <div class="capa-btn-row"><button class="btn-capa-small" onclick="voltarCapa()" style="background:#6c757d; width:100%;">VOLTAR</button></div>
        </div>
    `;
    iniciarSimulacao(); 
}

function voltarCapa() { somClique.play(); mostrarCapa(); }

function setModo(modo, nivel) {
    clearInterval(simuInterval); somClique.play();
    modoJogo = modo; nivelJogo = nivel;
    matchScore = [0, 0]; turnoAtual = 0; 
    iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(7).fill().map(() => Array(7).fill(0));
    for(let c=0; c<7; c++) { tabuleiro[0][c] = 2; tabuleiro[6][c] = 1; }
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = modoJogo === 'CPU' ? "Pc" : "J2";
    const nomeVez = (turnoAtual === 0) ? "Jogador 1" : (modoJogo === 'CPU' ? "Computador" : "Jogador 2");
    Engine.showStatusBar(nomeVez, matchScore[0], matchScore[1], pcLabel);
    const area = document.getElementById('game-content');
    area.innerHTML = "";
    const boardEl = document.createElement('div');
    boardEl.className = "grid-board";
    for(let r=0; r<7; r++) {
        for(let c=0; c<7; c++) {
            const cell = document.createElement('div');
            cell.className = "cell";
            if(tabuleiro[r][c] === 1) cell.innerHTML = '<div class="piece white"></div>';
            if(tabuleiro[r][c] === 2) cell.innerHTML = '<div class="piece black"></div>';
            cell.onclick = () => handleCellClick(r, c);
            boardEl.appendChild(cell);
        }
    }
    area.appendChild(boardEl);
}

function handleCellClick(r, c) {
    if(!jogoAtivo) return;
    tabuleiro[r][c] = turnoAtual === 0 ? 1 : 2;
    turnoAtual = turnoAtual === 0 ? 1 : 0;
    atualizarUI();
}

function iniciarSimulacao() {
    clearInterval(simuInterval);
    const board = document.getElementById('simu-board');
    if(!board) return;
    simuInterval = setInterval(() => {
        board.innerHTML = `<div class="grid-board" style="opacity:0.2;">` + 
            Array(49).fill().map(() => `<div class="cell"></div>`).join('') + `</div>`;
    }, 1000);
}
