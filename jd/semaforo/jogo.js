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
let tabuleiro = Array(3).fill().map(() => Array(4).fill(0)); 
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

    #instrucoes-panel { position: fixed; top: 100vh; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: top 0.5s cubic-bezier(0.4, 0, 0.2, 1); padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0; }
    #instrucoes-panel.open { top: 0; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.2rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; transition: 0.2s; }

    .nivel-select-container { display: none; flex-direction: column; gap: 12px; width: 95%; max-width: 500px; animation: cardPop 0.3s ease; align-items: center; }
    .nivel-row { display: flex; flex-direction: row; gap: 6px; width: 100%; justify-content: center; }
    .btn-nivel { background: white; padding: 12px 2px; border-radius: 12px; border: 2px solid #eee; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; flex: 1; min-width: 0; }
    .btn-nivel b { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; }
    .btn-nivel span { font-size: 0.6rem; font-weight: 700; opacity: 0.7; text-align: center; }
    .btn-nivel.l1 { border-color: #8cc63f; color: #8cc63f; }
    .btn-nivel.l2 { border-color: #f9a825; color: #f9a825; }
    .btn-nivel.l3 { border-color: #ff5a5f; color: #ff5a5f; }

    /* ESTILO TABULEIRO - TAMANHOS ATUALIZADOS */
    .grid-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: #bbb; padding: 8px; border-radius: 15px; width: fit-content; margin: 0 auto; }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 10px; position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
    
    .piece { width: 85%; height: 85%; border-radius: 50%; box-shadow: inset 0 -4px 6px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1); border: 2px solid rgba(255,255,255,0.3); }
    .piece.green { background: #8cc63f; }
    .piece.yellow { background: #f9a825; }
    .piece.red { background: #ff5a5f; }
    
    .inst-content { max-width: 600px; margin: 0 auto; text-align: left; }
    .inst-header { color: var(--primary-color); text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 3px solid var(--bg-color); padding-bottom: 10px; }
    .inst-section-title { color: #444; font-size: 1.2rem; font-weight: 800; margin: 20px 0 10px; display: flex; align-items: center; gap: 10px; }
    .inst-section-title::before { content: ''; width: 6px; height: 22px; background: var(--primary-color); border-radius: 3px; display: inline-block; }
    .inst-text { color: #666; font-size: 1.05rem; line-height: 1.6; margin-bottom: 15px; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f9f9f9; margin-bottom: 8px; padding: 12px 15px; border-radius: 12px; border-left: 4px solid var(--bg-color); color: #555; font-size: 1rem; line-height: 1.4; }

    /* TAMANHOS DO TABULEIRO ADAPTADOS */
    @media screen and (min-width: 1025px) { :root { --cell-size: 110px; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 21vw; } }
    @media screen and (max-height: 500px) and (orientation: landscape) { :root { --cell-size: 23vh; } }
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
            <div class="inst-content">
                <div class="inst-header">Semáforo</div>
                <div class="inst-section-title">Objetivo</div>
                <p class="inst-text">Ser o primeiro a conseguir uma <b>linha de três peças da mesma cor</b> (horizontal, vertical ou diagonal).</p>
                <div class="inst-section-title">Como Jogar</div>
                <ul class="inst-list">
                    <li><b>1.</b> Podes colocar uma peça <b>Verde</b> num quadrado vazio.</li>
                    <li><b>2.</b> Podes substituir uma peça Verde por uma <b>Amarela</b>.</li>
                    <li><b>3.</b> Podes substituir uma peça Amarela por uma <b>Vermelha</b>.</li>
                    <li>As peças vermelhas não podem ser alteradas.</li>
                </ul>
            </div>`;
        document.body.appendChild(panel);
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.game-shell').appendChild(feedback);
    }

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board" style="transform: scale(0.85);"></div></div>
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
                <div class="btn-nivel l1" onclick="setModo('CPU', 1)"><b>Nível 1</b><span>Básico</span></div>
                <div class="btn-nivel l2" onclick="setModo('CPU', 2)"><b>Nível 2</b><span>Normal</span></div>
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
// 4. LÓGICA CORE DO JOGO E TURNOS
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval); somClique.play();
    modoJogo = modo; nivelJogo = nivel;
    matchScore = [0, 0]; currentGameNum = 1; turnoAtual = 0; iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(3).fill().map(() => Array(4).fill(0));
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
    let html = `<div class="grid-board">`;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
            let canClick = (tabuleiro[r][c] < 3) && (modoJogo === 'PVP' || turnoAtual === 0);
            let cl = "cell";
            
            html += `<div class="${cl}" onclick="jogar(${r},${c})">`;
            if (tabuleiro[r][c] === 1) html += `<div class="piece green"></div>`;
            if (tabuleiro[r][c] === 2) html += `<div class="piece yellow"></div>`;
            if (tabuleiro[r][c] === 3) html += `<div class="piece red"></div>`;
            html += `</div>`;
        }
    }
    area.innerHTML = html + `</div>`;
}

function jogar(r, c) {
    if (!jogoAtivo || tabuleiro[r][c] >= 3) return;
    tabuleiro[r][c]++;
    somClique.play();

    if (verificarVitoria(tabuleiro)) {
        finalizarRonda(turnoAtual);
        return;
    }
    turnoAtual = (turnoAtual === 0) ? 1 : 0;
    if (modoJogo === 'CPU' && turnoAtual === 1) { atualizarUI(); setTimeout(iaControlador, 600); }
    else { atualizarUI(); }
}

function iaControlador() {
    let moves = [];
    for(let r=0; r<3; r++) for(let c=0; c<4; c++) if(tabuleiro[r][c] < 3) moves.push({r, c});
    if (moves.length === 0) return;
    let move;
    if (nivelJogo >= 2) {
        for (let m of moves) {
            let tempTab = tabuleiro.map(row => [...row]);
            tempTab[m.r][m.c]++;
            if (verificarVitoria(tempTab)) { move = m; break; }
        }
    }
    if (!move && nivelJogo === 3) {
        moves = moves.filter(m => {
            let tempTab = tabuleiro.map(row => [...row]);
            tempTab[m.r][m.c]++;
            let winHumano = false;
            for(let r=0; r<3; r++) for(let c=0; c<4; c++) {
                if(tempTab[r][c] < 3) {
                    let hTab = tempTab.map(row => [...row]);
                    hTab[r][c]++;
                    if(verificarVitoria(hTab)) winHumano = true;
                }
            }
            return !winHumano;
        });
        if (moves.length === 0) for(let r=0; r<3; r++) for(let c=0; c<4; c++) if(tabuleiro[r][c] < 3) moves.push({r, c});
    }
    if (!move) move = moves[Math.floor(Math.random() * moves.length)];
    tabuleiro[move.r][move.c]++;
    if (verificarVitoria(tabuleiro)) { finalizarRonda(1); } 
    else { turnoAtual = 0; atualizarUI(); }
}

function verificarVitoria(tab) {
    for(let r=0; r<3; r++) for(let c=0; c<2; c++) if(tab[r][c]!==0 && tab[r][c]===tab[r][c+1] && tab[r][c]===tab[r][c+2]) return true;
    for(let c=0; c<4; c++) if(tab[0][c]!==0 && tab[0][c]===tab[1][c] && tab[0][c]===tab[2][c]) return true;
    for(let c=0; c<2; c++) {
        if(tab[0][c]!==0 && tab[0][c]===tab[1][c+1] && tab[0][c]===tab[2][c+2]) return true;
        if(tab[2][c]!==0 && tab[2][c]===tab[1][c+1] && tab[2][c]===tab[0][c+2]) return true;
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
    const nomeVencedor = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    const corVencedor = vencedorIdx === 0 ? "#8cc63f" : "#ff5a5f";
    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="vitoria-card">
        <div style="font-size: 3rem; color: ${corVencedor}; margin-bottom: 10px;"><i class="fas fa-star"></i></div>
        <h1 style="color:${corVencedor}; font-size:2.2rem; font-weight:900; margin:0; text-transform:uppercase;">${nomeVencedor}</h1>
        <p style="color:#666; font-size:1.1rem; font-weight:700; margin:5px 0 0 0;">Venceu esta ronda!</p>
        <div style="margin-top:15px; padding-top:15px; border-top:2px dashed #eee; color:#aaa; font-weight:800;">PLACAR: J1 ${matchScore[0]} - ${matchScore[1]}</div>
    </div>`;
    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 2000);
    else setTimeout(() => { currentGameNum++; turnoAtual = 0; iniciarJogo(); }, 2000);
}

function finalizarMatch() {
    document.getElementById('round-feedback').style.display = 'none';
    const vencedorIdx = (matchScore[0] >= 3) ? 0 : 1;
    const nomeVencedor = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    
    // Título de resultados com o mesmo estilo da capa
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">RESULTADOS FINAIS</h2>`;
    
    document.getElementById('game-content').innerHTML = `<div style="text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:150px; margin-bottom:10px;">
            <h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase; margin-bottom:20px;">GANHOU O ${nomeVencedor}</h2>
            <div style="display:flex; justify-content:center; gap:20px;">
                <div class="score-box box-v" style="padding:10px 20px; font-size:1.2rem;">J1: ${matchScore[0]}</div>
                <div class="score-box box-x" style="padding:10px 20px; font-size:1.2rem;">${modoJogo === 'CPU' ? 'Pc' : 'J2'}: ${matchScore[1]}</div>
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
    let sTab = Array(3).fill().map(() => Array(4).fill(0));
    const render = () => {
        if(!board) return;
        let h = `<div class="grid-board" style="opacity:0.6; pointer-events:none; transform:scale(0.9);">`;
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
            h += `<div class="cell">`;
            if(sTab[r][c]===1) h+=`<div class="piece green"></div>`;
            if(sTab[r][c]===2) h+=`<div class="piece yellow"></div>`;
            if(sTab[r][c]===3) h+=`<div class="piece red"></div>`;
            h += `</div>`;
        }
        board.innerHTML = h + `</div>`;
    };
    simuInterval = setInterval(() => {
        let leg = [];
        for(let r=0; r<3; r++) for(let c=0; c<4; c++) if(sTab[r][c]<3) leg.push({r,c});
        if (leg.length === 0 || verificarVitoria(sTab)) { sTab = Array(3).fill().map(() => Array(4).fill(0)); }
        else {
            let m = leg[Math.floor(Math.random() * leg.length)];
            sTab[m.r][m.c]++;
        }
        render();
    }, 700);
}
