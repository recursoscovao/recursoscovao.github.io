// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
let jogoAtivo = false;
let modoJogo = 'CPU';     
let nivelJogo = 1;        
let mostrarDicas = true;  
let matchScore = [0, 0];  // [Vertical, Horizontal]
let turnoAtual = 0;       // 0: Vertical (J1), 1: Horizontal (J2/Pc)
let currentGameNum = 1;   
let tabuleiro = [];       // 0: vazio, 1: ocupado
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
    
    /* J1 (Vertical) Verde | J2 (Horizontal) Vermelho */
    .box-v, .pill-j1 { background: #8cc63f !important; box-shadow: 0 3px 0 #6da32f; }
    .box-x, .pill-j2 { background: #ff5a5f !important; box-shadow: 0 3px 0 #d44348; }
    
    .blinking { animation: blinker 1s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.4; } }

    #round-feedback {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(6px); 
        z-index: 1000; display: none; align-items: center; justify-content: center; border-radius: 35px;
    }
    .vitoria-card { background: white; padding: 30px; border-radius: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.15); text-align: center; animation: cardPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.28); }
    @keyframes cardPop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    .capa-btn-row { display: flex; flex-direction: row; gap: 10px; width: 95%; max-width: 480px; justify-content: center; align-items: center; margin-top: 10px; }
    .btn-capa-small { flex: 1; height: 55px; border-radius: 12px; border: none; color: white; font-weight: 900; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-transform: uppercase; transition: 0.2s; white-space: nowrap; padding: 0 10px; }
    .btn-inform { width: 55px; height: 55px; flex: none; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .btn-inform img { width: 45px; height: 45px; object-fit: contain; }

    #simu-container { height: 260px; display: flex; align-items: center; justify-content: center; width: 100%; overflow: visible; margin-top: -60px; margin-bottom: 55px; }

    #instrucoes-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); transform: translateY(100%); visibility: hidden; padding: 40px 25px; overflow-y: auto; }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.2rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; transition: 0.2s; }

    .nivel-select-container { display: none; flex-direction: column; gap: 12px; width: 95%; max-width: 500px; animation: cardPop 0.3s ease; align-items: center; }
    .nivel-row { display: flex; flex-direction: row; gap: 6px; width: 100%; justify-content: center; }
    .btn-nivel { background: white; padding: 12px 2px; border-radius: 12px; border: 2px solid #eee; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; flex: 1; min-width: 0; }
    .btn-nivel b { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; }
    .btn-nivel span { font-size: 0.6rem; font-weight: 700; opacity: 0.7; text-align: center; }
    .btn-nivel.l1 { border-color: #8cc63f; color: #8cc63f; }
    .btn-nivel.l2 { border-color: #f9a825; color: #f9a825; }
    .btn-nivel.l3 { border-color: #ff5a5f; color: #ff5a5f; }

    /* ESTILO TABULEIRO 8x8 DOMINÓRIO */
    .grid-board { display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px; background: #bbb; padding: 3px; border-radius: 8px; width: fit-content; margin: 0 auto; }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 2px; position: relative; }
    
    /* Cores das Peças de Dominó */
    .cell.v-piece { background: #8cc63f !important; border: 1px solid #6da32f; }
    .cell.h-piece { background: #ff5a5f !important; border: 1px solid #d44348; }
    
    /* Preview de jogada */
    .cell.preview { background: #e8f5e9; border: 1px solid #8cc63f; cursor: pointer; }
    .cell.preview-h { background: #ffebee; border: 1px solid #ff5a5f; cursor: pointer; }

    .inst-content { max-width: 600px; margin: 0 auto; text-align: left; }
    .inst-header { color: var(--primary-color); text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 3px solid var(--bg-color); padding-bottom: 10px; }
    .inst-section-title { color: #444; font-size: 1.2rem; font-weight: 800; margin: 20px 0 10px; display: flex; align-items: center; gap: 10px; }
    .inst-section-title::before { content: ''; width: 6px; height: 22px; background: var(--primary-color); border-radius: 3px; display: inline-block; }
    .inst-text { color: #666; font-size: 1.05rem; line-height: 1.6; margin-bottom: 15px; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f9f9f9; margin-bottom: 8px; padding: 12px 15px; border-radius: 12px; border-left: 4px solid var(--bg-color); color: #555; font-size: 1rem; line-height: 1.4; }

    @media screen and (min-width: 1025px) { :root { --cell-size: 55px; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 10.5vw; } }
    @media screen and (max-height: 500px) and (orientation: landscape) { :root { --cell-size: 9vh; } }
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
                <div class="inst-header">Dominório</div>
                <div class="inst-section-title">Objetivo</div>
                <p class="inst-text">Vence o jogador que realizar a <b>última jogada possível</b>. O primeiro jogador que não se conseguir mover perde o jogo.</p>
                
                <div class="inst-section-title">Como Jogar</div>
                <ul class="inst-list">
                    <li><b>Vertical (Verde):</b> Só pode colocar peças na vertical (ocupa 2 casas: cima e baixo).</li>
                    <li><b>Horizontal (Vermelho):</b> Só pode colocar peças na horizontal (ocupa 2 casas: esquerda e direita).</li>
                    <li>As peças devem ser colocadas apenas em <b>quadrados vazios</b>.</li>
                    <li>O jogador <b>Vertical</b> é sempre o primeiro a começar.</li>
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
    if (modo === 'CPU') {
        container.innerHTML = `<p style="font-weight:800; color:#888; margin-bottom:5px; font-size:0.8rem;">DESAFIO CONTRA PC:</p>
            <div class="nivel-row">
                <div class="btn-nivel l1" onclick="setModo('CPU', 1)"><b>Nível 1</b><span>Com Dicas</span></div>
                <div class="btn-nivel l2" onclick="setModo('CPU', 2)"><b>Nível 2</b><span>Sem Dicas</span></div>
                <div class="btn-nivel l3" onclick="setModo('CPU', 3)"><b>Nível 3</b><span>Difícil</span></div>
            </div>
            <button class="btn-capa-small" style="background:#aaa; height:40px; width:140px; margin-top:10px;" onclick="voltarCapa()">VOLTAR</button>`;
    } else {
        container.innerHTML = `<p style="font-weight:800; color:#888; margin-bottom:5px; font-size:0.8rem;">2 JOGADORES (PVP):</p>
            <div class="nivel-row">
                <div class="btn-nivel l1" onclick="setModo('PVP', 1)"><b>Nível 1</b><span>Com Dicas</span></div>
                <div class="btn-nivel l2" onclick="setModo('PVP', 2)"><b>Nível 2</b><span>Sem Dicas</span></div>
            </div>
            <button class="btn-capa-small" style="background:#aaa; height:40px; width:140px; margin-top:10px;" onclick="voltarCapa()">VOLTAR</button>`;
    }
}

function voltarCapa() { document.getElementById('capa-menu-principal').style.display = 'block'; document.getElementById('nivel-select-container').style.display = 'none'; }
function toggleInstructions() { somClique.play(); document.getElementById('instrucoes-panel').classList.toggle('open'); }


// ============================================================
// 4. LÓGICA CORE DO JOGO E IA
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval); somClique.play();
    modoJogo = modo; nivelJogo = nivel;
    mostrarDicas = (nivel === 1);
    matchScore = [0, 0]; currentGameNum = 1; turnoAtual = 0; iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(8).fill().map(() => Array(8).fill(0));
    document.getElementById('round-feedback').style.display = 'none';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = "Pc";
    const j2Label = "J2";
    const labelSegundaBox = modoJogo === 'CPU' ? pcLabel : j2Label;
    let turnInfoHTML = "";
    if (modoJogo === 'CPU') {
        if (turnoAtual === 0) turnInfoHTML = `<div class="status-pill pill-j1 blinking">VEZ DO VERTICAL</div>`;
        else turnInfoHTML = `<div style="flex:1"></div>`; 
    } else {
        const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";
        const nomeVez = (turnoAtual === 0) ? "VERTICAL" : "HORIZONTAL";
        turnInfoHTML = `<div class="status-pill ${classPill} blinking">VEZ DO ${nomeVez}</div>`;
    }
    document.getElementById('shell-header-content').innerHTML = `
        <div class="status-container">
            ${turnInfoHTML}
            <div class="score-group">
                <div class="score-box box-v">V: ${matchScore[0]}</div>
                <div class="score-box box-x">${labelSegundaBox}: ${matchScore[1]}</div>
            </div>
        </div>`;
    renderTabuleiro();
}

function renderTabuleiro() {
    const area = document.getElementById('game-content');
    let html = `<div class="grid-board">`;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            let cl = "cell";
            if (tabuleiro[r][c] === 'V') cl += " v-piece";
            if (tabuleiro[r][c] === 'H') cl += " h-piece";
            
            const isHuman = (modoJogo === 'PVP' || turnoAtual === 0);
            
            if (jogoAtivo && isHuman && tabuleiro[r][c] === 0) {
                // Lógica de dicas/preview
                if (turnoAtual === 0 && r < 7 && tabuleiro[r+1][c] === 0) { // Vertical
                   if(mostrarDicas) cl += " preview";
                   html += `<div class="${cl}" onclick="jogar(${r},${c})"></div>`;
                } else if (turnoAtual === 1 && c < 7 && tabuleiro[r][c+1] === 0) { // Horizontal
                   if(mostrarDicas) cl += " preview-h";
                   html += `<div class="${cl}" onclick="jogar(${r},${c})"></div>`;
                } else { html += `<div class="${cl}"></div>`; }
            } else { html += `<div class="${cl}"></div>`; }
        }
    }
    area.innerHTML = html + `</div>`;
}

function jogar(r, c) {
    if (!jogoAtivo) return;
    if (turnoAtual === 0) { // Vertical
        tabuleiro[r][c] = 'V'; tabuleiro[r+1][c] = 'V';
    } else { // Horizontal
        tabuleiro[r][c] = 'H'; tabuleiro[r][c+1] = 'H';
    }
    somClique.play();
    turnoAtual = (turnoAtual === 0) ? 1 : 0;
    
    // Verificar se o próximo jogador tem jogadas
    if (!temJogadas(turnoAtual)) {
        finalizarRonda(turnoAtual === 0 ? 1 : 0); // O anterior ganha
        return;
    }

    if (modoJogo === 'CPU' && turnoAtual === 1) {
        atualizarUI();
        setTimeout(iaControlador, 600);
    } else { atualizarUI(); }
}

function iaControlador() {
    let legalMoves = getLegalMoves(1); // 1 é Horizontal
    if (legalMoves.length === 0) { finalizarRonda(0); return; }

    let move;
    if (nivelJogo === 1) move = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    else if (nivelJogo === 2) {
        // IA Média: Tenta jogar onde o Vertical (0) tem mais opções para o bloquear
        move = legalMoves.sort((a,b) => avaliar(b.r, b.c, 1) - avaliar(a.r, a.c, 1))[0];
    } else {
        // IA Difícil: Escolhe a jogada que deixa menos opções para o Vertical
        move = legalMoves.reduce((best, curr) => {
            let score = avaliar(curr.r, curr.c, 1);
            return (score > best.score) ? {m: curr, score: score} : best;
        }, {m: legalMoves[0], score: -1000}).m;
    }
    jogar(move.r, move.c);
}

function avaliar(r, c, type) {
    let tempTab = tabuleiro.map(row => [...row]);
    if(type === 1) { tempTab[r][c] = 'H'; tempTab[r][c+1] = 'H'; }
    let countVertical = 0;
    for(let i=0; i<7; i++) for(let j=0; j<8; j++) if(tempTab[i][j]===0 && tempTab[i+1][j]===0) countVertical++;
    return -countVertical; // Menos jogadas para o Vertical é melhor para a CPU
}

function getLegalMoves(type) {
    let moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (type === 0 && r < 7 && tabuleiro[r][c] === 0 && tabuleiro[r+1][c] === 0) moves.push({r, c});
            if (type === 1 && c < 7 && tabuleiro[r][c] === 0 && tabuleiro[r][c+1] === 0) moves.push({r, c});
        }
    }
    return moves;
}

function temJogadas(type) {
    return getLegalMoves(type).length > 0;
}

// ============================================================
// 5. FINALIZAÇÃO
// ============================================================
function finalizarRonda(vencedorIdx) {
    jogoAtivo = false;
    matchScore[vencedorIdx]++;
    somAcerto.play();
    const overlay = document.getElementById('round-feedback');
    const nomeVencedor = vencedorIdx === 0 ? "VERTICAL" : (modoJogo === 'CPU' ? "Pc" : "HORIZONTAL");
    const corVencedor = vencedorIdx === 0 ? "#8cc63f" : "#ff5a5f";
    const icone = vencedorIdx === 0 ? "fa-star" : "fa-trophy";
    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="vitoria-card">
        <div style="font-size: 3rem; color: ${corVencedor}; margin-bottom: 10px;"><i class="fas ${icone}"></i></div>
        <h1 style="color:${corVencedor}; font-size:2rem; font-weight:900; margin:0; text-transform:uppercase;">${nomeVencedor}</h1>
        <p style="color:#666; font-size:1.1rem; font-weight:700; margin:5px 0 0 0;">Venceu esta ronda!</p>
        <div style="margin-top:15px; padding-top:15px; border-top:2px dashed #eee; color:#aaa; font-weight:800;">PLACAR: V ${matchScore[0]} - ${matchScore[1]} H</div>
    </div>`;
    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 2000);
    else setTimeout(() => { currentGameNum++; turnoAtual = 0; iniciarJogo(); }, 2000);
}

function finalizarMatch() {
    document.getElementById('round-feedback').style.display = 'none';
    const vencedorIdx = (matchScore[0] >= 3) ? 0 : 1;
    const nomeVencedor = vencedorIdx === 0 ? "VERTICAL" : (modoJogo === 'CPU' ? "Pc" : "HORIZONTAL");
    document.getElementById('shell-header-content').innerHTML = `<h2>VITÓRIA FINAL</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:120px; margin-bottom:10px;">
            <h2 style="color:var(--primary-color); font-weight:900;">${nomeVencedor} VENCEU!</h2>
            <div style="display:flex; justify-content:center; gap:20px;">
                <div class="score-box box-v" style="padding:10px 20px; font-size:1.2rem;">V: ${matchScore[0]}</div>
                <div class="score-box box-x" style="padding:10px 20px; font-size:1.2rem;">H: ${matchScore[1]}</div>
            </div>
        </div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.style.gap = "10px";
    footer.innerHTML = `<button class="btn-capa-small" style="background:#6c757d;" onclick="location.reload()"><i class="fas fa-redo"></i> REPETIR</button>
                        <button class="btn-capa-small" style="background:var(--primary-color);" onclick="window.history.back()"><i class="fas fa-sign-out-alt"></i> SAIR</button>`;
}

function iniciarSimulacao() {
    clearInterval(simuInterval);
    const board = document.getElementById('simu-board');
    let sTab = Array(8).fill().map(() => Array(8).fill(0));
    let sTurno = 0;
    const render = () => {
        if(!board) return;
        let h = `<div class="grid-board" style="opacity:0.6; pointer-events:none;">`;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                let cl = "cell";
                if (sTab[r][c] === 'V') cl += " v-piece";
                if (sTab[r][c] === 'H') cl += " h-piece";
                h += `<div class="${cl}"></div>`;
            }
        }
        board.innerHTML = h + `</div>`;
    };
    simuInterval = setInterval(() => {
        let leg = [];
        for(let r=0; r<8; r++) for(let c=0; c<8; c++) {
            if(sTurno===0 && r<7 && sTab[r][c]===0 && sTab[r+1][c]===0) leg.push({r,c});
            if(sTurno===1 && c<7 && sTab[r][c]===0 && sTab[r][c+1]===0) leg.push({r,c});
        }
        if (leg.length === 0) { sTab = Array(8).fill().map(() => Array(8).fill(0)); sTurno = 0; }
        else {
            let m = leg[Math.floor(Math.random() * leg.length)];
            if(sTurno===0){ sTab[m.r][m.c]='V'; sTab[m.r+1][m.c]='V'; }
            else { sTab[m.r][m.c]='H'; sTab[m.r][m.c+1]='H'; }
            sTurno = (sTurno === 0) ? 1 : 0;
        }
        render();
    }, 600);
}
