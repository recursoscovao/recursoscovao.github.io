// ==========================================
// 1. ESTADO GLOBAL E ESTILOS CUSTOMIZADOS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0;
let totalRondas = 10;
let certos = 0;
let erros = 0;
let ajudasUsadas = 0;
let itemDestaque = null;
let opcoesRonda = [];

// Injeção de CSS para reduzir paddings e ajustar tamanhos
const style = document.createElement('style');
style.innerHTML = `
    /* Barra de Status super compacta */
    #shell-header { height: 38px !important; min-height: 38px !important; padding: 0 !important; background: #fff; border-bottom: 1px solid #eee; }
    .status-bar-container { height: 38px !important; padding: 0 10px !important; display: flex; align-items: center; justify-content: space-between; }
    .status-item { font-size: 0.7rem !important; font-weight: 800 !important; color: #555; }
    .status-item img { height: 14px !important; margin-right: 3px !important; }
    
    /* Área de jogo sem espaços vazios */
    #game-content { padding: 5px !important; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; }

    /* Estilo dos cards e imagens */
    .opcao-card {
        background: white; 
        border: 2px solid #e0e0e0; 
        border-radius: 10px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        cursor: pointer;
        padding: 2px;
        transition: transform 0.2s;
    }
    .opcao-card img {
        width: 100%;
        height: 100%;
        object-fit: contain; /* Faz todos os animais terem o mesmo tamanho proporcional */
    }
    .destaque-container {
        height: 22vh; 
        width: auto;
        aspect-ratio: 1/1;
        padding: 5px; 
        background: #fdfdfd; 
        border-radius: 20px; 
        border: 2px dashed var(--primary-color); 
        display: flex; 
        align-items: center; 
        justify-content: center;
        margin-bottom: 10px;
    }
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
        <div class="capa-container" style="display:flex; flex-direction:column; align-items:center; gap:10px; width:100%; justify-content:center; height:100%;">
            <div id="simulacao-box" style="display:flex; flex-direction:column; align-items:center; gap:10px;">
                <div style="height:12vh; border:2px dashed #ddd; padding:8px; border-radius:12px;">
                    <img id="simu-destaque" src="${DADOS_JOGO.caminhoImagens + DADOS_JOGO.itens[0].img}" style="height:100%;">
                </div>
                <div style="display:flex; gap:8px;">
                    <div id="simu-opt-1" style="width:55px; height:55px; border:2px solid #eee; border-radius:10px; display:flex; align-items:center; justify-content:center; background:white;"></div>
                    <div id="simu-opt-2" style="width:55px; height:55px; border:2px solid #eee; border-radius:10px; display:flex; align-items:center; justify-content:center; background:white;"></div>
                    <div id="simu-opt-3" style="width:55px; height:55px; border:2px solid #eee; border-radius:10px; display:flex; align-items:center; justify-content:center; background:white;"></div>
                </div>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-grey); font-weight:700; text-align:center; padding:0 20px; margin:0;">
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
        if(!dest || !opt2) return;

        document.querySelectorAll('[id^="simu-opt-"]').forEach(o => { o.style.borderColor = "#eee"; o.innerHTML = ""; });
        dest.src = DADOS_JOGO.caminhoImagens + item.img;
        
        setTimeout(() => {
            if(opt2) {
                opt2.innerHTML = `<img src="${DADOS_JOGO.caminhoImagens + item.img}" style="height:80%;">`;
                opt2.style.borderColor = "#8cc63f";
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
    
    // Pequeno ajuste para garantir que a lâmpada (ajuda) funcione na nova barra
    setTimeout(() => {
        const lamp = document.querySelector('.lamp-icon');
        if(lamp) lamp.onclick = darAjuda;
    }, 50);

    const area = document.getElementById('game-content');
    const todosItens = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todosItens[0];
    opcoesRonda = todosItens.slice(0, 10).sort(() => Math.random() - 0.5);

    const isPortrait = window.innerHeight > window.innerWidth;
    // Aumentamos a altura para os animais ficarem maiores
    const cardHeight = isPortrait ? "12vh" : "16vh"; 

    area.innerHTML = `
        <div class="destaque-container">
            <img src="${DADOS_JOGO.caminhoImagens + itemDestaque.img}" style="height:100%;">
        </div>
        
        <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:5px; width:100%; max-width:650px;">
            ${opcoesRonda.map(item => `
                <div class="opcao-card" id="card-${item.id}" onclick="verificarResposta(${item.id}, this)" style="height:${cardHeight};">
                    <img src="${DADOS_JOGO.caminhoImagens + item.img}">
                </div>
            `).join('')}
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
        cardCorreto.style.borderColor = "var(--primary-color)";
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
        const correto = document.getElementById(`card-${itemDestaque.id}`);
        if(correto) {
            correto.style.borderColor = "#8cc63f";
            correto.style.borderWidth = "4px";
        }
    }

    setTimeout(() => { rondaAtual++; proximaRonda(); }, 1500);
}

// ==========================================
// 5. FINALIZAÇÃO
// ==========================================

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    
    document.getElementById('shell-header-content').innerHTML = `<h2 style="font-size:1rem; color:var(--primary-color); margin:0;">RESULTADOS</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; text-align:center; justify-content:center; height:100%;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu + rel.img}" style="height:18vh; margin-bottom:10px;">
            <h2 style="font-size:1.2rem; color:var(--primary-color); margin:0 0 10px 0;">${rel.titulo}</h2>
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                <div class="score-box score-certo" style="padding:5px 15px;">CERTOS: ${certos}</div>
                <div class="score-box score-erro" style="padding:5px 15px;">ERROS: ${erros}</div>
            </div>
            <p style="font-size:0.8rem; color:var(--text-grey); font-weight:800;">💡 AJUDAS: ${ajudasUsadas}</p>
        </div>
    `;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = 'flex';
    footer.innerHTML = `
        <button class="btn-play-rect" style="background:#6c757d; height:45px; font-size:0.9rem;" onclick="location.reload()">REPETIR</button>
        <button class="btn-play-rect" style="height:45px; font-size:0.9rem;" onclick="window.history.back()">SAIR</button>
    `;
}

function onResizeGame() { if (!jogoAtivo) mostrarCapa(); }
