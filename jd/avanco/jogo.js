// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
let jogoAtivo = false;
let modoJogo = 'CPU';     
let nivelJogo = 1;        
let mostrarDicas = true;  
let matchScore = [0, 0];  // [Brancas, Negras]
let turnoAtual = 0;       // 0: Brancas (J1), 1: Negras (J2/Pc)
let currentGameNum = 1;   
let tabuleiro = [];       // 0: vazio, 1: Branca, 2: Negra
let selectedPiece = null; // {r, c}
let simuInterval;         

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");
// [FIM DA SECÇÃO 1]

// ============================================================
// 2. CONFIGURAÇÃO VISUAL (DESIGN PREMIUM)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 2px 5px; }
    .status-pill { padding: 4px 15px; border-radius: 8px; font-weight: 800; font-size: 0.9rem; color: white; display: flex; align-items: center; gap: 10px; }
    
    .score-group { display: flex; gap: 8px; }
    .score-box { padding: 5px 10px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1rem; min-width: 55px; justify-content: center; }
    
    /* Brancas (J1) Verde-Claro | Negras (J2/Pc) Cinza-Escuro */
    .pill-j1, .box-v { background: #8cc63f !important; box-shadow: 0 3px 0 #6da32f; }
    .pill-j2, .box-x { background: #444 !important; box-shadow: 0 3px 0 #222; }
    
    .blinking { animation: blinker 1s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.4; } }

    #simu-container { height: 300px; display: flex; align-items: center; justify-content: center; width: 100%; overflow: visible; margin-top: 10px !important; margin-bottom: 30px; }

    .capa-btn-row { display: flex; flex-direction: row; gap: 10px; width: 95%; max-width: 480px; justify-content: center; align-items: center; }
    .btn-capa-small { flex: 1; height: 50px; border-radius: 12px; border: none; color: white; font-weight: 900; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-transform: uppercase; }
    .btn-inform { width: 50px; height: 50px; cursor: pointer; flex: none; }
    .btn-inform img { width: 100%; height: 100%; object-fit: contain; }

    .nivel-select-container { display: none; flex-direction: column; gap: 12px; width: 95%; max-width: 500px; align-items: center; }
    .nivel-row { display: flex; flex-direction: row; gap: 10px; width: 100%; justify-content: center; }
    .btn-nivel { background: white; padding: 12px 2px; border-radius: 12px; border: 2px solid #eee; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; flex: 1; }
    .btn-nivel b { font-size: 0.8rem; font-weight: 900; text-transform: uppercase; }
    .btn-nivel span { font-size: 0.55rem; font-weight: 700; opacity: 0.7; text-align: center; line-height: 1.1; }
    .btn-nivel.l1 { border-color: #8cc63f; color: #8cc63f; }
    .btn-nivel.l2 { border-color: #ff5a5f; color: #ff5a5f; }
    .btn-voltar-nivel { height: 65px !important; background: #6c757d !important; width: 160px; margin-top: 10px; border-radius: 12px; color: white; font-weight: 900; border: none; cursor: pointer; text-transform: uppercase; }

    #instrucoes-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: transform 0.5s ease; transform: translateY(100%); visibility: hidden; padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0; }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.5rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; }

    .inst-content { max-width: 600px; margin: 0 auto; text-align: left; }
    .inst-header { color: var(--primary-color); text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 3px solid var(--bg-color); padding-bottom: 10px; }
    .inst-section-title { color: #444; font-size: 1.2rem; font-weight: 800; margin: 20px 0 10px; display: flex; align-items: center; gap: 10px; }
    .inst-section-title::before { content: ''; width: 6px; height: 22px; background: var(--primary-color); border-radius: 3px; display: inline-block; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f9f9f9; margin-bottom: 8px; padding: 12px 15px; border-radius: 12px; border-left: 4px solid var(--bg-color); color: #555; font-size: 0.95rem; line-height: 1.4; }

    /* TABULEIRO 7x7 */
    .grid-board { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; background: #bbb; padding: 4px; border-radius: 8px; width: fit-content; margin: 0 auto; }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 2px; position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    
    .piece { width: 80%; height: 80%; border-radius: 50%; border: 2px solid rgba(0,0,0,0.1); box-shadow: 0 3px 6px rgba(0,0,0,0.2); }
    .piece.white { background: #fff; border-color: #ddd; }
    .piece.black { background: #333; border-color: #000; }
    
    .cell.selected { background: #fff9c4 !important; border: 2px solid #fbc02d; }
    .cell.hint::after { content: ''; width: 10px; height: 10px; background: #8cc63f; border-radius: 50%; opacity: 0.6; }

    #round-feedback { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(6px); z-index: 1000; display: none; align-items: center; justify-content: center; border-radius: 35px; }
    .vitoria-card { background: white; padding: 30px; border-radius: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.15); text-align: center; }

    @media screen and (min-width: 1025px) { :root { --cell-size: 55px; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 11vw; } }
    @media screen and (max-height: 500px) and (orientation: landscape) { :root { --cell-size: 10vh; } }
`;
document.head.appendChild(style);

// ============================================================
// 3. CAPA E INSTRUÇÕES PREMIUM
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
                <div class="inst-header">Como Jogar Avanço</div>
                <div class="inst-section-title">Objetivo</div>
                <p class="inst-text">Ser o primeiro a levar uma das suas peças à <b>primeira linha do adversário</b> (a 7ª linha para as Brancas e a 1ª linha para as Negras).</p>
                
                <div class="inst-section-title">Movimento</div>
                <ul class="inst-list">
                    <li>As peças movem-se sempre <b>uma casa para a frente</b> (vertical ou diagonal).</li>
                    <li>Para mover <b>em frente</b>, a casa deve estar vazia.</li>
                </ul>

                <div class="inst-section-title">Captura</div>
                <ul class="inst-list">
                    <li>Capturas apenas na <b>diagonal para a frente</b>.</li>
                    <li>Move a tua peça para a casa da peça adversária para a remover do jogo.</li>
                    <li>Ao contrário do Xadrez, se uma peça adversária estiver à tua frente, tu estás bloqueado nessa coluna!</li>
                </ul>
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
        <p style="font-weight:800; color:#888; margin-bottom:10px; font-size:0.8rem; text-transform:uppercase;">Jogar com o ${modo === 'CPU' ? 'computador' : 'adversário'}:</p>
        <div class="nivel-row">
            <div class="btn-nivel l1" onclick="setModo('${modo}', 1)"><b>Nível 1</b><span>Fácil (Dicas)</span></div>
            <div class="btn-nivel l2" onclick="setModo('${modo}', 2)"><b>Nível 2</b><span>Difícil</span></div>
        </div>
        <button class="btn-capa-small btn-voltar-nivel" onclick="voltarCapa()">VOLTAR</button>`;
}

function voltarCapa() { somClique.play(); document.getElementById('capa-menu-principal').style.display = 'flex'; document.getElementById('nivel-select-container').style.display = 'none'; }
function toggleInstructions() { somClique.play(); document.getElementById('instrucoes-panel').classList.toggle('open'); }

// ============================================================
// 4. LÓGICA CORE DO JOGO
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
    // Brancas nas linhas 0 e 1 (o J1 sobe)
    for(let c=0; c<7; c++) { tabuleiro[0][c] = 1; tabuleiro[1][c] = 1; }
    // Negras nas linhas 5 e 6 (o PC/J2 desce)
    for(let c=0; c<7; c++) { tabuleiro[5][c] = 2; tabuleiro[6][c] = 2; }
    
    document.getElementById('round-feedback').style.display = 'none';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = modoJogo === 'CPU' ? "Pc" : "J2";
    const nomeVez = (turnoAtual === 0) ? "Jogador 1" : (modoJogo === 'CPU' ? "Pc" : "Jogador 2");
    const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";

    document.getElementById('shell-header-content').innerHTML = `
        <div class="status-container">
            <div class="status-pill ${classPill} blinking">VEZ DO ${nomeVez.toUpperCase()}</div>
            <div class="score-group">
                <div class="score-box box-v">J1: ${matchScore[0]}</div>
                <div class="score-box box-x">${pcLabel}: ${matchScore[1]}</div>
            </div>
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
            
            // Dicas visuais
            if(mostrarDicas && selectedPiece && getLegalMoves(selectedPiece.r, selectedPiece.c).some(m => m.r === r && m.c === c)) {
                cell.classList.add('hint');
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

    // Se clicar numa peça sua, seleciona
    if(piece === (turnoAtual === 0 ? 1 : 2)) {
        selectedPiece = {r, c};
        somClique.play();
        atualizarUI();
    } 
    // Se já tiver selecionado e clicar num destino
    else if(selectedPiece) {
        const moves = getLegalMoves(selectedPiece.r, selectedPiece.c);
        const valid = moves.find(m => m.r === r && m.c === c);
        
        if(valid) {
            executarMovimento(selectedPiece.r, selectedPiece.c, r, c);
        } else {
            selectedPiece = null;
            atualizarUI();
        }
    }
}

function getLegalMoves(r, c) {
    const player = tabuleiro[r][c];
    if(player === 0) return [];
    let moves = [];
    const step = (player === 1) ? 1 : -1;
    const opponent = (player === 1) ? 2 : 1;

    // Movimento Frente (apenas se vazio)
    if(r + step >= 0 && r + step < 7) {
        if(tabuleiro[r + step][c] === 0) moves.push({r: r + step, c: c});
        
        // Diagonais (vazio ou oponente)
        [c-1, c+1].forEach(nc => {
            if(nc >= 0 && nc < 7) {
                if(tabuleiro[r + step][nc] === 0 || tabuleiro[r + step][nc] === opponent) {
                    moves.push({r: r + step, c: nc});
                }
            }
        });
    }
    return moves;
}

function executarMovimento(fr, fc, tr, tc) {
    const p = tabuleiro[fr][fc];
    tabuleiro[fr][fc] = 0;
    tabuleiro[tr][tc] = p;
    selectedPiece = null;
    somClique.play();

    // Checar vitória
    if((p === 1 && tr === 6) || (p === 2 && tr === 0)) {
        finalizarRonda(turnoAtual);
        return;
    }

    turnoAtual = (turnoAtual === 0) ? 1 : 0;
    atualizarUI();

    if(modoJogo === 'CPU' && turnoAtual === 1) {
        setTimeout(iaControlador, 800);
    }
}

function iaControlador() {
    let allMoves = [];
    for(let r=0; r<7; r++) {
        for(let c=0; c<7; c++) {
            if(tabuleiro[r][c] === 2) {
                const ms = getLegalMoves(r, c);
                ms.forEach(m => allMoves.push({fr: r, fc: c, tr: m.r, tc: m.c}));
            }
        }
    }

    if(allMoves.length === 0) return;

    let move;
    if(nivelJogo === 2) {
        // Nível 2: Prioriza ganhar ou capturar
        const win = allMoves.find(m => m.tr === 0);
        const capture = allMoves.find(m => tabuleiro[m.tr][m.tc] === 1);
        move = win || capture || allMoves[Math.floor(Math.random() * allMoves.length)];
    } else {
        move = allMoves[Math.floor(Math.random() * allMoves.length)];
    }

    executarMovimento(move.fr, move.fc, move.tr, move.tc);
}

// ============================================================
// 5. FINALIZAÇÃO
// ============================================================
function finalizarRonda(vencedorIdx) {
    jogoAtivo = false;
    matchScore[vencedorIdx]++;
    somAcerto.play();
    const overlay = document.getElementById('round-feedback');
    const nomeVencedor = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    const corVencedor = vencedorIdx === 0 ? "#8cc63f" : "#444";
    
    overlay.style.display = 'flex';
    overlay.innerHTML = `
        <div class="vitoria-card">
            <h1 style="color:${corVencedor}; font-size:2.2rem; font-weight:900; margin:0;">${nomeVencedor}</h1>
            <p style="color:#666; font-size:1.1rem; font-weight:700;">Ganhou a ronda!</p>
            <div style="margin-top:15px; padding-top:15px; border-top:2px dashed #eee; color:#aaa; font-weight:800;">
                PLACAR: J1 ${matchScore[0]} - ${matchScore[1]} ${modoJogo === 'CPU' ? 'Pc' : 'J2'}
            </div>
        </div>`;

    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 2000);
    else setTimeout(() => { currentGameNum++; iniciarJogo(); }, 2000);
}

function finalizarMatch() {
    document.getElementById('round-feedback').style.display = 'none';
    const vencedorIdx = matchScore[0] >= 3 ? 0 : 1;
    const nomeVencedor = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">RESULTADOS FINAIS</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:150px; margin-bottom:10px;">
            <h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">GANHOU O ${nomeVencedor}</h2>
            <div style="display:flex; justify-content:center; gap:20px;">
                <div class="score-box box-v" style="padding:10px 20px; font-size:1.2rem;">J1: ${matchScore[0]}</div>
                <div class="score-box box-x" style="padding:10px 20px; font-size:1.2rem;">${modoJogo === 'CPU' ? 'Pc' : 'J2'}: ${matchScore[1]}</div>
            </div>
        </div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `<button class="btn-capa-small" style="background:#6c757d; flex:1;" onclick="location.reload()">REPETIR</button>
                        <button class="btn-capa-small" style="background:var(--primary-color); flex:1;" onclick="window.history.back()">SAIR</button>`;
}

function iniciarSimulacao() {
    clearInterval(simuInterval);
    const board = document.getElementById('simu-board');
    let sTab = Array(7).fill().map(() => Array(7).fill(0));
    for(let c=0; c<7; c++) { sTab[0][c] = 1; sTab[1][c] = 1; sTab[5][c] = 2; sTab[6][c] = 2; }
    
    simuInterval = setInterval(() => {
        let moves = [];
        for(let r=0; r<7; r++) {
            for(let c=0; c<7; c++) {
                if(sTab[r][c] !== 0) {
                    const step = sTab[r][c] === 1 ? 1 : -1;
                    if(r+step>=0 && r+step<7 && sTab[r+step][c]===0) moves.push({fr:r,fc:c,tr:r+step,tc:c});
                }
            }
        }
        if (moves.length === 0) {
            sTab = Array(7).fill().map(() => Array(7).fill(0));
            for(let c=0; c<7; c++) { sTab[0][c] = 1; sTab[1][c] = 1; sTab[5][c] = 2; sTab[6][c] = 2; }
        } else {
            let m = moves[Math.floor(Math.random() * moves.length)];
            sTab[m.tr][m.tc] = sTab[m.fr][m.fc];
            sTab[m.fr][m.fc] = 0;
        }
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
