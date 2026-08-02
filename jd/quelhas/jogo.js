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
    .status-pill { padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 0.9rem; color: white; transition: 0.3s; }
    .score-group { display: flex; gap: 8px; }
    .score-box { padding: 5px 10px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1rem; min-width: 55px; justify-content: center; }
    
    .box-v, .pill-j1 { background: #8cc63f !important; box-shadow: 0 3px 0 #6da32f; }
    .box-x, .pill-j2 { background: #ff5a5f !important; box-shadow: 0 3px 0 #d44348; }
    
    .blinking { animation: blinker 1s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.4; } }

    /* Ajuste: 10px de padding da barra de status */
    #simu-container { height: 320px; display: flex; align-items: center; justify-content: center; width: 100%; overflow: visible; margin-top: 10px !important; margin-bottom: 40px; }
    #simu-board { transform: scale(1.1); }

    .capa-btn-row { display: flex; flex-direction: row; gap: 10px; width: 95%; max-width: 480px; justify-content: center; align-items: center; }
    .btn-capa-small { flex: 1; height: 50px; border-radius: 12px; border: none; color: white; font-weight: 900; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-transform: uppercase; }
    
    .btn-inform { width: 50px; height: 50px; cursor: pointer; flex: none; }
    .btn-inform img { width: 100%; height: 100%; object-fit: contain; }

    /* MENU DE NÍVEIS PREMIUM */
    .nivel-select-container { display: none; flex-direction: column; gap: 12px; width: 95%; max-width: 500px; align-items: center; }
    .nivel-row { display: flex; flex-direction: row; gap: 10px; width: 100%; justify-content: center; }
    .btn-nivel { background: white; padding: 12px 2px; border-radius: 12px; border: 2px solid #eee; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; flex: 1; }
    .btn-nivel b { font-size: 0.8rem; font-weight: 900; text-transform: uppercase; }
    .btn-nivel span { font-size: 0.6rem; font-weight: 700; opacity: 0.7; text-align: center; line-height: 1.1; margin-top: 4px; }
    .btn-nivel.l1 { border-color: #8cc63f; color: #8cc63f; }
    .btn-nivel.l2 { border-color: #ff5a5f; color: #ff5a5f; }
    
    /* Botão Voltar: 65px de altura */
    .btn-voltar-nivel { height: 65px !important; background: #6c757d !important; width: 150px; margin-top: 15px; border-radius: 12px; color: white; font-weight: 900; border: none; cursor: pointer; text-transform: uppercase; }

    /* PAINEL DE INSTRUÇÕES PREMIUM */
    #instrucoes-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: transform 0.5s ease; transform: translateY(100%); visibility: hidden; padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0; }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.5rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; transition: 0.2s; }
    .close-x:hover { transform: scale(1.2); }

    .inst-content { max-width: 600px; margin: 0 auto; text-align: left; }
    .inst-header { color: var(--primary-color); text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 3px solid var(--bg-color); padding-bottom: 10px; }
    .inst-section-title { color: #444; font-size: 1.2rem; font-weight: 800; margin: 20px 0 12px; display: flex; align-items: center; gap: 10px; }
    .inst-section-title::before { content: ''; width: 6px; height: 22px; background: var(--primary-color); border-radius: 3px; display: inline-block; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f9f9f9; margin-bottom: 10px; padding: 15px; border-radius: 15px; border-left: 5px solid var(--bg-color); color: #555; font-size: 0.95rem; line-height: 1.4; }

    /* TABULEIRO */
    .grid-board { display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; background: #bbb; padding: 3px; border-radius: 8px; width: fit-content; margin: 0 auto; transition: transform 0.8s ease; }
    .grid-board.rotated { transform: rotate(180deg); }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 1px; display: flex; align-items: center; justify-content: center; }
    .cell.occupied::after { content: ''; width: 85%; height: 85%; background: #333; border-radius: 50%; }
    .cell.selected { background: #e8f5e9; border: 2px solid #8cc63f; }
    .cell.hint { background: rgba(140, 198, 63, 0.25); position: relative; }
    .cell.hint::before { content: ''; width: 8px; height: 8px; background: #8cc63f; border-radius: 50%; opacity: 0.5; }

    #round-feedback { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(6px); z-index: 1000; display: none; align-items: center; justify-content: center; border-radius: 35px; }
    .vitoria-card { background: white; padding: 30px; border-radius: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.15); text-align: center; }

    @media screen and (min-width: 1025px) { :root { --cell-size: 40px; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 8.5vw; } }
    @media screen and (max-height: 500px) and (orientation: landscape) { :root { --cell-size: 7vh; } }
`;
document.head.appendChild(style);

// ============================================================
// 3. CAPA, SIMULAÇÃO E INSTRUÇÕES COMPLETAS
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
                <p class="inst-text">O Quelhas é um jogo de bloqueio estratégico. Ao contrário da maioria dos jogos, este segue a regra <b>Misere</b>: o jogador que realizar a <b>última jogada possível</b> no tabuleiro perde o jogo. O teu objetivo é forçar o adversário a ocupar o último espaço livre.</p>

                <div class="inst-section-title">As Peças e o Tabuleiro</div>
                <ul class="inst-list">
                    <li><b>Tabuleiro:</b> Um quadrado de 10x10 casas.</li>
                    <li><b>Jogadores:</b> Um joga na <b>Vertical</b> (colunas) e outro na <b>Horizontal</b> (linhas).</li>
                    <li><b>Peças:</b> Devem ser colocados blocos de <b>duas ou mais peças</b> seguidas na orientação do jogador.</li>
                </ul>

                <div class="inst-section-title">Como Jogar</div>
                <ul class="inst-list">
                    <li><b>1.</b> O jogador Vertical começa sempre o jogo.</li>
                    <li><b>2.</b> Para jogar, clica na casa onde o bloco começa e depois na casa onde termina.</li>
                    <li><b>3.</b> O bloco só pode ser colocado em <b>casas livres</b> e na tua orientação correta.</li>
                    <li><b>4. Regra da Troca:</b> Na primeira jogada do segundo jogador (J2), este pode optar por <b>trocar de orientação</b> com o J1. O tabuleiro roda 180º e o J2 assume a Vertical.</li>
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
// 4. LÓGICA DO JOGO E IA
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
    startCell = null; primeiraJogadaRealizada = false; turnoAtual = 0; 
    document.getElementById('round-feedback').style.display = 'none';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = modoJogo === 'CPU' ? "Pc" : "J2";
    const nomeVez = (turnoAtual === 0) ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";
    document.getElementById('shell-header-content').innerHTML = `
        <div class="status-container">
            <div class="status-pill ${classPill} blinking" style="animation: blinker 1s linear infinite;">VEZ DO ${nomeVez}</div>
            <div class="score-group"><div class="score-box box-v">J1: ${matchScore[0]}</div><div class="score-box box-x">${pcLabel}: ${matchScore[1]}</div></div>
        </div>`;
    const area = document.getElementById('game-content');
    area.innerHTML = `<div class="game-layout-wrapper">
            <div class="orient-wrap ${getOrientationPlayer(orientacoes[1]) === turnoAtual ? 'active' : ''}"><div class="orient-circle" style="background:${orientacoes[1] === 0 ? '#8cc63f' : '#ff5a5f'}"></div><div class="orient-circle" style="background:${orientacoes[1] === 0 ? '#8cc63f' : '#ff5a5f'}"></div></div>
            <div id="grid-mount" class="grid-board ${trocouOrientacao ? 'rotated' : ''}"></div>
            <div class="orient-wrap ${getOrientationPlayer(orientacoes[0]) === turnoAtual ? 'active' : ''}"><div class="orient-circle" style="background:${orientacoes[0] === 0 ? '#8cc63f' : '#ff5a5f'}"></div><div class="orient-circle" style="background:${orientacoes[0] === 0 ? '#8cc63f' : '#ff5a5f'}"></div></div>
        </div>`;
    renderTabuleiro(document.getElementById('grid-mount'));
    if (primeiraJogadaRealizada && !tabuleiro.flat().includes(1, tabuleiro.flat().indexOf(1)+1) && turnoAtual === 1 && modoJogo === 'PVP' && !trocouOrientacao) {
        const btn = document.createElement('button');
        btn.className = "btn-capa-small"; btn.style = "background:#f9a825; margin: 10px auto; width: 180px; display:block; height:50px;";
        btn.innerText = "TROCAR"; btn.onclick = swapOrientations; area.appendChild(btn);
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
            startCell = null; finalizarTurno();
        } else { startCell = { r, c }; somClique.play(); atualizarUI(); }
    }
}

function swapOrientations() { somAcerto.play(); trocouOrientacao = true; orientacoes = [orientacoes[1], orientacoes[0]]; turnoAtual = 0; atualizarUI(); }

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
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) if (tabuleiro[r][c] === 0) {
        if (cpuO === 0 && r < 9 && tabuleiro[r+1][c] === 0) moves.push({r1:r, c1:c, r2:r+1, c2:c});
        if (cpuO === 1 && c < 9 && tabuleiro[r][c+1] === 0) moves.push({r1:r, c1:c, r2:r, c2:c+1});
    }
    if (moves.length === 0) return;
    let moveFinal;
    if (nivelJogo === 1) {
        let boas = moves.filter(m => {
            let t = tabuleiro.map(row => [...row]); t[m.r1][m.c1]=1; t[m.r2][m.c2]=1;
            return temLancesLegaisParaAlguem(t);
        });
        moveFinal = boas.length > 0 ? boas[Math.floor(Math.random()*boas.length)] : moves[Math.floor(Math.random()*moves.length)];
    } else {
        let melhor = -Infinity;
        for (let m of moves) {
            let s = 0; let t = tabuleiro.map(row=>[...row]); t[m.r1][m.c1]=1; t[m.r2][m.c2]=1;
            if(!temLancesLegaisParaAlguem(t)) s-=100;
            let lAdv = contarLances(0, t); let lProp = contarLances(1, t);
            s += (lAdv % 2 === 0) ? 20 : -10; s += lProp * 5;
            if(s > melhor){ melhor = s; moveFinal = m; }
        }
    }
    if(!moveFinal) moveFinal = moves[0];
    colocarPeca(moveFinal.r1, moveFinal.c1, moveFinal.r2, moveFinal.c2); finalizarTurno();
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
    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 2000);
    else setTimeout(() => { currentGameNum++; trocouOrientacao = false; iniciarJogo(); }, 2000);
}

function finalizarMatch() {
    document.getElementById('round-feedback').style.display = 'none';
    const vencedorIdx = (matchScore[0] >= 3) ? 0 : 1;
    const nomeVencedor = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">RESULTADOS FINAIS</h2>`;
    document.getElementById('game-content').innerHTML = `<div style="text-align:center;"><img src="${JOGO_CONFIG.caminhoIconsMenu}taca_1.png" style="height:150px; margin-bottom:10px;"><h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase; margin-bottom:20px;">GANHOU O ${nomeVencedor}</h2><div style="display:flex; justify-content:center; gap:20px;"><div class="score-box box-v" style="padding:10px 20px; font-size:1.2rem;">J1: ${matchScore[0]}</div><div class="score-box box-x" style="padding:10px 20px; font-size:1.2rem;">${modoJogo === 'CPU' ? 'Pc' : 'J2'}: ${matchScore[1]}</div></div></div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex"; footer.style.gap = "10px";
    footer.innerHTML = `<button class="btn-capa-small" style="background:#6c757d; flex:1;" onclick="location.reload()">REPETIR</button><button class="btn-capa-small" style="background:var(--primary-color); flex:1;" onclick="window.history.back()">SAIR</button>`;
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
