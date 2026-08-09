// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
let jogoAtivo = false;
let modoJogo = 'CPU';     
let nivelJogo = 1;        
let mostrarDicas = true;  
let matchScore = [0, 0];  // [Brancas J1, Negras J2/Pc]
let turnoAtual = 0;       // 0: Brancas (J1), 1: Negras (J2/Pc)
let currentGameNum = 1;   
let tabuleiro = [];       
let selectedPiece = null; 
let simuInterval;         

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// ============================================================
// 2. CONFIGURAÇÃO VISUAL (OTIMIZADA PARA TABLETS)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 2px 5px; }
    .status-pill { padding: 8px 18px; border-radius: 10px; font-weight: 800; font-size: 1rem; color: white; display: flex; align-items: center; gap: 10px; }
    .score-group { display: flex; gap: 8px; }
    .score-box { padding: 8px 12px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1.1rem; min-width: 65px; justify-content: center; }
    
    .pill-j1, .box-v { background: #8cc63f !important; box-shadow: 0 3px 0 #6da32f; }
    .pill-j2, .box-x { background: #444 !important; box-shadow: 0 3px 0 #222; }
    
    .blinking { animation: blinker 1s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.4; } }

    /* Capa e Simulação */
    #simu-container { height: 350px; display: flex; align-items: center; justify-content: center; width: 100%; overflow: visible; margin-bottom: 20px; }
    #simu-board { transition: 0.3s; }

    .capa-btn-row { display: flex; flex-direction: row; gap: 15px; width: 95%; max-width: 600px; justify-content: center; align-items: center; flex-wrap: wrap; }
    .btn-capa-small { flex: 1; min-width: 160px; height: 60px; border-radius: 15px; border: none; color: white; font-weight: 900; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 5px 0 rgba(0,0,0,0.1); text-transform: uppercase; }
    .btn-inform { width: 60px; height: 60px; cursor: pointer; flex: none; }
    .btn-inform img { width: 100%; height: 100%; object-fit: contain; }

    .nivel-select-container { display: none; flex-direction: column; gap: 15px; width: 95%; max-width: 500px; align-items: center; }
    .nivel-row { display: flex; flex-direction: row; gap: 15px; width: 100%; justify-content: center; }
    .btn-nivel { background: white; padding: 20px 5px; border-radius: 15px; border: 2px solid #eee; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; flex: 1; }
    .btn-nivel b { font-size: 1rem; font-weight: 900; text-transform: uppercase; }
    .btn-nivel span { font-size: 0.75rem; font-weight: 700; opacity: 0.7; }
    .btn-nivel.l1 { border-color: #8cc63f; color: #8cc63f; }
    .btn-nivel.l2 { border-color: #ff5a5f; color: #ff5a5f; }
    
    .btn-voltar-nivel { height: 60px !important; background: #6c757d !important; width: 180px; margin-top: 10px; border-radius: 15px; color: white; font-weight: 900; border: none; cursor: pointer; }

    /* Instruções */
    #instrucoes-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: transform 0.5s ease; transform: translateY(100%); visibility: hidden; padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0; }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 3rem; color: #ff5a5f; cursor: pointer; font-weight: 900; }
    
    /* Tabuleiro Principal */
    .grid-board { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; background: #bbb; padding: 8px; border-radius: 15px; width: fit-content; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 5px; position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .cell.selected { background: #fff9c4 !important; border: 3px solid #fbc02d; }
    .cell.hint::after { content: ''; width: 30%; height: 30%; background: #8cc63f; border-radius: 50%; opacity: 0.5; }

    .piece { width: 85%; height: 85%; border-radius: 50%; border: 2px solid rgba(0,0,0,0.1); box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: 0.2s; }
    .piece.white { background: radial-gradient(circle at 30% 30%, #fff, #ddd); border-color: #ccc; }
    .piece.black { background: radial-gradient(circle at 30% 30%, #555, #111); border-color: #000; }

    #round-feedback { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(8px); z-index: 1000; display: none; align-items: center; justify-content: center; border-radius: 35px; }
    .vitoria-card { background: white; padding: 40px; border-radius: 35px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); text-align: center; width: 85%; max-width: 450px; }

    /* ============================================================
       RESPONSIVIDADE DAS CASAS (TABLET FOCUS)
       ============================================================ */
    
    /* 1. PC */
    @media screen and (min-width: 1025px) { 
        :root { --cell-size: 70px; } 
    }

    /* 2. TABLET VERTICAL (Aumentado para preencher melhor) */
    @media screen and (min-width: 501px) and (max-width: 1024px) and (orientation: portrait) {
        :root { --cell-size: 13vw; } 
        #simu-container { height: 450px; }
        #simu-board { transform: scale(1.4); } /* Simulação muito maior no tablet */
        .grid-board { gap: 8px; padding: 12px; }
        .status-pill { font-size: 1.2rem; padding: 12px 25px; }
    }

    /* 3. TELEMÓVEL VERTICAL */
    @media screen and (max-width: 500px) and (orientation: portrait) { 
        :root { --cell-size: 11.5vw; } 
        #simu-container { height: 260px; }
        #simu-board { transform: scale(1); }
    }

    /* 4. LANDSCAPE (Geral) */
    @media screen and (max-height: 600px) and (orientation: landscape) { 
        :root { --cell-size: 11vh; }
        #simu-container { height: 200px; }
        #simu-board { transform: scale(0.85); }
    }
`;
document.head.appendChild(style);

// ============================================================
// 3. CAPA E INSTRUÇÕES
// ============================================================
function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">${JOGO_CONFIG.nomeDoJogo.toUpperCase()}</h2>`;
    
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `
            <span class="close-x" onclick="toggleInstructions()">&times;</span>
            <div class="inst-content">
                <div class="inst-header">Instruções: Avanço</div>
                <div class="inst-section-title">Objetivo</div>
                <p class="inst-text">Chegar com qualquer uma das tuas peças à primeira linha do adversário.</p>
                <div class="inst-section-title">Regras</div>
                <ul class="inst-list">
                    <li><b>Vertical:</b> Move 1 casa se estiver vazia.</li>
                    <li><b>Diagonal:</b> Move para vazia ou captura adversária.</li>
                </ul>
                <div style="height:40px;"></div>
            </div>`;
        document.body.appendChild(panel);
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.game-shell').appendChild(feedback);
    }

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board"></div></div>
        <div id="capa-menu-principal" style="width:100%; display:flex; flex-direction:column; align-items:center;">
            <div class="capa-btn-row">
                <div class="btn-inform" onclick="toggleInstructions()"><img src="${JOGO_CONFIG.caminhoIconsMenu}inform.png"></div>
                <button class="btn-capa-small" style="background:var(--primary-color);" onclick="mostrarNiveis('CPU')"><i class="fas fa-robot"></i> COMPUTADOR</button>
                <button class="btn-capa-small" style="background:#6c757d;" onclick="mostrarNiveis('PVP')"><i class="fas fa-users"></i> 2 JOGADORES</button>
            </div>
        </div>
        <div id="nivel-select-container" class="nivel-select-container"></div>
    `;
    document.getElementById('shell-footer-content').style.display = 'none';
    iniciarSimulacao();
}

function mostrarNiveis(modo) {
    somClique.play();
    document.getElementById('capa-menu-principal').style.display = 'none';
    const container = document.getElementById('nivel-select-container');
    container.style.display = 'flex';
    container.innerHTML = `
        <p style="font-weight:800; color:#888; margin-bottom:10px; text-transform:uppercase;">Dificuldade:</p>
        <div class="nivel-row">
            <div class="btn-nivel l1" onclick="setModo('${modo}', 1)"><b>Fácil</b></div>
            <div class="btn-nivel l2" onclick="setModo('${modo}', 2)"><b>Difícil</b></div>
        </div>
        <button class="btn-capa-small btn-voltar-nivel" onclick="voltarCapa()">VOLTAR</button>`;
}

function voltarCapa() { somClique.play(); document.getElementById('capa-menu-principal').style.display = 'flex'; document.getElementById('nivel-select-container').style.display = 'none'; }
function toggleInstructions() { somClique.play(); document.getElementById('instrucoes-panel').classList.toggle('open'); }

// ============================================================
// 4. LÓGICA CORE
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval); somClique.play();
    modoJogo = modo; nivelJogo = nivel;
    mostrarDicas = (nivel === 1);
    matchScore = [0, 0]; currentGameNum = 1; turnoAtual = 0; 
    iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    selectedPiece = null;
    tabuleiro = Array(7).fill().map(() => Array(7).fill(0));
    for(let c=0; c<7; c++) { tabuleiro[0][c] = 2; tabuleiro[1][c] = 2; tabuleiro[5][c] = 1; tabuleiro[6][c] = 1; }
    document.getElementById('round-feedback').style.display = 'none';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = modoJogo === 'CPU' ? "Pc" : "J2";
    const nomeVez = (turnoAtual === 0) ? "J1" : (modoJogo === 'CPU' ? "Pc" : "J2");
    const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";
    document.getElementById('shell-header-content').innerHTML = `
        <div class="status-container">
            <div class="status-pill ${classPill} blinking">VEZ DE: ${nomeVez}</div>
            <div class="score-group"><div class="score-box box-v">J1: ${matchScore[0]}</div><div class="score-box box-x">${pcLabel}: ${matchScore[1]}</div></div>
        </div>`;
    const area = document.getElementById('game-content');
    area.innerHTML = "";
    const boardEl = document.createElement('div');
    boardEl.className = "grid-board";
    for(let r=0; r<7; r++) {
        for(let c=0; c<7; c++) {
            const cell = document.createElement('div');
            cell.className = "cell";
            if(selectedPiece && selectedPiece.r === r && selectedPiece.c === c) cell.classList.add('selected');
            if(mostrarDicas && selectedPiece && getLegalMoves(selectedPiece.r, selectedPiece.c).some(m => m.r === r && m.c === c)) cell.classList.add('hint');
            if(tabuleiro[r][c] === 1) cell.innerHTML = '<div class="piece white"></div>';
            if(tabuleiro[r][c] === 2) cell.innerHTML = '<div class="piece black"></div>';
            cell.onclick = () => handleCellClick(r, c);
            boardEl.appendChild(cell);
        }
    }
    area.appendChild(boardEl);
}

function handleCellClick(r, c) {
    if(!jogoAtivo || (modoJogo === 'CPU' && turnoAtual === 1)) return;
    const piece = tabuleiro[r][c];
    if(piece === (turnoAtual === 0 ? 1 : 2)) {
        selectedPiece = {r, c}; somClique.play(); atualizarUI();
    } else if(selectedPiece) {
        const moves = getLegalMoves(selectedPiece.r, selectedPiece.c);
        if(moves.find(m => m.r === r && m.c === c)) executarMovimento(selectedPiece.r, selectedPiece.c, r, c);
        else { selectedPiece = null; atualizarUI(); }
    }
}

function getLegalMoves(r, c) {
    const player = tabuleiro[r][c];
    if(player === 0) return [];
    let moves = [];
    const step = (player === 1) ? -1 : 1;
    const opponent = (player === 1) ? 2 : 1;
    if(r + step >= 0 && r + step < 7) {
        if(tabuleiro[r + step][c] === 0) moves.push({r: r + step, c: c});
        [c-1, c+1].forEach(nc => {
            if(nc >= 0 && nc < 7 && (tabuleiro[r+step][nc] === 0 || tabuleiro[r+step][nc] === opponent)) moves.push({r:r+step, c:nc});
        });
    }
    return moves;
}

function executarMovimento(fr, fc, tr, tc) {
    const p = tabuleiro[fr][fc];
    tabuleiro[fr][fc] = 0; tabuleiro[tr][tc] = p;
    selectedPiece = null; somClique.play();
    if((p === 1 && tr === 0) || (p === 2 && tr === 6)) { finalizarRonda(turnoAtual); return; }
    turnoAtual = (turnoAtual === 0) ? 1 : 0;
    atualizarUI();
    if(modoJogo === 'CPU' && turnoAtual === 1) setTimeout(iaControlador, 800);
}

function iaControlador() {
    let allMoves = [];
    for(let r=0; r<7; r++) for(let c=0; c<7; c++) if(tabuleiro[r][c] === 2) getLegalMoves(r,c).forEach(m => allMoves.push({fr:r, fc:c, tr:m.r, tc:m.c}));
    if(allMoves.length === 0) return;
    let m;
    if(nivelJogo === 2) {
        const win = allMoves.find(mv => mv.tr === 6);
        const capture = allMoves.find(mv => tabuleiro[mv.tr][mv.tc] === 1);
        m = win || capture || allMoves[Math.floor(Math.random() * allMoves.length)];
    } else m = allMoves[Math.floor(Math.random() * allMoves.length)];
    executarMovimento(m.fr, m.fc, m.tr, m.tc);
}

// ============================================================
// 5. FINALIZAÇÃO
// ============================================================
function finalizarRonda(vencedorIdx) {
    jogoAtivo = false; matchScore[vencedorIdx]++; somAcerto.play();
    const overlay = document.getElementById('round-feedback');
    const nomeV = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="vitoria-card"><h1 style="color:#8cc63f; font-size:2.5rem; font-weight:900;">${nomeV}</h1><p>Ganhou a ronda!</p><div style="margin-top:15px; font-weight:800; font-size:1.2rem;">PLACAR: J1 ${matchScore[0]} - ${matchScore[1]} ${modoJogo==='CPU'?'Pc':'J2'}</div></div>`;
    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 2000);
    else setTimeout(() => { currentGameNum++; iniciarJogo(); }, 2000);
}

function finalizarMatch() {
    document.getElementById('round-feedback').style.display = 'none';
    const vencedorIdx = matchScore[0] >= 3 ? 0 : 1;
    const nomeV = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    document.getElementById('shell-header-content').innerHTML = `<h2>RESULTADOS FINAIS</h2>`;
    document.getElementById('game-content').innerHTML = `<div style="text-align:center;"><img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:150px;"><h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase; margin-bottom:20px; font-size:2rem;">GANHOU O ${nomeV}</h2></div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex"; footer.style.gap = "15px";
    footer.innerHTML = `<button class="btn-capa-small" style="background:#6c757d; flex:1;" onclick="location.reload()">REPETIR</button><button class="btn-capa-small" style="background:var(--primary-color); flex:1;" onclick="window.history.back()">SAIR</button>`;
}

function iniciarSimulacao() {
    clearInterval(simuInterval);
    const board = document.getElementById('simu-board');
    let sTab = Array(7).fill().map(() => Array(7).fill(0));
    for(let c=0; c<7; c++) { sTab[0][c] = 2; sTab[1][c] = 2; sTab[5][c] = 1; sTab[6][c] = 1; }
    simuInterval = setInterval(() => {
        let moves = [];
        for(let r=0; r<7; r++) for(let c=0; c<7; c++) if(sTab[r][c] !== 0){
            const step = sTab[r][c] === 1 ? -1 : 1;
            if(r+step>=0 && r+step<7 && sTab[r+step][c]===0) moves.push({fr:r,fc:c,tr:r+step,tc:c});
        }
        if (moves.length === 0) for(let c=0; c<7; c++) { sTab[0][c] = 2; sTab[1][c] = 2; sTab[5][c] = 1; sTab[6][c] = 1; }
        else { let m = moves[Math.floor(Math.random() * moves.length)]; sTab[m.tr][m.tc] = sTab[m.fr][m.fc]; sTab[m.fr][m.fc] = 0; }
        let h = `<div class="grid-board" style="opacity:0.4; pointer-events:none; transform:scale(0.85);">`;
        for(let r=0;r<7;r++) for(let c=0;c<7;c++) {
            h+=`<div class="cell">`;
            if(sTab[r][c]===1) h+='<div class="piece white"></div>';
            if(sTab[r][c]===2) h+='<div class="piece black"></div>';
            h+=`</div>`;
        }
        if(board) board.innerHTML = h + `</div>`;
    }, 600);
}
