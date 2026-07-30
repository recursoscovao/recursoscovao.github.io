// ==========================================
// 1. ESTADO GLOBAL E ESTILOS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0;
let totalRondas = 10;
let certos = 0;
let erros = 0;
let ajudasUsadas = 0;
let itemDestaque = null;
let opcoesRonda = [];

const style = document.createElement('style');
style.innerHTML = `
    #shell-header { height: 38px !important; min-height: 38px !important; padding: 0 !important; background: #fff; }
    .status-bar-container { height: 38px !important; padding: 0 10px !important; display: flex; align-items: center; justify-content: space-between; }
    .status-item { font-size: 0.7rem !important; font-weight: 800 !important; }
    .status-item img { height: 14px !important; margin-right: 3px !important; }
    
    #game-content { padding: 5px !important; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; position: relative; }

    .opcao-card {
        background: white; border: 2px solid #e0e0e0; border-radius: 10px; 
        display: flex; align-items: center; justify-content: center; 
        cursor: pointer; padding: 2px; transition: transform 0.2s;
    }
    .opcao-card img { width: 100%; height: 100%; object-fit: contain; }

    .destaque-container {
        height: 22vh; width: auto; aspect-ratio: 1/1; padding: 5px; 
        background: #fdfdfd; border-radius: 20px; border: 2px dashed var(--primary-color); 
        display: flex; align-items: center; justify-content: center; margin-bottom: 10px;
    }

    /* Estilo da Mão na Simulação */
    #simu-hand {
        position: absolute;
        font-size: 2rem;
        z-index: 10;
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        display: none;
    }
`;
document.head.appendChild(style);

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CAPA COM SIMULAÇÃO MELHORADA
// ==========================================

function mostrarCapa() {
    if (jogoAtivo) return;
    const area = document.getElementById('game-content');
    
    area.innerHTML = `
        <div class="capa-container" style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; justify-content:center; height:100%; position:relative;">
            <div id="simu-hand">👆</div>
            
            <div id="simulacao-box" style="display:flex; flex-direction:column; align-items:center; gap:15px;">
                <!-- Animal em Destaque -->
                <div style="height:15vh; aspect-ratio:1/1; border:2px dashed var(--primary-color); padding:8px; border-radius:15px; background:white;">
                    <img id="simu-destaque" src="" style="height:100%; width:100%; object-fit:contain;">
                </div>

                <!-- 3 Opções por baixo -->
                <div style="display:flex; gap:10px; position:relative;">
                    <div id="simu-opt-0" class="opcao-card" style="width:65px; height:65px; background:white;">
                        <img src="" style="width:80%;">
                    </div>
                    <div id="simu-opt-1" class="opcao-card" style="width:65px; height:65px; background:white;">
                        <img src="" style="width:80%;">
                    </div>
                    <div id="simu-opt-2" class="opcao-card" style="width:65px; height:65px; background:white;">
                        <img src="" style="width:80%;">
                    </div>
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
    const hand = document.getElementById('simu-hand');
    
    const animarPasso = () => {
        // 1. Escolher 3 animais aleatórios diferentes
        const embaralhado = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
        const trio = embaralhado.slice(0, 3);
        const indexCerto = Math.floor(Math.random() * 3);
        const correto = trio[indexCerto];

        // 2. Atualizar imagens
        document.getElementById('simu-destaque').src = DADOS_JOGO.caminhoImagens + correto.img;
        trio.forEach((item, i) => {
            const container = document.getElementById(`simu-opt-${i}`);
            container.querySelector('img').src = DADOS_JOGO.caminhoImagens + item.img;
            container.style.borderColor = "#e0e0e0";
            container.style.transform = "scale(1)";
        });

        // 3. Posicionar a mão inicialmente fora
        hand.style.display = "block";
        hand.style.opacity = "0";
        hand.style.top = "60%";
        hand.style.left = "80%";

        // 4. Mover a mão para o animal correto
        setTimeout(() => {
            const target = document.getElementById(`simu-opt-${indexCerto}`);
            const rect = target.getBoundingClientRect();
            const parentRect = document.querySelector('.capa-container').getBoundingClientRect();
            
            hand.style.opacity = "1";
            hand.style.top = (rect.top - parentRect.top + 40) + "px";
            hand.style.left = (rect.left - parentRect.left + 20) + "px";

            // 5. Simular o clique
            setTimeout(() => {
                target.style.borderColor = "#8cc63f";
                target.style.transform = "scale(1.1)";
                hand.style.transform = "scale(0.8)";
                setTimeout(() => { 
                    hand.style.transform = "scale(1)";
                    hand.style.opacity = "0";
                }, 300);
            }, 700);
        }, 500);
    };

    animarPasso();
    simuInterval = setInterval(animarPasso, 3000);
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
    
    setTimeout(() => {
        const lamp = document.querySelector('.lamp-icon');
        if(lamp) lamp.onclick = darAjuda;
    }, 50);

    const area = document.getElementById('game-content');
    const todosItens = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todosItens[0];
    opcoesRonda = todosItens.slice(0, 10).sort(() => Math.random() - 0.5);

    // Garantir que o destaque está nas opções
    if (!opcoesRonda.find(i => i.id === itemDestaque.id)) {
        opcoesRonda[Math.floor(Math.random() * 10)] = itemDestaque;
    }

    const isPortrait = window.innerHeight > window.innerWidth;
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
