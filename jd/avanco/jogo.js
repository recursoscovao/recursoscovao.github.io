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
// 2. CONFIGURAÇÃO VISUAL (DESIGN PARA TABLETS E TELEMÓVEIS)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    /* Contentor Principal: Gestão de Espaço */
    #game-content { 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: space-evenly; 
        width: 100%; 
        height: 100%; 
        padding: 15px;
        box-sizing: border-box;
        overflow: hidden;
    }

    /* Área de Simulação (Capa e Níveis) */
    #simu-container { 
        flex: 1; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        width: 100%;
        min-height: 140px;
    }

    /* Menus da Capa */
    #capa-menu-principal, #nivel-select-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px; 
        padding-bottom: 10px;
    }

    .capa-btn-row, .nivel-row { 
        display: flex; 
        flex-direction: row; 
        gap: 12px; 
        width: 100%; 
        max-width: 550px; 
        justify-content: center; 
        align-items: center; 
    }

    /* Botões Premium */
    .btn-capa-small { 
        flex: 1; 
        height: clamp(45px, 6.5vh, 60px); 
        border-radius: 12px; 
        border: none; 
        color: white; 
        font-weight: 900; 
        font-size: clamp(0.75rem, 2vw, 0.95rem); 
        cursor: pointer; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        gap: 8px; 
        box-shadow: 0 4px 0 rgba(0,0,0,0.1); 
        text-transform: uppercase; 
    }

    .btn-inform { width: clamp(45px, 6.5vh, 60px); height: clamp(45px, 6.5vh, 60px); cursor: pointer; flex: none; }
    .btn-inform img { width: 100%; height: 100%; object-fit: contain; }

    /* INSTRUÇÕES PREMIUM */
    #instrucoes-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: transform 0.4s ease; transform: translateY(100%); visibility: hidden; padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0; }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.5rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; }
    .inst-content { max-width: 600px; margin: 0 auto; text-align: left; }
    .inst-header { color: var(--primary-color); text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 3px solid #eee; padding-bottom: 10px; }
    .inst-section-title { color: #444; font-size: 1.2rem; font-weight: 800; margin: 20px 0 10px; display: flex; align-items: center; gap: 10px; }
    .inst-section-title::before { content: ''; width: 6px; height: 22px; background: var(--primary-color); border-radius: 3px; display: inline-block; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f9f9f9; margin-bottom: 8px; padding: 12px 15px; border-radius: 12px; border-left: 4px solid var(--primary-color); color: #555; font-size: 0.95rem; line-height: 1.4; }

    /* TABULEIRO DE JOGO */
    .grid-board { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; background: #bbb; padding: 6px; border-radius: 12px; margin: 0 auto; box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; }
    .piece { width: 80%; height: 80%; border-radius: 50%; box-shadow: 0 3px 6px rgba(0,0,0,0.2); }
    .piece.white { background: radial-gradient(circle at 30% 30%, #fff, #ddd); }
    .piece.black { background: radial-gradient(circle at 30% 30%, #555, #111); }

    /* RESPONSIVIDADE CRITERIOSA */
    @media screen and (min-width: 1025px) { :root { --cell-size: min(55px, 7.5vh); } }
    
    /* TABLET VERTICAL (iPad, etc) */
    @media screen and (min-width: 501px) and (max-width: 1024px) and (orientation: portrait) {
        :root { --cell-size: 9.5vw; }
        #simu-board { transform: scale(1.1); }
        #game-content { padding: 40px 20px; gap: 30px; }
    }

    /* TELEMÓVEL VERTICAL */
    @media screen and (max-width: 500px) and (orientation: portrait) {
        :root { --cell-size: 11vw; }
        #simu-board { transform: scale(0.85); }
    }

    /* TABLET E TELEMÓVEL LANDSCAPE (Deitado) */
    @media screen and (max-height: 600px) and (orientation: landscape) {
        :root { --cell-size: 10.5vh; }
        #game-content { flex-direction: row; justify-content: center; gap: 40px; padding: 5px; }
        #simu-container { flex: none; width: auto; }
        #capa-menu-principal, #nivel-select-container { width: auto; }
        .capa-btn-row, .nivel-row { flex-direction: column; width: clamp(150px, 25vw, 200px); }
    }
`;
document.head.appendChild(style);

// ============================================================
// 3. CAPA E INSTRUÇÕES (SEQUÊNCIA RIGOROSA)
// ============================================================
function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `
        <h2 style="color:var(--primary-color); font-weight:900; font-size:clamp(1.1rem, 3vw, 1.5rem); text-align:center; width:100%;">
            ${JOGO_CONFIG.nomeDoJogo.toUpperCase()}
        </h2>`;
    
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `
            <span class="close-x" onclick="toggleInstructions()">&times;</span>
            <div class="inst-content">
                <div class="inst-header">Instruções: Avanço</div>
                <div class="inst-section-title">Objetivo</div>
                <p>O Avanço é uma corrida estratégica. Vence quem chegar primeiro com qualquer uma das suas peças à <b>primeira linha do adversário</b>.</p>
                <div class="inst-section-title">Regras de Movimento</div>
                <ul class="inst-list">
                    <li><b>Sentido:</b> As Brancas "sobem" e as Negras "descem".</li>
                    <li><b>Frente:</b> Podes mover 1 casa para a frente se estiver vazia.</li>
                    <li><b>Diagonal:</b> Move para as diagonais se estiverem vazias ou para <b>capturar</b>.</li>
                </ul>
                <div class="inst-section-title">Capturas</div>
                <ul class="inst-list">
                    <li><b>Diagonal apenas:</b> As capturas só são permitidas em movimento diagonal.</li>
                    <li><b>Não há saltos:</b> Não podes saltar por cima de outras peças.</li>
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
        <div id="capa-menu-principal">
            <div class="capa-btn-row">
                <div class="btn-inform" onclick="toggleInstructions()"><img src="${JOGO_CONFIG.caminhoIconsMenu}inform.png"></div>
                <button class="btn-capa-small" style="background:var(--primary-color);" onclick="mostrarNiveis('CPU')"><i class="fas fa-robot"></i> COMPUTADOR</button>
                <button class="btn-capa-small" style="background:#6c757d;" onclick="mostrarNiveis('PVP')"><i class="fas fa-users"></i> 2 JOGADORES</button>
            </div>
        </div>
        <div id="nivel-select-container" style="display:none;"></div>
    `;
    document.getElementById('shell-footer-content').style.display = 'none';
    iniciarSimulacao();
}

function toggleInstructions() { somClique.play(); document.getElementById('instrucoes-panel').classList.toggle('open'); }

function mostrarNiveis(modo) {
    somClique.play();
    document.getElementById('capa-menu-principal').style.display = 'none';
    const container = document.getElementById('nivel-select-container');
    container.style.display = 'flex';
    container.innerHTML = `
        <div id="simu-container"><div id="simu-board"></div></div>
        <p style="font-weight:800; color:#888; font-size:0.8rem; text-transform:uppercase; margin-bottom:5px;">Dificuldade:</p>
        <div class="nivel-row">
            <div class="btn-nivel" onclick="setModo('${modo}', 1)" style="border:2px solid #8cc63f; color:#8cc63f; padding:15px; border-radius:12px; flex:1; text-align:center; cursor:pointer; font-weight:900;">FÁCIL</div>
            <div class="btn-nivel" onclick="setModo('${modo}', 2)" style="border:2px solid #ff5a5f; color:#ff5a5f; padding:15px; border-radius:12px; flex:1; text-align:center; cursor:pointer; font-weight:900;">DIFÍCIL</div>
        </div>
        <button class="btn-capa-small" onclick="voltarCapa()" style="background:#6c757d; width:160px; height:50px; border-radius:12px; color:white; border:none; font-weight:900; cursor:pointer;">VOLTAR</button>
    `;
    iniciarSimulacao(); 
}

function voltarCapa() { somClique.play(); mostrarCapa(); }

// ============================================================
// 4. LÓGICA CORE (JOGO E INTERFACE)
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
    
    // BARRA DE STATUS ORIGINAL MANTIDA
    document.getElementById('shell-header-content').innerHTML = `
        <div class="status-container" style="width:100%; display:flex; justify-content:space-between; align-items:center;">
            <div class="status-pill ${classPill} blinking" style="padding:6px 14px; border-radius:8px; color:white; font-weight:800; font-size:0.9rem;">VEZ DE: ${nomeVez}</div>
            <div class="score-group" style="display:flex; gap:6px;">
                <div class="score-box" style="background:#8cc63f; padding:6px 10px; border-radius:10px; color:white; font-weight:900;">J1: ${matchScore[0]}</div>
                <div class="score-box" style="background:#444; padding:6px 10px; border-radius:10px; color:white; font-weight:900;">${pcLabel}: ${matchScore[1]}</div>
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

// ============================================================
// 5. FINALIZAÇÃO E RESULTADOS
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
    
    // ECRÃ DE RESULTADOS ORIGINAL MANTIDO
    document.getElementById('shell-header-content').innerHTML = `<h2>FIM DO JOGO</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:20px;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:120px;">
            <h2 style="color:var(--primary-color); font-weight:900;">VENCEDOR: ${nomeV}</h2>
        </div>`;
    
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex"; 
    footer.style.padding = "15px";
    footer.innerHTML = `<button class="btn-capa-small" style="background:#6c757d; flex:1;" onclick="location.reload()">REPETIR</button><button class="btn-capa-small" style="background:var(--primary-color); flex:1;" onclick="window.history.back()">SAIR</button>`;
}

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
