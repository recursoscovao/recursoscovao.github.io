// ==========================================
// MOTOR DO JOGO: CENTRAMENTO VERTICAL TOTAL
// ==========================================

let estado = {
    ronda: 1,
    maxRondas: 10,
    pontos: 0,
    itemCorreto: null,
    bloqueado: false
};

// --- 1. MOSTRAR CAPA (CENTRADA ENTRE HEADER E FOOTER) ---
function mostrarCapa() {
    const container = document.getElementById('game-container');
    
    // Configuração do contentor para ocupar todo o espaço e centrar
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "center"; // Centro Vertical
    container.style.alignItems = "center";     // Centro Horizontal
    container.style.padding = "15px";          // Padding solicitado
    container.style.minHeight = "calc(100dvh - 95px - 60px)"; // Altura dinâmica (100vh - header - footer aprox)
    container.style.width = "100%";

    container.innerHTML = `
        <div class="game-intro-card" style="margin: 0 auto;">
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

// --- 3. DESENHAR O PALCO DO JOGO (TAMBÉM CENTRADO) ---
function desenharPalco() {
    const container = document.getElementById('game-container');
    
    // Mantemos o centramento durante o jogo
    container.innerHTML = `
        <div id="jogo-display" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; text-align: center;">
            
            <!-- Modelo em Destaque -->
            <div id="box-modelo" style="margin-bottom: 30px;">
                <p style="font-weight: 800; color: #5d7082; margin-bottom: 12px; font-size: 1.1rem;">Encontra o animal igual:</p>
                <div id="modelo-img-container" style="background: white; width: 140px; height: 140px; border-radius: 35px; border: 5px solid var(--primary-color); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 0 rgba(0,0,0,0.05); margin: 0 auto;">
                    <img id="img-alvo" src="" style="width: 100px; height: 100px; object-fit: contain;">
                </div>
            </div>

            <!-- Grelha de Opções -->
            <div id="grelha-opcoes" style="display: grid; grid-template-columns: repeat(2, 135px); gap: 15px; justify-content: center; margin: 0 auto;">
            </div>

            <!-- Contador -->
            <div id="contador-container" style="margin-top: 30px;">
                <p id="contador-texto" style="font-weight: 900; color: var(--text-grey); font-size: 1rem; text-transform: uppercase; letter-spacing: 1px;"></p>
            </div>
        </div>
    `;
}

// --- 4. LÓGICA DA RONDA ---
function proximaRonda() {
    if (estado.ronda > estado.maxRondas) {
        mostrarResultado();
        return;
    }

    estado.bloqueado = false;
    document.getElementById('contador-texto').innerText = `Ronda ${estado.ronda} de ${estado.maxRondas}`;

    // Sorteio dos itens
    const todosItens = [...DADOS_JOGO.itens];
    const sorteio = todosItens.sort(() => 0.5 - Math.random());
    estado.itemCorreto = sorteio[0];

    // Selecionar 4 opções (incluindo a correta)
    let opcoes = sorteio.slice(0, 4).sort(() => 0.5 - Math.random());

    // Atualizar imagem Alvo
    document.getElementById('img-alvo').src = DADOS_JOGO.caminhoImagens + estado.itemCorreto.img;

    // Desenhar Opções Pequenas
    const grelha = document.getElementById('grelha-opcoes');
    grelha.innerHTML = "";

    opcoes.forEach(item => {
        const div = document.createElement('div');
        div.style.cssText = `
            background: white; 
            padding: 15px; 
            border-radius: 25px; 
            border: 2px solid #eee; 
            cursor: pointer; 
            box-shadow: 0 4px 0 rgba(0,0,0,0.05); 
            transition: transform 0.1s, border-color 0.2s; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center;
        `;
        
        div.innerHTML = `
            <img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="width: 75px; height: 75px; object-fit: contain; pointer-events: none;">
            <p style="font-size: 0.75rem; font-weight: 800; color: #8792a1; margin-top: 8px; pointer-events: none;">${item.nome}</p>
        `;

        div.onclick = () => verificarResposta(item.id, div);
        
        // Feedback de toque
        div.onmousedown = () => div.style.transform = "scale(0.95)";
        div.onmouseup = () => div.style.transform = "scale(1)";

        grelha.appendChild(div);
    });
}

// --- 5. VERIFICAÇÃO ---
function verificarResposta(id, elemento) {
    if (estado.bloqueado) return;
    estado.bloqueado = true;

    if (id === estado.itemCorreto.id) {
        estado.pontos++;
        elemento.style.borderColor = "#45cfa8";
        elemento.style.boxShadow = "0 4px 0 #3db896";
        tocarAudio("acerto");
    } else {
        elemento.style.borderColor = "#ff6b6b";
        elemento.style.boxShadow = "0 4px 0 #e65a5a";
        tocarAudio("erro");
    }

    // Espera 1 segundo e passa à próxima
    setTimeout(() => {
        estado.ronda++;
        proximaRonda();
    }, 1000);
}

// --- 6. RESULTADOS ---
function mostrarResultado() {
    const rel = JOGO_CONFIG.relatorios.find(r => estado.pontos >= r.min && estado.pontos <= r.max);
    const container = document.getElementById('game-container');
    
    // Ecrã final centrado
    container.innerHTML = `
        <div class="game-intro-card" style="display: flex; flex-direction: column; align-items: center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}${rel.img}" style="width: 120px; margin-bottom: 20px;">
            <h1 style="color: var(--primary-color);">${rel.titulo}</h1>
            <p style="font-size: 1.3rem; font-weight: 800; margin: 15px 0;">
                Acertaste ${estado.pontos} de ${estado.maxRondas}!
            </p>
            <button class="btn-jogar" onclick="iniciarJogo()">JOGAR NOVAMENTE</button>
        </div>
    `;
}

// --- AUXILIAR DE SOM ---
function tocarAudio(tipo) {
    const som = JOGO_CONFIG.sons[tipo];
    if (som) {
        const audio = new Audio(JOGO_CONFIG.caminhoSons + som);
        audio.play().catch(() => { /* Evita erro se o user não interagiu */ });
    }
}
