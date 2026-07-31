// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
let jogoAtivo = false;
let modoJogo = 'CPU';     
let matchScore = [0, 0];  
let turnoAtual = 0;       
let currentGameNum = 1;   
let tabuleiro = [];       
let posBranca = { x: 4, y: 2 }; 
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
    .blinking { animation: blinker 1s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.4; } }

    #round-feedback {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(255,255,255,0.9); z-index: 1000;
        display: none; flex-direction: column; align-items: center; justify-content: center;
        border-radius: 35px; backdrop-filter: blur(4px);
    }

    .capa-btn-row { display: flex; flex-direction: row; gap: 10px; width: 100%; max-width: 480px; justify-content: center; align-items: center; margin-top: 10px; }
    .btn-capa-small { flex: 1; height: 55px; border-radius: 25px; border: none; color: white; font-weight: 900; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-transform: uppercase; }
    .btn-inform { width: 55px; height: 55px; flex: none; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .btn-inform img { width: 45px; height: 45px; object-fit: contain; }

    /* PAINEL DE INSTRUÇÕES MELHORADO */
    #instrucoes-panel { 
        position: absolute; bottom: -105%; left: 0; width: 100%; height: 100%; 
        background: white; z-index: 5000; transition: bottom 0.5s cubic-bezier(0.4, 0, 0.2, 1); 
        padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0;
    }
    #instrucoes-panel.open { bottom: 0; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.2rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; transition: 0.2s; }
    .close-x:hover { transform: scale(1.2); }

    .inst-content { max-width: 600px; margin: 0 auto; text-align: left; }
    .inst-header { color: var(--primary-color); text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 3px solid var(--bg-color); padding-bottom: 10px; }
    .inst-section-title { color: #444; font-size: 1.2rem; font-weight: 800; margin: 20px 0 10px; display: flex; align-items: center; gap: 10px; }
    .inst-section-title::before { content: ''; width: 6px; height: 22px; background: var(--primary-color); border-radius: 3px; display: inline-block; }
    .inst-text { color: #666; font-size: 1.05rem; line-height: 1.6; margin-bottom: 15px; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f9f9f9; margin-bottom: 8px; padding: 12px 15px; border-radius: 12px; border-left: 4px solid var(--bg-color); color: #555; font-size: 1rem; line-height: 1.4; }
    /* ------------------------------ */

    .rastros-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; background: #ccc; padding: 4px; border-radius: 8px; width: fit-content; margin: 0 auto; }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.1rem; position: relative; border-radius: 4px; color: #bbb; }
    .cell.blocked { background: #444; color: #444; }
    .cell.white-piece { background: white; z-index: 10; }
    .cell.white-piece::after { content: ''; width: 80%; height: 80%; background: white; border: 4px solid var(--primary-color); border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.2); }
    .cell.goal { background: #f0f0f0; color: #d54267; border: 2px dashed #bbb; }
    .cell.valid-move { background: #e0f0ff; cursor: pointer; border: 2px solid var(--primary-color); color: transparent; }

    @media screen and (min-width: 1025px) { :root { --cell-size: 60px; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 11vw; } }
    @media screen and (max-height: 500px) and (orientation: landscape) { :root { --cell-size: 10vh; } }
`;
document.head.appendChild(style);
// [FIM DA SECÇÃO 2]


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
            <div class="inst-content">
                <div class="inst-header">Como Jogar</div>
                
                <div class="inst-section-title">Objetivo</div>
                <p class="inst-text">Vence o jogador que conseguir levar a <b>peça branca</b> até à sua casa final ou deixar o adversário sem movimentos (bloqueado).</p>
                <ul class="inst-list">
                    <li><b>Jogador 1 (Canto Inferior):</b> Deve chegar à casa <b>1</b>.</li>
                    <li><b>Jogador 2 (Canto Superior):</b> Deve chegar à casa <b>2</b>.</li>
                </ul>

                <div class="inst-section-title">Regras Principais</div>
                <ul class="inst-list">
                    <li><b>1.</b> A peça branca começa no centro do tabuleiro (casa <b>e5</b>).</li>
                    <li><b>2.</b> Podes mover a peça para qualquer casa vazia ao lado (horizontal, vertical ou diagonal).</li>
                    <li><b>3.</b> Quando a peça sai de uma casa, essa casa fica <b>bloqueada</b> (fica preta) e ninguém pode voltar a passar por lá.</li>
                    <li><b>4.</b> O jogo termina mal a peça entre numa casa de vitória ou alguém fique cercado sem saída.</li>
                </ul>
                <div style="height:40px;"></div>
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
            <div class="btn-inform" onclick="toggleInstructions()">
                <img src="${JOGO_CONFIG.caminhoIconsMenu}inform.png">
            </div>
            <button class="btn-capa-small" style="background:var(--primary-color);" onclick="setModo('CPU')">
                <i class="fas fa-robot"></i> COMPUTADOR
            </button>
            <button class="btn-capa-small" style="background:#6c757d;" onclick="setModo('PVP')">
                <i class="fas fa-users"></i> 2 JOGADORES
            </button>
        </div>
    `;
    
    document.getElementById('shell-footer-content').style.display = 'none';
    iniciarSimulacao();
}

function toggleInstructions() {
    somClique.play();
    document.getElementById('instrucoes-panel').classList.toggle('open');
}

function iniciarSimulacao() {
    clearInterval(simuInterval);
    const container = document.getElementById('simu-container');
    let sTab = Array(7).fill().map(() => Array(7).fill(0));
    let sPos = { x: 4, y: 2 };
    sTab[sPos.y][sPos.x] = 2;

    const renderSimu = () => {
        let html = `<div class="rastros-grid" style="pointer-events:none; opacity:0.7;">`;
        for (let y = 0; y < 7; y++) {
            for (let x = 0; x < 7; x++) {
                let cl = "cell", num = "";
                if (x === 0 && y === 6) { cl += " goal"; num = "1"; }
                if (x === 6 && y === 0) { cl += " goal"; num = "2"; }
                if (sTab[y][x] === 1) cl += " blocked";
                if (sTab[y][x] === 2) cl += " white-piece";
                html += `<div class="${cl}">${num}</div>`;
            }
        }
        container.innerHTML = html + `</div>`;
    };

    const step = () => {
        let moves = [];
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                let nx = sPos.x + dx, ny = sPos.y + dy;
                if (nx >= 0 && nx < 7 && ny >= 0 && ny < 7 && sTab[ny][nx] === 0 && !(dx === 0 && dy === 0)) moves.push({x:nx, y:ny});
            }
        }
        if (moves.length === 0 || Math.random() > 0.92) { 
            sTab = Array(7).fill().map(() => Array(7).fill(0));
            sPos = { x: 4, y: 2 };
            sTab[sPos.y][sPos.x] = 2;
        } else {
            let m = moves[Math.floor(Math.random() * moves.length)];
            sTab[sPos.y][sPos.x] = 1;
            sPos = m;
            sTab[sPos.y][sPos.x] = 2;
        }
        renderSimu();
    };

    simuInterval = setInterval(step, 1000);
    renderSimu();
}
// [FIM DA SECÇÃO 3]


// ============================================================
// 4. LÓGICA CORE DO JOGO (REGRAS E TURNOS)
// ============================================================
function setModo(modo) {
    clearInterval(simuInterval);
    modoJogo = modo;
    matchScore = [0, 0];
    currentGameNum = 1;
    turnoAtual = 0; 
    iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(7).fill().map(() => Array(7).fill(0));
    posBranca = { x: 4, y: 2 }; 
    tabuleiro[posBranca.y][posBranca.x] = 2;
    document.getElementById('round-feedback').style.display = 'none';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = "Pc";
    const j2Label = "J2";
    const labelSegundaBox = modoJogo === 'CPU' ? pcLabel : j2Label;
    
    let turnInfoHTML = "";
    if (modoJogo === 'CPU') {
        if (turnoAtual === 0) turnInfoHTML = `<div class="status-pill pill-j1 blinking">VEZ DO JOGADOR 1</div>`;
        else turnInfoHTML = `<div style="flex:1"></div>`; 
    } else {
        const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";
        const nomeVez = (turnoAtual === 0) ? "JOGADOR 1" : "JOGADOR 2";
        turnInfoHTML = `<div class="status-pill ${classPill} blinking">VEZ DO ${nomeVez}</div>`;
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
    let html = `<div class="rastros-grid">`;
    for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
            let classe = "cell";
            let conteudo = "";
            if (x === 0 && y === 6) { classe += " goal"; conteudo = "1"; }
            if (x === 6 && y === 0) { classe += " goal"; conteudo = "2"; }
            if (tabuleiro[y][x] === 1) classe += " blocked";
            if (tabuleiro[y][x] === 2) classe += " white-piece";
            
            const dx = Math.abs(x - posBranca.x);
            const dy = Math.abs(y - posBranca.y);
            const humanoPodeJogar = (turnoAtual === 0) || (turnoAtual === 1 && modoJogo === 'PVP');

            if (humanoPodeJogar && tabuleiro[y][x] === 0 && dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0)) {
                classe += " valid-move";
                html += `<div class="${classe}" onclick="moverPeca(${x},${y})"></div>`;
            } else { html += `<div class="${classe}">${conteudo}</div>`; }
        }
    }
    html += `</div>`;
    area.innerHTML = html;
}

function moverPeca(nx, ny) {
    if (!jogoAtivo) return;
    somClique.play();
    tabuleiro[posBranca.y][posBranca.x] = 1;
    posBranca = { x: nx, y: ny };
    tabuleiro[ny][nx] = 2;

    if (nx === 0 && ny === 6) { finalizarRonda(0); return; }
    if (nx === 6 && ny === 0) { finalizarRonda(1); return; }
    if (getMovimentosPosiveis(nx, ny).length === 0) { finalizarRonda(turnoAtual); return; }

    turnoAtual = (turnoAtual === 0) ? 1 : 0;
    
    if (modoJogo === 'CPU' && turnoAtual === 1) {
        atualizarUI();
        setTimeout(cpuJogar, 600);
    } else { atualizarUI(); }
}

function cpuJogar() {
    const moves = getMovimentosPosiveis(posBranca.x, posBranca.y);
    if (moves.length === 0) { finalizarRonda(0); return; }
    moves.sort((a, b) => Math.hypot(a.x - 6, a.y - 0) - Math.hypot(b.x - 6, b.y - 0));
    const alvo = moves.find(m => m.x === 6 && m.y === 0) || moves[0];
    tabuleiro[posBranca.y][posBranca.x] = 1;
    posBranca = { x: alvo.x, y: alvo.y };
    tabuleiro[alvo.y][alvo.x] = 2;
    if (alvo.x === 6 && alvo.y === 0) { finalizarRonda(1); return; }
    if (getMovimentosPosiveis(alvo.x, alvo.y).length === 0) { finalizarRonda(1); return; }
    turnoAtual = 0;
    atualizarUI();
}

function getMovimentosPosiveis(cx, cy) {
    let possiveis = [];
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            let nx = cx + dx, ny = cy + dy;
            if (nx >= 0 && nx < 7 && ny >= 0 && ny < 7 && tabuleiro[ny][nx] === 0 && !(dx===0 && dy===0)) possiveis.push({ x: nx, y: ny });
        }
    }
    return possiveis;
}
// [FIM DA SECÇÃO 4]


// ============================================================
// 5. FINALIZAÇÃO (RONDA E MATCH)
// ============================================================
function finalizarRonda(vencedorIdx) {
    jogoAtivo = false;
    matchScore[vencedorIdx]++;
    somAcerto.play();
    
    const overlay = document.getElementById('round-feedback');
    const nomeVencedor = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    const corVencedor = vencedorIdx === 0 ? "#8cc63f" : "#ff5a5f";
    
    overlay.style.display = 'flex';
    overlay.innerHTML = `
        <h1 style="color:${corVencedor}; font-size:2.5rem; font-weight:900; margin-bottom:10px;">${nomeVencedor}</h1>
        <h2 style="color:#666; font-size:1.2rem;">Ganhou a Ronda!</h2>
    `;

    if (matchScore[0] >= 3 || matchScore[1] >= 3) {
        setTimeout(finalizarMatch, 1500);
    } else {
        setTimeout(() => {
            currentGameNum++;
            turnoAtual = 0; 
            iniciarJogo();
        }, 1500);
    }
}

function finalizarMatch() {
    jogoAtivo = false;
    document.getElementById('round-feedback').style.display = 'none';

    const vencedorIdx = (matchScore[0] >= 3) ? 0 : 1;
    const nomeVencedor = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    const labelSegundaBox = modoJogo === 'CPU' ? 'Pc' : 'J2';

    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">RESULTADOS FINAIS</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:150px; margin-bottom:10px;">
            <h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase; margin-bottom:20px;">GANHOU O ${nomeVencedor}</h2>
            <div style="display:flex; justify-content:center; gap:20px;">
                <div class="score-box box-v" style="padding:10px 20px; font-size:1.2rem;">J1: ${matchScore[0]}</div>
                <div class="score-box box-x" style="padding:10px 20px; font-size:1.2rem;">${labelSegundaBox}: ${matchScore[1]}</div>
            </div>
        </div>`;
    
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `<button class="btn-play-rect" style="background:#6c757d; flex:1;" onclick="location.reload()">REPETIR</button>
                        <button class="btn-play-rect" style="flex:1;" onclick="window.history.back()">SAIR</button>`;
}
// [FIM DA SECÇÃO 5]
