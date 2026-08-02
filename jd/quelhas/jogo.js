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
let tabuleiro = Array(10).fill().map(() => Array(10).fill(0)); 
let startCell = null;     
let primeiraJogadaRealizada = false;
let trocouOrientacao = false; 
let j2JaJogou = false;
let orientacoes = [0, 1]; 
let simuInterval;         

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");
// [FIM DA SECÇÃO 1]

// ============================================================
// 2. CONFIGURAÇÃO VISUAL (DESIGN PREMIUM)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 2px 5px; }
    
    .status-pill { padding: 4px 15px; border-radius: 8px; font-weight: 800; font-size: 0.9rem; color: white; display: flex; align-items: center; gap: 12px; }
    .status-dots { display: flex; gap: 4px; }
    .status-dots.v-dir { flex-direction: column; }
    .status-dots.h-dir { flex-direction: row; }
    .dot-blink { width: 6px; height: 6px; background: white; border-radius: 50%; animation: blinker 1s linear infinite; }

    .score-group { display: flex; gap: 8px; }
    .score-box { padding: 5px 10px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1rem; min-width: 55px; justify-content: center; }
    
    .box-v, .pill-j1 { background: #8cc63f !important; box-shadow: 0 3px 0 #6da32f; }
    .box-x, .pill-j2 { background: #ff5a5f !important; box-shadow: 0 3px 0 #d44348; }
    
    @keyframes blinker { 50% { opacity: 0.2; } }

    #simu-container { height: 320px; display: flex; align-items: center; justify-content: center; width: 100%; overflow: visible; margin-top: 10px !important; margin-bottom: 40px; }
    #simu-board { transform: scale(1.1); }

    .capa-btn-row { display: flex; flex-direction: row; gap: 10px; width: 95%; max-width: 480px; justify-content: center; align-items: center; }
    .btn-capa-small { flex: 1; height: 50px; border-radius: 12px; border: none; color: white; font-weight: 900; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-transform: uppercase; }
    
    .btn-inform { width: 50px; height: 50px; cursor: pointer; flex: none; }
    .btn-inform img { width: 100%; height: 100%; object-fit: contain; }

    .nivel-select-container { display: none; flex-direction: column; gap: 12px; width: 95%; max-width: 500px; align-items: center; }
    .nivel-row { display: flex; flex-direction: row; gap: 10px; width: 100%; justify-content: center; }
    .btn-nivel { background: white; padding: 12px 2px; border-radius: 12px; border: 2px solid #eee; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; flex: 1; }
    .btn-nivel b { font-size: 0.8rem; font-weight: 900; text-transform: uppercase; }
    .btn-nivel span { font-size: 0.55rem; font-weight: 700; opacity: 0.7; text-align: center; line-height: 1.1; margin-top: 4px; }
    .btn-nivel.l1 { border-color: #8cc63f; color: #8cc63f; }
    .btn-nivel.l2 { border-color: #ff5a5f; color: #ff5a5f; }
    
    .btn-voltar-nivel { height: 65px !important; background: #6c757d !important; width: 160px; margin-top: 15px; border-radius: 12px; color: white; font-weight: 900; border: none; cursor: pointer; text-transform: uppercase; }

    /* INSTRUÇÕES PREMIUM */
    #instrucoes-panel { 
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; 
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); transform: translateY(105%); 
        visibility: hidden; padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0; 
    }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.5rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; transition: 0.2s; }
    .close-x:hover { transform: scale(1.2); }
    .inst-content { max-width: 600px; margin: 0 auto; text-align: left; }
    .inst-header { color: var(--primary-color); text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 3px solid var(--bg-color); padding-bottom: 10px; }
    .inst-section-title { color: #444; font-size: 1.2rem; font-weight: 800; margin: 25px 0 12px; display: flex; align-items: center; gap: 10px; }
    .inst-section-title::before { content: ''; width: 6px; height: 22px; background: var(--primary-color); border-radius: 3px; display: inline-block; }
    .inst-text { color: #666; font-size: 1.05rem; line-height: 1.6; margin-bottom: 15px; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f9f9f9; margin-bottom: 10px; padding: 15px; border-radius: 15px; border-left: 5px solid var(--bg-color); color: #555; font-size: 0.95rem; line-height: 1.5; }

    .grid-board { display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; background: #bbb; padding: 3px; border-radius: 8px; width: fit-content; margin: 0 auto; transition: transform 0.8s ease; }
    .grid-board.rotated { transform: rotate(180deg); }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 1px; display: flex; align-items: center; justify-content: center; position: relative; }
    .cell.occupied::after { content: ''; width: 85%; height: 85%; background: #333; border-radius: 50%; }
    .cell.selected { background: #e8f5e9; border: 1px solid #8cc63f; }
    .cell.hint::after { content: ''; width: 8px; height: 8px; background: #bbb; border-radius: 50%; opacity: 0.8; }

    #round-feedback { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(6px); z-index: 1000; display: none; align-items: center; justify-content: center; border-radius: 35px; }
    .vitoria-card { background: white; padding: 30px; border-radius: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.15); text-align: center; border: 4px solid var(--bg-color); animation: cardPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.28); }
    @keyframes cardPop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    @media screen and (min-width: 1025px) { :root { --cell-size: 40px; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 8.5vw; } }
    @media screen and (max-height: 500px) and (orientation: landscape) { :root { --cell-size: 7vh; } }
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
                <div class="inst-section-title">Objetivo (Regra Misere)</div>
                <p class="inst-text">O Quelhas é um jogo estratégico. Ao contrário da maioria, aqui <b>PERDE o jogador que realizar a última jogada possível</b>. Força o adversário a ocupar o último espaço livre!</p>
                <div class="inst-section-title">As Peças e o Tabuleiro</div>
                <ul class="inst-list">
                    <li><b>Tabuleiro:</b> 10x10 casas.</li>
                    <li><b>Jogadores:</b> Vertical (colunas) e Horizontal (linhas).</li>
                    <li><b>Blocos:</b> Deves colocar blocos de <b>duas ou mais peças</b> seguidas.</li>
                </ul>
                <div class="inst-section-title">Como Jogar</div>
                <ul class="inst-list">
                    <li><b>1.</b> O jogador Vertical começa sempre.</li>
                    <li><b>2.</b> Clica na casa onde o bloco começa e depois na casa onde termina.</li>
                    <li><b>3. Regra da Troca:</b> Na primeira jogada do J2, este pode decidir <b>trocar de orientação</b>. O tabuleiro roda 180º e as funções invertem-se.</li>
                </ul>
            </div>`;
        document.body.appendChild(panel);
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.game-shell').appendChild(feedback);
    }

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board"></div></div>
        <div id="capa-menu-principal" style="width:100%; display:flex; flex-direction:column; align-items:center;">
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
        container.innerHTML = `
            <p style="font-weight:800; color:#888; margin-bottom:10px; font-size:0.8rem; text-transform:uppercase;">Jogar com o computador:</p>
            <div class="nivel-row">
                <div class="btn-nivel l1" onclick="setModo('CPU', 1)"><b>Nível 1</b><span>Fácil</span></div>
                <div class="btn-nivel l2" onclick="setModo('CPU', 2)"><b>Nível 2</b><span>Difícil</span></div>
            </div>
            <button class="btn-capa-small btn-voltar-nivel" onclick="voltarCapa()">VOLTAR</button>`;
    } else {
        container.innerHTML = `
            <p style="font-weight:800; color:#888; margin-bottom:10px; font-size:0.8rem; text-transform:uppercase;">Modo 2 Jogadores:</p>
            <div class="nivel-row">
                <div class="btn-nivel l1" onclick="setModo('PVP', 1)"><b>Nível 1</b><span>Fácil</span></div>
                <div class="btn-nivel l2" onclick="setModo('PVP', 2)"><b>Nível 2</b><span>Difícil</span></div>
            </div>
            <button class="btn-capa-small btn-voltar-nivel" onclick="voltarCapa()">VOLTAR</button>`;
    }
}

function voltarCapa() { somClique.play(); document.getElementById('capa-menu-principal').style.display = 'flex'; document.getElementById('nivel-select-container').style.display = 'none'; }
function toggleInstructions() { somClique.play(); document.getElementById('instrucoes-panel').classList.toggle('open'); }

// ============================================================
// 4. LÓGICA CORE DO JOGO E IA
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval); somClique.play();
    modoJogo = modo; nivelJogo = nivel;
    mostrarDicas = (nivel === 1);
    matchScore = [0, 0]; currentGameNum = 1; orientacoes = [0, 1]; trocouOrientacao = false;
    iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(10).fill().map(() => Array(10).fill(0));
    startCell = null; primeiraJogadaRealizada = false; j2JaJogou = false; turnoAtual = 0; 
    document.getElementById('round-feedback').style.display = 'none';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = modoJogo === 'CPU' ? "Pc" : "J2";
    const labelJ2 = modoJogo === 'CPU' ? "Pc" : "Jogador 2";
    const nomeVez = (turnoAtual === 0) ? "Jogador 1" : labelJ2;
    const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";
    const orient = orientacoes[turnoAtual]; 

    const dotsHTML = `<div class="status-dots ${orient === 0 ? 'v-dir' : 'h-dir'}"><div class="dot-blink"></div><div class="dot-blink"></div></div>`;

    document.getElementById('shell-header-content').innerHTML = `
        <div class="status-container">
            <div class="status-pill ${classPill}">${nomeVez} ${dotsHTML}</div>
            <div class="score-group"><div class="score-box box-v">J1: ${matchScore[0]}</div><div class="score-box box-x">${pcLabel}: ${matchScore[1]}</div></div>
        </div>`;

    const area = document.getElementById('game-content');
    area.innerHTML = `<div id="grid-mount" class="grid-board ${trocouOrientacao ? 'rotated' : ''}"></div>`;
    renderTabuleiro(document.getElementById('grid-mount'));

    if (primeiraJogadaRealizada && !j2JaJogou && turnoAtual === 1) {
        const btn = document.createElement('button');
        btn.className = "btn-capa-small"; btn.style = "background:#f9a825; margin: 15px auto; width: 180px; display:block; height:50px;";
        btn.innerText = "TROCAR ORIENTAÇÃO"; btn.onclick = swapOrientations; area.appendChild(btn);
    }
}

function renderTabuleiro(container) {
    const orient = orientacoes[turnoAtual];
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            let cell = document.createElement('div');
            cell.className = "cell";
            if (tabuleiro[r][c] === 1) cell.classList.add("occupied");
            if (startCell && startCell.r === r && startCell.c === c) cell.classList.add("selected");
            if (mostrarDicas && startCell && tabuleiro[r][c] === 0 && validarPeca(startCell.r, startCell.c, r, c, orient)) cell.classList.add("hint");
            cell.onclick = () => handleCellClick(r, c);
            container.appendChild(cell);
        }
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

function swapOrientations() { 
    somAcerto.play(); trocouOrientacao = !trocouOrientacao; orientacoes = [orientacoes[1], orientacoes[0]]; 
    j2JaJogou = true; turnoAtual = 0; atualizarUI(); 
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
    if (!temLancesLegaisParaAlguem(tabuleiro)) { finalizarRonda(turnoAtual); return; }
    turnoAtual = (turnoAtual === 0) ? 1 : 0;
    atualizarUI();
    if (modoJogo === 'CPU' && turnoAtual === 1) setTimeout(iaControlador, 800);
}

function iaControlador() {
    const cpuO = orientacoes[1];
    let moves = [];
    for (let r=0; r<10; r++) for (let c=0; c<10; c++) if (tabuleiro[r][c] === 0) {
        if (cpuO === 0 && r<9 && tabuleiro[r+1][c] === 0) moves.push({r1:r, c1:c, r2:r+1, c2:c});
        if (cpuO === 1 && c<9 && tabuleiro[r][c+1] === 0) moves.push({r1:r, c1:c, r2:r, c2:c+1});
    }
    if (moves.length === 0) return;
    let m;
    if (nivelJogo === 1) {
        let boas = moves.filter(mv => {
            let t = tabuleiro.map(row => [...row]); t[mv.r1][mv.c1]=1; t[mv.r2][mv.c2]=1;
            return temLancesLegaisParaAlguem(t);
        });
        m = boas.length > 0 ? boas[Math.floor(Math.random()*boas.length)] : moves[Math.floor(Math.random()*moves.length)];
    } else {
        let melhor = -Infinity;
        for (let mv of moves) {
            let s = 0; let t = tabuleiro.map(row=>[...row]); t[mv.r1][mv.c1]=1; t[mv.r2][mv.c2]=1;
            if(!temLancesLegaisParaAlguem(t)) s-=100;
            let lAdv = contarLances(0, t); let lProp = contarLances(1, t);
            s += (lAdv % 2 === 0) ? 20 : -10; s += lProp * 5;
            if(s > melhor){ melhor = s; m = mv; }
        }
    }
    if(!m) m = moves[0];
    colocarPeca(m.r1, m.c1, m.r2, m.c2); j2JaJogou = true; finalizarTurno();
}

function contarLances(idx, tab) {
    const o = orientacoes[idx]; let count = 0;
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) if (tab[r][c] === 0) {
        if (o === 0 && r < 9 && tab[r+1][c] === 0) count++;
        if (o === 1 && c < 9 && tab[r][c+1] === 0) count++;
    }
    return count;
}

function temLancesLegaisParaAlguem(tab) {
    return (contarLances(0, tab) > 0 || contarLances(1, tab) > 0);
}

// ============================================================
// 5. FINALIZAÇÃO
// ============================================================
function finalizarRonda(perdedorIdx) {
    jogoAtivo = false; let vencedorIdx = perdedorIdx === 0 ? 1 : 0;
    matchScore[vencedorIdx]++; somAcerto.play();
    const overlay = document.getElementById('round-feedback');
    const nomeV = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    const corV = vencedorIdx === 0 ? "#8cc63f" : "#ff5a5f";
    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="vitoria-card">
        <div style="font-size: 3rem; color: ${corV}; margin-bottom: 10px;"><i class="fas fa-star"></i></div>
        <h1 style="color:${corV}; font-size:2.2rem; font-weight:900; margin:0; text-transform:uppercase;">${nomeV}</h1>
        <p style="color:#666; font-size:1.1rem; font-weight:700; margin:5px 0 0 0;">Venceu esta ronda!</p>
        <div style="margin-top:15px; padding-top:15px; border-top:2px dashed #eee; color:#aaa; font-weight:800;">PLACAR: J1 ${matchScore[0]} - ${matchScore[1]} Pc</div>
    </div>`;
    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 2500);
    else setTimeout(() => { currentGameNum++; trocouOrientacao = false; iniciarJogo(); }, 2500);
}

function finalizarMatch() {
    document.getElementById('round-feedback').style.display = 'none';
    const vencedorIdx = (matchScore[0] >= 3) ? 0 : 1;
    const nomeVencedor = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">RESULTADOS FINAIS</h2>`;
    document.getElementById('game-content').innerHTML = `<div style="text-align:center;"><img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:150px; margin-bottom:10px;"><h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase; margin-bottom:20px;">GANHOU O ${nomeVencedor}</h2><div style="display:flex; justify-content:center; gap:20px;"><div class="score-box box-v" style="padding:10px 20px; font-size:1.2rem;">J1: ${matchScore[0]}</div><div class="score-box box-x" style="padding:10px 20px; font-size:1.2rem;">${modoJogo === 'CPU' ? 'Pc' : 'J2'}: ${matchScore[1]}</div></div></div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex"; footer.style.gap = "10px";
    footer.innerHTML = `<button class="btn-capa-small" style="background:#6c757d; flex:1;" onclick="location.reload()"><i class="fas fa-redo"></i> REPETIR</button><button class="btn-capa-small" style="background:var(--primary-color); flex:1;" onclick="window.history.back()">SAIR</button>`;
}

function getOrientationPlayer(tipo) { return orientacoes.indexOf(tipo); }

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
        else { let m = leg[Math.floor(Math.random() * leg.length)]; sTab[m.r][m.c] = 1; sTab[m.r2][m.c2] = 1; sTurno = (sTurno === 0) ? 1 : 0; }
        let h = `<div class="grid-board" style="opacity:0.4; pointer-events:none;">`;
        for(let r=0;r<10;r++) for(let c=0;c<10;c++) h+=`<div class="cell ${sTab[r][c]===1?'occupied':''}" style="width:23px; height:23px;"></div>`;
        if(board) board.innerHTML = h + `</div>`;
    }, 600);
}
