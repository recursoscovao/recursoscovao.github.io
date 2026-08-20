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
// === SOBREPOSIÇÃO DO ENGINE (DESIGN TURNOS E RESULTADOS) ===
// ============================================================

Engine.showStatusBar = function(nomeVez, s1, s2, label2) {
    const isJ1 = nomeVez.toUpperCase().includes("JOGADOR 1");
    const pillBg = isJ1 ? "#8cc63f" : "#444";
    const pillShadow = isJ1 ? "#6da32f" : "#222";

    document.getElementById('shell-header-content').innerHTML = `
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 15px;">
            <div class="blinking" style="padding: 10px 22px; border-radius: 15px; color: white; font-weight: 900; font-size: 1.1rem; text-transform: uppercase; background: ${pillBg}; box-shadow: 0 4px 0 ${pillShadow};">
                ${nomeVez}
            </div>
            <div style="display: flex; gap: 8px;">
                <div style="padding: 10px 15px; border-radius: 12px; color: white; font-weight: 900; background: #8cc63f; box-shadow: 0 4px 0 #6da32f;">J1: ${s1}</div>
                <div style="padding: 10px 15px; border-radius: 12px; color: white; font-weight: 900; background: #444; box-shadow: 0 4px 0 #222;">${label2}: ${s2}</div>
            </div>
        </div>`;
};

Engine.showResults = function(s1, s2, rel, label2) {
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; padding: 15px;">RESULTADOS</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 100%; gap: 20px; text-align: center; padding: 20px;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}${rel.img}" style="height: clamp(160px, 30vh, 280px); object-fit:contain; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));">
            <div><h2 style="color:var(--text-grey); font-size: clamp(1.1rem, 3vw, 1.6rem); font-weight:800; text-transform:uppercase; margin:0;">${rel.titulo}</h2></div>
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

// ============================================================
// === INÍCIO SECÇÃO 2: CONFIGURAÇÃO VISUAL / CSS ===
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    #game-content { 
        display: flex; flex-direction: column; align-items: center; 
        width: 100%; height: 100%; padding: 0; box-sizing: border-box; 
        overflow: hidden; position: relative;
    }

    /* AREA DA SIMULAÇÃO: Ocupa o centro e empurra os botões para o fundo */
    #simu-container { 
        flex: 1; display: flex; align-items: center; justify-content: center; 
        width: 100%; min-height: 0; overflow: hidden;
    }

    /* CONTENTOR DOS BOTÕES: 20px de padding rigoroso do fundo */
    #capa-menu-principal, #nivel-select-container { 
        width: 100%; display: flex; flex-direction: column; align-items: center; 
        gap: 15px; flex-shrink: 0; padding-bottom: 20px !important; 
    }

    .capa-btn-row, .nivel-row { 
        display: flex; flex-direction: row; align-items: stretch;
        gap: 12px; width: 100%; max-width: 550px; justify-content: center; padding: 0 20px; 
    }
    
    /* TODOS OS BOTÕES COM 60PX DE ALTURA E MESMA FORMA */
    .btn-capa-small { 
        flex: 1; height: 60px; border-radius: 15px; border: none; color: white; 
        font-weight: 900; font-size: 1rem; cursor: pointer; display: flex; 
        align-items: center; justify-content: center; gap: 10px; 
        box-shadow: 0 5px 0 rgba(0,0,0,0.1); text-transform: uppercase; transition: 0.2s; 
    }
    
    .btn-inform { 
        width: 60px; height: 60px; border-radius: 15px; background: white; border: 2px solid #eee;
        cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 5px 0 rgba(0,0,0,0.05); transition: 0.2s;
    }
    .btn-inform img { width: 65%; height: 65%; object-fit: contain; }
    .btn-capa-small:active, .btn-inform:active { transform: translateY(3px); box-shadow: 0 2px 0 rgba(0,0,0,0.1); }

    /* INSTRUÇÕES PREMIUM - SCROLL DE PÁGINA INTEIRA */
    #instrucoes-panel { 
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
        background: white; z-index: 10000; 
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); 
        transform: translateY(100%); 
        visibility: hidden; overflow-y: auto; padding: 0; margin: 0;
    }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: sticky; top: 20px; float: right; margin-right: 25px; font-size: 3.5rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; z-index: 10001; }

    .inst-content { max-width: 750px; margin: 0 auto; text-align: left; font-family: 'Nunito', sans-serif; padding: 60px 25px; clear: both; }
    .inst-header { color: var(--primary-color); text-align: center; font-size: 2.2rem; font-weight: 900; margin-bottom: 30px; text-transform: uppercase; border-bottom: 5px solid var(--bg-color); padding-bottom: 15px; }
    .inst-section-title { color: #333; font-size: 1.4rem; font-weight: 800; margin: 30px 0 15px; display: flex; align-items: center; gap: 12px; }
    .inst-list li { background: #f8f9fa; margin-bottom: 12px; padding: 18px; border-radius: 20px; border-left: 6px solid var(--primary-color); color: #444; font-size: 1.05rem; line-height: 1.6; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }

    /* TABULEIRO */
    .grid-board { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; background: #bbb; padding: 6px; border-radius: 12px; margin: auto; width: fit-content; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; position: relative; }
    .piece { width: 85%; height: 85%; border-radius: 50%; box-shadow: 0 3px 6px rgba(0,0,0,0.2); }
    .piece.white { background: radial-gradient(circle at 30% 30%, #fff, #ddd); border: 1px solid #eee; }
    .piece.black { background: radial-gradient(circle at 30% 30%, #555, #111); }

    /* RESPONSIVIDADE */
    :root { --cell-size: min(55px, 8vh); }
    @media screen and (min-width: 501px) and (max-width: 1024px) and (orientation: portrait) { :root { --cell-size: 10vw; } #simu-board { transform: scale(1.15); } }
    @media screen and (max-width: 500px) and (orientation: portrait) { 
        :root { --cell-size: 11vw; } 
        .capa-btn-row { flex-direction: column; width: 100%; padding: 0 30px; }
        .btn-inform { width: 100%; order: -1; }
        #capa-menu-principal { padding-bottom: 25px !important; }
    }

    .blinking { animation: blinker 1.5s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.4; } }
    #round-feedback { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.9); z-index: 2000; display: none; align-items: center; justify-content: center; }
    .vitoria-card { background: white; padding: 25px; border-radius: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); width: 85%; max-width: 320px; text-align: center; }
`;
document.head.appendChild(style);
// === FIM SECÇÃO 2 ===


// ============================================================
// === INÍCIO SECÇÃO 3: CAPA E INSTRUÇÕES ===
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
                <div class="inst-section-title"><i class="fas fa-bullseye"></i> Objetivo do Jogo</div>
                <p class="inst-text">O Avanço é uma corrida estratégica. Vence o primeiro jogador que conseguir levar <b>qualquer uma das suas peças</b> até à primeira linha do campo adversário.</p>
                <div class="inst-section-title"><i class="fas fa-walking"></i> Como Mover</div>
                <ul class="inst-list">
                    <li><b>Movimento Vertical:</b> Podes avançar 1 casa para a frente se esta estiver <b>vazia</b>.</li>
                    <li><b>Movimento Diagonal:</b> Podes mover-te para as duas casas diagonais à tua frente, quer estejam vazias ou ocupadas por um adversário.</li>
                </ul>
                <div class="inst-section-title"><i class="fas fa-fist-raised"></i> Capturas</div>
                <ul class="inst-list">
                    <li><b>Só Diagonais:</b> Podes capturar uma peça adversária se ela estiver numa das tuas <b>diagonais frontais</b>.</li>
                    <li><b>Proibido Vertical:</b> Não podes capturar uma peça que esteja diretamente à tua frente.</li>
                </ul>
                <div class="inst-section-title"><i class="fas fa-trophy"></i> Sistema de Jogo</div>
                <p class="inst-text">As peças Brancas (Jogador 1) movem-se sempre para cima. As Negras (PC ou J2) movem-se para baixo. Ganha a melhor de 5 rondas!</p>
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
        <div id="simu-container"><div id="simu-board"></div></div>
        <div id="nivel-select-container">
            <p style="font-weight:800; color:#888; font-size:0.8rem; text-transform:uppercase; margin-bottom:5px;">Escolha a Dificuldade:</p>
            <div class="nivel-row">
                <button class="btn-capa-small" onclick="setModo('${modo}', 1)" style="background:#8cc63f;"><i class="fas fa-leaf"></i> FÁCIL</button>
                <button class="btn-capa-small" onclick="setModo('${modo}', 2)" style="background:#ff5a5f;"><i class="fas fa-fire"></i> DIFÍCIL</button>
            </div>
            <div class="capa-btn-row"><button class="btn-capa-small" onclick="voltarCapa()" style="background:#6c757d; max-width:250px;"><i class="fas fa-arrow-left"></i> VOLTAR</button></div>
        </div>
    `;
    iniciarSimulacao(); 
}

function voltarCapa() { somClique.play(); mostrarCapa(); }
// === FIM SECÇÃO 3 ===


// ============================================================
// === INÍCIO SECÇÃO 4: LÓGICA CORE DO JOGO ===
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
    for(let c=0; c<7; c++) { tabuleiro[0][c] = 2; tabuleiro[1][c] = 2; tabuleiro[5][c] = 1; tabuleiro[6][c] = 1; }
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
    for(let r=0; r<7; r++) {
        for(let c=0; c<7; c++) {
            const cell = document.createElement('div');
            cell.className = "cell";
            if(selectedPiece && selectedPiece.r === r && selectedPiece.c === c) cell.style.border = "3px solid #fbc02d";
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
        executarMovimento(selectedPiece.r, selectedPiece.c, r, c);
    }
}

function executarMovimento(fr, fc, tr, tc) {
    tabuleiro[fr][fc] = 0; tabuleiro[tr][tc] = turnoAtual === 0 ? 1 : 2;
    selectedPiece = null; somClique.play();
    if((turnoAtual === 0 && tr === 0) || (turnoAtual === 1 && tr === 6)) { finalizarRonda(turnoAtual); return; }
    turnoAtual = (turnoAtual === 0) ? 1 : 0;
    atualizarUI();
    if(modoJogo === 'CPU' && turnoAtual === 1) setTimeout(iaControlador, 800);
}

function iaControlador() {
    finalizarRonda(1); // Exemplo simplificado
}

function finalizarRonda(vencedorIdx) {
    jogoAtivo = false; matchScore[vencedorIdx]++; somAcerto.play();
    if (matchScore[0] >= 3 || matchScore[1] >= 3) finalizarMatch();
    else iniciarJogo();
}

function finalizarMatch() {
    const vencedorIdx = matchScore[0] >= 3 ? 0 : 1;
    const pcLabel = modoJogo === 'CPU' ? "PC" : "JOGADOR 2";
    const rel = {img:"taca_1.png", titulo:"PARABÉNS!"};
    Engine.showResults(matchScore[0], matchScore[1], rel, pcLabel);
}

function iniciarSimulacao() {
    clearInterval(simuInterval);
    const board = document.getElementById('simu-board');
    if(!board) return;
    simuInterval = setInterval(() => {
        board.innerHTML = `<div class="grid-board" style="opacity:0.3; transform: scale(1.05);">` + 
            Array(49).fill().map(() => `<div class="cell"></div>`).join('') + `</div>`;
    }, 700);
}
