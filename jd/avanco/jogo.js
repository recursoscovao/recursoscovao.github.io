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

// ============================================================
// === INÍCIO SECÇÃO: SOBREPOSIÇÃO DO ENGINE (DESIGN) ===
// ============================================================

Engine.showStatusBar = function(nomeVez, s1, s2, label2) {
    const isJ1 = nomeVez.toUpperCase().includes("JOGADOR 1");
    const pillBg = isJ1 ? "#8cc63f" : "#444";
    const pillShadow = isJ1 ? "#6da32f" : "#222";

    document.getElementById('shell-header-content').innerHTML = `
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 5px 15px;">
            <div class="blinking" style="padding: 8px 18px; border-radius: 12px; color: white; font-weight: 900; font-size: 1rem; text-transform: uppercase; background: ${pillBg}; box-shadow: 0 4px 0 ${pillShadow};">
                ${nomeVez}
            </div>
            <div style="display: flex; gap: 8px;">
                <div style="padding: 8px 12px; border-radius: 12px; color: white; font-weight: 900; background: #8cc63f; box-shadow: 0 3px 0 #6da32f; font-size: 0.9rem;">J1: ${s1}</div>
                <div style="padding: 8px 12px; border-radius: 12px; color: white; font-weight: 900; background: #444; box-shadow: 0 3px 0 #222; font-size: 0.9rem;">${label2}: ${s2}</div>
            </div>
        </div>`;
};

Engine.showResults = function(s1, s2, rel, label2) {
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; padding: 15px;">RESULTADOS</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; gap: 20px; text-align: center; padding: 20px;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}${rel.img}" style="height: clamp(120px, 25vh, 220px); object-fit:contain; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));">
            <h2 style="color:var(--text-grey); font-size: 1.2rem; font-weight:800; text-transform:uppercase; margin:0;">${rel.titulo}</h2>
            <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap; width:100%; max-width:600px;">
                <div style="flex:1; min-width: 200px; padding: 15px; border-radius: 18px; color: white; font-weight: 900; background: #8cc63f; box-shadow: 0 5px 0 #6da32f; font-size: 1.1rem;">JOGADOR 1: ${s1}</div>
                <div style="flex:1; min-width: 200px; padding: 15px; border-radius: 18px; color: white; font-weight: 900; background: #444; box-shadow: 0 5px 0 #222; font-size: 1.1rem;">${label2.toUpperCase()}: ${s2}</div>
            </div>
        </div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `<div style="display:flex; width:100%; gap:15px; padding:20px 25px 35px; max-width:700px; margin:0 auto;">
        <button onclick="location.reload()" style="flex: 1; height: 60px; border-radius: 30px; background: #6c757d; color: white; border: none; font-size: 1.2rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #4e555b;">REPETIR</button>
        <button onclick="window.history.back()" style="flex: 1; height: 60px; border-radius: 30px; background: var(--primary-color); color: white; border: none; font-size: 1.2rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #4582c0;">SAIR</button>
    </div>`;
};

// ============================================================
// === INÍCIO SECÇÃO 2: CONFIGURAÇÃO VISUAL / CSS ===
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    #game-content { display: flex; flex-direction: column; align-items: center; width: 100%; min-height: 400px; padding: 10px; box-sizing: border-box; }

    #simu-container { width: 100%; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; min-height: 220px; }
    #capa-menu-principal, #nivel-select-container { width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 12px; }

    .grid-board { display: grid; grid-template-columns: repeat(7, 1fr); gap: clamp(2px, 0.5vw, 6px); background: #ced4da; padding: 8px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); margin: auto; }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    
    .piece { width: 80%; height: 80%; border-radius: 50%; transition: all 0.3s ease; }
    .piece.white { background: radial-gradient(circle at 30% 30%, #ffffff, #e0e0e0); border: 1px solid #ccc; box-shadow: 0 3px 6px rgba(0,0,0,0.15); }
    .piece.black { background: radial-gradient(circle at 30% 30%, #444, #111); border: 1px solid #000; box-shadow: 0 3px 6px rgba(0,0,0,0.3); }

    .capa-btn-row { display: flex; gap: 12px; width: 100%; align-items: center; }
    .btn-capa-small { flex: 1; height: 58px; border-radius: 16px; border: none; color: white; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 5px 0 rgba(0,0,0,0.15); text-transform: uppercase; transition: 0.2s; }
    .btn-inform { width: 58px; height: 58px; border-radius: 16px; background: white; border: 2.5px solid #eee; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 0 rgba(0,0,0,0.05); }
    .btn-inform img { width: 30px; height: 30px; object-fit: contain; }
    
    .btn-capa-small:active, .btn-inform:active { transform: translateY(3px); box-shadow: 0 2px 0 rgba(0,0,0,0.1); }

    /* INSTRUÇÕES PREMIUM */
    #instrucoes-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: transform 0.5s ease; transform: translateY(100%); visibility: hidden; overflow-y: auto; }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: sticky; top: 20px; float: right; margin-right: 25px; font-size: 3rem; color: #ff5a5f; cursor: pointer; font-weight: 900; z-index: 10001; }
    .inst-content { max-width: 700px; margin: 0 auto; padding: 60px 25px; text-align: left; }
    .inst-header { color: var(--primary-color); text-align: center; font-size: 1.5rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 4px solid #f0f0f0; padding-bottom: 10px; }
    .inst-section-title { color: #333; font-size: 1.1rem; font-weight: 800; margin: 25px 0 12px; display: flex; align-items: center; gap: 10px; }
    .inst-section-title::before { content: ''; width: 6px; height: 20px; background: var(--primary-color); border-radius: 3px; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f8f9fa; margin-bottom: 10px; padding: 15px; border-radius: 15px; border-left: 5px solid var(--primary-color); color: #444; font-size: 1rem; line-height: 1.4; }

    :root { --cell-size: clamp(38px, 8vw, 62px); }

    @media screen and (min-width: 600px) {
        :root { --cell-size: clamp(45px, 6vw, 65px); }
    }

    @media screen and (max-width: 480px) {
        .capa-btn-row { flex-direction: column; }
        .btn-inform { width: 100%; order: -1; }
        .btn-capa-small { width: 100%; }
        #simu-container { min-height: 180px; transform: scale(0.9); }
    }

    .blinking { animation: blinker 1.5s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.6; } }
    
    #round-feedback { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.92); z-index: 2000; display: none; align-items: center; justify-content: center; border-radius: 35px; }
    .vitoria-card { text-align: center; padding: 30px; background: white; border-radius: 30px; box-shadow: 0 15px 40px rgba(0,0,0,0.1); border: 2px solid #f0f0f0; }
`;
document.head.appendChild(style);

// ============================================================
// === INÍCIO SECÇÃO 3: CAPA E INSTRUÇÕES ===
// ============================================================
function mostrarCapa() {
    if (jogoAtivo) return;

    // Criar Painel de Instruções se não existir
    if(!document.getElementById('instrucoes-panel')) {
        const p = document.createElement('div');
        p.id = 'instrucoes-panel';
        p.innerHTML = `
            <span class="close-x" onclick="toggleInstructions()">&times;</span>
            <div class="inst-content">
                <div class="inst-header">Como Jogar Avanço</div>
                <div class="inst-section-title">Objetivo</div>
                <p>Leva qualquer uma das tuas peças até à <b>primeira linha do campo adversário</b>.</p>
                <div class="inst-section-title">Movimento</div>
                <ul class="inst-list">
                    <li><b>Frente:</b> 1 casa se estiver vazia.</li>
                    <li><b>Diagonal:</b> 1 casa (vazia ou ocupada).</li>
                </ul>
                <div class="inst-section-title">Captura</div>
                <ul class="inst-list">
                    <li>Capturas apenas nas <b>diagonais frontais</b>.</li>
                </ul>
            </div>`;
        document.body.appendChild(p);

        // Criar Feedback de Ronda se não existir
        const f = document.createElement('div');
        f.id = 'round-feedback';
        document.querySelector('.game-shell').appendChild(f);
    }

    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; font-size:1.3rem; text-align:center; width:100%; margin: 15px 0;">${JOGO_CONFIG.nomeDoJogo.toUpperCase()}</h2>`;
    
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board"></div></div>
        <div id="capa-menu-principal">
            <div class="capa-btn-row">
                <button class="btn-inform" onclick="toggleInstructions()"><img src="${JOGO_CONFIG.caminhoIconsMenu}inform.png"></button>
                <button class="btn-capa-small" style="background:var(--primary-color);" onclick="mostrarNiveis('CPU')"><i class="fas fa-robot"></i> COMPUTADOR</button>
                <button class="btn-capa-small" style="background:#6c757d;" onclick="mostrarNiveis('PVP')"><i class="fas fa-users"></i> 2 JOGADORES</button>
            </div>
        </div>
    `;
    document.getElementById('shell-footer-content').style.display = 'none';
    iniciarSimulacao();
}

function mostrarNiveis(modo) {
    somClique.play();
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container" style="transform:scale(0.85); margin-bottom:5px;"><div id="simu-board"></div></div>
        <div id="nivel-select-container">
            <p style="font-weight:800; color:var(--text-grey); font-size:0.8rem; text-transform:uppercase; text-align:center; margin-bottom:8px;">Dificuldade:</p>
            <div class="capa-btn-row" style="margin-bottom:10px;">
                <button class="btn-capa-small" onclick="setModo('${modo}', 1)" style="background:#8cc63f;">FÁCIL</button>
                <button class="btn-capa-small" onclick="setModo('${modo}', 2)" style="background:#ff5a5f;">DIFÍCIL</button>
            </div>
            <button class="btn-capa-small" onclick="voltarCapa()" style="background:#6c757d; width:100%;"><i class="fas fa-arrow-left"></i> VOLTAR</button>
        </div>
    `;
    iniciarSimulacao(); // ADICIONADO: Inicia a simulação também neste ecrã
}

function voltarCapa() { somClique.play(); mostrarCapa(); }

function toggleInstructions() { 
    somClique.play(); 
    const p = document.getElementById('instrucoes-panel');
    p.classList.toggle('open');
}

// ... Restante do código (Lógica core, IA, Finalização, Simulação) permanece exatamente igual ...

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
    const feedback = document.getElementById('round-feedback');
    if(feedback) feedback.style.display = 'none';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = modoJogo === 'CPU' ? "PC" : "J2";
    const labelJ2 = modoJogo === 'CPU' ? "Computador" : "Jogador 2";
    Engine.showStatusBar(turnoAtual === 0 ? "Jogador 1" : labelJ2, matchScore[0], matchScore[1], pcLabel);

    const area = document.getElementById('game-content');
    area.innerHTML = "";
    const boardEl = document.createElement('div');
    boardEl.className = "grid-board";

    let hints = [];
    if(selectedPiece && nivelJogo === 1) {
        for(let r=0; r<7; r++) for(let c=0; c<7; c++) if(validarMovimento(selectedPiece.r, selectedPiece.c, r, c, (turnoAtual === 0 ? 1 : 2))) hints.push({r, c});
    }

    for(let r=0; r<7; r++) {
        for(let c=0; c<7; c++) {
            const cell = document.createElement('div');
            cell.className = "cell";
            if(selectedPiece?.r === r && selectedPiece?.c === c) cell.style.background = "#fff9c4";
            if(hints.some(h => h.r === r && h.c === c)) cell.innerHTML = '<div style="width:8px; height:8px; background:#ddd; border-radius:50%;"></div>';
            
            if(tabuleiro[r][c] === 1) cell.innerHTML = '<div class="piece white"></div>';
            else if(tabuleiro[r][c] === 2) cell.innerHTML = '<div class="piece black"></div>';
            
            cell.onclick = () => handleCellClick(r, c);
            boardEl.appendChild(cell);
        }
    }
    area.appendChild(boardEl);
}

function handleCellClick(r, c) {
    if(!jogoAtivo || (modoJogo === 'CPU' && turnoAtual === 1)) return;
    const p = turnoAtual === 0 ? 1 : 2;
    if(tabuleiro[r][c] === p) {
        selectedPiece = {r, c}; somClique.play(); atualizarUI();
    } else if(selectedPiece) {
        if(validarMovimento(selectedPiece.r, selectedPiece.c, r, c, p)) executarMovimento(selectedPiece.r, selectedPiece.c, r, c);
        else { selectedPiece = null; atualizarUI(); }
    }
}

function validarMovimento(r1, c1, r2, c2, p) {
    const dir = p === 1 ? -1 : 1;
    const enemy = p === 1 ? 2 : 1;
    if(c1 === c2 && r2 === r1 + dir && tabuleiro[r2][c2] === 0) return true;
    if(Math.abs(c2 - c1) === 1 && r2 === r1 + dir && (tabuleiro[r2][c2] === 0 || tabuleiro[r2][c2] === enemy)) return true;
    return false;
}

function executarMovimento(fr, fc, tr, tc) {
    const p = tabuleiro[fr][fc];
    tabuleiro[fr][fc] = 0; tabuleiro[tr][tc] = p;
    selectedPiece = null; somClique.play();
    if((p === 1 && tr === 0) || (p === 2 && tr === 6)) { finalizarRonda(turnoAtual); return; }
    turnoAtual = 1 - turnoAtual;
    atualizarUI();
    if(modoJogo === 'CPU' && turnoAtual === 1) setTimeout(iaControlador, 600);
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

function finalizarRonda(vIdx) {
    jogoAtivo = false; matchScore[vIdx]++; somAcerto.play();
    const overlay = document.getElementById('round-feedback');
    const labelV = vIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "COMPUTADOR" : "JOGADOR 2");
    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="vitoria-card">
        <h1 style="color:${vIdx===0?'#8cc63f':'#444'}; font-size:1.8rem; margin-bottom:10px;">${labelV}</h1>
        <p style="font-weight:700; color:#888;">VENCEU A RONDA!</p>
    </div>`;
    
    setTimeout(() => {
        if (matchScore[0] >= 3 || matchScore[1] >= 3) finalizarMatch();
        else iniciarJogo();
    }, 1800);
}

function finalizarMatch() {
    const vIdx = matchScore[0] >= 3 ? 0 : 1;
    const rel = { img: "taca_1.png", titulo: "VITÓRIA FINAL!" };
    Engine.showResults(matchScore[0], matchScore[1], rel, modoJogo === 'CPU' ? "PC" : "J2");
}

function iniciarSimulacao() {
    clearInterval(simuInterval);
    const board = document.getElementById('simu-board');
    if(!board) return;
    
    let sTab = Array(7).fill().map(() => Array(7).fill(0));
    const reset = () => { for(let c=0; c<7; c++){ sTab[0][c]=2; sTab[1][c]=2; sTab[5][c]=1; sTab[6][c]=1; } };
    reset();

    const render = () => {
        board.innerHTML = `<div class="grid-board" style="opacity:0.4; pointer-events:none;">` + 
            sTab.flat().map(v => `<div class="cell">${v?`<div class="piece ${v==1?'white':'black'}"></div>`:''}</div>`).join('') + `</div>`;
    };

    let sTurno = 1;
    const anim = () => {
        let moves = [];
        for(let r=0; r<7; r++) for(let c=0; c<7; c++) if(sTab[r][c] === sTurno)
            for(let dr=0; dr<7; dr++) for(let dc=0; dc<7; dc++) 
                if(validarMovimentoSimu(r,c,dr,dc,sTurno,sTab)) moves.push({fr:r,fc:c,tr:dr,tc:dc});

        if(moves.length > 0) {
            const m = moves[Math.floor(Math.random()*moves.length)];
            sTab[m.tr][m.tc] = sTab[m.fr][m.fc]; sTab[m.fr][m.fc] = 0;
            if((sTurno===1 && m.tr===0) || (sTurno===2 && m.tr===6)) reset();
            else sTurno = sTurno === 1 ? 2 : 1;
        } else reset();
        render();
    };

    render();
    simuInterval = setInterval(anim, 700); 
}

function validarMovimentoSimu(r1, c1, r2, c2, p, tab) {
    const d = p === 1 ? -1 : 1;
    if(c1 === c2 && r2 === r1 + d && tab[r2][c2] === 0) return true;
    if(Math.abs(c2 - c1) === 1 && r2 === r1 + d && (tab[r2][c2] === 0 || tab[r2][c2] === (3-p))) return true;
    return false;
}

window.onload = () => Engine.init();
