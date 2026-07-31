// ==========================================
// 1. ESTADO GLOBAL E CONFIGURAÇÕES
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0;
let totalRondas = 10;
let certos = 0;
let erros = 0;
let ajudasUsadas = 0;
let itemDestaque = null;
let opcoesRonda = [];
let simuInterval;

// Prevenção de cache de sons
const carregarSom = (ficheiro) => new Audio(JOGO_CONFIG.caminhoSons + ficheiro);
const somAcerto = carregarSom(JOGO_CONFIG.sons.acerto);
const somErro = carregarSom(JOGO_CONFIG.sons.erro);
const somClique = carregarSom(JOGO_CONFIG.sons.clique);

// Injeção de CSS específico para os elementos internos do jogo
const style = document.createElement('style');
style.innerHTML = `
    .opcao-card {
        background: white; 
        border: 3px solid #f0f0f0; 
        border-radius: 15px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        cursor: pointer;
        padding: 5px;
        transition: all 0.2s ease;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .opcao-card:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.1); }
    .opcao-card img { width: 90%; height: 90%; object-fit: contain; }

    #simu-hand {
        position: absolute;
        font-size: 3rem;
        z-index: 100;
        pointer-events: none;
        display: none;
        filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.3));
    }

    .destaque-box {
        height: 25vh; 
        aspect-ratio: 1/1; 
        padding: 15px; 
        background: #fdfdfd; 
        border-radius: 25px; 
        border: 3px dashed var(--primary-color); 
        display: flex; 
        align-items: center; 
        justify-content: center;
        margin-bottom: 20px;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// ==========================================
// 2. FUNÇÕES DE INTERFACE (CAPA E SIMULAÇÃO)
// ==========================================

function mostrarCapa() {
    if (jogoAtivo) return;
    const area = document.getElementById('game-content');
    
    area.innerHTML = `
        <div id="simu-hand">👆</div>
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; gap:25px;">
            <div class="destaque-box" style="height:18vh; animation:none;">
                <img id="simu-destaque" src="" style="height:100%; object-fit:contain;">
            </div>
            <div style="display:flex; gap:15px;">
                <div id="simu-opt-0" class="opcao-card" style="width:80px; height:80px;"><img src=""></div>
                <div id="simu-opt-1" class="opcao-card" style="width:80px; height:80px;"><img src=""></div>
                <div id="simu-opt-2" class="opcao-card" style="width:80px; height:80px;"><img src=""></div>
            </div>
            <p style="font-size: 1.1rem; color: var(--text-grey); font-weight:800; text-align:center; max-width:400px; line-height:1.4;">
                ${JOGO_CONFIG.descricao}
            </p>
        </div>
    `;
    correrSimulacao();
}

function correrSimulacao() {
    clearInterval(simuInterval);
    const hand = document.getElementById('simu-hand');
    
    const animar = () => {
        const itens = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
        const trio = itens.slice(0, 3);
        const certoIdx = Math.floor(Math.random() * 3);
        const itemCerto = trio[certoIdx];

        if(!document.getElementById('simu-destaque')) return;

        document.getElementById('simu-destaque').src = DADOS_JOGO.caminhoImagens + itemCerto.img;
        trio.forEach((it, i) => {
            const card = document.getElementById(`simu-opt-${i}`);
            card.querySelector('img').src = DADOS_JOGO.caminhoImagens + it.img;
            card.style.borderColor = "#f0f0f0";
        });

        // Posicionamento inicial da mão
        const container = document.getElementById('game-content').getBoundingClientRect();
        hand.style.display = "block";
        hand.style.transition = "none";
        hand.style.top = "80%"; 
        hand.style.left = "80%";
        hand.style.opacity = "0";

        setTimeout(() => {
            const target = document.getElementById(`simu-opt-${certoIdx}`);
            const rect = target.getBoundingClientRect();
            
            hand.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
            hand.style.opacity = "1";
            hand.style.top = (rect.top - container.top + 40) + "px";
            hand.style.left = (rect.left - container.left + 30) + "px";

            setTimeout(() => {
                target.style.borderColor = "#8cc63f";
                target.style.transform = "scale(1.1)";
                setTimeout(() => { 
                    if(target) target.style.transform = "scale(1)"; 
                    hand.style.opacity = "0";
                }, 400);
            }, 900);
        }, 300);
    };

    animar();
    simuInterval = setInterval(animar, 4000);
}

// ==========================================
// 3. LÓGICA DO JOGO (GAMEPLAY)
// ==========================================

function iniciarJogo() {
    clearInterval(simuInterval);
    jogoAtivo = true;
    rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0;
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }

    // Atualiza a barra de status no header (Engine do index)
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    
    // Configura a lâmpada como botão de ajuda
    setTimeout(() => {
        const lamp = document.querySelector('.lamp-icon');
        if(lamp) {
            lamp.style.cursor = "pointer";
            lamp.title = "Clique para uma ajuda!";
            lamp.onclick = darAjuda;
        }
    }, 50);

    const area = document.getElementById('game-content');
    
    // Preparar dados da ronda
    const todosItens = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todosItens[0];
    
    // Pegar 10 opções aleatórias garantindo que a correta lá esteja
    let selecao = todosItens.slice(0, 10);
    if (!selecao.find(i => i.id === itemDestaque.id)) selecao[0] = itemDestaque;
    opcoesRonda = selecao.sort(() => Math.random() - 0.5);

    const isPortrait = window.innerHeight > window.innerWidth;
    const gridCols = isPortrait ? 3 : 5;
    const cardSize = isPortrait ? "18vw" : "110px";

    area.innerHTML = `
        <div class="destaque-box">
            <img src="${DADOS_JOGO.caminhoImagens + itemDestaque.img}">
        </div>
        
        <div style="display:grid; grid-template-columns: repeat(${gridCols}, 1fr); gap:12px; width:100%; max-width:700px; justify-items:center;">
            ${opcoesRonda.map(item => `
                <div class="opcao-card" id="card-${item.id}" onclick="verificarResposta(${item.id}, this)" style="width:${cardSize}; height:${cardSize};">
                    <img src="${DADOS_JOGO.caminhoImagens + item.img}">
                </div>
            `).join('')}
        </div>
    `;
}

function verificarResposta(id, elemento) {
    if (!jogoAtivo) return;
    
    // Bloquear cliques múltiplos
    const todosCards = document.querySelectorAll('.opcao-card');
    todosCards.forEach(c => c.style.pointerEvents = 'none');

    if (id === itemDestaque.id) {
        certos++;
        somAcerto.play();
        elemento.style.borderColor = "#8cc63f";
        elemento.style.background = "#f0fff0";
        elemento.innerHTML += '<i class="fas fa-check" style="position:absolute; color:#8cc63f; font-size:2rem;"></i>';
    } else {
        erros++;
        somErro.play();
        elemento.style.borderColor = "#ff5a5f";
        elemento.style.background = "#fff5f5";
        elemento.innerHTML += '<i class="fas fa-times" style="position:absolute; color:#ff5a5f; font-size:2rem;"></i>';
        
        // Mostrar o correto
        const cardCorreto = document.getElementById(`card-${itemDestaque.id}`);
        if(cardCorreto) cardCorreto.style.borderColor = "#8cc63f";
    }

    setTimeout(() => {
        rondaAtual++;
        proximaRonda();
    }, 1500);
}

function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++;
    somClique.play();
    
    const correto = document.getElementById(`card-${itemDestaque.id}`);
    if (correto) {
        correto.animate([
            { transform: 'scale(1)', boxShadow: '0 0 0px var(--primary-color)' },
            { transform: 'scale(1.1)', boxShadow: '0 0 20px var(--primary-color)' },
            { transform: 'scale(1)', boxShadow: '0 0 0px var(--primary-color)' }
        ], { duration: 600, iterations: 2 });
        correto.style.borderColor = "var(--primary-color)";
    }
}

// ==========================================
// 4. FINALIZAÇÃO
// ==========================================

function finalizarJogo() {
    jogoAtivo = false;
    // Usa o motor do index para mostrar os resultados
    Engine.showResults(certos, erros);
    
    // Adicionar info extra de ajudas nos resultados
    const stats = document.querySelector('.results-stats');
    if(stats) {
        const divAjuda = document.createElement('div');
        divAjuda.style = "margin-top: 20px; font-weight: 800; color: var(--text-grey); font-size: 0.9rem;";
        divAjuda.innerHTML = `LÂMPADAS DE AJUDA USADAS: ${ajudasUsadas}`;
        stats.parentElement.appendChild(divAjuda);
    }
}

// Re-renderiza a capa se o ecrã rodar para ajustar tamanhos
function onResizeGame() {
    if (!jogoAtivo) mostrarCapa();
}
