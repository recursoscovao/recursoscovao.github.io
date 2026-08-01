// ============================================================
// 1. ESTADO GLOBAL, SONS E NÍVEIS
// ============================================================
let jogoAtivo = false;
let modoJogo = 'CPU';     
let nivelJogo = 1;        // 1, 2 ou 3
let mostrarDicas = true;  // Controla o destaque verde
let matchScore = [0, 0];  
let turnoAtual = 0;       
let currentGameNum = 1;   
let tabuleiro = [];       
let simuInterval;         

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// ============================================================
// 2. CONFIGURAÇÃO VISUAL (CSS ADICIONAL PARA NÍVEIS)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; }
    .status-pill { padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 0.9rem; color: white; transition: 0.3s; }
    .score-group { display: flex; gap: 8px; }
    .score-box { padding: 5px 10px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1rem; min-width: 55px; justify-content: center; }
    
    .box-v, .pill-j1 { background: #444 !important; box-shadow: 0 3px 0 #222; }
    .box-x, .pill-j2 { background: #f8f9fa !important; color: #444 !important; border: 2px solid #ddd; box-shadow: 0 3px 0 #ccc; }
    .blinking { animation: blinker 1s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.4; } }

    #round-feedback {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(6px); 
        z-index: 1000; display: none; align-items: center; justify-content: center; border-radius: 35px;
    }
    .vitoria-card { background: white; padding: 30px; border-radius: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.15); text-align: center; animation: cardPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.28); }
    @keyframes cardPop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    .capa-btn-row { display: flex; flex-direction: row; gap: 10px; width: 100%; max-width: 480px; justify-content: center; align-items: center; margin-top: 10px; }
    .btn-capa-small { flex: 1; height: 55px; border-radius: 25px; border: none; color: white; font-weight: 900; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-transform: uppercase; transition: 0.2s; }
    .btn-inform { width: 55px; height: 55px; flex: none; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .btn-inform img { width: 45px; height: 45px; object-fit: contain; }

    /* Estilo para menu de níveis */
    .nivel-select-container { display: none; flex-direction: column; gap: 10px; width: 100%; max-width: 300px; animation: cardPop 0.3s ease; }

    #instrucoes-panel { position: absolute; bottom: -105%; left: 0; width: 100%; height: 100%; background: white; z-index: 5000; transition: bottom 0.5s ease; padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0; }
    #instrucoes-panel.open { bottom: 0; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.2rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; }

    .grid-board { display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px; background: #bbb; padding: 3px; border-radius: 8px; width: fit-content; margin: 0 auto; }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; display: flex; align-items: center; justify-content: center; position: relative; border-radius: 2px; cursor: default; font-weight: 900; font-size: 1.2rem; color: #ccc; }
    .cell.central { background: #fff8e1; }
    .cell.legal-hint { background: #e8f5e9; cursor: pointer; border: 1px solid #8cc63f; }
    .cell img { width: 90%; height: 90%; object-fit: contain; z-index: 2; }

    @media screen and (min-width: 1025px) { :root { --cell-size: 55px; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 10.5vw; } }
    @media screen and (max-height: 500px) and (orientation: landscape) { :root { --cell-size: 9vh; } }
`;
document.head.appendChild(style);

// ============================================================
// 3. CAPA E SELEÇÃO DE NÍVEL
// ============================================================
function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">${JOGO_CONFIG.nomeDoJogo.toUpperCase()}</h2>`;
    
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `<span class="close-x" onclick="toggleInstructions()">&times;</span><div id="inst-text-area"></div>`;
        document.querySelector('.game-shell').appendChild(panel);
        document.getElementById('inst-text-area').innerHTML = `
            <h2 style="color:var(--primary-color); text-align:center;">COMO JOGAR</h2>
            <p><b>Objetivo:</b> Ganha o jogador que realizar a última jogada possível no tabuleiro.</p>
            <ul>
                <li>Gatos (Pretos) começam e o primeiro deve ser na <b>zona central</b> (X).</li>
                <li>Cães (Brancos) jogam a seguir e o primeiro deve ser <b>fora da zona central</b>.</li>
                <li><b>Proibição:</b> Não podes colocar uma peça ao lado de uma do tipo oposto.</li>
            </ul>`;
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.game-shell').appendChild(feedback);
    }

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container" style="transform: scale(0.65); margin-top: -30px;"></div>
        
        <!-- Menu Principal da Capa -->
        <div id="capa-menu-principal" style="display:flex; flex-direction:column; align-items:center; width:100%;">
            <div class="capa-btn-row">
                <div class="btn-inform" onclick="toggleInstructions()"><img src="${JOGO_CONFIG.caminhoIconsMenu}inform.png"></div>
                <button class="btn-capa-small" style="background:var(--primary-color);" onclick="mostrarMenuNiveis()">
                    <i class="fas fa-robot"></i> COMPUTADOR
                </button>
                <button class="btn-capa-small" style="background:#6c757d;" onclick="setModo('PVP', 1)">
                    <i class="fas fa-users"></i> 2 JOGADORES
                </button>
            </div>
        </div>

        <!-- Sub-menu de Níveis -->
        <div id="nivel-select-container" class="nivel-select-container">
            <button class="btn-capa-small" style="background:#8cc63f;" onclick="setModo('CPU', 1)">Nível 1 (Dicas)</button>
            <button class="btn-capa-small" style="background:#f9a825;" onclick="setModo('CPU', 2)">Nível 2 (Normal)</button>
            <button class="btn-capa-small" style="background:#ff5a5f;" onclick="setModo('CPU', 3)">Nível 3 (Avançado)</button>
            <button class="btn-capa-small" style="background:#aaa; height:40px;" onclick="voltarMenuPrincipal()">VOLTAR</button>
        </div>
    `;
    document.getElementById('shell-footer-content').style.display = 'none';
    iniciarSimulacao();
}

function mostrarMenuNiveis() {
    document.getElementById('capa-menu-principal').style.display = 'none';
    document.getElementById('nivel-select-container').style.display = 'flex';
}

function voltarMenuPrincipal() {
    document.getElementById('capa-menu-principal').style.display = 'flex';
    document.getElementById('nivel-select-container').style.display = 'none';
}

function toggleInstructions() { somClique.play(); document.getElementById('instrucoes-panel').classList.toggle('open'); }

// ============================================================
// 4. LÓGICA CORE E IA POR NÍVEL
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval); somClique.play();
    modoJogo = modo;
    nivelJogo = nivel;
    // Dicas apenas no Nível 1 ou em 2 Jogadores (podes mudar isto se quiseres dicas no PVP também)
    mostrarDicas = (nivel === 1 || modo === 'PVP');
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
        if (turnoAtual === 0) turnInfoHTML = `<div class="status-pill pill-j1 blinking">GATOS (Nível ${nivelJogo})</div>`;
        else turnInfoHTML = `<div style="flex:1"></div>`; 
    } else {
        const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";
        const nomeVez = (turnoAtual === 0) ? "GATOS" : "CÃES";
        turnInfoHTML = `<div class="status-pill ${classPill} blinking">VEZ DOS ${nomeVez}</div>`;
    }
    document.getElementById('shell-header-content').innerHTML = `
        <div class="status-container">
            ${turnInfoHTML}
            <div class="score-group">
                <div class="score-box box-v">J1: ${matchScore[0]}</div>
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
            if (isCentral(r, c)) cl += " central";
            const playerType = (turnoAtual === 0) ? 1 : 2;
            const isHuman = (modoJogo === 'PVP' || turnoAtual === 0);
            
            // Verifica se deve mostrar as dicas verdes (legal-hint)
            if (jogoAtivo && isHuman && isLegal(r, c, playerType, tabuleiro)) {
                if (mostrarDicas) cl += " legal-hint";
                html += `<div class="${cl}" onclick="jogar(${r},${c})">`;
            } else { html += `<div class="${cl}">`; }
            
            if (tabuleiro[r][c] === 1) html += `<img src="${DADOS_JOGO.caminhoImagens}gato.png">`;
            else if (tabuleiro[r][c] === 2) html += `<img src="${DADOS_JOGO.caminhoImagens}cao.png">`;
            else if (isCentral(r, c)) html += `X`; 
            html += `</div>`;
        }
    }
    area.innerHTML = html + `</div>`;
}

function jogar(r, c) {
    if (!jogoAtivo) return;
    const pType = (turnoAtual === 0) ? 1 : 2;
    tabuleiro[r][c] = pType;
    somClique.play();
    turnoAtual = (turnoAtual === 0) ? 1 : 0;
    if (!temJogadas(turnoAtual === 0 ? 1 : 2, tabuleiro)) {
        finalizarRonda(turnoAtual === 0 ? 1 : 0);
        return;
    }
    if (modoJogo === 'CPU' && turnoAtual === 1) {
        atualizarUI();
        setTimeout(iaControlador, 600);
    } else { atualizarUI(); }
}

// Lógica de IA baseada no nível
function iaControlador() {
    let legalMoves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isLegal(r, c, 2, tabuleiro)) legalMoves.push({r, c});
        }
    }
    if (legalMoves.length === 0) { finalizarRonda(0); return; }

    let move;
    if (nivelJogo === 1) {
        // Nível 1: Totalmente aleatório
        move = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    } 
    else if (nivelJogo === 2) {
        // Nível 2: Tenta ocupar as bordas (posições defensivas)
        let edges = legalMoves.filter(m => m.r === 0 || m.r === 7 || m.c === 0 || m.c === 7);
        move = edges.length > 0 ? edges[Math.floor(Math.random() * edges.length)] : legalMoves[Math.floor(Math.random() * legalMoves.length)];
    } 
    else {
        // Nível 3: Bloqueio Estratégico (Maximiza as próprias jogadas futuras e minimiza as do jogador)
        move = legalMoves.reduce((best, current) => {
            let score = avaliarJogada(current.r, current.c);
            return (score > best.score) ? {r: current.r, c: current.c, score: score} : best;
        }, {r: legalMoves[0].r, c: legalMoves[0].c, score: -1000});
    }

    jogar(move.r, move.c);
}

// Heurística para Nível 3: Conta quantas jogadas o humano perde se a CPU jogar aqui
function avaliarJogada(r, c) {
    let tempTab = tabuleiro.map(row => [...row]);
    tempTab[r][c] = 2; // CPU simula jogada
    let jogadasHumano = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (isLegal(i, j, 1, tempTab)) jogadasHumano++;
        }
    }
    // Quanto menos jogadas sobrarem para o humano, melhor para a CPU
    return -jogadasHumano;
}

function isCentral(r, c) { return r >= 3 && r <= 4 && c >= 3 && c <= 4; }

function isLegal(r, c, pType, tab) {
    if (tab[r][c] !== 0) return false;
    let totalPieces = tab.flat().filter(x => x !== 0).length;
    if (pType === 1 && totalPieces === 0 && !isCentral(r, c)) return false;
    if (pType === 2 && totalPieces === 1 && isCentral(r, c)) return false;
    const dr = [-1, 1, 0, 0], dc = [0, 0, -1, 1];
    const opponent = (pType === 1) ? 2 : 1;
    for (let i = 0; i < 4; i++) {
        let nr = r + dr[i], nc = c + dc[i];
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && tab[nr][nc] === opponent) return false;
    }
    return true;
}

function temJogadas(pType, tab) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isLegal(r, c, pType, tab)) return true;
        }
    }
    return false;
}

// ============================================================
// 5. FINALIZAÇÃO
// ============================================================
function finalizarRonda(vencedorIdx) {
    jogoAtivo = false;
    matchScore[vencedorIdx]++;
    somAcerto.play();
    const overlay = document.getElementById('round-feedback');
    const nomeVencedor = vencedorIdx === 0 ? "GATOS" : (modoJogo === 'CPU' ? "Pc" : "CÃES");
    const corVencedor = vencedorIdx === 0 ? "#444" : "#ff5a5f";
    overlay.style.display = 'flex';
    overlay.innerHTML = `
        <div class="vitoria-card">
            <h1 style="color:${corVencedor}; font-size:2rem; font-weight:900; margin:0;">${nomeVencedor}</h1>
            <p style="color:#666; font-weight:700;">Ganharam a ronda!</p>
            <div style="margin-top:15px; padding-top:10px; border-top:2px dashed #eee; font-weight:800;">
                PLACAR: J1 ${matchScore[0]} - ${matchScore[1]} ${modoJogo === 'CPU' ? 'Pc' : 'J2'}
            </div>
        </div>`;
    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 2000);
    else setTimeout(() => { currentGameNum++; turnoAtual = 0; iniciarJogo(); }, 2000);
}

function finalizarMatch() {
    document.getElementById('round-feedback').style.display = 'none';
    const vencedorIdx = (matchScore[0] >= 3) ? 0 : 1;
    const nomeVencedor = vencedorIdx === 0 ? "GATOS" : (modoJogo === 'CPU' ? "Pc" : "CÃES");
    document.getElementById('shell-header-content').innerHTML = `<h2>VITÓRIA FINAL</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:120px; margin-bottom:10px;">
            <h2 style="color:var(--primary-color); font-weight:900;">${nomeVencedor} VENCERAM!</h2>
            <p style="font-weight:800; color:#666;">MODO: ${modoJogo === 'CPU' ? 'Nível ' + nivelJogo : '2 Jogadores'}</p>
        </div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `<button class="btn-capa-small" style="background:#6c757d; flex:1;" onclick="location.reload()">REPETIR</button>
                        <button class="btn-capa-small" style="background:var(--primary-color); flex:1;" onclick="window.history.back()">SAIR</button>`;
}

// SIMULAÇÃO (Mantida igual, apenas atualizada para passar o tabuleiro)
function iniciarSimulacao() {
    clearInterval(simuInterval);
    const container = document.getElementById('simu-container');
    let sTab = Array(8).fill().map(() => Array(8).fill(0));
    let sTurno = 0;
    const render = () => {
        if(!container) return;
        let h = `<div class="grid-board" style="opacity:0.6; transform:scale(0.85); pointer-events:none;">`;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                h += `<div class="cell ${isCentral(r,c)?'central':''}">`;
                if(sTab[r][c]===1) h+=`<img src="${DADOS_JOGO.caminhoImagens}gato.png">`;
                else if(sTab[r][c]===2) h+=`<img src="${DADOS_JOGO.caminhoImagens}cao.png">`;
                else if(isCentral(r,c)) h+= `X`;
                h += `</div>`;
            }
        }
        container.innerHTML = h + `</div>`;
    };
    simuInterval = setInterval(() => {
        let p = (sTurno === 0) ? 1 : 2;
        let legal = [];
        for(let r=0; r<8; r++) for(let c=0; c<8; c++) if(isLegal(r,c,p,sTab)) legal.push({r,c});
        if (legal.length === 0) { sTab = Array(8).fill().map(() => Array(8).fill(0)); sTurno = 0; }
        else {
            let m = legal[Math.floor(Math.random() * legal.length)];
            sTab[m.r][m.c] = p;
            sTurno = (sTurno === 0) ? 1 : 0;
        }
        render();
    }, 800);
}
