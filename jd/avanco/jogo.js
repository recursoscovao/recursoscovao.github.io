// ============================================================
// === SECÇÃO 1: ESTADO GLOBAL E SONS (INÍCIO) ===
// ============================================================
let jogoAtivo = false;
let modoJogo = 'CPU';     
let nivelJogo = 1;        
let mostrarDicas = true;  
let matchScore = [0, 0];  
let turnoAtual = 0;       
let currentGameNum = 1;   
let tabuleiro = [];       
let selectedPiece = null; 
let simuInterval;         

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");
// === SECÇÃO 1: FIM ===


// ============================================================
// === SECÇÃO 2: CONFIGURAÇÃO VISUAL / CSS (INÍCIO) ===
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    #game-content { 
        display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; 
        width: 100%; height: 100%; padding: 15px; box-sizing: border-box; overflow: hidden; position: relative;
    }
    #simu-container { flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; min-height: 120px; }
    #capa-menu-principal, #nivel-select-container { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 15px; padding-bottom: 5px; }
    .capa-btn-row, .nivel-row { display: flex; flex-direction: row; gap: 10px; width: 100%; max-width: 500px; justify-content: center; align-items: center; }
    
    .btn-capa-small { flex: 1; height: clamp(45px, 6.5vh, 60px); border-radius: 12px; border: none; color: white; font-weight: 900; font-size: clamp(0.75rem, 2vw, 0.95rem); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 0 rgba(0,0,0,0.1); text-transform: uppercase; }
    .btn-inform { width: clamp(45px, 6.5vh, 60px); height: clamp(45px, 6.5vh, 60px); cursor: pointer; flex: none; }
    .btn-inform img { width: 100%; height: 100%; object-fit: contain; }

    /* INSTRUÇÕES PREMIUM - DESIGN DRAWER (BAIXO PARA CIMA) */
    #instrucoes-panel { 
        position: fixed; bottom: 0; left: 0; width: 100vw; height: 100vh; 
        background: white; z-index: 10000; 
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); 
        transform: translateY(100%); 
        visibility: hidden; padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0; 
        box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
    }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    
    .close-x { position: absolute; top: 15px; right: 25px; font-size: 3rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; transition: 0.2s; }
    .close-x:hover { transform: scale(1.1); }

    .inst-content { max-width: 650px; margin: 0 auto; text-align: left; font-family: 'Nunito', sans-serif; }
    .inst-header { color: var(--primary-color); text-align: center; font-size: 2rem; font-weight: 900; margin-bottom: 30px; text-transform: uppercase; border-bottom: 4px solid var(--bg-color); padding-bottom: 10px; }
    .inst-section-title { color: #333; font-size: 1.3rem; font-weight: 800; margin: 25px 0 12px; display: flex; align-items: center; gap: 12px; }
    .inst-section-title i { color: var(--primary-color); font-size: 1.1rem; }
    .inst-text { color: #555; font-size: 1.05rem; line-height: 1.6; margin-bottom: 15px; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f8f9fa; margin-bottom: 10px; padding: 15px; border-radius: 15px; border-left: 5px solid var(--primary-color); color: #444; font-size: 1rem; line-height: 1.5; }
    .inst-list b { color: #222; }

    /* BARRA DE STATUS */
    .pill-j1 { background: #8cc63f !important; box-shadow: 0 3px 0 #6da32f; }
    .pill-j2 { background: #444 !important; box-shadow: 0 3px 0 #222; }
    .blinking { animation: blinker 1.5s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.5; } }

    /* TABULEIRO */
    .grid-board { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; background: #bbb; padding: 6px; border-radius: 12px; margin: 0 auto; box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; position: relative; }
    .piece { width: 80%; height: 80%; border-radius: 50%; box-shadow: 0 3px 6px rgba(0,0,0,0.2); }
    .piece.white { background: radial-gradient(circle at 30% 30%, #fff, #ddd); }
    .piece.black { background: radial-gradient(circle at 30% 30%, #555, #111); }

    /* POPUP VITÓRIA */
    #round-feedback { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.9); z-index: 2000; display: none; align-items: center; justify-content: center; text-align: center; }
    .vitoria-card { background: white; padding: 30px; border-radius: 30px; box-shadow: 0 15px 40px rgba(0,0,0,0.2); width: 80%; max-width: 350px; }

    /* RESPONSIVIDADE */
    @media screen and (min-width: 1025px) { :root { --cell-size: min(55px, 7.5vh); } }
    @media screen and (min-width: 501px) and (max-width: 1024px) and (orientation: portrait) { :root { --cell-size: 9.5vw; } #simu-board { transform: scale(1.1); } #game-content { padding: 30px 20px; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 11vw; } #simu-board { transform: scale(0.85); } }
    @media screen and (max-height: 600px) and (orientation: landscape) {
        :root { --cell-size: 10.5vh; }
        #game-content { flex-direction: row; gap: 30px; }
        #simu-container { flex: none; width: auto; }
        .capa-btn-row, .nivel-row { flex-direction: column; width: clamp(150px, 22vw, 190px); }
    }
`;
document.head.appendChild(style);
// === SECÇÃO 2: FIM ===


// ============================================================
// === SECÇÃO 3: CAPA E INSTRUÇÕES PREMIUM (INÍCIO) ===
// ============================================================
function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; font-size:clamp(1.1rem, 3vw, 1.5rem); text-align:center; width:100%;">${JOGO_CONFIG.nomeDoJogo.toUpperCase()}</h2>`;
    
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `
            <span class="close-x" onclick="toggleInstructions()">&times;</span>
            <div class="inst-content">
                <div class="inst-header">Como Jogar Avanço</div>
                
                <div class="inst-section-title"><i class="fas fa-bullseye"></i> O Objetivo</div>
                <p class="inst-text">O Avanço é uma corrida estratégica. O teu objetivo é simples: ser o primeiro a levar qualquer uma das tuas peças à <b>última linha do adversário</b>.</p>

                <div class="inst-section-title"><i class="fas fa-arrows-alt"></i> Movimentos Permitidos</div>
                <ul class="inst-list">
                    <li><b>Movimento Vertical:</b> Podes avançar uma casa para a frente, desde que esta esteja <b>vazia</b>.</li>
                    <li><b>Movimento Diagonal:</b> Podes mover-te para as duas casas diagonais à frente. Estas casas podem estar vazias ou ocupadas por uma peça do adversário.</li>
                </ul>

                <div class="inst-section-title"><i class="fas fa-fist-raised"></i> Como Capturar</div>
                <ul class="inst-list">
                    <li><b>Captura Diagonal:</b> Se uma peça adversária estiver na tua diagonal frontal, podes movê-la para essa casa e remover a peça dele do jogo.</li>
                    <li><b>Proibido na Vertical:</b> Não podes capturar peças que estejam diretamente à tua frente. Apenas as diagonais permitem capturas.</li>
                </ul>

                <div class="inst-section-title"><i class="fas fa-trophy"></i> Vitória</div>
                <p class="inst-text">O jogo termina no instante em que uma peça toca a linha de fundo oposta. Ganha o melhor de 5 rondas (quem chegar primeiro às 3 vitórias)!</p>
                
                <div style="height:50px;"></div>
            </div>`;
        document.body.appendChild(panel);

        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.getElementById('game-content').parentElement.appendChild(feedback);
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
    document.getElementById('shell-footer-content').style.display = 'none';
    iniciarSimulacao();
}

function toggleInstructions() { 
    somClique.play(); 
    document.getElementById('instrucoes-panel').classList.toggle('open'); 
}

function mostrarNiveis(modo) {
    somClique.play();
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board"></div></div>
        <div id="nivel-select-container">
            <p style="font-weight:800; color:#888; font-size:0.8rem; text-transform:uppercase; margin-bottom:-5px;">Dificuldade:</p>
            <div class="nivel-row">
                <div class="btn-nivel" onclick="setModo('${modo}', 1)" style="border:2px solid #8cc63f; color:#8cc63f; padding:15px; border-radius:12px; flex:1; text-align:center; cursor:pointer; font-weight:900;">FÁCIL</div>
                <div class="btn-nivel" onclick="setModo('${modo}', 2)" style="border:2px solid #ff5a5f; color:#ff5a5f; padding:15px; border-radius:12px; flex:1; text-align:center; cursor:pointer; font-weight:900;">DIFÍCIL</div>
            </div>
            <button class="btn-capa-small" onclick="voltarCapa()" style="background:#6c757d; width:160px; height:50px; border-radius:12px; color:white; border:none; font-weight:900; cursor:pointer;">VOLTAR</button>
        </div>
    `;
    iniciarSimulacao(); 
}

function voltarCapa() { somClique.play(); mostrarCapa(); }
// === SECÇÃO 3: FIM ===


// ============================================================
// === SECÇÃO 4: LÓGICA CORE DO JOGO (INÍCIO) ===
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval); somClique.play();
    modoJogo = modo; nivelJogo = nivel;
    mostrarDicas = (nivel === 1);
    matchScore = [0, 0]; turnoAtual = 0; 
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
    const pcLabel = modoJogo === 'CPU' ? "Pc" : "Jogador 2";
    const nomeVez = (turnoAtual === 0) ? "Jogador 1" : pcLabel;
    const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";
    
    document.getElementById('shell-header-content').innerHTML = `
        <div class="status-container" style="width:100%; display:flex; justify-content:space-between; align-items:center;">
            <div class="status-pill ${classPill} blinking" style="padding:10px 20px; border-radius:12px; color:white; font-weight:900; font-size:1rem; text-transform:uppercase;">
                VEZ DE: ${nomeVez}
            </div>
            <div class="score-group" style="display:flex; gap:6px;">
                <div class="score-box" style="background:#8cc63f; padding:8px 12px; border-radius:10px; color:white; font-weight:900; min-width:60px; text-align:center;">J1: ${matchScore[0]}</div>
                <div class="score-box" style="background:#444; padding:8px 12px; border-radius:10px; color:white; font-weight:900; min-width:60px; text-align:center;">${modoJogo === 'CPU' ? 'Pc' : 'J2'}: ${matchScore[1]}</div>
            </div>
        </div>`;

    const area = document.getElementById('game-content');
    area.innerHTML = "";
    area.style.justifyContent = "center"; 
    
    const boardEl = document.createElement('div');
    boardEl.className = "grid-board";
    for(let r=0; r<7; r++) {
        for(let c=0; c<7; c++) {
            const cell = document.createElement('div');
            cell.className = "cell";
            if(selectedPiece && selectedPiece.r === r && selectedPiece.c === c) cell.style.border = "3px solid #fbc02d";
            if(mostrarDicas && selectedPiece && getLegalMoves(selectedPiece.r, selectedPiece.c).some(m => m.r === r && m.c === c)) cell.style.backgroundColor = "#fff9c4";
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
// === SECÇÃO 4: FIM ===


// ============================================================
// === SECÇÃO 5: FINALIZAÇÃO E RESULTADOS (INÍCIO) ===
// ============================================================
function finalizarRonda(vencedorIdx) {
    jogoAtivo = false; matchScore[vencedorIdx]++; somAcerto.play();
    const overlay = document.getElementById('round-feedback');
    const pcLabel = modoJogo === 'CPU' ? "Pc" : "Jogador 2";
    const nomeV = vencedorIdx === 0 ? "JOGADOR 1" : pcLabel;
    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="vitoria-card"><h1 style="color:#8cc63f; font-size:2rem; font-weight:900;">${nomeV}</h1><p style="font-weight:700; color:#666;">Ganhou a ronda!</p><div style="margin-top:10px; font-weight:800;">PLACAR: J1 ${matchScore[0]} - ${matchScore[1]} ${modoJogo === 'CPU' ? 'Pc' : 'J2'}</div></div>`;
    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 2000);
    else setTimeout(() => { iniciarJogo(); }, 2000);
}

function finalizarMatch() {
    document.getElementById('round-feedback').style.display = 'none';
    const vencedorIdx = matchScore[0] >= 3 ? 0 : 1;
    const pcLabel = modoJogo === 'CPU' ? "PC" : "JOGADOR 2";
    const nomeV = vencedorIdx === 0 ? "JOGADOR 1" : pcLabel;
    
    document.getElementById('shell-header-content').innerHTML = `<h2>RESULTADOS FINAIS</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:20px;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:120px;">
            <h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">GANHOU O ${nomeV}</h2>
            <div style="background:#f9f9f9; padding:15px 30px; border-radius:15px; border:2px solid #eee;">
                <p style="font-weight:800; color:#555; margin:5px 0;">PONTOS JOGADOR 1: <span style="color:#8cc63f;">${matchScore[0]}</span></p>
                <p style="font-weight:800; color:#555; margin:5px 0;">PONTOS ${pcLabel}: <span style="color:#ff5a5f;">${matchScore[1]}</span></p>
            </div>
        </div>`;
    
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex"; footer.style.padding = "15px";
    footer.innerHTML = `<button class="btn-capa-small" style="background:#6c757d; flex:1;" onclick="location.reload()">REPETIR</button><button class="btn-capa-small" style="background:var(--primary-color); flex:1;" onclick="window.history.back()">SAIR</button>`;
}
// === SECÇÃO 5: FIM ===


// ============================================================
// === SECÇÃO 6: SIMULAÇÃO DA CAPA (INÍCIO) ===
// ============================================================
function iniciarSimulacao() {
    clearInterval(simuInterval);
    const board = document.getElementById('simu-board');
    if(!board) return;
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
        let h = `<div class="grid-board" style="opacity:0.3; pointer-events:none; transform:scale(0.85);">`;
        for(let r=0;r<7;r++) for(let c=0;c<7;c++) {
            h+=`<div class="cell">`;
            if(sTab[r][c]===1) h+='<div class="piece white"></div>';
            if(sTab[r][c]===2) h+='<div class="piece black"></div>';
            h+=`</div>`;
        }
        board.innerHTML = h + `</div>`;
    }, 700);
}
// === SECÇÃO 6: FIM ===
