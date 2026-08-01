// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
let jogoAtivo = false;
let modoJogo = 'CPU';     
let matchScore = [0, 0];  
let turnoAtual = 0;       
let currentGameNum = 1;   
let tabuleiro = [];       
let simuInterval;         

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// ============================================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
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

    #instrucoes-panel { position: absolute; bottom: -105%; left: 0; width: 100%; height: 100%; background: white; z-index: 5000; transition: bottom 0.5s ease; padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0; }
    #instrucoes-panel.open { bottom: 0; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.2rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; }

    .grid-board {
        display: grid; grid-template-columns: repeat(8, 1fr);
        gap: 2px; background: #bbb; padding: 3px; border-radius: 8px;
        width: fit-content; margin: 0 auto;
    }
    .cell {
        width: var(--cell-size); height: var(--cell-size); background: white;
        display: flex; align-items: center; justify-content: center;
        position: relative; border-radius: 2px; cursor: default;
        font-weight: 900; font-size: 1.2rem; color: #ccc; /* Cor do X */
    }
    .cell.central { background: #fff8e1; }
    .cell.legal-hint { background: #e8f5e9; cursor: pointer; border: 1px solid #8cc63f; }
    .cell img { width: 90%; height: 90%; object-fit: contain; z-index: 2; }

    @media screen and (min-width: 1025px) { :root { --cell-size: 55px; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 10.5vw; } }
    @media screen and (max-height: 500px) and (orientation: landscape) { :root { --cell-size: 9vh; } }
`;
document.head.appendChild(style);

// ============================================================
// 3. CAPA, SIMULAÇÃO E INSTRUÇÕES
// ============================================================
function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">${JOGO_CONFIG.nomeDoJogo.toUpperCase()}</h2>`;
    
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `
            <span class="close-x" onclick="toggleInstructions()">&times;</span>
            <div style="max-width:600px; margin:0 auto; text-align:left;">
                <h2 style="color:var(--primary-color); text-align:center;">COMO JOGAR</h2>
                <p><b>Objetivo:</b> Ganha o jogador que realizar a última jogada possível no tabuleiro.</p>
                <p><b>Regras:</b></p>
                <ul>
                    <li>Gatos (Pretos) começam e o primeiro deve ser na <b>zona central</b> (marcadas com X).</li>
                    <li>Cães (Brancos) jogam a seguir e o primeiro deve ser <b>fora da zona central</b>.</li>
                    <li><b>Proibição:</b> Não podes colocar um Gato encostado (H/V) a um Cão, nem um Cão encostado a um Gato.</li>
                    <li>O jogo termina quando um jogador não tiver mais espaço livre para as suas peças.</li>
                </ul>
            </div>
        `;
        document.querySelector('.game-shell').appendChild(panel);
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.game-shell').appendChild(feedback);
    }

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container" style="transform: scale(0.65); margin-top: -30px;"></div>
        <div class="capa-btn-row">
            <div class="btn-inform" onclick="toggleInstructions()"><img src="${JOGO_CONFIG.caminhoIconsMenu}inform.png"></div>
            <button class="btn-capa-small" style="background:var(--primary-color);" onclick="setModo('CPU')"><i class="fas fa-robot"></i> COMPUTADOR</button>
            <button class="btn-capa-small" style="background:#6c757d;" onclick="setModo('PVP')"><i class="fas fa-users"></i> 2 JOGADORES</button>
        </div>
    `;
    document.getElementById('shell-footer-content').style.display = 'none';
    iniciarSimulacao();
}

function toggleInstructions() { somClique.play(); document.getElementById('instrucoes-panel').classList.toggle('open'); }

// ============================================================
// 4. LÓGICA CORE DO JOGO
// ============================================================
function setModo(modo) {
    clearInterval(simuInterval); somClique.play();
    modoJogo = modo; matchScore = [0, 0]; currentGameNum = 1; turnoAtual = 0; iniciarJogo();
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
        if (turnoAtual === 0) turnInfoHTML = `<div class="status-pill pill-j1 blinking">VEZ DOS GATOS (J1)</div>`;
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

function isCentral(r, c) { return r >= 3 && r <= 4 && c >= 3 && c <= 4; }

function isLegal(r, c, pType) {
    if (tabuleiro[r][c] !== 0) return false;
    let totalPieces = tabuleiro.flat().filter(x => x !== 0).length;
    if (pType === 1 && totalPieces === 0 && !isCentral(r, c)) return false;
    if (pType === 2 && totalPieces === 1 && isCentral(r, c)) return false;
    const dr = [-1, 1, 0, 0], dc = [0, 0, -1, 1];
    const opponent = (pType === 1) ? 2 : 1;
    for (let i = 0; i < 4; i++) {
        let nr = r + dr[i], nc = c + dc[i];
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            if (tabuleiro[nr][nc] === opponent) return false;
        }
    }
    return true;
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
            
            if (jogoAtivo && isHuman && isLegal(r, c, playerType)) {
                cl += " legal-hint";
                html += `<div class="${cl}" onclick="jogar(${r},${c})">`;
            } else {
                html += `<div class="${cl}">`;
            }
            
            if (tabuleiro[r][c] === 1) html += `<img src="${DADOS_JOGO.caminhoImagens}gato.png">`;
            else if (tabuleiro[r][c] === 2) html += `<img src="${DADOS_JOGO.caminhoImagens}cao.png">`;
            else if (isCentral(r, c)) html += `X`; // ADICIONADO O X NAS CÉLULAS VAZIAS CENTRAIS
            
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
    if (!temJogadas(turnoAtual === 0 ? 1 : 2)) {
        finalizarRonda(turnoAtual === 0 ? 1 : 0);
        return;
    }
    if (modoJogo === 'CPU' && turnoAtual === 1) {
        atualizarUI();
        setTimeout(cpuInteligente, 600);
    } else {
        atualizarUI();
    }
}

function temJogadas(pType) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isLegal(r, c, pType)) return true;
        }
    }
    return false;
}

function cpuInteligente() {
    let boas = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isLegal(r, c, 2)) boas.push({r, c});
        }
    }
    if (boas.length === 0) { finalizarRonda(0); return; }
    let move = boas[Math.floor(Math.random() * boas.length)];
    jogar(move.r, move.c);
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
    const imgVencedor = vencedorIdx === 0 ? "gato.png" : "cao.png";
    overlay.style.display = 'flex';
    overlay.innerHTML = `
        <div class="vitoria-card">
            <img src="${DADOS_JOGO.caminhoImagens}${imgVencedor}" style="height:60px; margin-bottom:10px;">
            <h1 style="color:${corVencedor}; font-size:2rem; font-weight:900; margin:0;">${nomeVencedor}</h1>
            <p style="color:#666; font-weight:700;">Ganharam esta ronda!</p>
            <div style="margin-top:15px; padding-top:10px; border-top:2px dashed #eee; font-weight:800;">
                PLACAR: J1 ${matchScore[0]} - ${matchScore[1]} ${modoJogo === 'CPU' ? 'Pc' : 'J2'}
            </div>
        </div>`;
    if (matchScore[0] >= 3 || matchScore[1] >= 3) {
        setTimeout(finalizarMatch, 2000);
    } else {
        setTimeout(() => { currentGameNum++; turnoAtual = 0; iniciarJogo(); }, 2000);
    }
}

function finalizarMatch() {
    document.getElementById('round-feedback').style.display = 'none';
    const vencedorIdx = (matchScore[0] >= 3) ? 0 : 1;
    const nomeVencedor = vencedorIdx === 0 ? "GATOS" : (modoJogo === 'CPU' ? "Pc" : "CÃES");
    document.getElementById('shell-header-content').innerHTML = `<h2>VITÓRIA FINAL</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:120px; margin-bottom:10px;">
            <h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${nomeVencedor} VENCERAM O JOGO!</h2>
            <p style="font-weight:800; color:#666;">PLACAR FINAL: ${matchScore[0]} - ${matchScore[1]}</p>
        </div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `<button class="btn-capa-small" style="background:#6c757d; flex:1;" onclick="location.reload()"><i class="fas fa-redo"></i> REPETIR</button>
                        <button class="btn-capa-small" style="background:var(--primary-color); flex:1;" onclick="window.history.back()"><i class="fas fa-sign-out-alt"></i> SAIR</button>`;
}

// SIMULAÇÃO NA CAPA
function iniciarSimulacao() {
    clearInterval(simuInterval);
    const container = document.getElementById('simu-container');
    let sTab = Array(8).fill().map(() => Array(8).fill(0));
    let sTurno = 0;
    const render = () => {
        let h = `<div class="grid-board" style="opacity:0.6; transform:scale(0.9); pointer-events:none;">`;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                h += `<div class="cell ${isCentral(r,c)?'central':''}">`;
                if(sTab[r][c]===1) h+=`<img src="${DADOS_JOGO.caminhoImagens}gato.png">`;
                else if(sTab[r][c]===2) h+=`<img src="${DADOS_JOGO.caminhoImagens}cao.png">`;
                else if(isCentral(r,c)) h+= `X`; // TAMBÉM NA SIMULAÇÃO
                h += `</div>`;
            }
        }
        container.innerHTML = h + `</div>`;
    };
    simuInterval = setInterval(() => {
        let p = (sTurno === 0) ? 1 : 2;
        let legal = [];
        for(let r=0; r<8; r++) for(let c=0; c<8; c++) if(isLegalSimulation(r,c,p,sTab)) legal.push({r,c});
        if (legal.length === 0) { sTab = Array(8).fill().map(() => Array(8).fill(0)); sTurno = 0; }
        else {
            let m = legal[Math.floor(Math.random() * legal.length)];
            sTab[m.r][m.c] = p;
            sTurno = (sTurno === 0) ? 1 : 0;
        }
        render();
    }, 800);
}

function isLegalSimulation(r, c, pType, tab) {
    if (tab[r][c] !== 0) return false;
    let total = tab.flat().filter(x=>x!==0).length;
    if(pType===1 && total===0 && !isCentral(r,c)) return false;
    if(pType===2 && total===1 && isCentral(r,c)) return false;
    const dr=[-1,1,0,0], dc=[0,0,-1,1], opp=(pType===1)?2:1;
    for(let i=0; i<4; i++){
        let nr=r+dr[i], nc=c+dc[i];
        if(nr>=0 && nr<8 && nc>=0 && nc<8 && tab[nr][nc]===opp) return false;
    }
    return true;
}
