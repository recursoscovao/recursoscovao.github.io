// ==========================================
// JOGO: ENCONTRAR O PAR (CENTRAMENTO TOTAL)
// ==========================================

let estado = {
    ronda: 1,
    maxRondas: 10,
    pontos: 0,
    itemCorreto: null,
    bloqueado: false
};

// --- 1. MOSTRAR CAPA (CENTRADÍSSIMA) ---
function mostrarCapa() {
    const container = document.getElementById('game-container');
    // Forçamos o contentor a centrar tudo o que houver lá dentro
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.width = "100%";

    container.innerHTML = `
        <div class="game-intro-card">
            <h1>${JOGO_CONFIG.nomeDoJogo}</h1>
            <p>${JOGO_CONFIG.descricao}</p>
            <button class="btn-jogar" onclick="iniciarJogo()">COMEÇAR JOGO</button>
        </div>
    `;
}

// --- 2. INICIAR ---
function iniciarJogo() {
    estado.ronda = 1;
    estado.pontos = 0;
    desenharPalco();
    proximaRonda();
}

function desenharPalco() {
    const container = document.getElementById('game-container');
    // Estilo para o palco principal do jogo
    container.innerHTML = `
        <div id="jogo-display" style="display: flex; flex-direction: column; align-items: center; width: 100%; text-align: center;">
            
            <!-- Modelo em Destaque -->
            <div id="box-modelo" style="margin-bottom: 30px; display: flex; flex-direction: column; align-items: center;">
                <p style="font-weight: 800; color: #5d7082; margin-bottom: 12px;">Encontra o animal igual:</p>
                <div id="modelo-img-container" style="background: white; width: 130px; height: 130px; border-radius: 30px; border: 5px solid var(--primary-color); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 0 rgba(0,0,0,0.05);">
                    <img id="img-alvo" src="" style="width: 90px; height: 90px; object-fit: contain;">
                </div>
            </div>

            <!-- Grelha de Opções (Centrada) -->
            <div id="grelha-opcoes" style="display: grid; grid-template-columns: repeat(2, 130px); gap: 15px; justify-content: center; margin: 0 auto;">
            </div>

            <!-- Contador -->
            <p id="contador-texto" style="margin-top: 30px; font-weight: 900; color: var(--text-grey); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px;"></p>
        </div>
    `;
}

// --- 3. LÓGICA DA RONDA ---
function proximaRonda() {
    if (estado.ronda > estado.maxRondas) {
        mostrarResultado();
        return;
    }

    estado.bloqueado = false;
    document.getElementById('contador-texto').innerText = `Ronda ${estado.ronda} de ${estado.maxRondas}`;

    // Sorteio
    const todosItens = [...DADOS_JOGO.itens];
    const sorteio = todosItens.sort(() => 0.5 - Math.random());
    estado.itemCorreto = sorteio[0];

    // Opções (4 itens misturados)
    let opcoes = sorteio.slice(0, 4).sort(() => 0.5 - Math.random());

    // Atualiza Imagem Alvo
    document.getElementById('img-alvo').src = DADOS_JOGO.caminhoImagens + estado.itemCorreto.img;

    // Desenha Opções
    const grelha = document.getElementById('grelha-opcoes');
    grelha.innerHTML = "";

    opcoes.forEach(item => {
        const div = document.createElement('div');
        // Estilo do Cartão de Opção
        div.style.cssText = `
            background: white; 
            padding: 12px; 
            border-radius: 22px; 
            border: 2px solid #eee; 
            cursor: pointer; 
            box-shadow: 0 4px 0 rgba(0,0,0,0.05); 
            transition: 0.1s; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center;
        `;
        
        div.innerHTML = `
            <img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="width: 75px; height: 75px; object-fit: contain; pointer-events: none;">
            <p style="font-size: 0.75rem; font-weight: 800; color: #8792a1; margin-top: 6px; pointer-events: none;">${item.nome}</p>
        `;

        div.onclick = () => clicarOpcao(item.id, div);
        
        // Efeito de hover/clique visual
        div.onmousedown = () => div.style.transform = "scale(0.95)";
        div.onmouseup = () => div.style.transform = "scale(1)";

        grelha.appendChild(div);
    });
}

// --- 4. VERIFICAÇÃO ---
function clicarOpcao(id, elemento) {
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
        // Piscar o correto para ajudar a criança a aprender
        destacarCorreto();
    }

    setTimeout(() => {
        estado.ronda++;
        proximaRonda();
    }, 1000);
}

function destacarCorreto() {
    const cards = document.getElementById('grelha-opcoes').children;
    // Lógica opcional para mostrar o correto se a criança errar
}

// --- 5. RESULTADOS (TAMBÉM CENTRADOS) ---
function mostrarResultado() {
    const rel = JOGO_CONFIG.relatorios.find(r => estado.pontos >= r.min && estado.pontos <= r.max);
    const container = document.getElementById('game-container');
    
    container.innerHTML = `
        <div class="game-intro-card" style="display: flex; flex-direction: column; align-items: center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}${rel.img}" style="width: 120px; margin-bottom: 20px;">
            <h1 style="color: var(--primary-color); font-size: 2.2rem;">${rel.titulo}</h1>
            <p style="font-size: 1.3rem; font-weight: 800; margin: 15px 0; color: #5d7082;">
                Acertaste ${estado.pontos} de ${estado.maxRondas}!
            </p>
            <button class="btn-jogar" style="margin-top: 15px;" onclick="iniciarJogo()">JOGAR NOVAMENTE</button>
        </div>
    `;
}

// Auxiliar de Som
function tocarAudio(tipo) {
    const som = JOGO_CONFIG.sons[tipo];
    if (som) {
        const audio = new Audio(JOGO_CONFIG.caminhoSons + som);
        audio.play().catch(e => console.log("Áudio aguarda interação"));
    }
}
