// ============================================================
// 1. ESTADO GLOBAL E SONS
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

// ============================================================
// 2. CONFIGURAÇÃO VISUAL (CRITÉRIO RIGOROSO DE ESPAÇAMENTO)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    /* Contentor Principal: Ocupa todo o espaço Main sem transbordar */
    #game-content { 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: space-evenly; /* Distribui espaço igual entre os blocos */
        width: 100%; 
        height: 100%; 
        padding: 10px;
        box-sizing: border-box;
        overflow: hidden;
    }

    /* Bloco 1: Animação de Simulação */
    #simu-container { 
        flex: 1; /* Cresce para ocupar o máximo de espaço central */
        display: flex; 
        align-items: center; 
        justify-content: center; 
        width: 100%;
        min-height: 150px;
    }

    /* Bloco 2: Botões da Capa */
    #capa-menu-principal {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px; /* Espaço entre a linha de botões e outros elementos */
        padding-bottom: 5px;
    }

    .capa-btn-row { 
        display: flex; 
        flex-direction: row; 
        gap: 10px; 
        width: 100%; 
        max-width: 550px; 
        justify-content: center; 
        align-items: center; 
        flex-wrap: nowrap; /* Impede quebra para manter alinhamento */
    }

    /* Botões Premium */
    .btn-capa-small { 
        flex: 1; 
        height: clamp(45px, 7vh, 60px); /* Altura adaptável */
        border-radius: 12px; 
        border: none; 
        color: white; 
        font-weight: 900; 
        font-size: clamp(0.7rem, 2vw, 0.9rem); 
        cursor: pointer; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        gap: 8px; 
        box-shadow: 0 4px 0 rgba(0,0,0,0.1); 
        text-transform: uppercase; 
        transition: transform 0.1s;
    }
    .btn-capa-small:active { transform: translateY(2px); box-shadow: 0 2px 0 rgba(0,0,0,0.1); }

    .btn-inform { 
        width: clamp(45px, 7vh, 60px); 
        height: clamp(45px, 7vh, 60px); 
        cursor: pointer; 
        flex: none; 
    }
    .btn-inform img { width: 100%; height: 100%; object-fit: contain; }

    /* Estilos do Tabuleiro Principal de Jogo */
    .grid-board { 
        display: grid; 
        grid-template-columns: repeat(7, 1fr); 
        gap: 4px; 
        background: #bbb; 
        padding: 6px; 
        border-radius: 12px; 
        margin: 0 auto;
    }
    .cell { 
        width: var(--cell-size); 
        height: var(--cell-size); 
        background: white; 
        border-radius: 4px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
    }
    .piece { width: 80%; height: 80%; border-radius: 50%; box-shadow: 0 3px 6px rgba(0,0,0,0.2); }
    .piece.white { background: radial-gradient(circle at 30% 30%, #fff, #ddd); }
    .piece.black { background: radial-gradient(circle at 30% 30%, #555, #111); }

    /* Painel de Instruções */
    #instrucoes-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: transform 0.4s ease; transform: translateY(100%); visibility: hidden; padding: 30px 20px; overflow-y: auto; border-radius: 30px 30px 0 0; }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }

    /* ============================================================
       RESPONSIVIDADE CRITERIOSA (DIFERENTES DISPOSITIVOS)
       ============================================================ */
    
    /* PC / LANDSCAPE GRANDE */
    @media screen and (min-width: 1025px) {
        :root { --cell-size: min(60px, 8vh); }
        #simu-board { transform: scale(1); }
    }

    /* TABLET VERTICAL (PORTRAIT) - Otimizado para não ficar gigante */
    @media screen and (min-width: 501px) and (max-width: 1024px) and (orientation: portrait) {
        :root { --cell-size: 10vw; }
        #simu-board { transform: scale(1.1); }
        #game-content { padding: 40px 20px; }
    }

    /* TELEMÓVEL VERTICAL (PORTRAIT) */
    @media screen and (max-width: 500px) and (orientation: portrait) {
        :root { --cell-size: 11vw; }
        #simu-board { transform: scale(0.85); }
        .capa-btn-row { width: 100%; gap: 8px; }
    }

    /* TODOS OS DISPOSITIVOS EM LANDSCAPE (Telemóvel/Tablet deitado) */
    @media screen and (max-height: 550px) and (orientation: landscape) {
        :root { --cell-size: 10vh; }
        #game-content { flex-direction: row; justify-content: center; gap: 30px; padding: 5px; }
        #simu-board { transform: scale(0.65); }
        #capa-menu-principal { width: auto; }
        .capa-btn-row { flex-direction: column; width: 180px; }
        #simu-container { flex: none; width: auto; }
    }
`;
document.head.appendChild(style);

// ============================================================
// 3. CAPA E INSTRUÇÕES (FLUXO: HEADER -> SIMU -> BOTOES)
// ============================================================
function mostrarCapa() {
    if (jogoAtivo) return;

    // Título no Header (Shell)
    document.getElementById('shell-header-content').innerHTML = `
        <h2 style="color:var(--primary-color); font-weight:900; font-size:clamp(1.1rem, 3vw, 1.5rem); text-align:center; width:100%;">
            ${JOGO_CONFIG.nomeDoJogo.toUpperCase()}
        </h2>`;
    
    // Garantir estrutura de avisos
    if(!document.getElementById('round-feedback')) {
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.game-shell').appendChild(feedback);
    }

    // Estrutura Dinâmica da Capa
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container">
            <div id="simu-board"></div>
        </div>

        <div id="capa-menu-principal">
            <div class="capa-btn-row">
                <div class="btn-inform" onclick="toggleInstructions()">
                    <img src="${JOGO_CONFIG.caminhoIconsMenu}inform.png">
                </div>
                <button class="btn-capa-small" style="background:var(--primary-color);" onclick="mostrarNiveis('CPU')">
                    <i class="fas fa-robot"></i> COMPUTADOR
                </button>
                <button class="btn-capa-small" style="background:#6c757d;" onclick="mostrarNiveis('PVP')">
                    <i class="fas fa-users"></i> 2 JOGADORES
                </button>
            </div>
        </div>
        <div id="nivel-select-container" class="nivel-select-container"></div>
    `;
    
    // Painel de Instruções Premium (Criar se não existir)
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `
            <span class="close-x" onclick="toggleInstructions()" style="position:absolute; top:15px; right:20px; cursor:pointer; font-size:2.5rem; color:#ff5a5f;">&times;</span>
            <div class="inst-content">
                <div class="inst-header" style="color:var(--primary-color); text-align:center; font-size:1.6rem; font-weight:900; margin-bottom:20px; border-bottom:2px solid #eee; padding-bottom:10px;">INSTRUÇÕES: AVANÇO</div>
                <div class="inst-section-title" style="font-weight:800; margin-top:15px; color:#444;">OBJETIVO:</div>
                <p>Chegar com qualquer peça à primeira linha do campo adversário.</p>
                <div class="inst-section-title" style="font-weight:800; margin-top:15px; color:#444;">MOVIMENTOS:</div>
                <ul style="padding-left:20px; margin-top:5px;">
                    <li><b>Frente:</b> 1 casa (apenas se estiver vazia).</li>
                    <li><b>Diagonal:</b> 1 casa (vazia ou para capturar peça adversária).</li>
                </ul>
            </div>`;
        document.body.appendChild(panel);
    }

    document.getElementById('shell-footer-content').style.display = 'none';
    iniciarSimulacao();
}

function toggleInstructions() { 
    somClique.play(); 
    document.getElementById('instrucoes-panel').classList.toggle('open'); 
}

function mostrarNiveis(modo) {
    somClique.play();
    document.getElementById('capa-menu-principal').style.display = 'none';
    const container = document.getElementById('nivel-select-container');
    container.style.display = 'flex';
    container.className = 'nivel-select-container'; // Garantir classe para CSS
    container.innerHTML = `
        <p style="font-weight:800; color:#888; font-size:0.8rem; text-transform:uppercase; margin-bottom:10px;">Dificuldade:</p>
        <div class="nivel-row" style="display:flex; gap:10px; width:100%;">
            <div class="btn-nivel" onclick="setModo('${modo}', 1)" style="border:2px solid #8cc63f; color:#8cc63f; padding:15px; border-radius:12px; flex:1; text-align:center; cursor:pointer;"><b>Fácil</b></div>
            <div class="btn-nivel" onclick="setModo('${modo}', 2)" style="border:2px solid #ff5a5f; color:#ff5a5f; padding:15px; border-radius:12px; flex:1; text-align:center; cursor:pointer;"><b>Difícil</b></div>
        </div>
        <button class="btn-capa-small btn-voltar-nivel" onclick="voltarCapa()" style="background:#6c757d; width:150px; margin-top:15px;">VOLTAR</button>`;
}

function voltarCapa() { somClique.play(); document.getElementById('capa-menu-principal').style.display = 'flex'; document.getElementById('nivel-select-container').style.display = 'none'; }

// ============================================================
// 4. LÓGICA CORE (TABULEIRO E JOGO)
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
    area.style.justifyContent = "center"; // Centraliza o tabuleiro no jogo
    
    const boardEl = document.createElement('div');
    boardEl.className = "grid-board";
    for(let r=0; r<7; r++) {
        for(let c=0; c<7; c++) {
            const cell = document.createElement('div');
            cell.className = "cell";
            if(selectedPiece && selectedPiece.r === r && selectedPiece.c === c) cell.style.border = "3px solid #fbc02d";
            if(mostrarDicas && selectedPiece && getLegalMoves(selectedPiece.r, selectedPiece.c).some(m => m.r === r && m.c === c)) {
                cell.style.backgroundColor = "#fff9c4";
            }
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
// 5. FINALIZAÇÃO E SIMULAÇÃO
// ============================================================
function finalizarRonda(vencedorIdx) {
    jogoAtivo = false; matchScore[vencedorIdx]++; somAcerto.play();
    const overlay = document.getElementById('round-feedback');
    const nomeV = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="vitoria-card"><h1 style="color:#8cc63f; font-size:2rem; font-weight:900;">${nomeV}</h1><p>Ganhou a ronda!</p><div style="margin-top:10px; font-weight:800;">PLACAR: J1 ${matchScore[0]} - ${matchScore[1]} Pc</div></div>`;
    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 2000);
    else setTimeout(() => { iniciarJogo(); }, 2000);
}

function finalizarMatch() {
    document.getElementById('round-feedback').style.display = 'none';
    const vencedorIdx = matchScore[0] >= 3 ? 0 : 1;
    const nomeV = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    document.getElementById('shell-header-content').innerHTML = `<h2>FIM DO JOGO</h2>`;
    document.getElementById('game-content').innerHTML = `<div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:20px;"><img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:120px;"><h2 style="color:var(--primary-color); font-weight:900;">VENCEDOR: ${nomeV}</h2></div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex"; 
    footer.style.padding = "15px";
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
        if (moves.length === 0) {
            for(let c=0; c<7; c++) { sTab[0][c] = 2; sTab[1][c] = 2; sTab[5][c] = 1; sTab[6][c] = 1; }
        } else {
            let m = moves[Math.floor(Math.random() * moves.length)];
            sTab[m.tr][m.tc] = sTab[m.fr][m.fc];
            sTab[m.fr][m.fc] = 0;
        }
        let h = `<div class="grid-board" style="opacity:0.3; pointer-events:none; transform:scale(0.85);">`;
        for(let r=0;r<7;r++) for(let c=0;c<7;c++) {
            h+=`<div class="cell">`;
            if(sTab[r][c]===1) h+='<div class="piece white"></div>';
            if(sTab[r][c]===2) h+='<div class="piece black"></div>';
            h+=`</div>`;
        }
        if(board) board.innerHTML = h + `</div>`;
    }, 700);
}
