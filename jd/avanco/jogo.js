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
// === INÍCIO SECÇÃO: SOBREPOSIÇÃO DO ENGINE (DESIGN) ===
// ============================================================
Engine.showStatusBar = function(nomeVez, s1, s2, label2) {
    const isJ1 = nomeVez.toUpperCase().includes("JOGADOR 1");
    const pillBg = isJ1 ? "#8cc63f" : "#444";
    const pillShadow = isJ1 ? "#6da32f" : "#222";

    document.getElementById('shell-header-content').innerHTML = `
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 10px;">
            <div class="blinking" style="padding: 8px 20px; border-radius: 12px; color: white; font-weight: 900; font-size: 1.1rem; text-transform: uppercase; background: ${pillBg}; box-shadow: 0 4px 0 ${pillShadow};">
                ${nomeVez}
            </div>
            <div style="display: flex; gap: 8px;">
                <div style="padding: 8px 15px; border-radius: 12px; color: white; font-weight: 900; background: #8cc63f; box-shadow: 0 3px 0 #6da32f;">J1: ${s1}</div>
                <div style="padding: 8px 15px; border-radius: 12px; color: white; font-weight: 900; background: #444; box-shadow: 0 3px 0 #222;">${label2}: ${s2}</div>
            </div>
        </div>`;
};

Engine.showResults = function(s1, s2, rel, label2) {
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; padding: 15px;">RESULTADOS</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 100%; gap: 20px; text-align: center; padding: 20px;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}${rel.img}" style="height: clamp(140px, 30vh, 280px); object-fit:contain; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));">
            <div><h2 style="color:var(--text-grey); font-size: clamp(1.1rem, 3vw, 1.6rem); font-weight:800; text-transform:uppercase; margin:0; opacity: 0.9;">${rel.titulo}</h2></div>
            <div style="display:flex; justify-content:center; gap:15px; flex-wrap:wrap; width:100%;">
                <div style="min-width: 240px; padding: 15px; border-radius: 18px; color: white; font-weight: 900; background: #8cc63f; box-shadow: 0 5px 0 #6da32f; font-size: 1.2rem;">JOGADOR 1: ${s1}</div>
                <div style="min-width: 240px; padding: 15px; border-radius: 18px; color: white; font-weight: 900; background: #444; box-shadow: 0 5px 0 #222; font-size: 1.2rem;">${label2.toUpperCase()}: ${s2}</div>
            </div>
        </div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `<div style="display:flex; width:100%; gap:20px; padding:20px 25px 35px;">
        <button onclick="location.reload()" style="flex: 1; height: 65px; border-radius: 40px; background: #6c757d; color: white; border: none; font-size: 1.4rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #4e555b;">REPETIR</button>
        <button onclick="window.history.back()" style="flex: 1; height: 65px; border-radius: 40px; background: var(--primary-color); color: white; border: none; font-size: 1.4rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #4582c0;">SAIR</button>
    </div>`;
};
// === FIM SECÇÃO ENGINE ===


// ============================================================
// === INÍCIO SECÇÃO 2: CONFIGURAÇÃO VISUAL / CSS ===
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    #game-content { display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%; padding: 0; box-sizing: border-box; overflow: hidden; position: relative; }

    #simu-container { flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; min-height: 0; overflow: hidden; }
    #simu-board { transform: scale(0.8); transition: 0.3s; }

    #capa-menu-principal, #nivel-select-container { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 12px; flex-shrink: 0; padding-bottom: 20px !important; }
    .capa-btn-row, .nivel-row { display: flex; flex-direction: row; align-items: stretch; gap: 12px; width: 100%; max-width: 550px; justify-content: center; padding: 0 20px; }
    
    .btn-capa-small { flex: 1; height: 60px; border-radius: 15px; border: none; color: white; font-weight: 900; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 5px 0 rgba(0,0,0,0.1); text-transform: uppercase; transition: 0.2s; }
    
    .nivel-row .btn-capa-small { height: 46px; font-size: 0.85rem; border-radius: 10px; }
    .btn-voltar-pequeno { height: 46px !important; max-width: 220px !important; font-size: 0.85rem !important; border-radius: 10px !important; }

    .btn-inform { width: 60px; height: 60px; border-radius: 15px; background: white; border: 2px solid #eee; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 0 rgba(0,0,0,0.05); }
    .btn-inform img { width: 65%; height: 65%; object-fit: contain; }
    .btn-capa-small:active, .btn-inform:active { transform: translateY(3px); box-shadow: 0 2px 0 rgba(0,0,0,0.1); }

    #instrucoes-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: transform 0.5s ease; transform: translateY(100%); visibility: hidden; overflow-y: auto; padding: 0; margin: 0; }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: sticky; top: 20px; float: right; margin-right: 25px; font-size: 3.5rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; z-index: 10001; }

    .inst-content { max-width: 750px; margin: 0 auto; text-align: left; font-family: 'Nunito', sans-serif; padding: 60px 25px; clear: both; }
    .inst-header { color: var(--primary-color); text-align: center; font-size: 2.2rem; font-weight: 900; margin-bottom: 30px; text-transform: uppercase; border-bottom: 5px solid var(--bg-color); padding-bottom: 15px; }
    .inst-section-title { color: #333; font-size: 1.4rem; font-weight: 800; margin: 30px 0 15px; display: flex; align-items: center; gap: 12px; }
    .inst-section-title::before { content: ''; width: 6px; height: 24px; background: var(--primary-color); border-radius: 3px; display: inline-block; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f8f9fa; margin-bottom: 12px; padding: 18px; border-radius: 20px; border-left: 6px solid var(--primary-color); color: #444; font-size: 1.05rem; line-height: 1.6; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }

    .grid-board { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; background: #bbb; padding: 6px; border-radius: 12px; margin: auto; width: fit-content; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; position: relative; transition: background 0.3s; }
    
    .piece { width: 85%; height: 85%; border-radius: 50%; box-shadow: 0 3px 6px rgba(0,0,0,0.2); transition: all 0.4s ease; }
    
    .piece.white { background: radial-gradient(circle at 30% 30%, #fff, #ddd); border: 1.5px solid #bbb; box-shadow: 0 3px 8px rgba(0,0,0,0.25); }
    .piece.black { background: radial-gradient(circle at 30% 30%, #555, #111); border: 1.5px solid #000; }

    :root { --cell-size: min(52px, 7.5vh); }
    @media screen and (min-width: 501px) and (max-width: 1024px) and (orientation: portrait) { :root { --cell-size: 10vw; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { 
        :root { --cell-size: 11vw; } 
        .capa-btn-row { flex-direction: column; width: 100%; padding: 0 30px; }
        .btn-inform { width: 100%; order: -1; }
        #capa-menu-principal { padding-bottom: 20px !important; }
    }

    .blinking { animation: blinker 1.5s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.4; } }
    #round-feedback { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.9); z-index: 2000; display: none; align-items: center; justify-content: center; }
    .vitoria-card { background: white; padding: 25px; border-radius: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); width: 85%; max-width: 320px; text-align: center; }
`;
document.head.appendChild(style);
// === FIM SECÇÃO 2 ===


// ============================================================
// === INÍCIO SECÇÃO 3: CAPA E INSTRUÇÕES PREMIUM ===
// ============================================================
function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; font-size:clamp(1.1rem, 3vw, 1.5rem); text-align:center; width:100%; margin-top:10px;">${JOGO_CONFIG.nomeDoJogo.toUpperCase()}</h2>`;
    
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `
            <span class="close-x" onclick="toggleInstructions()">&times;</span>
            <div class="inst-content">
                <div class="inst-header">Como Jogar Avanço</div>
                
                <div class="inst-section-title">Objetivo do Jogo</div>
                <p class="inst-text">O Avanço é uma corrida estratégica. Vence o primeiro jogador que conseguir levar <b>qualquer uma das suas peças</b> até à primeira linha do campo adversário (a linha de onde o oponente começou).</p>

                <div class="inst-section-title">Como Mover as Peças</div>
                <ul class="inst-list">
                    <li><i class="fas fa-arrow-up"></i> <b>Movimento Vertical:</b> Podes avançar 1 casa para a frente se esta estiver <b>vazia</b>.</li>
                    <li><i class="fas fa-arrows-alt-v"></i> <b>Movimento Diagonal:</b> Podes mover-te para as duas casas diagonais à tua frente, quer estejam vazias ou ocupadas por um adversário.</li>
                </ul>

                <div class="inst-section-title">Como Capturar</div>
                <ul class="inst-list">
                    <li><b>Captura Diagonal:</b> Podes capturar uma peça adversária se ela estiver numa das tuas <b>diagonais frontais</b>. A peça capturada é removida do tabuleiro.</li>
                    <li><b>Nota Importante:</b> Não podes capturar peças movendo-te verticalmente (para a frente).</li>
                </ul>

                <div class="inst-section-title">Sistema de Pontuação</div>
                <p class="inst-text">O jogo é disputado em rondas. Ganha o jogador que vencer primeiro 3 rondas (melhor de 5)!</p>
                <div style="height:60px;"></div>
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
    const p = document.getElementById('instrucoes-panel');
    const isOpening = !p.classList.contains('open');
    p.classList.toggle('open');
    document.body.style.overflow = isOpening ? 'hidden' : 'auto';
}

function mostrarNiveis(modo) {
    somClique.play();
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board" style="transform: scale(0.68);"></div></div>
        <div id="nivel-select-container">
            <p style="font-weight:800; color:#888; font-size:0.75rem; text-transform:uppercase; margin-bottom:5px;">Escolha a Dificuldade:</p>
            <div class="nivel-row">
                <button class="btn-capa-small" onclick="setModo('${modo}', 1)" style="background:#8cc63f;">FÁCIL</button>
                <button class="btn-capa-small" onclick="setModo('${modo}', 2)" style="background:#ff5a5f;">DIFÍCIL</button>
            </div>
            <div class="capa-btn-row">
                <button class="btn-capa-small btn-voltar-pequeno" onclick="voltarCapa()" style="background:#6c757d;">
                    <i class="fas fa-arrow-left"></i> VOLTAR
                </button>
            </div>
        </div>
    `;
    iniciarSimulacao(); 
}

function voltarCapa() { somClique.play(); mostrarCapa(); }
// === FIM SECÇÃO 3 ===


// ============================================================
// === INÍCIO SECÇÃO 4: LÓGICA CORE (AVANÇO) ===
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval); somClique.play();
    modoJogo = modo; nivelJogo = nivel;
    matchScore = [0, 0]; turnoAtual = 0; 
    iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    selectedPiece = null;
    tabuleiro = Array(7).fill().map(() => Array(7).fill(0));
    for(let c=0; c<7; c++) { 
        tabuleiro[0][c] = 2; tabuleiro[1][c] = 2; 
        tabuleiro[5][c] = 1; tabuleiro[6][c] = 1; 
    }
    document.getElementById('round-feedback').style.display = 'none';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = modoJogo === 'CPU' ? "Pc" : "J2";
    const labelJ2 = modoJogo === 'CPU' ? "Computador" : "Jogador 2";
    const nomeVez = (turnoAtual === 0) ? "Jogador 1" : labelJ2;
    Engine.showStatusBar(nomeVez, matchScore[0], matchScore[1], pcLabel);

    const area = document.getElementById('game-content');
    area.innerHTML = "";
    area.style.justifyContent = "center"; 
    const boardEl = document.createElement('div');
    boardEl.className = "grid-board";

    let movesHints = [];
    if(selectedPiece && nivelJogo === 1) {
        for(let r=0; r<7; r++) {
            for(let c=0; c<7; c++) {
                if(validarMovimento(selectedPiece.r, selectedPiece.c, r, c, (turnoAtual === 0 ? 1 : 2))) movesHints.push({r, c});
            }
        }
    }

    for(let r=0; r<7; r++) {
        for(let c=0; c<7; c++) {
            const cell = document.createElement('div');
            cell.className = "cell";
            if(selectedPiece && selectedPiece.r === r && selectedPiece.c === c) cell.style.background = "#fff9c4";
            if(movesHints.some(m => m.r === r && m.c === c)) {
                cell.innerHTML = '<div style="width:6px; height:6px; background:#bbb; border-radius:50%; opacity:0.6;"></div>';
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
    const player = turnoAtual === 0 ? 1 : 2;
    if(tabuleiro[r][c] === player) {
        selectedPiece = {r, c}; somClique.play(); atualizarUI();
    } else if(selectedPiece) {
        if(validarMovimento(selectedPiece.r, selectedPiece.c, r, c, player)) executarMovimento(selectedPiece.r, selectedPiece.c, r, c);
        else { selectedPiece = null; atualizarUI(); }
    }
}

function validarMovimento(r1, c1, r2, c2, p) {
    const dir = p === 1 ? -1 : 1;
    if(c1 === c2 && r2 === r1 + dir && tabuleiro[r2][c2] === 0) return true;
    if(Math.abs(c2 - c1) === 1 && r2 === r1 + dir && (tabuleiro[r2][c2] === 0 || tabuleiro[r2][c2] === (p === 1 ? 2 : 1))) return true;
    return false;
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
    let moves = [];
    for(let r=0; r<7; r++) for(let c=0; c<7; c++) if(tabuleiro[r][c] === 2) 
        for(let dr=0; dr<7; dr++) for(let dc=0; dc<7; dc++) if(validarMovimento(r,c,dr,dc,2)) moves.push({fr:r,fc:c,tr:dr,tc:dc});
    if(moves.length === 0) { finalizarRonda(0); return; }
    const win = moves.find(m => m.tr === 6);
    const cap = moves.find(m => tabuleiro[m.tr][m.tc] === 1);
    const m = win || cap || moves[Math.floor(Math.random()*moves.length)];
    executarMovimento(m.fr, m.fc, m.tr, m.tc);
}

function finalizarRonda(vencedorIdx) {
    jogoAtivo = false; matchScore[vencedorIdx]++; somAcerto.play();
    const overlay = document.getElementById('round-feedback');
    const pcLabel = modoJogo === 'CPU' ? "Pc" : "J2";
    const labelJ2 = modoJogo === 'CPU' ? "Computador" : "Jogador 2";
    const nomeV = vencedorIdx === 0 ? "JOGADOR 1" : labelJ2;
    const corV = vencedorIdx === 0 ? "#8cc63f" : "#444";
    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="vitoria-card"><h1 style="color:${corV}; font-size:2rem; font-weight:900; text-transform:uppercase;">${nomeV}</h1><p style="font-weight:700; color:#666;">Venceu a ronda!</p><div style="margin-top:10px; font-weight:800;">PLACAR: J1 ${matchScore[0]} - ${matchScore[1]} ${pcLabel}</div></div>`;
    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 2000);
    else setTimeout(() => { iniciarJogo(); }, 2000);
}

function finalizarMatch() {
    const vencedorIdx = matchScore[0] >= 3 ? 0 : 1;
    const pcLabel = modoJogo === 'CPU' ? "PC" : "JOGADOR 2";
    const rel = {img:"taca_1.png", titulo:"PARABÉNS!"};
    Engine.showResults(matchScore[0], matchScore[1], rel, pcLabel);
}
// === FIM SECÇÃO 4 ===


// ============================================================
// === INÍCIO SECÇÃO 6: SIMULAÇÃO DA CAPA (RÁPIDA) ===
// ============================================================
function iniciarSimulacao() {
    clearInterval(simuInterval);
    const board = document.getElementById('simu-board');
    if(!board) return;
    
    let sTab = Array(7).fill().map(() => Array(7).fill(0));
    const resetTab = () => { for(let c=0; c<7; c++) { sTab[0][c] = 2; sTab[1][c] = 2; sTab[5][c] = 1; sTab[6][c] = 1; } };
    resetTab();

    const render = () => {
        board.innerHTML = `<div class="grid-board" style="opacity:0.35;">` + 
            sTab.flat().map(v => `<div class="cell">${v?`<div class="piece ${v==1?'white':'black'}"></div>`:''}</div>`).join('') + `</div>`;
    };

    const animStep = () => {
        const player = Math.random() > 0.5 ? 1 : 2;
        const dir = player === 1 ? -1 : 1;
        const possibleMoves = [];
        for(let r=0; r<7; r++) for(let c=0; c<7; c++) if(sTab[r][c] === player && r+dir >= 0 && r+dir < 7 && sTab[r+dir][c] === 0) possibleMoves.push({fr:r,fc:c,tr:r+dir,tc:c});
        
        if(possibleMoves.length > 0 && Math.random() > 0.1){
            const m = possibleMoves[Math.floor(Math.random()*possibleMoves.length)];
            sTab[m.tr][m.tc] = sTab[m.fr][m.fc]; sTab[m.fr][m.fc] = 0;
        } else if (Math.random() > 0.8) {
            sTab = Array(7).fill().map(() => Array(7).fill(0)); resetTab();
        }
        render();
    };

    render();
    simuInterval = setInterval(animStep, 500); 
}
// === FIM SECÇÃO 6 ===
