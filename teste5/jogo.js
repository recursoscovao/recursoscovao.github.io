// ==========================================
// 1. ESTADO GLOBAL DO JOGO
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0;
let totalRondas = 10;
let certos = 0;
let erros = 0;
let itemDestaque = null;
let opcoesRonda = [];

// Pré-carregamento de sons
const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. FUNÇÕES DE INICIALIZAÇÃO E CAPA
// ==========================================

function mostrarCapa() {
    if (jogoAtivo) return; // Não redesenha a capa se estivermos a jogar

    const area = document.getElementById('game-content');
    
    // Altura dinâmica para a simulação (40% da altura disponível)
    const simuSize = window.innerHeight < 500 ? 80 : 180;

    area.innerHTML = `
        <div class="capa-container" style="text-align:center; width:100%;">
            <div id="simulacao-jogo" style="height: ${simuSize}px; margin-bottom: 20px; display:flex; justify-content:center; align-items:center; gap:15px;">
                <!-- A simulação vai correr aqui -->
            </div>
            <p style="font-size: calc(1.2rem * var(--ui-scale)); color: var(--text-grey); font-weight:700; padding: 0 20px;">
                ${JOGO_CONFIG.descricao}
            </p>
        </div>
    `;

    // Iniciar a simulação visual (troca de animais automática)
    correrSimulacao();
    
    // Resetar a Engine para o estado de Capa (Título + Botões)
    Engine.showCapa();
}

let simuInterval;
function correrSimulacao() {
    clearInterval(simuInterval);
    const box = document.getElementById('simulacao-jogo');
    if (!box) return;

    let index = 0;
    const items = DADOS_JOGO.itens;

    simuInterval = setInterval(() => {
        const item = items[index];
        box.innerHTML = `
            <img src="${DADOS_JOGO.caminhoImagens + item.img}" 
                 style="height: 100%; width: auto; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.1)); animation: bounce 0.5s ease-in-out;">
        `;
        index = (index + 1) % items.length;
    }, 1500);
}

// ==========================================
// 3. LÓGICA DO JOGO (ENCONTRAR O PAR)
// ==========================================

function iniciarJogo() {
    clearInterval(simuInterval);
    jogoAtivo = true;
    rondaAtual = 1;
    certos = 0;
    erros = 0;
    
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) {
        finalizarJogo();
        return;
    }

    // 1. Atualizar Barra de Status na Engine
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);

    const area = document.getElementById('game-content');
    area.innerHTML = ""; // Limpar área

    // 2. Escolher item destaque e opções
    // Baralhar todos os itens e escolher um para destaque
    const todosItens = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todosItens[0];

    // Criar lista de 10 opções (incluindo o certo)
    opcoesRonda = todosItens.slice(0, 10).sort(() => Math.random() - 0.5);

    // 3. Renderizar Layout do Jogo
    // O tamanho das imagens adapta-se se o ecrã for Landscape ou Portrait
    const isLandscape = window.innerWidth > window.innerHeight;
    const destaqueHeight = isLandscape ? "25vh" : "20vh";
    const opcoesHeight = isLandscape ? "15vh" : "12vh";

    area.innerHTML = `
        <div class="jogo-container" style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; gap:20px;">
            
            <!-- MODELO EM DESTAQUE -->
            <div class="destaque-box" style="height: ${destaqueHeight}; background: #f8f9fa; padding: 15px; border-radius: 25px; border: 3px dashed var(--primary-color);">
                <img src="${DADOS_JOGO.caminhoImagens + itemDestaque.img}" style="height: 100%; width: auto;">
            </div>

            <!-- GRELHA DE OPÇÕES -->
            <div class="opcoes-grid" style="
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(${opcoesHeight}, 1fr)); 
                gap: 10px; 
                width: 100%; 
                justify-items: center;
                padding: 10px;
            ">
                ${opcoesRonda.map(item => `
                    <div class="opcao-card" onclick="verificarResposta(${item.id}, this)" style="
                        background: white; 
                        border: 2px solid #eee; 
                        border-radius: 15px; 
                        padding: 10px; 
                        cursor: pointer; 
                        height: ${opcoesHeight};
                        transition: transform 0.2s;
                    ">
                        <img src="${DADOS_JOGO.caminhoImagens + item.img}" style="height: 100%; width: auto;">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==========================================
// 4. VERIFICAÇÃO E FEEDBACK
// ==========================================

function verificarResposta(idEscolhido, elemento) {
    if (!jogoAtivo) return;
    
    // Bloquear cliques temporariamente para feedback
    const cards = document.querySelectorAll('.opcao-card');
    cards.forEach(c => c.style.pointerEvents = 'none');

    if (idEscolhido === itemDestaque.id) {
        // ACERTO
        certos++;
        somAcerto.play();
        elemento.style.borderColor = "#8cc63f";
        elemento.style.backgroundColor = "#e8f5e9";
        elemento.innerHTML += '<i class="fas fa-check-circle" style="position:absolute; color:#8cc63f; font-size:2rem; top:-10px; right:-10px;"></i>';
    } else {
        // ERRO
        erros++;
        somErro.play();
        elemento.style.borderColor = "#ff5a5f";
        elemento.style.backgroundColor = "#ffebee";
        
        // Mostrar qual era a correta
        cards.forEach(c => {
            const img = c.querySelector('img').src;
            if (img.includes(itemDestaque.img)) {
                c.style.borderColor = "#8cc63f";
                c.style.borderWidth = "4px";
                c.style.transform = "scale(1.1)";
            }
        });
    }

    // Aguardar 1.5 segundos e passar para a próxima
    setTimeout(() => {
        rondaAtual++;
        proximaRonda();
    }, 1500);
}

// ==========================================
// 5. FINALIZAÇÃO
// ==========================================

function finalizarJogo() {
    jogoAtivo = false;
    // Chamar a Engine de Resultados (ela trata das taças e botões automaticamente)
    Engine.showResults(certos, erros);
}

// ==========================================
// 6. ADAPTAÇÃO AO ECRÃ (ON RESIZE)
// ==========================================

function onResizeGame(viewport) {
    // Se o jogo estiver a decorrer, podemos ajustar tamanhos ou apenas redesenhar
    if (!jogoAtivo) {
        mostrarCapa();
    }
}
