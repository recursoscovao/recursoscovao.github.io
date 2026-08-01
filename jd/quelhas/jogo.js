// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
let jogoAtivo = false;
let modoJogo = 'CPU';     
let nivelJogo = 1;        
let matchScore = [0, 0];  
let turnoAtual = 0;       
let currentGameNum = 1;   
let tabuleiro = Array(10).fill().map(() => Array(10).fill(0)); 
let startCell = null;     
let primeiraJogadaRealizada = false;
let orientacoes = [0, 1]; // [J1, J2/Pc] -> 0: Vertical, 1: Horizontal
let simuInterval;         

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");
// [FIM DA SECÇÃO 1]

// ============================================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; }
    .status-pill { padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 0.9rem; color: white; transition: 0.3s; }
    .score-group { display: flex; gap: 8px; }
    .score-box { padding: 5px 10px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1rem; min-width: 55px; justify-content: center; }
    
    .box-v, .pill-j1 { background: #8cc63f !important; box-shadow: 0 3px 0 #6da32f; }
    .box-x, .pill-j2 { background: #ff5a5f !important; box-shadow: 0 3px 0 #d44348; }

    /* INDICADORES DE CANTO */
    .indicator-piece { width: 40px; height: 20px; border-radius: 4px; display: none; }
    .indicator-piece.v { width: 20px; height: 40px; }
    .indicator-piece.active { display: block; animation: blinker 1s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.2; } }

    .vitoria-card { background: white; padding: 30px; border-radius: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.15); text-align: center; animation: cardPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.28); }
    @keyframes cardPop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    /* BOTÕES PREMIUM */
    .nivel-select-container { display: none; flex-direction: column; gap: 12px; width: 95%; max-width: 500px; align-items: center; }
    .nivel-row { display: flex; flex-direction: row; gap: 6px; width: 100%; justify-content: center; }
    .btn-nivel {
        background: white; padding: 12px 2px; border-radius: 12px; border: 2px solid #eee;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        cursor: pointer; transition: 0.2s; flex: 1;
    }
    .btn-nivel b { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; }
    .btn-nivel span { font-size: 0.6rem; font-weight: 700; opacity: 0.7; }
    .btn-nivel.l1 { border-color: #8cc63f; color: #8cc63f; }
    .btn-nivel.l2 { border-color: #f9a825; color: #f9a825; }
    .btn-nivel.l3 { border-color: #ff5a5f; color: #ff5a5f; }

    .capa-btn-row { display: flex; flex-direction: row; gap: 10px; width: 95%; max-width: 480px; justify-content: center; align-items: center; margin-top: 10px; }
    .btn-capa-small { flex: 1; height: 50px; border-radius: 12px; border: none; color: white; font-weight: 900; font-size: 0.75rem; cursor: pointer; text-transform: uppercase; }
    .btn-inform { width: 50px; height: 50px; cursor: pointer; }
    .btn-inform img { width: 100%; height: 100%; object-fit: contain; }

    #instrucoes-panel { position: fixed; top: 100vh; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: top 0.5s ease; padding: 40px 25px; overflow-y: auto; }
    #instrucoes-panel.open { top: 0; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.2rem; color: #ff5a5f; cursor: pointer; font-weight: 900; }

    .grid-board { display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; background: #bbb; padding: 3px; border-radius: 8px; width: fit-content; margin: 0 auto; }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 1px; cursor: pointer; }
    .cell.occupied { background: #333 !important; }
    .cell.selected { background: #e8f5e9; border: 2px solid #8cc63f; }

    @media screen and (min-width: 1025px) { :root { --cell-size: 40px; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 8vw; } }
    @media screen and (max-height: 500px) and (orientation: landscape) { :root { --cell-size: 6.5vh; } }
`;
document.head.appendChild(style);

// ============================================================
// 3. CAPA E SELEÇÃO
// ============================================================
function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">${JOGO_CONFIG.nomeDoJogo.toUpperCase()}</h2>`;
    
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `<span class="close-x" onclick="toggleInstructions()">&times;</span>
            <div class="inst-content">
                <div class="inst-header">Como Jogar Quelhas</div>
                <div class="inst-section-title">Objetivo</div>
                <p class="inst-text">Este é um jogo <b>Misere</b>: quem fizer o último lance <b>PERDE</b> o jogo.</p>
                <div class="inst-section-title">Regras</div>
                <ul class="inst-list">
                    <li><b>Vertical:</b> Clica em 2 casas verticais seguidas.</li>
                    <li><b>Horizontal:</b> Clica em 2 casas horizontais seguidas.</li>
                </ul>
            </div>`;
        document.body.appendChild(panel);
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.game-shell').appendChild(feedback);
    }

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board" style="transform: scale(0.65);"></div></div>
        <div id="capa-menu-principal" style="width:100%; display:flex; justify-content:center;">
            <div class="capa-btn-row">
                <div class="btn-inform" onclick="toggleInstructions()"><img src="${JOGO_CONFIG.caminhoIconsMenu}inform.png"></div>
                <button class="btn-capa-small" style="background:var(--primary-color);" onclick="mostrarNiveis('CPU')">COMPUTADOR</button>
                <button class="btn-capa-small" style="background:#6c757d;" onclick="mostrarNiveis('PVP')">2 JOGADORES</button>
            </div>
        </div>
        <div id="nivel-select-container" class="nivel-select-container"></div>
    `;
    document.getElementById('shell-footer-content').style.display = 'none';
    iniciarSimulacao();
}

function mostrarNiveis(modo) {
    document.getElementById('capa-menu-principal').style.display = 'none';
    const container = document.getElementById('nivel-select-container');
    container.style.display = 'flex';
    if (modo === 'CPU') {
        container.innerHTML = `
            <p style="font-weight:800; color:#888; margin-bottom:5px; font-size:0.8rem;">DESAFIO CONTRA PC:</p>
            <div class="nivel-row">
                <div class="btn-nivel l1" onclick="setModo('CPU', 1)"><b>Nível 1</b><span>Fácil</span></div>
                <div class="btn-nivel l2" onclick="setModo('CPU', 2)"><b>Nível 2</b><span>Normal</span></div>
                <div class="btn-nivel l3" onclick="setModo('CPU', 3)"><b>Nível 3</b><span>Difícil</span></div>
            </div>`;
    } else {
        container.innerHTML = `
            <p style="font-weight:800; color:#888; margin-bottom:5px; font-size:0.8rem;">2 JOGADORES:</p>
            <div class="nivel-row">
                <div class="btn-nivel l1" onclick="setModo('PVP', 1)"><b>Nível 1</b><span>Com Dicas</span></div>
                <div class="btn-nivel l2" onclick="setModo('PVP', 2)"><b>Nível 2</b><span>Sem Dicas</span></div>
            </div>`;
    }
}

function toggleInstructions() { somClique.play(); document.getElementById('instrucoes-panel').classList.toggle('open'); }

// ============================================================
// 4. LÓGICA DO JOGO
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval); somClique.play();
    modoJogo = modo; nivelJogo = nivel;
    matchScore = [0, 0]; currentGameNum = 1; orientacoes = [0, 1];
    iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(10).fill().map(() => Array(10).fill(0));
    startCell = null; primeiraJogadaRealizada = false; turnoAtual = 0; 
    document.getElementById('round-feedback').style.display = 'none';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = "Pc";
    const j2Label = "J2";
    const labelBox2 = modoJogo === 'CPU' ? pcLabel : j2Label;
    
    // Header Info
    const nomeVez = (turnoAtual === 0) ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";

    document.getElementById('shell-header-content').innerHTML = `
        <div class="status-container">
            <div class="status-pill ${classPill} blinking">VEZ DO ${nomeVez}</div>
            <div class="score-group">
                <div class="score-box box-v">J1: ${matchScore[0]}</div>
                <div class="score-box box-x">${labelBox2}: ${matchScore[1]}</div>
            </div>
        </div>`;

    const area = document.getElementById('game-content');
    area.innerHTML = "";

    // Contentor Superior (Horizontal - Direita)
    const topWrap = document.createElement('div');
    topWrap.style = "width:100%; display:flex; justify-content:flex-end; padding-right:10px;";
    const pieceH = document.createElement('div');
    pieceH.className = `indicator-piece ${getOrientationPlayer(1) === turnoAtual ? 'active' : ''}`;
    pieceH.style.background = "#ff5a5f";
    topWrap.appendChild(pieceH);
    area.appendChild(topWrap);

    renderTabuleiro(area);

    // Contentor Inferior (Vertical - Esquerda)
    const botWrap = document.createElement('div');
    botWrap.style = "width:100%; display:flex; justify-content:flex-start; padding-left:10px;";
    const pieceV = document.createElement('div');
    pieceV.className = `indicator-piece v ${getOrientationPlayer(0) === turnoAtual ? 'active' : ''}`;
    pieceV.style.background = "#8cc63f";
    botWrap.appendChild(pieceV);
    area.appendChild(botWrap);

    // Botão Troca
    if (primeiraJogadaRealizada && !tabuleiro.flat().includes(2) && modoJogo === 'PVP' && turnoAtual === 1) {
        const btn = document.createElement('button');
        btn.className = "btn-capa-small";
        btn.style = "background:#f9a825; margin:10px auto; width:180px; display:block;";
        btn.innerText = "TROCAR ORIENTAÇÃO";
        btn.onclick = swapOrientations;
        area.appendChild(btn);
    }
}

function getOrientationPlayer(tipo) { return orientacoes.indexOf(tipo); }

function renderTabuleiro(container) {
    let html = `<div class="grid-board">`;
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            let cl = "cell";
            if (tabuleiro[r][c] === 1) cl += " occupied";
            if (startCell && startCell.r === r && startCell.c === c) cl += " selected";
            html += `<div class="${cl}" onclick="handleCellClick(${r},${c})"></div>`;
        }
    }
    container.innerHTML += html + `</div>`;
}

function handleCellClick(r, c) {
    if (!jogoAtivo || (modoJogo === 'CPU' && turnoAtual === 1)) return;
    if (tabuleiro[r][c] !== 0) return;
    if (!startCell) { startCell = { r, c }; somClique.play(); atualizarUI(); }
    else {
        if (validarPeca(startCell.r, startCell.c, r, c, orientacoes[turnoAtual])) {
            colocarPeca(startCell.r, startCell.c, r, c);
            startCell = null; finalizarTurno();
        } else { startCell = { r, c }; somClique.play(); atualizarUI(); }
    }
}

function validarPeca(r1, c1, r2, c2, orient) {
    let rs = Math.min(r1, r2), re = Math.max(r1, r2), cs = Math.min(c1, c2), ce = Math.max(c1, c2);
    if (orient === 0) { if (c1 !== c2 || re - rs < 1) return false; for (let i = rs; i <= re; i++) if (tabuleiro[i][c1] !== 0) return false; }
    else { if (r1 !== r2 || ce - cs < 1) return false; for (let i = cs; i <= ce; i++) if (tabuleiro[r1][i] !== 0) return false; }
    return true;
}

function colocarPeca(r1, c1, r2, c2) {
    let rs = Math.min(r1, r2), re = Math.max(r1, r2), cs = Math.min(c1, c2), ce = Math.max(c1, c2);
    for (let r = rs; r <= re; r++) for (let c = cs; c <= ce; c++) tabuleiro[r][c] = 1;
    primeiraJogadaRealizada = true; somClique.play();
}

function swapOrientations() { 
    somAcerto.play(); orientacoes = [orientacoes[1], orientacoes[0]]; turnoAtual = 0; atualizarUI(); 
}

function finalizarTurno() {
    if (!temLancesLegais(0) && !temLancesLegais(1)) { finalizarRonda(turnoAtual); return; }
    turnoAtual = (turnoAtual === 0) ? 1 : 0;
    atualizarUI();
    if (modoJogo === 'CPU' && turnoAtual === 1) setTimeout(iaControlador, 800);
}

function temLancesLegais(orient) {
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) if (tabuleiro[r][c] === 0) {
        if (orient === 0 && r < 9 && tabuleiro[r+1][c] === 0) return true;
        if (orient === 1 && c < 9 && tabuleiro[r][c+1] === 0) return true;
    }
    return false;
}

function iaControlador() {
    const cpuO = orientacoes[1];
    let moves = [];
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) if (tabuleiro[r][c] === 0) {
        if (cpuO === 0 && r < 9 && tabuleiro[r+1][c] === 0) moves.push({r1:r, c1:c, r2:r+1, c2:c});
        if (cpuO === 1 && c < 9 && tabuleiro[r][c+1] === 0) moves.push({r1:r, c1:c, r2:r, c2:c+1});
    }
    if (moves.length === 0) return;
    let m = moves[Math.floor(Math.random() * moves.length)];
    colocarPeca(m.r1, m.c1, m.r2, m.c2);
    finalizarTurno();
}

function finalizarRonda(perdedorIdx) {
    jogoAtivo = false;
    let vencedorIdx = perdedorIdx === 0 ? 1 : 0;
    matchScore[vencedorIdx]++; somAcerto.play();
    const overlay = document.getElementById('round-feedback');
    const nomeV = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="vitoria-card"><h1 style="color:#8cc63f;">${nomeV}</h1><p>Ganhou a ronda!</p></div>`;
    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 2000);
    else setTimeout(() => { currentGameNum++; iniciarJogo(); }, 2000);
}

function finalizarMatch() {
    document.getElementById('round-feedback').style.display = 'none';
    const vIdx = matchScore[0] >= 3 ? 0 : 1;
    const nomeV = vIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color);">RESULTADOS FINAIS</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:120px;">
            <h2 style="color:var(--primary-color); text-transform:uppercase;">${nomeV} VENCEU!</h2>
        </div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `<button class="btn-capa-small" style="background:#6c757d; flex:1;" onclick="location.reload()">REPETIR</button>
                        <button class="btn-capa-small" style="background:var(--primary-color); flex:1;" onclick="window.history.back()">SAIR</button>`;
}

function iniciarSimulacao() {
    clearInterval(simuInterval);
    const board = document.getElementById('simu-board');
    let sTab = Array(10).fill().map(() => Array(10).fill(0));
    let sTurno = 0;
    simuInterval = setInterval(() => {
        let leg = [];
        for(let r=0; r<10; r++) for(let c=0; c<10; c++) {
            if(sTurno===0 && r<9 && sTab[r][c]===0 && sTab[r+1][c]===0) leg.push({r,c,r2:r+1,c2:c});
            if(sTurno===1 && c<9 && sTab[r][c]===0 && sTab[r][c+1]===0) leg.push({r,c,r2:r,c2:c+1});
        }
        if (leg.length === 0) { sTab = Array(10).fill().map(() => Array(10).fill(0)); sTurno = 0; }
        else { let m = leg[Math.floor(Math.random() * leg.length)]; sTab[m.r][m.c] = 1; sTab[m.r2][m.c2] = 1; sTurno = (sTurno === 0) ? 1 : 0; }
        let h = `<div class="grid-board" style="opacity:0.4; pointer-events:none;">`;
        for(let r=0;r<10;r++) for(let c=0;c<10;c++) h+=`<div class="cell ${sTab[r][c]===1?'occupied':''}" style="width:18px; height:18px;"></div>`;
        if(board) board.innerHTML = h + `</div>`;
    }, 600);
}
