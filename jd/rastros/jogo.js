// ==========================================
// 1. ESTADO DO JOGO RASTROS
// ==========================================
let jogoAtivo = false;
let modoJogo = 'CPU'; // 'CPU' ou 'PVP'
let matchScore = [0, 0]; // [P1, P2/CPU]
let totalGames = 5;
let currentGameNum = 1;

let tabuleiro = []; // 0: vazio, 1: bloqueado, 2: peça branca
let posBranca = { x: 4, y: 2 }; // e5 no sistema 0-6 (x: col a-g, y: linha 1-7)
// Nota: a1 é (0,0), g7 é (6,6). e5 é x=4, y=4. 
// Ajustando para o diagrama: a1(0,6), g7(6,0), e5(4,2)

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// ==========================================
// 2. CAPA INICIAL (Escolha de Modo)
// ==========================================
function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">${JOGO_CONFIG.nomeDoJogo.toUpperCase()}</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}icondestaque.png" style="height:120px;">
            <div style="display:flex; flex-direction:column; gap:10px; width:250px;">
                <button class="btn-play-rect" onclick="setModo('CPU')"><i class="fas fa-robot"></i> VS COMPUTADOR</button>
                <button class="btn-play-rect" style="background:#6c757d;" onclick="setModo('PVP')"><i class="fas fa-users"></i> 2 JOGADORES</button>
            </div>
            <p style="color:var(--text-grey); font-weight:800; text-align:center;">Melhor de 5 Jogos</p>
        </div>`;
    document.getElementById('shell-footer-content').style.display = 'none';
}

function setModo(modo) {
    modoJogo = modo;
    matchScore = [0, 0];
    currentGameNum = 1;
    iniciarJogo();
}

// ==========================================
// 3. LOGICA DO TABULEIRO
// ==========================================
function iniciarJogo() {
    jogoAtivo = true;
    // Reset Tabuleiro (0-6 para X e Y)
    tabuleiro = Array(7).fill().map(() => Array(7).fill(0));
    posBranca = { x: 4, y: 2 }; // e5 (col e=4, linha 5=índice 2 de cima para baixo)
    tabuleiro[posBranca.y][posBranca.x] = 2;
    
    atualizarUI();
}

function atualizarUI() {
    // Cabeçalho: Nome do Jogo + Placar
    const p2Label = modoJogo === 'CPU' ? 'COMP' : 'P2';
    document.getElementById('shell-header-content').innerHTML = `
        <div class="status-container">
            <div class="status-pill">JOGO ${currentGameNum}/5</div>
            <div class="score-group">
                <div class="score-box box-v">P1: ${matchScore[0]}</div>
                <div class="score-box box-x">${p2Label}: ${matchScore[1]}</div>
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
            
            // Verificar se é movimento válido
            const dx = Math.abs(x - posBranca.x);
            const dy = Math.abs(y - posBranca.y);
            if (tabuleiro[y][x] === 0 && dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0)) {
                classe += " valid-move";
                html += `<div class="${classe}" onclick="moverPeca(${x},${y})">${conteudo}</div>`;
            } else {
                html += `<div class="${classe}">${conteudo}</div>`;
            }
        }
    }
    html += `</div>`;
    area.innerHTML = html;
}

function moverPeca(nx, ny) {
    if (!jogoAtivo) return;
    somClique.play();

    // 1. Transformar posição atual em pedra negra
    tabuleiro[posBranca.y][posBranca.x] = 1;
    
    // 2. Mover peça branca
    posBranca = { x: nx, y: ny };
    tabuleiro[ny][nx] = 2;

    // 3. Verificar Vitória imediata por casa final
    if (nx === 0 && ny === 6) { finalizarRonda(0); return; } // P1 chegou a a1
    if (nx === 6 && ny === 0) { finalizarRonda(1); return; } // P2/CPU chegou a g7

    // 4. Verificar Bloqueio (quem não tem movimentos perde, logo o último a mover ganha)
    if (!temMovimentosValidos()) {
        finalizarRonda(0); // P1 moveu e bloqueou o outro
        return;
    }

    if (modoJogo === 'CPU') {
        setTimeout(cpuJogar, 600);
    } else {
        atualizarUI();
    }
}

// ==========================================
// 4. INTELIGÊNCIA ARTIFICIAL (CPU)
// ==========================================
function cpuJogar() {
    const moves = getMovimentosPosiveis(posBranca.x, posBranca.y);
    if (moves.length === 0) { finalizarRonda(0); return; }

    // Estratégia Greedy: Escolher a casa mais próxima do objetivo g7(6,0)
    // E evitar a casa a1(0,6)
    moves.sort((a, b) => {
        const distA = Math.hypot(a.x - 6, a.y - 0);
        const distB = Math.hypot(b.x - 6, b.y - 0);
        return distA - distB;
    });

    // Se puder ganhar, ganha
    const vitoria = moves.find(m => m.x === 6 && m.y === 0);
    const alvo = vitoria || moves[0];

    // Executar movimento CPU
    tabuleiro[posBranca.y][posBranca.x] = 1;
    posBranca = { x: alvo.x, y: alvo.y };
    tabuleiro[alvo.y][alvo.x] = 2;

    if (alvo.x === 6 && alvo.y === 0) { finalizarRonda(1); return; }
    if (!temMovimentosValidos()) { finalizarRonda(1); return; }

    atualizarUI();
}

// ==========================================
// 5. UTILITÁRIOS E FINALIZAÇÃO
// ==========================================
function getMovimentosPosiveis(cx, cy) {
    let possiveis = [];
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            let nx = cx + dx;
            let ny = cy + dy;
            if (nx >= 0 && nx < 7 && ny >= 0 && ny < 7 && tabuleiro[ny][nx] === 0) {
                possiveis.push({ x: nx, y: ny });
            }
        }
    }
    return possiveis;
}

function temMovimentosValidos() {
    return getMovimentosPosiveis(posBranca.x, posBranca.y).length > 0;
}

function finalizarRonda(vencedorIdx) {
    jogoAtivo = false;
    matchScore[vencedorIdx]++;
    somAcerto.play();

    if (matchScore[0] >= 3 || matchScore[1] >= 3) {
        finalizarMatch();
    } else {
        const nomeVencedor = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === "CPU" ? "COMPUTADOR" : "JOGADOR 2");
        document.getElementById('game-content').innerHTML = `
            <div style="text-align:center;">
                <h2 style="color:var(--primary-color);">${nomeVencedor} GANHOU ESTE JOGO!</h2>
                <p>Próximo jogo em instantes...</p>
            </div>`;
        setTimeout(() => {
            currentGameNum++;
            iniciarJogo();
        }, 2000);
    }
}

function finalizarMatch() {
    const vencedorFinal = matchScore[0] >= 3 ? 0 : 1;
    const rel = JOGO_CONFIG.relatorios[vencedorFinal === 0 ? 0 : 3];
    
    Engine.showResults(matchScore[0], matchScore[1], 0, rel);
}

// Sobrepor função de ajuda para Rastros
function darAjuda() {
    if (!jogoAtivo) return;
    somClique.play();
    const moves = getMovimentosPosiveis(posBranca.x, posBranca.y);
    // Destacar o melhor movimento para o P1 (ir para a1 -> 0,6)
    moves.sort((a, b) => Math.hypot(a.x - 0, a.y - 6) - Math.hypot(b.x - 0, b.y - 6));
    alert("DICA: Tenta aproximar-te da casa 1 (canto inferior esquerdo)!");
}
