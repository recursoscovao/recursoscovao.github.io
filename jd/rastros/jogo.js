// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let modoJogo = 'CPU'; 
let matchScore = [0, 0]; 
let turnoAtual = 0; 
let currentGameNum = 1;
let tabuleiro = []; 
let posBranca = { x: 4, y: 2 }; 
let simuInterval; // Intervalo da simulação da capa

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; }
    .status-pill { background: #6c757d; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 1rem; }
    .score-group { display: flex; gap: 8px; }
    .score-box { padding: 5px 10px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1rem; min-width: 55px; justify-content: center; }
    .box-v { background: #8cc63f; box-shadow: 0 3px 0 #6da32f; }
    .box-x { background: #ff5a5f; box-shadow: 0 3px 0 #d44348; }

    @keyframes blinker { 50% { opacity: 0.2; } }
    .blinking { animation: blinker 1s linear infinite; background: var(--primary-color) !important; }

    /* LINHA DE BOTÕES DA CAPA */
    .capa-btn-row { 
        display: flex; 
        flex-direction: row; 
        gap: 8px; 
        width: 100%; 
        max-width: 450px; 
        justify-content: center; 
        align-items: center;
        margin-top: 10px;
    }
    .btn-capa-small {
        flex: 1; height: 55px; border-radius: 20px; border: none;
        color: white; font-weight: 900; font-size: 0.9rem; cursor: pointer;
        display: flex; align-items: center; justify-content: center; gap: 6px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-transform: uppercase;
    }
    .btn-inform { width: 55px; flex: none; background: #fff; border: 2px solid #ddd; }
    .btn-inform img { width: 30px; height: 30px; }

    /* PAINEL DE INSTRUÇÕES (OVERLAY) */
    #instrucoes-panel {
        position: absolute; bottom: -100%; left: 0; width: 100%; height: 100%;
        background: white; z-index: 5000; transition: bottom 0.4s ease;
        padding: 30px 20px; overflow-y: auto; display: flex; flex-direction: column;
    }
    #instrucoes-panel.open { bottom: 0; }
    #instrucoes-panel h3 { color: var(--primary-color); text-transform: uppercase; margin-bottom: 15px; border-bottom: 2px dashed #eee; padding-bottom: 5px; }
    #instrucoes-panel p, #instrucoes-panel li { color: #666; font-size: 0.95rem; line-height: 1.4; margin-bottom: 8px; text-align: left;}

    /* TABULEIRO */
    .rastros-grid {
        display: grid; grid-template-columns: repeat(7, 1fr);
        gap: 4px; background: #ccc; padding: 4px; border-radius: 8px;
        width: fit-content; margin: 0 auto;
    }
    .cell {
        width: var(--cell-size); height: var(--cell-size);
        background: white; display: flex; align-items: center; justify-content: center;
        font-weight: 900; font-size: 1.2rem; position: relative; border-radius: 4px; color: #ddd;
    }
    .cell.blocked { background: #444; color: #444; }
    .cell.white-piece { background: white; z-index: 10; }
    .cell.white-piece::after {
        content: ''; width: 80%; height: 80%; background: white;
        border: 4px solid var(--primary-color); border-radius: 50%;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }
    .cell.goal { background: #f8f8f8; color: #994d4d; border: 2px dashed #ccc; }
    .cell.valid-move { background: #e0f0ff; cursor: pointer; border: 2px solid var(--primary-color); color: transparent; }
    .cell.valid-move:hover { background: var(--primary-color); }

    @media screen and (min-width: 1025px) { :root { --cell-size: 60px; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 11vw; } }
    @media screen and (max-height: 500px) and (orientation: landscape) { :root { --cell-size: 10vh; } }
`;
document.head.appendChild(style);

// ==========================================
// 3. CAPA COM SIMULAÇÃO
// ==========================================
function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">${JOGO_CONFIG.nomeDoJogo.toUpperCase()}</h2>`;
    
    // Criar o painel de instruções se não existir
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `
            <div style="max-width:500px; margin: 0 auto;">
                <h3>Como Jogar Rastros</h3>
                <p>O Rastros é um jogo de estratégia para dois jogadores num tabuleiro 7x7.</p>
                <p><b>Objetivo:</b> Ganha quem levar a peça branca à sua casa final (Canto 1 para o J1, Canto 2 para o J2) ou quem conseguir bloquear o adversário.</p>
                <p><b>Regras:</b></p>
                <ul>
                    <li>A peça branca começa em <b>e5</b>.</li>
                    <li>Cada jogador desloca a peça para um quadrado vazio adjacente (em qualquer direção).</li>
                    <li>Onde a peça branca estava, fica agora uma <b>peça negra</b> (bloqueada).</li>
                    <li>Ninguém pode voltar a passar por casas com peças negras.</li>
                </ul>
                <button class="btn-play-rect" style="margin-top:20px;" onclick="toggleInstructions()">ENTENDI!</button>
            </div>
        `;
        document.querySelector('.game-shell').appendChild(panel);
    }

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container" style="transform: scale(0.7); margin-top: -30px;"></div>
        <div class="capa-btn-row">
            <button class="btn-inform" onclick="toggleInstructions()">
                <img src="${JOGO_CONFIG.caminhoIconsMenu}inform.png">
            </button>
            <button class="btn-capa-small" style="background:var(--primary-color);" onclick="setModo('CPU')">
                <i class="fas fa-robot"></i> COMPUTADOR
            </button>
            <button class="btn-capa-small" style="background:#6c757d;" onclick="setModo('PVP')">
                <i class="fas fa-users"></i> 2 JOGADORES
            </button>
        </div>
    `;
    
    document.getElementById('shell-footer-content').style.display = 'none';
    iniciarSimulacao();
}

function toggleInstructions() {
    document.getElementById('instrucoes-panel').classList.toggle('open');
}

function iniciarSimulacao() {
    clearInterval(simuInterval);
    const container = document.getElementById('simu-container');
    let sTab = Array(7).fill().map(() => Array(7).fill(0));
    let sPos = { x: 4, y: 2 };
    sTab[sPos.y][sPos.x] = 2;

    const renderSimu = () => {
        let html = `<div class="rastros-grid" style="pointer-events:none; opacity:0.6;">`;
        for (let y = 0; y < 7; y++) {
            for (let x = 0; x < 7; x++) {
                let cl = "cell";
                if (x === 0 && y === 6) cl += " goal";
                if (x === 6 && y === 0) cl += " goal";
                if (sTab[y][x] === 1) cl += " blocked";
                if (sTab[y][x] === 2) cl += " white-piece";
                html += `<div class="${cl}"></div>`;
            }
        }
        container.innerHTML = html + `</div>`;
    };

    const step = () => {
        let moves = [];
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                let nx = sPos.x + dx, ny = sPos.y + dy;
                if (nx >= 0 && nx < 7 && ny >= 0 && ny < 7 && sTab[ny][nx] === 0 && !(dx === 0 && dy === 0)) moves.push({x:nx, y:ny});
            }
        }
        if (moves.length === 0 || Math.random() > 0.9) { 
            sTab = Array(7).fill().map(() => Array(7).fill(0));
            sPos = { x: 4, y: 2 };
            sTab[sPos.y][sPos.x] = 2;
        } else {
            let m = moves[Math.floor(Math.random() * moves.length)];
            sTab[sPos.y][sPos.x] = 1;
            sPos = m;
            sTab[sPos.y][sPos.x] = 2;
        }
        renderSimu();
    };

    simuInterval = setInterval(step, 1000);
    renderSimu();
}

// ==========================================
// 4. LÓGICA DO JOGO
// ==========================================
function setModo(modo) {
    clearInterval(simuInterval);
    modoJogo = modo;
    matchScore = [0, 0];
    currentGameNum = 1;
    turnoAtual = 0; 
    iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(7).fill().map(() => Array(7).fill(0));
    posBranca = { x: 4, y: 2 }; 
    tabuleiro[posBranca.y][posBranca.x] = 2;
    atualizarUI();
}

function atualizarUI() {
    const p2Label = modoJogo === 'CPU' ? 'COMP' : 'P2';
    let turnInfoHTML = "";

    if (modoJogo === 'CPU') {
        if (turnoAtual === 0) turnInfoHTML = `<div class="status-pill blinking">SUA VEZ (J1)</div>`;
        else turnInfoHTML = `<div style="flex:1"></div>`;
    } else {
        const nomeVez = turnoAtual === 0 ? "JOGADOR 1" : "JOGADOR 2";
        turnInfoHTML = `<div class="status-pill blinking">VEZ DO ${nomeVez}</div>`;
    }

    document.getElementById('shell-header-content').innerHTML = `
        <div class="status-container">
            ${turnInfoHTML}
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
            const humanoPodeJogar = (turnoAtual === 0) || (turnoAtual === 1 && modoJogo === 'PVP');

            if (humanoPodeJogar && tabuleiro[y][x] === 0 && dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0)) {
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
    if (getMovimentosPosiveis(nx, ny).length === 0) {
        finalizarRonda(turnoAtual); 
        return;
    }

    turnoAtual = turnoAtual === 0 ? 1 : 0;
    if (modoJogo === 'CPU' && turnoAtual === 1) {
        atualizarUI();
        setTimeout(cpuJogar, 600);
    } else {
        atualizarUI();
    }
}

function cpuJogar() {
    const moves = getMovimentosPosiveis(posBranca.x, posBranca.y);
    if (moves.length === 0) { finalizarRonda(0); return; }
    moves.sort((a, b) => Math.hypot(a.x - 6, a.y - 0) - Math.hypot(b.x - 6, b.y - 0));
    const alvo = moves.find(m => m.x === 6 && m.y === 0) || moves[0];
    tabuleiro[posBranca.y][posBranca.x] = 1;
    posBranca = { x: alvo.x, y: alvo.y };
    tabuleiro[alvo.y][alvo.x] = 2;
    if (alvo.x === 6 && alvo.y === 0) { finalizarRonda(1); return; }
    if (getMovimentosPosiveis(alvo.x, alvo.y).length === 0) { finalizarRonda(1); return; }
    turnoAtual = 0;
    atualizarUI();
}

function getMovimentosPosiveis(cx, cy) {
    let possiveis = [];
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            let nx = cx + dx, ny = cy + dy;
            if (nx >= 0 && nx < 7 && ny >= 0 && ny < 7 && tabuleiro[ny][nx] === 0) possiveis.push({ x: nx, y: ny });
        }
    }
    return possiveis;
}

function finalizarRonda(vencedorIdx) {
    jogoAtivo = false;
    matchScore[vencedorIdx]++;
    somAcerto.play();
    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 1000);
    else setTimeout(() => { currentGameNum++; turnoAtual = 0; iniciarJogo(); }, 1500);
}

function finalizarMatch() {
    const vencedorIdx = matchScore[0] >= 3 ? 0 : 1;
    const nomeVencedor = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "COMPUTADOR" : "JOGADOR 2");
    const p2Label = modoJogo === 'CPU' ? 'COMP' : 'P2';
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">RESULTADOS FINAIS</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:150px; margin-bottom:10px;">
            <h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase; margin-bottom:20px;">GANHOU O ${nomeVencedor}</h2>
            <div style="display:flex; justify-content:center; gap:20px;">
                <div class="score-box box-v" style="padding:10px 20px; font-size:1.2rem;">JOGADOR 1: ${matchScore[0]}</div>
                <div class="score-box box-x" style="padding:10px 20px; font-size:1.2rem;">${p2Label}: ${matchScore[1]}</div>
            </div>
        </div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `<button class="btn-play-rect" style="background:#6c757d" onclick="location.reload()">REPETIR</button>
                        <button class="btn-play-rect" onclick="window.history.back()">SAIR</button>`;
}
