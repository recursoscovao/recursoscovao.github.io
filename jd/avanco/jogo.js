// ============================================================
// === INÍCIO SECÇÃO 1: ESTADO GLOBAL E SONS ===
// ============================================================
let jogoAtivo = false;
let modoJogo = 'CPU';     
let nivelJogo = 1;        
let mostrarDicas = true;  
let matchScore = [0, 0];  
let turnoAtual = 0;       
let tabuleiro = Array(10).fill().map(() => Array(10).fill(0)); 
let startCell = null;     
let primeiraJogadaRealizada = false;
let j2JaJogou = false; 
let trocouOrientacao = false; 
let orientacoes = [0, 1]; // [J1, J2/Pc] -> 0: Vertical, 1: Horizontal
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
    const orient = orientacoes[turnoAtual]; 

    // Indicador visual da direção (pontos verticais ou horizontais)
    const dotsHTML = `<div style="display:flex; gap:4px; ${orient === 0 ? 'flex-direction:column;' : 'flex-direction:row;'}">
                        <div class="dot-blink" style="width:6px; height:6px; background:white; border-radius:50%;"></div>
                        <div class="dot-blink" style="width:6px; height:6px; background:white; border-radius:50%;"></div>
                      </div>`;

    document.getElementById('shell-header-content').innerHTML = `
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 10px;">
            <div class="blinking" style="padding: 8px 20px; border-radius: 12px; color: white; font-weight: 900; font-size: 1rem; text-transform: uppercase; background: ${pillBg}; box-shadow: 0 4px 0 ${pillShadow}; display:flex; align-items:center; gap:10px;">
                ${nomeVez} ${dotsHTML}
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
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 100%; gap: 15px; text-align: center; padding: 20px;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}${rel.img}" style="height: clamp(140px, 25vh, 260px); object-fit:contain; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));">
            <div><h2 style="color:var(--text-grey); font-size: clamp(1.1rem, 3vw, 1.6rem); font-weight:800; text-transform:uppercase; margin:0; opacity: 0.9;">${rel.titulo}</h2></div>
            <div style="display:flex; justify-content:center; gap:15px; flex-wrap:wrap; width:100%;">
                <div style="min-width: 220px; padding: 12px 20px; border-radius: 18px; color: white; font-weight: 900; background: #8cc63f; box-shadow: 0 5px 0 #6da32f; font-size: 1.1rem;">JOGADOR 1: ${s1}</div>
                <div style="min-width: 220px; padding: 12px 20px; border-radius: 18px; color: white; font-weight: 900; background: #444; box-shadow: 0 5px 0 #222; font-size: 1.1rem;">${label2.toUpperCase()}: ${s2}</div>
            </div>
        </div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `<div style="display:flex; width:100%; gap:20px; padding:20px 25px 35px;">
        <button onclick="location.reload()" style="flex: 1; height: 60px; border-radius: 40px; background: #6c757d; color: white; border: none; font-size: 1.3rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #4e555b;">REPETIR</button>
        <button onclick="window.history.back()" style="flex: 1; height: 60px; border-radius: 40px; background: var(--primary-color); color: white; border: none; font-size: 1.3rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #4582c0;">SAIR</button>
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
    #simu-board { transform: scale(0.75); transition: 0.3s; }

    #capa-menu-principal, #nivel-select-container { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 12px; flex-shrink: 0; padding-bottom: 20px !important; }
    .capa-btn-row, .nivel-row { display: flex; flex-direction: row; align-items: stretch; gap: 12px; width: 100%; max-width: 550px; justify-content: center; padding: 0 20px; }
    
    .btn-capa-small { flex: 1; height: 60px; border-radius: 15px; border: none; color: white; font-weight: 900; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 5px 0 rgba(0,0,0,0.1); text-transform: uppercase; transition: 0.2s; }
    .btn-inform { width: 60px; height: 60px; border-radius: 15px; background: white; border: 2px solid #eee; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 0 rgba(0,0,0,0.05); }
    .btn-inform img { width: 60%; height: 60%; object-fit: contain; }

    /* Dificuldade menores para caber a simulação */
    .nivel-row .btn-capa-small { height: 46px; font-size: 0.85rem; }
    .btn-voltar-pequeno { height: 46px !important; max-width: 220px !important; font-size: 0.85rem !important; }

    #instrucoes-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: transform 0.5s ease; transform: translateY(100%); visibility: hidden; overflow-y: auto; padding: 0; margin: 0; }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: sticky; top: 20px; float: right; margin-right: 25px; font-size: 3.5rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; z-index: 10001; }

    .inst-content { max-width: 750px; margin: 0 auto; text-align: left; font-family: 'Nunito', sans-serif; padding: 60px 25px; clear: both; }
    .inst-header { color: var(--primary-color); text-align: center; font-size: 2.2rem; font-weight: 900; margin-bottom: 30px; text-transform: uppercase; border-bottom: 5px solid var(--bg-color); padding-bottom: 15px; }
    .inst-section-title { color: #333; font-size: 1.4rem; font-weight: 800; margin: 30px 0 15px; display: flex; align-items: center; gap: 12px; }
    .inst-section-title::before { content: ''; width: 6px; height: 24px; background: var(--primary-color); border-radius: 3px; display: inline-block; }
    .inst-list li { background: #f8f9fa; margin-bottom: 12px; padding: 18px; border-radius: 20px; border-left: 6px solid var(--primary-color); color: #444; font-size: 1.05rem; line-height: 1.6; }

    /* TABULEIRO QUELHAS 10x10 */
    .grid-board { display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; background: #bbb; padding: 4px; border-radius: 8px; margin: auto; width: fit-content; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.8s ease-in-out; }
    .grid-board.rotated { transform: rotate(180deg); }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 2px; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; }
    .cell.occupied::after { content: ''; width: 85%; height: 85%; background: #333; border-radius: 50%; }
    .cell.selected { background: #fff9c4; border: 2px solid #fbc02d; }
    .cell.hint::after { content: ''; width: 8px; height: 8px; background: #ddd; border-radius: 50%; }

    :root { --cell-size: min(42px, 6.5vh); }
    @media screen and (min-width: 501px) and (max-width: 1024px) and (orientation: portrait) { 
        :root { --cell-size: 8.5vw; } 
        #simu-board { transform: scale(1.1); }
    }
    @media screen and (max-width: 500px) and (orientation: portrait) { 
        :root { --cell-size: 9vw; }
        .capa-btn-row { flex-direction: column; width: 100%; padding: 0 30px; }
        .btn-inform { width: 100%; order: -1; }
        .btn-voltar-pequeno { width: 100% !important; max-width: none !important; }
    }

    .blinking { animation: blinker 1.5s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.4; } }
    .dot-blink { animation: blinker 1s linear infinite; }

    #round-feedback { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.85); backdrop-filter: blur(4px); z-index: 2000; display: none; align-items: center; justify-content: center; }
    .vitoria-card { background: white; padding: 30px; border-radius: 30px; box-shadow: 0 15px 45px rgba(0,0,0,0.2); width: 85%; max-width: 350px; text-align: center; border: 4px solid var(--bg-color); }
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
                <div class="inst-header">Como Jogar Quelhas</div>
                <div class="inst-section-title">Objetivo (Regra Misere)</div>
                <p class="inst-text">O Quelhas é um jogo de bloqueio. Segue a regra <b>Misere</b>: o jogador que realizar a <b>última jogada possível</b> no tabuleiro perde o jogo.</p>
                
                <div class="inst-section-title">As Peças e o Tabuleiro</div>
                <ul class="inst-list">
                    <li><b>Tabuleiro:</b> Um quadrado de 10x10 casas.</li>
                    <li><b>Jogadores:</b> Um joga na <b>Vertical</b> e outro na <b>Horizontal</b>.</li>
                    <li><b>Peças:</b> Deves colocar blocos de <b>duas ou mais peças</b> seguidas na tua orientação.</li>
                </ul>

                <div class="inst-section-title">Como Jogar</div>
                <ul class="inst-list">
                    <li>O jogador <b>Vertical</b> começa sempre.</li>
                    <li>Clica na casa onde o teu bloco começa e depois na casa onde termina.</li>
                    <li><b>Regra da Troca:</b> Na primeira jogada do J2, este pode trocar de orientação. O tabuleiro roda e o J2 assume a Vertical.</li>
                </ul>
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

function toggleInstructions() { somClique.play(); document.getElementById('instrucoes-panel').classList.toggle('open'); }

function mostrarNiveis(modo) {
    somClique.play();
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board"></div></div>
        <div id="nivel-select-container">
            <p style="font-weight:800; color:#888; font-size:0.8rem; text-transform:uppercase; margin-bottom:5px;">Escolha a Dificuldade:</p>
            <div class="nivel-row">
                <button class="btn-capa-small" onclick="setModo('${modo}', 1)" style="background:#8cc63f;">FÁCIL</button>
                <button class="btn-capa-small" onclick="setModo('${modo}', 2)" style="background:#ff5a5f;">DIFÍCIL</button>
            </div>
            <div class="capa-btn-row"><button class="btn-capa-small btn-voltar-pequeno" onclick="voltarCapa()" style="background:#6c757d;">VOLTAR</button></div>
        </div>
    `;
    iniciarSimulacao(); 
}

function voltarCapa() { somClique.play(); mostrarCapa(); }
// === FIM SECÇÃO 3 ===


// ============================================================
// === INÍCIO SECÇÃO 4: LÓGICA CORE (QUELHAS) ===
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval); somClique.play();
    modoJogo = modo; nivelJogo = nivel; orientacoes = [0, 1]; trocouOrientacao = false;
    matchScore = [0, 0]; turnoAtual = 0; 
    iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(10).fill().map(() => Array(10).fill(0));
    startCell = null; primeiraJogadaRealizada = false; j2JaJogou = false;
    document.getElementById('round-feedback').style.display = 'none';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = modoJogo === 'CPU' ? "Pc" : "Jogador 2";
    const nomeVez = (turnoAtual === 0) ? "Jogador 1" : pcLabel;
    Engine.showStatusBar(nomeVez, matchScore[0], matchScore[1], pcLabel);

    const area = document.getElementById('game-content');
    area.innerHTML = `<div id="grid-mount" class="grid-board ${trocouOrientacao ? 'rotated' : ''}"></div>`;
    
    const mount = document.getElementById('grid-mount');
    const orient = orientacoes[turnoAtual];
    
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            let cell = document.createElement('div');
            cell.className = "cell";
            if (tabuleiro[r][c] === 1) cell.classList.add("occupied");
            if (startCell && startCell.r === r && startCell.c === c) cell.classList.add("selected");
            if (startCell && validarPeca(startCell.r, startCell.c, r, c, orient)) cell.classList.add("hint");
            cell.onclick = () => handleCellClick(r, c);
            mount.appendChild(cell);
        }
    }

    if (primeiraJogadaRealizada && !j2JaJogou && turnoAtual === 1) {
        const btn = document.createElement('button');
        btn.className = "btn-capa-small"; btn.style = "background:#f9a825; margin: 15px auto; width: 220px; height:50px;";
        btn.innerText = "TROCAR ORIENTAÇÃO"; btn.onclick = swapOrientations; area.appendChild(btn);
    }
}

function handleCellClick(r, c) {
    if (!jogoAtivo || (modoJogo === 'CPU' && turnoAtual === 1)) return;
    if (tabuleiro[r][c] !== 0) return;
    if (!startCell) { startCell = { r, c }; somClique.play(); atualizarUI(); }
    else {
        if (validarPeca(startCell.r, startCell.c, r, c, orientacoes[turnoAtual])) {
            colocarPeca(startCell.r, startCell.c, r, c);
            if(turnoAtual === 1) j2JaJogou = true;
            startCell = null; finalizarTurno();
        } else { startCell = { r, c }; somClique.play(); atualizarUI(); }
    }
}

function validarPeca(r1, c1, r2, c2, orient) {
    let rs = Math.min(r1, r2), re = Math.max(r1, r2), cs = Math.min(c1, c2), ce = Math.max(c1, c2);
    if (orient === 0) { if (c1 !== c2 || re - rs < 1) return false; for (let i = rs; i <= re; i++) if (tabuleiro[i][c1] !== 0) return false; }
    else { if (r1 !== r2 || ce - cs < 1) return false; for (let i = cs; i <= ce; i++) if (tabuleiro[r1][i] !== 0) return false; }
    return true;
}

function colocarPeca(r1, c1, r2, c2) {
    let rs = Math.min(r1, r2), re = Math.max(r1, r2), cs = Math.min(c1, c2), ce = Math.max(c1, c2);
    for (let r = rs; r <= re; r++) for (let c = cs; c <= ce; c++) tabuleiro[r][c] = 1;
    primeiraJogadaRealizada = true; somClique.play();
}

function finalizarTurno() {
    const proximo = (turnoAtual === 0) ? 1 : 0;
    if (!temLancesLegais(orientacoes[proximo])) { finalizarRonda(turnoAtual); return; }
    turnoAtual = proximo; atualizarUI();
    if (modoJogo === 'CPU' && turnoAtual === 1) setTimeout(iaControlador, 800);
}

function temLancesLegais(o) {
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) if (tabuleiro[r][c] === 0) {
        if (o === 0 && r < 9 && tabuleiro[r+1][c] === 0) return true;
        if (o === 1 && c < 9 && tabuleiro[r][c+1] === 0) return true;
    }
    return false;
}

function swapOrientations() { 
    somAcerto.play(); trocouOrientacao = !trocouOrientacao; orientacoes = [orientacoes[1], orientacoes[0]]; 
    j2JaJogou = true; turnoAtual = 0; atualizarUI(); 
}

function iaControlador() {
    const cpuO = orientacoes[1]; let moves = [];
    for (let r=0; r<10; r++) for (let c=0; c<10; c++) if (tabuleiro[r][c] === 0) {
        if (cpuO === 0 && r<9 && tabuleiro[r+1][c] === 0) moves.push({r1:r, c1:c, r2:r+1, c2:c});
        if (cpuO === 1 && c<9 && tabuleiro[r][c+1] === 0) moves.push({r1:r, c1:c, r2:r, c2:c+1});
    }
    if (moves.length === 0) { finalizarRonda(0); return; }
    let m = moves[Math.floor(Math.random() * moves.length)];
    colocarPeca(m.r1, m.c1, m.r2, m.c2); j2JaJogou = true; finalizarTurno();
}
// === FIM SECÇÃO 4 ===


// ============================================================
// === INÍCIO SECÇÃO 5: FINALIZAÇÃO ===
// ============================================================
function finalizarRonda(perdedorIdx) {
    jogoAtivo = false; let vencedorIdx = perdedorIdx === 0 ? 1 : 0;
    matchScore[vencedorIdx]++; somAcerto.play();
    const overlay = document.getElementById('round-feedback');
    const pcLabel = modoJogo === 'CPU' ? "Pc" : "Jogador 2";
    const nomeV = vencedorIdx === 0 ? "JOGADOR 1" : pcLabel;
    const corV = vencedorIdx === 0 ? "#8cc63f" : "#444";
    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="vitoria-card"><h1 style="color:${corV}; font-size:2rem; font-weight:900;">${nomeV}</h1><p style="font-weight:700; color:#666;">Venceu a ronda!</p></div>`;
    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 2000);
    else setTimeout(() => { trocouOrientacao = false; iniciarJogo(); }, 2000);
}

function finalizarMatch() {
    const vencedorIdx = matchScore[0] >= 3 ? 0 : 1;
    const pcLabel = modoJogo === 'CPU' ? "PC" : "JOGADOR 2";
    const nomeV = vencedorIdx === 0 ? "JOGADOR 1" : pcLabel;
    const rel = JOGO_CONFIG.relatorios.find(r => matchScore[vencedorIdx] >= r.min && matchScore[vencedorIdx] <= r.max) || {img:"taca_1.png", titulo:"PARABÉNS!"};
    Engine.showResults(matchScore[0], matchScore[1], rel, pcLabel);
}
// === FIM SECÇÃO 5 ===


// ============================================================
// === INÍCIO SECÇÃO 6: SIMULAÇÃO DA CAPA (QUELHAS REALISTA) ===
// ============================================================
function iniciarSimulacao() {
    clearInterval(simuInterval);
    const board = document.getElementById('simu-board');
    if(!board) return;
    
    let sTab = Array(10).fill().map(() => Array(10).fill(0));
    let sTurno = 0;

    const render = () => {
        board.innerHTML = `<div class="grid-board" style="opacity:0.3; transform: scale(0.8);">` + 
            sTab.flat().map(v => `<div class="cell ${v?'occupied':''}" style="width:24px; height:24px;"></div>`).join('') + `</div>`;
    };

    const animStep = () => {
        let leg = [];
        for(let r=0; r<10; r++) for(let c=0; c<10; c++) {
            if(sTurno===0 && r<9 && sTab[r][c]===0 && sTab[r+1][c]===0) leg.push({r,c,r2:r+1,c2:c});
            if(sTurno===1 && c<9 && sTab[r][c]===0 && sTab[r][c+1]===0) leg.push({r,c,r2:r,c2:c+1});
        }
        if (leg.length === 0 || Math.random() > 0.9) { sTab = Array(10).fill().map(() => Array(10).fill(0)); sTurno = 0; }
        else { 
            let m = leg[Math.floor(Math.random() * leg.length)]; 
            sTab[m.r][m.c] = 1; sTab[m.r2][m.c2] = 1; 
            sTurno = (sTurno === 0) ? 1 : 0; 
        }
        render();
    };

    render();
    simuInterval = setInterval(animStep, 600); // Rápido
}
// === FIM SECÇÃO 6 ===
