// ==========================================
// 1. ESTADO GLOBAL E ESTILO DA BARRA
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0;
let totalRondas = 10;
let certos = 0;
let erros = 0;
let ajudasUsadas = 0;
let itemDestaque = null;
let opcoesRonda = [];

// Reduz a altura da barra de status e o tamanho dos ícones nela
const style = document.createElement('style');
style.innerHTML = `
    #shell-header { height: 50px !important; min-height: 50px !important; }
    .status-bar-container { padding: 0 10px !important; height: 50px !important; }
    .status-item { font-size: 0.9rem !important; }
    .status-item img { height: 20px !important; }
`;
document.head.appendChild(style);

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CAPA COM SIMULAÇÃO ANIMADA
// ==========================================

function mostrarCapa() {
    if (jogoAtivo) return;
    const area = document.getElementById('game-content');
    
    area.innerHTML = `
        <div class="capa-container" style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div id="simulacao-box" style="display:flex; flex-direction:column; align-items:center; gap:10px;">
                <!-- Modelo Destaque -->
                <div style="height:10vh; border:2px dashed #ddd; padding:8px; border-radius:12px;">
                    <img id="simu-destaque" src="${DADOS_JOGO.caminhoImagens + DADOS_JOGO.itens[0].img}" style="height:100%;">
                </div>
                <!-- 3 Opções -->
                <div style="display:flex; gap:10px;">
                    <div id="simu-opt-1" style="width:60px; height:60px; border:2px solid #eee; border-radius:10px; display:flex; align-items:center; justify-content:center; background:white;"></div>
                    <div id="simu-opt-2" style="width:60px; height:60px; border:2px solid #eee; border-radius:10px; display:flex; align-items:center; justify-content:center; background:white;"></div>
                    <div id="simu-opt-3" style="width:60px; height:60px; border:2px solid #eee; border-radius:10px; display:flex; align-items:center; justify-content:center; background:white;"></div>
                </div>
            </div>
            <p style="font-size: 1rem; color: var(--text-grey); font-weight:700; text-align:center; padding:0 20px;">
                ${JOGO_CONFIG.descricao}
            </p>
        </div>
    `;
    correrSimulacao();
    Engine.showCapa();
}

let simuInterval;
function correrSimulacao() {
    clearInterval(simuInterval);
    let step = 0;
    simuInterval = setInterval(() => {
        const item = DADOS_JOGO.itens[step % DADOS_JOGO.itens.length];
        const dest = document.getElementById('simu-destaque');
        const opt2 = document.getElementById('simu-opt-2');
        const opt1 = document.getElementById('simu-opt-1');
        const opt3 = document.getElementById('simu-opt-3');

        if(!dest || !opt2) return;

        [opt1, opt2, opt3].forEach(o => { o.style.borderColor = "#eee"; o.innerHTML = ""; });
        dest.src = DADOS_JOGO.caminhoImagens + item.img;
        
        setTimeout(() => {
            if(opt2) {
                opt2.innerHTML = `<img src="${DADOS_JOGO.caminhoImagens + item.img}" style="height:80%;">`;
                opt2.style.borderColor = "#8cc63f";
                opt2.style.transform = "scale(1.1)";
                setTimeout(() => { if(opt2) opt2.style.transform = "scale(1)"; }, 300);
            }
        }, 800);
        step++;
    }, 2000);
}

// ==========================================
// 3. LÓGICA DO JOGO
// ==========================================

function iniciarJogo() {
    clearInterval(simuInterval);
    jogoAtivo = true;
    rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0;
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }

    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    
    const lamp = document.querySelector('.lamp-icon');
    if(lamp) lamp.onclick = darAjuda;

    const area = document.getElementById('game-content');
    const todosItens = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todosItens[0];
    opcoesRonda = todosItens.slice(0, 10).sort(() => Math.random() - 0.5);

    const isPortrait = window.innerHeight > window.innerWidth;
    // Reduzi levemente as alturas (vh) para compensar o layout
    const imgHeight = isPortrait ? "9vh" : "13vh"; 

    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-evenly;">
            <div style="height:16vh; padding:8px; background:#f9f9f9; border-radius:20px; border:2px dashed var(--primary-color);">
                <img src="${DADOS_JOGO.caminhoImagens + itemDestaque.img}" style="height:100%;">
            </div>
            <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:8px; width:100%; max-width:600px;">
                ${opcoesRonda.map(item => `
                    <div class="opcao-card" id="card-${item.id}" onclick="verificarResposta(${item.id}, this)" style="
                        background:white; border:2px solid #e0e0e0; border-radius:12px; 
                        height:${imgHeight}; display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative;
                    ">
                        <img src="${DADOS_JOGO.caminhoImagens + item.img}" style="max-height:85%; max-width:85%;">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ... (resto das funções darAjuda, verificarResposta, finalizarJogo e onResizeGame permanecem iguais)
