// ==========================================
// 1. ESTADO GLOBAL E ESTILOS (OVERRIDE DO INDEX)
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0;
let totalRondas = 10;
let certos = 0;
let erros = 0;
let ajudasUsadas = 0;
let itemDestaque = null;
let opcoesRonda = [];

// Injeção de CSS para "esmagar" os estilos do index.html
const style = document.createElement('style');
style.innerHTML = `
    /* Reduzir a altura bruta do topo do shell */
    .shell-header { 
        min-height: 50px !important; 
        padding: 5px 15px !important; 
    }
    
    /* Ajustar os elementos da barra de status */
    .status-bar { padding: 0 !important; }
    
    .status-pill { 
        padding: 4px 12px !important; 
        font-size: 0.9rem !important; 
    }
    
    .lamp-icon { 
        height: 35px !important; 
    }
    
    .score-box { 
        padding: 4px 10px !important; 
        font-size: 0.8rem !important; 
        gap: 5px !important;
    }

    /* Ajuste da área de jogo */
    #game-content { 
        padding: 10px !important; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: space-evenly; 
    }

    /* Estilo dos cards e imagens (Animais Maiores) */
    .opcao-card {
        background: white; 
        border: 2px solid #e0e0e0; 
        border-radius: 12px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        cursor: pointer;
        padding: 4px;
        overflow: hidden;
    }
    .opcao-card img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    /* Simulação (Mão/Seta) */
    #simu-hand {
        position: absolute;
        font-size: 2.5rem;
        z-index: 100;
        transition: all 0.7s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        pointer-events: none;
        display: none;
        filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.2));
    }
`;
document.head.appendChild(style);

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CAPA COM SIMULAÇÃO (DESTAQUE + 3 OPÇÕES + SETA)
// ==========================================

function mostrarCapa() {
    if (jogoAtivo) return;
    const area = document.getElementById('game-content');
    
    area.innerHTML = `
        <div class="capa-container" style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; justify-content:center; height:100%; position:relative;">
            <div id="simu-hand">👆</div>
            
            <div style="display:flex; flex-direction:column; align-items:center; gap:15px;">
                <!-- Destaque -->
                <div style="height:15vh; aspect-ratio:1/1; border:2px dashed var(--primary-color); padding:10px; border-radius:20px; background:white; display:flex; align-items:center; justify-content:center;">
                    <img id="simu-destaque" src="" style="height:100%; object-fit:contain;">
                </div>

                <!-- 3 Opções -->
                <div style="display:flex; gap:12px;">
                    <div id="simu-opt-0" class="opcao-card" style="width:70px; height:70px;"><img src=""></div>
                    <div id="simu-opt-1" class="opcao-card" style="width:70px; height:70px;"><img src=""></div>
                    <div id="simu-opt-2" class="opcao-card" style="width:70px; height:70px;"><img src=""></div>
                </div>
            </div>

            <p style="font-size: 1rem; color: var(--text-grey); font-weight:700; text-align:center; padding:0 20px; margin:0;">
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
    const hand = document.getElementById('simu-hand');
    
    const animar = () => {
        const itens = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
        const trio = itens.slice(0, 3);
        const certoIdx = Math.floor(Math.random() * 3);
        const itemCerto = trio[certoIdx];

        document.getElementById('simu-destaque').src = DADOS_JOGO.caminhoImagens + itemCerto.img;
        trio.forEach((it, i) => {
            const card = document.getElementById(`simu-opt-${i}`);
            card.querySelector('img').src = DADOS_JOGO.caminhoImagens + it.img;
            card.style.borderColor = "#e0e0e0";
        });

        // Movimento da Mão
        hand.style.display = "block";
        hand.style.opacity = "0";
        hand.style.top = "70%"; hand.style.left = "80%";

        setTimeout(() => {
            const target = document.getElementById(`simu-opt-${certoIdx}`);
            const rect = target.getBoundingClientRect();
            const parent = document.querySelector('.capa-container').getBoundingClientRect();
            
            hand.style.opacity = "1";
            hand.style.top = (rect.top - parent.top + 45) + "px";
            hand.style.left = (rect.left - parent.left + 25) + "px";

            setTimeout(() => {
                target.style.borderColor = "#8cc63f";
                target.style.transform = "scale(1.1)";
                setTimeout(() => { 
                    target.style.transform = "scale(1)"; 
                    hand.style.opacity = "0";
                }, 400);
            }, 800);
        }, 400);
    };

    animar();
    simuInterval = setInterval(animar, 3500);
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
    
    // Ativar clique na lâmpada (que foi gerada pelo Engine.showStatusBar)
    setTimeout(() => {
        const lamp = document.querySelector('.lamp-icon');
        if(lamp) {
            lamp.style.cursor = "pointer";
            lamp.onclick = darAjuda;
        }
    }, 100);

    const area = document.getElementById('game-content');
    const todos = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todos[0];
    opcoesRonda = todos.slice(0, 10).sort(() => Math.random() - 0.5);

    // Garantir que o item certo está nas opções
    if(!opcoesRonda.find(x => x.id === itemDestaque.id)) opcoesRonda[0] = itemDestaque;
    opcoesRonda.sort(() => Math.random() - 0.5);

    const isPortrait = window.innerHeight > window.innerWidth;
    const cardHeight = isPortrait ? "11vh" : "15vh"; 

    area.innerHTML = `
        <div style="height:22vh; aspect-ratio:1/1; padding:8px; background:#fdfdfd; border-radius:20px; border:2.5px dashed var(--primary-color); display:flex; align-items:center; justify-content:center; margin-bottom:10px;">
            <img src="${DADOS_JOGO.caminhoImagens + itemDestaque.img}" style="height:100%; object-fit:contain;">
        </div>
        
        <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:8px; width:100%; max-width:650px;">
            ${opcoesRonda.map(item => `
                <div class="opcao-card" id="card-${item.id}" onclick="verificarResposta(${item.id}, this)" style="height:${cardHeight};">
                    <img src="${DADOS_JOGO.caminhoImagens + item.img}">
                </div>
            `).join('')}
        </div>
    `;
}

// ==========================================
// 4. VERIFICAÇÃO E AJUDA
// ==========================================

function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++;
    somClique.play();
    const correto = document.getElementById(`card-${itemDestaque.id}`);
    if (correto) {
        correto.style.borderColor = "var(--primary-color)";
        correto.animate([
            { transform: 'scale(1)', boxShadow: '0 0 0px var(--primary-color)' },
            { transform: 'scale(1.15)', boxShadow: '0 0 25px var(--primary-color)' },
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
        const real = document.getElementById(`card-${itemDestaque.id}`);
        if(real) real.style.borderColor = "#8cc63f";
    }

    setTimeout(() => { rondaAtual++; proximaRonda(); }, 1500);
}

// ==========================================
// 5. FINALIZAÇÃO
// ==========================================

function finalizarJogo() {
    jogoAtivo = false;
    Engine.showResults(certos, erros);
    
    // Adicionar contagem de ajudas na tela de resultados
    const statsContainer = document.querySelector('.results-stats');
    if(statsContainer) {
        const ajudaP = document.createElement('p');
        ajudaP.style = "font-size:0.9rem; color:var(--text-grey); font-weight:800; margin-top:15px; width:100%;";
        ajudaP.innerHTML = `💡 AJUDAS UTILIZADAS: ${ajudasUsadas}`;
        statsContainer.parentElement.appendChild(ajudaP);
    }
}

function onResizeGame() { if (!jogoAtivo) mostrarCapa(); }
