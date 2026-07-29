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

// Pré-carregamento de sons
const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CAPA E SIMULAÇÃO
// ==========================================

function mostrarCapa() {
    if (jogoAtivo) return;
    const area = document.getElementById('game-content');
    
    // Simulação que imita o layout do jogo
    area.innerHTML = `
        <div class="capa-realista" style="display:flex; flex-direction:column; align-items:center; gap:10px; width:100%; opacity:0.8;">
            <div style="height:12vh; border:2px dashed #ccc; padding:10px; border-radius:15px;">
                <img src="${DADOS_JOGO.caminhoImagens + DADOS_JOGO.itens[0].img}" style="height:100%;">
            </div>
            <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:5px; width:90%;">
                ${Array(10).fill(0).map((_, i) => `
                    <div style="aspect-ratio:1/1; background:#f0f0f0; border-radius:8px; border:1px solid #ddd;"></div>
                `).join('')}
            </div>
            <p style="font-size: calc(1.1rem * var(--ui-scale)); color: var(--text-grey); font-weight:700; margin-top:10px;">
                ${JOGO_CONFIG.descricao}
            </p>
        </div>
    `;
    Engine.showCapa();
}

// ==========================================
// 3. LÓGICA DO JOGO
// ==========================================

function iniciarJogo() {
    jogoAtivo = true;
    rondaAtual = 1;
    certos = 0;
    erros = 0;
    ajudasUsadas = 0;
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) {
        finalizarJogo();
        return;
    }

    // Atualizar Barra de Status e tornar a lâmpada clicável para ajuda
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    const lampada = document.querySelector('.lamp-icon');
    if(lampada) {
        lampada.style.cursor = "pointer";
        lampada.onclick = darAjuda;
        lampada.title = "Clique para uma ajuda!";
    }

    const area = document.getElementById('game-content');
    area.innerHTML = "";

    // Escolher Destaque
    const todosItens = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todosItens[0];
    
    // Escolher 10 opções (incluindo a correta)
    opcoesRonda = todosItens.slice(0, 10).sort(() => Math.random() - 0.5);

    // Ajuste de tamanhos para caber 2 linhas de 5
    const isPortrait = window.innerHeight > window.innerWidth;
    const imgHeight = isPortrait ? "10vh" : "15vh";

    area.innerHTML = `
        <div class="jogo-wrapper" style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-around;">
            
            <div class="destaque-area" style="height:20vh; padding:15px; background:#f9f9f9; border-radius:25px; border:3px dashed var(--primary-color); display:flex; align-items:center; justify-content:center;">
                <img src="${DADOS_JOGO.caminhoImagens + itemDestaque.img}" style="height:100%; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1));">
            </div>

            <div class="grid-opcoes" style="
                display: grid; 
                grid-template-columns: repeat(5, 1fr); 
                grid-template-rows: repeat(2, 1fr); 
                gap: 8px; 
                width: 100%; 
                max-width: 600px;
                padding: 5px;
            ">
                ${opcoesRonda.map(item => `
                    <div class="opcao-card" id="card-${item.id}" onclick="verificarResposta(${item.id}, this)" style="
                        background: white; border: 2px solid #e0e0e0; border-radius: 12px; 
                        padding: 5px; cursor: pointer; display:flex; align-items:center; justify-content:center;
                        height: ${imgHeight}; transition: transform 0.2s; position:relative;
                    ">
                        <img src="${DADOS_JOGO.caminhoImagens + item.img}" style="max-height: 90%; max-width:90%; object-fit:contain;">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==========================================
// 4. FUNÇÕES DE APOIO (AJUDA E VERIFICAÇÃO)
// ==========================================

function darAjuda() {
    if (!jogoAtivo) return;
    somClique.play();
    ajudasUsadas++;
    
    // Encontrar 3 itens errados que ainda estejam visíveis
    let eliminados = 0;
    const cards = document.querySelectorAll('.opcao-card');
    
    cards.forEach(card => {
        const id = parseInt(card.id.replace('card-', ''));
        if (id !== itemDestaque.id && card.style.opacity !== "0.2" && eliminados < 3) {
            card.style.opacity = "0.2";
            card.style.pointerEvents = "none";
            eliminados++;
        }
    });
    
    // Desativar a lâmpada nesta ronda para não abusar
    const lampada = document.querySelector('.lamp-icon');
    if(lampada) {
        lampada.style.filter = "grayscale(100%)";
        lampada.onclick = null;
    }
}

function verificarResposta(idEscolhido, elemento) {
    if (!jogoAtivo) return;
    
    const cards = document.querySelectorAll('.opcao-card');
    cards.forEach(c => c.style.pointerEvents = 'none');

    if (idEscolhido === itemDestaque.id) {
        certos++;
        somAcerto.play();
        elemento.style.borderColor = "#8cc63f";
        elemento.style.backgroundColor = "#f0fff0";
        elemento.innerHTML += '<i class="fas fa-check" style="position:absolute; color:#8cc63f; font-size:1.5rem; bottom:5px; right:5px;"></i>';
    } else {
        erros++;
        somErro.play();
        elemento.style.borderColor = "#ff5a5f";
        elemento.style.backgroundColor = "#fff5f5";
        
        // Mostrar a correta
        cards.forEach(c => {
            if (c.id === `card-${itemDestaque.id}`) {
                c.style.borderColor = "#8cc63f";
                c.style.borderWidth = "4px";
                c.style.transform = "scale(1.05)";
            }
        });
    }

    setTimeout(() => {
        rondaAtual++;
        proximaRonda();
    }, 1500);
}

// ==========================================
// 5. RESULTADOS (COMPACTO)
// ==========================================

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">RESULTADOS</h2>`;
    
    // Layout compacto para a taça e botões caberem
    document.getElementById('game-content').innerHTML = `
        <div class="results-container" style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content:center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu + rel.img}" style="height:22vh; margin-bottom:10px;">
            <h2 style="color:var(--primary-color); font-size:1.4rem; margin-bottom:5px;">${rel.titulo}</h2>
            
            <div style="display:flex; gap:15px; margin-bottom:15px;">
                <div class="score-box score-certo" style="font-size:1rem; padding:5px 12px;">${certos} ACERTOS</div>
                <div class="score-box score-erro" style="font-size:1rem; padding:5px 12px;">${erros} ERROS</div>
            </div>
            
            <p style="font-size:0.9rem; color:var(--text-grey); font-weight:bold;">Ajudas utilizadas: ${ajudasUsadas}</p>
        </div>
    `;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = 'flex';
    footer.style.padding = "10px 20px"; // Footer mais fino
    footer.innerHTML = `
        <button class="btn-play-rect" style="background:#6c757d; height:50px; font-size:1.1rem;" onclick="location.reload()">REPETIR</button>
        <button class="btn-play-rect" style="height:50px; font-size:1.1rem;" onclick="window.history.back()">OUTROS JOGOS</button>
    `;
}

function onResizeGame(viewport) {
    if (!jogoAtivo) mostrarCapa();
}
