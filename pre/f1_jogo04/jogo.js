// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0;
let itemDestaque = null, opcoesRonda = [];
let somAtualAnimal = null;
let audioInstGlobal = null; // Para controlar o áudio das instruções

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .game-container-inner { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 600px; }
    .sound-main-card {
        background: white; border: 4px solid #e0f7fa; border-radius: 40px;
        padding: 25px; display: flex; flex-direction: column; align-items: center;
        cursor: pointer; box-shadow: 0 8px 15px rgba(0,0,0,0.05);
        margin-bottom: 25px; width: 100%; max-width: 320px; transition: 0.2s;
    }
    .sound-main-card:active { transform: scale(0.96); }
    .sound-icon-big { width: 70px; height: 70px; margin-bottom: 10px; }
    .sound-text-big { color: #2e7d32; font-size: 2rem; font-weight: 900; margin: 0; }
    
    .grid-opcoes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%; }
    .card-animal {
        background: white; border: 3px solid #f0f0f0; border-radius: 20px;
        padding: 10px; display: flex; flex-direction: column; align-items: center;
        cursor: pointer; position: relative;
    }
    .card-animal img { width: 100%; aspect-ratio: 1/1; object-fit: contain; border-radius: 10px; }
    .card-animal span { margin-top: 8px; font-weight: 800; color: #5d7082; font-size: 0.9rem; }
    
    .feedback-icon { position: absolute; font-size: 3rem; top: 15%; z-index: 10; pointer-events: none; }
`;
document.head.appendChild(style);

// ==========================================
// 3. FUNÇÕES DE ÁUDIO
// ==========================================
function tocarSomAnimal() {
    if (!itemDestaque) return;
    if (somAtualAnimal) { somAtualAnimal.pause(); somAtualAnimal.currentTime = 0; }
    somAtualAnimal = new Audio(JOGO_CONFIG.caminhoSonsAnimais + itemDestaque.som);
    somAtualAnimal.play().catch(e => console.log("Erro ao tocar som do animal:", e));
}

function tocarAudioInstrucoes() {
    if (audioInstGlobal) { audioInstGlobal.pause(); audioInstGlobal.currentTime = 0; }
    somClique.play();
    audioInstGlobal = new Audio(JOGO_CONFIG.caminhoSons + DADOS_JOGO.somInstrucoes);
    audioInstGlobal.play().catch(e => console.log("Erro ao tocar instruções:", e));
}

function pararInstrucoes() {
    if (audioInstGlobal) {
        audioInstGlobal.pause();
        audioInstGlobal.currentTime = 0;
    }
}

// ==========================================
// 4. LÓGICA DO JOGO
// ==========================================
function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div class="game-container-inner">
            <div class="sound-main-card">
                <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="sound-icon-big">
                <p class="sound-text-big">?</p>
            </div>
            <p style="font-weight:800; color:#5d7082; text-align:center;">${JOGO_CONFIG.descricao}</p>
        </div>`;
    
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="tocarAudioInstrucoes()">
        <button class="btn-play-rect" onclick="iniciarJogo()">JOGAR</button>`;
}

function iniciarJogo() { 
    pararInstrucoes(); // Pára o som das instruções ao clicar em Jogar
    jogoAtivo = true; 
    rondaAtual = 1; 
    certos = 0; 
    erros = 0; 
    proximaRonda(); 
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);

    const todos = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todos[0];
    
    let selecao = todos.slice(0, 3);
    if (!selecao.find(i => i.id === itemDestaque.id)) selecao[0] = itemDestaque;
    opcoesRonda = selecao.sort(() => Math.random() - 0.5);

    document.getElementById('game-content').innerHTML = `
        <div class="game-container-inner">
            <div class="sound-main-card" onclick="tocarSomAnimal()">
                <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="sound-icon-big">
                <p class="sound-text-big">Quem sou eu?</p>
                <span style="opacity:0.6; font-size:0.8rem; font-weight:700;">CLICA PARA OUVIR</span>
            </div>
            <div class="grid-opcoes">
                ${opcoesRonda.map(it => `
                    <div class="card-animal" id="card-${it.id}" onclick="verificarResposta(${it.id}, this)">
                        <img src="../../img/${it.pasta}/${it.img}">
                        <span>${it.nome}</span>
                    </div>
                `).join('')}
            </div>
        </div>`;

    // Toca o som automaticamente ao entrar na ronda
    setTimeout(tocarSomAnimal, 500);
}

function verificarResposta(id, el) {
    if (!jogoAtivo) return;
    document.querySelectorAll('.card-animal').forEach(c => c.style.pointerEvents = 'none');

    if (id === itemDestaque.id) {
        certos++; somAcerto.play();
        el.style.borderColor = "#8cc63f";
        el.innerHTML += '<i class="fas fa-check feedback-icon" style="color:#8cc63f"></i>';
    } else {
        erros++; somErro.play();
        el.style.borderColor = "#ff5a5f";
        el.innerHTML += '<i class="fas fa-times feedback-icon" style="color:#ff5a5f"></i>';
        const correto = document.getElementById(`card-${itemDestaque.id}`);
        if(correto) correto.style.borderColor = "#8cc63f";
    }
    
    setTimeout(() => { rondaAtual++; proximaRonda(); }, 2000);
}

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, 0, rel);
}

mostrarCapa();
