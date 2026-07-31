// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let modoJogo = 'CPU'; // 'CPU' ou 'PVP'
let matchScore = [0, 0]; 
let currentGameNum = 1;

let tabuleiro = []; 
let posBranca = { x: 4, y: 2 }; // e5 

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    /* [ESTILOS GERAIS DA INTERFACE] */
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; }
    .status-pill { background: #6c757d; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 1.1rem; }
    .score-group { display: flex; gap: 10px; }
    .score-box { padding: 5px 12px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1.1rem; min-width: 60px; justify-content: center; }
    .box-v { background: #8cc63f; box-shadow: 0 3px 0 #6da32f; }
    .box-x { background: #ff5a5f; box-shadow: 0 3px 0 #d44348; }

    .btn-play-rect { 
        width: 100%; height: 60px; border-radius: 30px; background: var(--primary-color); 
        color: white; border: none; font-size: 1.2rem; font-weight: 900; 
        text-transform: uppercase; cursor: pointer; display: flex; 
        align-items: center; justify-content: center; gap: 12px; 
        box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-bottom: 10px;
    }

    /* [ESTILOS DO TABULEIRO RASTROS] */
    .rastros-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
        background: #ccc;
        padding: 4px;
        border-radius: 8px;
        width: fit-content;
        margin: 0 auto;
    }
    .cell {
        width: var(--cell-size);
        height: var(--cell-size);
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 1.2rem;
        cursor: default;
        position: relative;
        border-radius: 4px;
        color: #ddd;
    }
    .cell.blocked { background: #444; color: #444; }
    .cell.white-piece { background: white; z-index: 10; }
    .cell.white-piece::after {
        content: '';
        width: 80%;
        height: 80%;
        background: white;
        border: 4px solid var(--primary-color);
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }
    .cell.goal { background: #f8f8f8; color: #994d4d; border: 2px dashed #ccc; }
    .cell.valid-move { background: #e0f0ff; cursor: pointer; border: 2px solid var(--primary-color); color: transparent; }
    .cell.valid-move:hover { background: var(--primary-color); }

    /* [RESPONSIVIDADE DO TABULEIRO] */
    @media screen and (min-width: 1025px) {
        :root { --cell-size: 60px; }
    }
    @media screen and (max-width: 500px) and (orientation: portrait) {
        :root { --cell-size: 11vw; }
    }
    @media screen and (max-height: 500px) and (orientation: landscape) {
        :root { --cell-size: 10vh; }
    }
`;
document.head.appendChild(style);

// ==========================================
// 3. CAPA E MODOS DE JOGO
// ==========================================
function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">${JOGO_CONFIG.nomeDoJogo.toUpperCase()}</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%; max-width:300px;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}icondestaque.png" style="height:100px; margin-bottom:10px;">
            <button class="btn-play-rect" onclick="setModo('CPU')"><i class="fas fa-robot"></i> VS COMPUTADOR</button>
            <button class="btn-play-rect" style="background:#6c757d;" onclick="setModo('PVP')"><i class="fas fa-users"></i> 2 JOGADORES</button>
            <p style="color:var(--text-grey); font-weight:800; text-align:center; font-size:0.9rem;">${JOGO_CONFIG.descricao}<br>(Melhor de 5 Jogos)</p>
        </div>`;
    document.getElementById('shell-footer-content').style.display = 'none';
}

function setModo(modo) {
    modoJogo = modo;
    matchScore = [0, 0];
    currentGameNum = 1;
    iniciarJogo();
}

// ==========================================
// 4. LÓGICA DO TABULEIRO
// ==========================================
function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(7).fill().map(() => Array(7).fill(0));
    posBranca = { x: 4, y: 2 }; // e5
    tabuleiro[posBranca.y][posBranca.x] = 2;
    atualizarUI();
}

function atualizarUI() {
    const p2Label = modoJogo === 'CPU' ? 'COMP' : 'P2';
    document.getElementById('shell-header-content').innerHTML = `
        <div class="status-container">
            <div class="status-pill">JOGO ${currentGameNum}/5</div>
            <div class="score-group">
                <div class="score-box box-v">P1: ${matchScore[0]}</div>
                <div class="score-box box-x">${p2Label}: ${matchScore[1]}</div>
            </div>
        </div>`;
    renderTabuleiro();
}

function renderTabuleiro() {
    const area = document.getElementById('game-content');
    let html = `<div class="rastros-grid">`;
    for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
            let classe = "cell";
            let conteudo = "";
            if (x === 0 && y === 6) { classe += " goal"; conteudo = "1"; }
            if (x === 6 && y === 0) { classe += " goal"; conteudo = "2"; }
            if (tabuleiro[y][x] === 1) classe += " blocked";
            if (tabuleiro[y][x] === 2) classe += " white-piece";
            
            const dx = Math.abs(x - posBranca.x);
            const dy = Math.abs(y - posBranca.y);
            if (tabuleiro[y][x] === 0 && dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0)) {
                classe += " valid-move";
                html += `<div class="${classe}" onclick="moverPeca(${x},${y})"></div>`;
            } else {
                html += `<div class="${classe}">${conteudo}</div>`;
            }
        }
    }
    html += `</div>`;
    area.innerHTML = html;
}

function moverPeca(nx, ny) {
    if (!jogoAtivo) return;
    somClique.play();
    tabuleiro[posBranca.y][posBranca.x] = 1;
    posBranca = { x: nx, y: ny };
    tabuleiro[ny][nx] = 2;

    if (nx === 0 && ny === 6) { finalizarRonda(0); return; }
    if (nx === 6 && ny === 0) { finalizarRonda(1); return; }
    if (getMovimentosPosiveis(nx, ny).length === 0) { finalizarRonda(0); return; }

    if (modoJogo === 'CPU') {
        renderTabuleiro(); // Mostra o movimento do jogador antes da CPU
        setTimeout(cpuJogar, 600);
    } else {
        atualizarUI();
    }
}

function cpuJogar() {
    const moves = getMovimentosPosiveis(posBranca.x, posBranca.y);
    if (moves.length === 0) { finalizarRonda(0); return; }

    // Inteligência básica: tentar chegar a g7(6,0)
    moves.sort((a, b) => Math.hypot(a.x - 6, a.y - 0) - Math.hypot(b.x - 6, b.y - 0));
    const alvo = moves.find(m => m.x === 6 && m.y === 0) || moves[0];

    tabuleiro[posBranca.y][posBranca.x] = 1;
    posBranca = { x: alvo.x, y: alvo.y };
    tabuleiro[alvo.y][alvo.x] = 2;

    if (alvo.x === 6 && alvo.y === 0) { finalizarRonda(1); return; }
    if (getMovimentosPosiveis(alvo.x, alvo.y).length === 0) { finalizarRonda(1); return; }

    atualizarUI();
}

function getMovimentosPosiveis(cx, cy) {
    let possiveis = [];
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            let nx = cx + dx, ny = cy + dy;
            if (nx >= 0 && nx < 7 && ny >= 0 && ny < 7 && tabuleiro[ny][nx] === 0) {
                possiveis.push({ x: nx, y: ny });
            }
        }
    }
    return possiveis;
}

function finalizarRonda(vencedorIdx) {
    jogoAtivo = false;
    matchScore[vencedorIdx]++;
    somAcerto.play();

    if (matchScore[0] >= 3 || matchScore[1] >= 3) {
        setTimeout(() => {
            const rel = JOGO_CONFIG.relatorios[vencedorIdx === 0 ? 0 : 3];
            Engine.showResults(matchScore[0], matchScore[1], 0, rel);
        }, 1000);
    } else {
        setTimeout(() => {
            currentGameNum++;
            iniciarJogo();
        }, 1500);
    }
}

function darAjuda() {
    if (!jogoAtivo) return;
    somClique.play();
    alert("DICA: Bloqueia o caminho do adversário ou tenta chegar ao teu canto!");
}
