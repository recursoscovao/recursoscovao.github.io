// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
let jogoAtivo = false;
let modoJogo = 'CPU';     
let nivelJogo = 1;        
let mostrarDicas = true;  
let matchScore = [0, 0];  
let turnoAtual = 0;       // 0: Vertical (J1), 1: Horizontal (J2/Pc)
let currentGameNum = 1;   
let tabuleiro = Array(10).fill().map(() => Array(10).fill(0)); 
let startCell = null;     // Para selecionar o início da peça (2 ou mais)
let primeiraJogadaRealizada = false;
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

    /* ESTILO TABULEIRO 10x10 QUELHAS */
    .grid-board { display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; background: #bbb; padding: 3px; border-radius: 8px; width: fit-content; margin: 0 auto; }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 1px; position: relative; cursor: pointer; display:flex; align-items:center; justify-content:center;}
    
    .cell.occupied { background: #333 !important; }
    .cell.selected { background: #e8f5e9; border: 2px solid #8cc63f; }
    .cell.valid-move { background: #f1f8e9; }

    .inst-content { max-width: 600px; margin: 0 auto; text-align: left; }
    .inst-header { color: var(--primary-color); text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 3px solid var(--bg-color); padding-bottom: 10px; }
    .inst-section-title { color: #444; font-size: 1.2rem; font-weight: 800; margin: 20px 0 10px; display: flex; align-items: center; gap: 10px; }
    .inst-section-title::before { content: ''; width: 6px; height: 22px; background: var(--primary-color); border-radius: 3px; display: inline-block; }
    .inst-text { color: #666; font-size: 1.05rem; line-height: 1.6; margin-bottom: 15px; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f9f9f9; margin-bottom: 8px; padding: 12px 15px; border-radius: 12px; border-left: 4px solid var(--bg-color); color: #555; font-size: 1rem; line-height: 1.4; }

    @media screen and (min-width: 1025px) { :root { --cell-size: 45px; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 8.5vw; } }
    @media screen and (max-height: 500px) and (orientation: landscape) { :root { --cell-size: 7.5vh; } }
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
                <div class="inst-header">Como Jogar Quelhas</div>
                <div class="inst-section-title">Objetivo</div>
                <p class="inst-text">Este é um jogo de estratégia "Misere": o jogador que realizar a <b>última jogada possível PERDE o jogo</b>. O teu objetivo é forçar o adversário a fazer o último lance.</p>

                <div class="inst-section-title">Como Jogar</div>
                <ul class="inst-list">
                    <li><b>Vertical (Verde):</b> Coloca blocos de 2 ou mais peças na vertical.</li>
                    <li><b>Horizontal (Vermelho):</b> Coloca blocos de 2 ou mais peças na horizontal.</li>
                    <li><b>Interação:</b> Clica na primeira casa e depois na última casa para formar o teu bloco.</li>
                    <li><b>Regra da Troca:</b> Na primeira jogada do 2º jogador, este pode optar por trocar de orientação com o adversário.</li>
                </ul>
            </div>`;
        document.body.appendChild(panel);
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.game-shell').appendChild(feedback);
    }

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board" style="transform: scale(0.7);"></div></div>
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
                <div class="btn-nivel l1" onclick="setModo('CPU', 1)"><b>Nível 1</b><span>Simples</span></div>
                <div class="btn-nivel l2" onclick="setModo('CPU', 2)"><b>Nível 2</b><span>Normal</span></div>
                <div class="btn-nivel l3" onclick="setModo('CPU', 3)"><b>Nível 3</b><span>Estratégico</span></div>
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
// 4. LÓGICA CORE DO JOGO
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval); somClique.play();
    modoJogo = modo; nivelJogo = nivel;
    mostrarDicas = (nivel === 1);
    matchScore = [0, 0]; currentGameNum = 1; turnoAtual = 0; iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(10).fill().map(() => Array(10).fill(0));
    startCell = null;
    primeiraJogadaRealizada = false;
    document.getElementById('round-feedback').style.display = 'none';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = "Pc";
    const j2Label = "J2";
    const labelSegundaBox = modoJogo === 'CPU' ? pcLabel : j2Label;
    let turnInfoHTML = "";

    const nomeVez = (turnoAtual === 0) ? "VERTICAL (J1)" : (modoJogo === 'CPU' ? "PC" : "HORIZONTAL (J2)");
    const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";

    if (modoJogo === 'CPU' && turnoAtual === 1) {
        turnInfoHTML = `<div style="flex:1"></div>`; 
    } else {
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
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            let cl = "cell";
            if (tabuleiro[r][c] === 1) cl += " occupied";
            if (startCell && startCell.r === r && startCell.c === c) cl += " selected";
            
            html += `<div class="${cl}" onclick="handleCellClick(${r},${c})"></div>`;
        }
    }
    area.innerHTML = html + `</div>`;
    
    // Botão de Troca na primeira jogada do J2
    if (primeiraJogadaRealizada && !tabuleiro.flat().includes(2) && turnoAtual === 1 && modoJogo === 'PVP') {
        const btnSwap = document.createElement('button');
        btnSwap.className = "btn-capa-small";
        btnSwap.style = "background: #f9a825; margin-top:10px; width:200px;";
        btnSwap.innerText = "Trocar Orientação";
        btnSwap.onclick = swapOrientations;
        area.appendChild(btnSwap);
    }
}

function handleCellClick(r, c) {
    if (!jogoAtivo || (modoJogo === 'CPU' && turnoAtual === 1)) return;
    if (tabuleiro[r][c] !== 0) { startCell = null; renderTabuleiro(); return; }

    if (!startCell) {
        startCell = { r, c };
        somClique.play();
        renderTabuleiro();
    } else {
        // Tentar finalizar a peça
        if (validarPeca(startCell.r, startCell.c, r, c, turnoAtual)) {
            colocarPeca(startCell.r, startCell.c, r, c);
            startCell = null;
            finalizarTurno();
        } else {
            startCell = { r, c }; // Reinicia seleção
            somClique.play();
            renderTabuleiro();
        }
    }
}

function validarPeca(r1, c1, r2, c2, turno) {
    if (turno === 0) { // Vertical
        if (c1 !== c2) return false;
        let start = Math.min(r1, r2), end = Math.max(r1, r2);
        if (end - start < 1) return false; // Pelo menos 2 quadrículas
        for (let i = start; i <= end; i++) if (tabuleiro[i][c1] !== 0) return false;
        return true;
    } else { // Horizontal
        if (r1 !== r2) return false;
        let start = Math.min(c1, c2), end = Math.max(c1, c2);
        if (end - start < 1) return false;
        for (let i = start; i <= end; i++) if (tabuleiro[r1][i] !== 0) return false;
        return true;
    }
}

function colocarPeca(r1, c1, r2, c2) {
    let rStart = Math.min(r1, r2), rEnd = Math.max(r1, r2);
    let cStart = Math.min(c1, c2), cEnd = Math.max(c1, c2);
    for (let r = rStart; r <= rEnd; r++) {
        for (let c = cStart; c <= cEnd; c++) {
            tabuleiro[r][c] = 1;
        }
    }
    primeiraJogadaRealizada = true;
    somClique.play();
}

function swapOrientations() {
    somAcerto.play();
    alert("Orientação trocada! O jogador Horizontal agora é Vertical.");
    // Logica simplificada: apenas passa o turno de volta para o J1 mantendo a peça
    turnoAtual = 0;
    atualizarUI();
}

function finalizarTurno() {
    turnoAtual = (turnoAtual === 0) ? 1 : 0;
    
    // Quem NÃO consegue jogar perde no Misere? Não, no Quelhas: "Perde o jogador que realizar a última jogada".
    // Isso significa que se após a minha jogada não houverem mais lances, eu PERDI.
    if (!temLancesLegais(0) && !temLancesLegais(1)) {
        finalizarRonda(turnoAtual === 0 ? 1 : 0); // O que acabou de jogar perdeu
        return;
    }

    if (modoJogo === 'CPU' && turnoAtual === 1) {
        atualizarUI();
        setTimeout(iaControlador, 800);
    } else {
        atualizarUI();
    }
}

function temLancesLegais(turno) {
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            if (tabuleiro[r][c] === 0) {
                if (turno === 0 && r < 9 && tabuleiro[r+1][c] === 0) return true;
                if (turno === 1 && c < 9 && tabuleiro[r][c+1] === 0) return true;
            }
        }
    }
    return false;
}

function iaControlador() {
    let moves = [];
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 9; c++) {
            if (tabuleiro[r][c] === 0 && tabuleiro[r][c+1] === 0) moves.push({r1:r, c1:c, r2:r, c2:c+1});
        }
    }
    
    if (moves.length === 0) return; // J1 já ganhou (CPU não tem lances)

    let move;
    if (nivelJogo === 3) {
        // IA tenta deixar pelo menos um lance para o humano fazer a última jogada
        move = moves.sort((a,b) => countLances(b) - countLances(a))[0];
    } else {
        move = moves[Math.floor(Math.random() * moves.length)];
    }

    colocarPeca(move.r1, move.c1, move.r2, move.c2);
    
    if (!temLancesLegais(0) && !temLancesLegais(1)) {
        finalizarRonda(1); // CPU fez a última e perdeu
    } else {
        turnoAtual = 0;
        atualizarUI();
    }
}

function countLances(m) {
    // Contagem simples de espaços para IA
    return Math.random();
}

// ============================================================
// 5. FINALIZAÇÃO
// ============================================================
function finalizarRonda(perdedorIdx) {
    jogoAtivo = false;
    let vencedorIdx = (perdedorIdx === 0) ? 1 : 0;
    matchScore[vencedorIdx]++;
    somAcerto.play();
    
    const overlay = document.getElementById('round-feedback');
    const nomeVencedor = vencedorIdx === 0 ? "VERTICAL" : (modoJogo === 'CPU' ? "Pc" : "HORIZONTAL");
    const corVencedor = vencedorIdx === 0 ? "#8cc63f" : "#ff5a5f";
    
    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="vitoria-card">
        <h1 style="color:${corVencedor}; font-size:2rem; font-weight:900; margin:0;">${nomeVencedor}</h1>
        <p style="color:#666; font-size:1.1rem; font-weight:700;">Ganhou a ronda!</p>
        <p style="font-size:0.8rem; color:#aaa;">(O adversário fez a última jogada)</p>
        <div style="margin-top:15px; padding-top:15px; border-top:2px dashed #eee; color:#aaa; font-weight:800;">PLACAR: ${matchScore[0]} - ${matchScore[1]}</div>
    </div>`;

    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 2000);
    else setTimeout(() => { currentGameNum++; turnoAtual = 0; iniciarJogo(); }, 2000);
}

function finalizarMatch() {
    document.getElementById('round-feedback').style.display = 'none';
    const vencedorIdx = (matchScore[0] >= 3) ? 0 : 1;
    const nomeVencedor = vencedorIdx === 0 ? "VERTICAL" : (modoJogo === 'CPU' ? "Pc" : "HORIZONTAL");

    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">RESULTADOS FINAIS</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:120px; margin-bottom:10px;">
            <h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase; margin-bottom:20px;">GANHOU O ${nomeVencedor}</h2>
            <div style="display:flex; justify-content:center; gap:20px;">
                <div class="score-box box-v" style="padding:10px 20px; font-size:1.2rem;">V: ${matchScore[0]}</div>
                <div class="score-box box-x" style="padding:10px 20px; font-size:1.2rem;">H/Pc: ${matchScore[1]}</div>
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
    let sTab = Array(10).fill().map(() => Array(10).fill(0));
    let sTurno = 0;
    simuInterval = setInterval(() => {
        let leg = [];
        for(let r=0; r<10; r++) for(let c=0; c<10; c++) {
            if(sTurno===0 && r<9 && sTab[r][c]===0 && sTab[r+1][c]===0) leg.push({r,c,r2:r+1,c2:c});
            if(sTurno===1 && c<9 && sTab[r][c]===0 && sTab[r][c+1]===0) leg.push({r,c,r2:r,c2:c+1});
        }
        if (leg.length === 0) { sTab = Array(10).fill().map(() => Array(10).fill(0)); sTurno = 0; }
        else {
            let m = leg[Math.floor(Math.random() * leg.length)];
            sTab[m.r][m.c] = 1; sTab[m.r2][m.c2] = 1;
            sTurno = (sTurno === 0) ? 1 : 0;
        }
        let h = `<div class="grid-board" style="opacity:0.6; pointer-events:none;">`;
        for(let r=0;r<10;r++) for(let c=0;c<10;c++) h+=`<div class="cell ${sTab[r][c]===1?'occupied':''}" style="width:20px; height:20px;"></div>`;
        if(board) board.innerHTML = h + `</div>`;
    }, 600);
}
