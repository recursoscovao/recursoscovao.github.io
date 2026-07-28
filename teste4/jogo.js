// ==========================================
// MOTOR DO JOGO: 10 OPÇÕES E CENTRAMENTO TOTAL
// ==========================================

let estado = {
    ronda: 1,
    maxRondas: 10,
    pontos: 0,
    itemCorreto: null,
    bloqueado: false
};

// --- 1. MOSTRAR CAPA (CENTRADA E TOTAL) ---
function mostrarCapa() {
    const container = document.getElementById('game-container');
    
    // Configuração para ocupar todo o espaço vertical disponível
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.height = "100%"; // Ocupa o flex:1 do main
    container.style.padding = "15px"; 
    container.style.width = "100%";

    container.innerHTML = `
        <div class="game-intro-card" style="margin: auto 0;">
            <h1>${JOGO_CONFIG.nomeDoJogo}</h1>
            <p>${JOGO_CONFIG.descricao}</p>
            <button class="btn-jogar" onclick="iniciarJogo()">COMEÇAR JOGO</button>
        </div>
    `;
}

// --- 2. INICIAR PARTIDA ---
function iniciarJogo() {
    estado.ronda = 1;
    estado.pontos = 0;
    desenharPalco();
    proximaRonda();
}

// --- 3. DESENHAR O PALCO (ESTRUTURA) ---
function desenharPalco() {
    const container = document.getElementById('game-container');
    container.style.justifyContent = "center"; // Garante centro vertical durante o jogo

    container.innerHTML = `
        <div id="jogo-display" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
            
            <!-- Modelo (Alvo) -->
            <div id="box-modelo" style="margin-bottom: 20px; text-align: center;">
                <p style="font-weight: 800; color: #5d7082; margin-bottom: 10px;">Encontra o animal igual:</p>
                <div style="background: white; width: 120px; height: 120px; border-radius: 30px; border: 5px solid var(--primary-color); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 0 rgba(0,0,0,0.05); margin: 0 auto;">
                    <img id="img-alvo" src="" style="width: 85px; height: 85px; object-fit: contain;">
                </div>
            </div>

            <!-- Grelha de 10 Opções -->
            <div id="grelha-opcoes" style="
                display: grid; 
                grid-template-columns: repeat(5, 1fr); 
                gap: 10px; 
                width: 100%; 
                max-width: 600px; 
                justify-items: center;
            ">
            </div>

            <!-- Contador -->
            <p id="contador-texto" style="margin-top: 20px; font-weight: 900; color: var(--text-grey); text-transform: uppercase; font-size: 0.9rem;"></p>
        </div>
    `;

    // Ajuste para ecrãs pequenos (2 colunas em telemóvel para caberem os 10)
    if(window.innerWidth < 600) {
        document.getElementById('grelha-opcoes').style.gridTemplateColumns = "repeat(2, 1fr)";
    }
}

// --- 4. LÓGICA DA RONDA (SORTEIA 10 ANIMAIS) ---
function proximaRonda() {
    if (estado.ronda > estado.maxRondas) {
        mostrarResultado();
        return;
    }

    estado.bloqueado = false;
    document.getElementById('contador-texto').innerText = `Ronda ${estado.ronda} de ${estado.maxRondas}`;

    // 1. Embaralhar todos os animais disponíveis
    const todosItens = [...DADOS_JOGO.itens].sort(() => 0.5 - Math.random());
    
    // 2. O primeiro é o correto
    estado.itemCorreto = todosItens[0];

    // 3. Pegar 10 animais para mostrar (incluindo o correto)
    let opcoesParaMostrar = todosItens.slice(0, 10);
    
    // 4. Baralhar os 10 para o correto não estar sempre na primeira posição
    opcoesParaMostrar.sort(() => 0.5 - Math.random());

    // Atualizar Imagem Alvo
    document.getElementById('img-alvo').src = DADOS_JOGO.caminhoImagens + estado.itemCorreto.img;

    // Desenhar Opções
    const grelha = document.getElementById('grelha-opcoes');
    grelha.innerHTML = "";

    opcoesParaMostrar.forEach(item => {
        const cartao = document.createElement('div');
        cartao.style.cssText = `
            background: white; 
            padding: 8px; 
            border-radius: 18px; 
            border: 2px solid #eee; 
            cursor: pointer; 
            box-shadow: 0 4px 0 rgba(0,0,0,0.05); 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            width: 100%; 
            max-width: 100px;
            transition: transform 0.1s;
        `;
        
        cartao.innerHTML = `
            <img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="width: 55px; height: 55px; object-fit: contain; pointer-events: none;">
            <p style="font-size: 0.65rem; font-weight: 800; color: #8792a1; margin-top: 4px; pointer-events: none;">${item.nome}</p>
        `;

        cartao.onclick = () => verificarResposta(item.id, cartao);
        grelha.appendChild(cartao);
    });
}

// --- 5. VERIFICAÇÃO ---
function verificarResposta(id, elemento) {
    if (estado.bloqueado) return;
    estado.bloqueado = true;

    if (id === estado.itemCorreto.id) {
        estado.pontos++;
        elemento.style.borderColor = "#45cfa8";
        elemento.style.background = "#e8f9f4";
        tocarAudio("acerto");
    } else {
        elemento.style.borderColor = "#ff6b6b";
        elemento.style.background = "#fff5f5";
        tocarAudio("erro");
    }

    setTimeout(() => {
        estado.ronda++;
        proximaRonda();
    }, 1000);
}

// --- 6. RESULTADOS ---
function mostrarResultado() {
    const rel = JOGO_CONFIG.relatorios.find(r => estado.pontos >= r.min && estado.pontos <= r.max);
    const container = document.getElementById('game-container');
    
    container.innerHTML = `
        <div class="game-intro-card" style="margin: auto 0;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}${rel.img}" style="width: 100px; margin-bottom: 20px;">
            <h1 style="color: var(--primary-color);">${rel.titulo}</h1>
            <p style="font-size: 1.2rem; font-weight: 800; margin: 10px 0;">Fizeste ${estado.pontos} pontos em ${estado.maxRondas}!</p>
            <button class="btn-jogar" onclick="iniciarJogo()">REPETIR JOGO</button>
        </div>
    `;
}

// Som
function tocarAudio(tipo) {
    const som = JOGO_CONFIG.sons[tipo];
    if (som) {
        const audio = new Audio(JOGO_CONFIG.caminhoSons + som);
        audio.play().catch(() => {});
    }
}
