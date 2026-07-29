// ==========================================
// 1. ESTADO GLOBAL DO JOGO
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0;
let totalRondas = 10;
let certos = 0;
let erros = 0;
let ajudasUsadas = 0;
let itemDestaque = null;
let opcoesRonda = [];

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

        // Reset cores
        [opt1, opt2, opt3].forEach(o => { o.style.borderColor = "#eee"; o.innerHTML = ""; });

        // Muda destaque
        dest.src = DADOS_JOGO.caminhoImagens + item.img;
        
        // Simula clique no meio após 800ms
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
    
    // Configurar Lâmpada (Ajuda)
    const lamp = document.querySelector('.lamp-icon');
    if(lamp) lamp.onclick = darAjuda;

    const area = document.getElementById('game-content');
    const todosItens = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todosItens[0];
    opcoesRonda = todosItens.slice(0, 10).sort(() => Math.random() - 0.5);

    const isPortrait = window.innerHeight > window.innerWidth;
    const imgHeight = isPortrait ? "10vh" : "14vh";

    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-evenly;">
            <div style="height:18vh; padding:12px; background:#f9f9f9; border-radius:20px; border:2px dashed var(--primary-color);">
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

// ==========================================
// 4. AJUDA E VERIFICAÇÃO
// ==========================================

function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++;
    somClique.play();

    const cardCorreto = document.getElementById(`card-${itemDestaque.id}`);
    if (cardCorreto) {
        cardCorreto.style.transition = "0.3s";
        cardCorreto.style.borderColor = "var(--primary-color)";
        cardCorreto.style.boxShadow = "0 0 15px var(--primary-color)";
        // Animação de pulso para destacar
        cardCorreto.animate([
            { transform: 'scale(1)', boxShadow: '0 0 0px var(--primary-color)' },
            { transform: 'scale(1.1)', boxShadow: '0 0 20px var(--primary-color)' },
            { transform: 'scale(1)', boxShadow: '0 0 0px var(--primary-color)' }
        ], { duration: 800, iterations: 2 });
    }
}

function verificarResposta(id, el) {
    if (!jogoAtivo) return;
    document.querySelectorAll('.opcao-card').forEach(c => c.style.pointerEvents = 'none');

    if (id === itemDestaque.id) {
        certos++; somAcerto.play();
        el.style.borderColor = "#8cc63f";
        el.style.backgroundColor = "#f0fff0";
    } else {
        erros++; somErro.play();
        el.style.borderColor = "#ff5a5f";
        el.style.backgroundColor = "#fff5f5";
        document.getElementById(`card-${itemDestaque.id}`).style.borderColor = "#8cc63f";
        document.getElementById(`card-${itemDestaque.id}`).style.borderWidth = "4px";
    }

    setTimeout(() => { rondaAtual++; proximaRonda(); }, 1500);
}

// ==========================================
// 5. FINALIZAÇÃO (COM AJUDAS)
// ==========================================

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    
    document.getElementById('shell-header-content').innerHTML = `<h2 style="font-size:1.2rem; color:var(--primary-color);">RESULTADOS</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu + rel.img}" style="height:20vh; margin-bottom:10px;">
            <h2 style="font-size:1.3rem; color:var(--primary-color); margin-bottom:10px;">${rel.titulo}</h2>
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                <div class="score-box score-certo">CERTOS: ${certos}</div>
                <div class="score-box score-erro">ERROS: ${erros}</div>
            </div>
            <p style="font-size:0.9rem; color:var(--text-grey); font-weight:800;">💡 AJUDAS UTILIZADAS: ${ajudasUsadas}</p>
        </div>
    `;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = 'flex';
    footer.innerHTML = `
        <button class="btn-play-rect" style="background:#6c757d; height:50px; font-size:1rem;" onclick="location.reload()">REPETIR</button>
        <button class="btn-play-rect" style="height:50px; font-size:1rem;" onclick="window.history.back()">SAIR</button>
    `;
}

function onResizeGame() { if (!jogoAtivo) mostrarCapa(); }
