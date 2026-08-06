// ==========================================
// 1. CONFIGURAÇÃO E ESTADO GLOBAL
// ==========================================
let jogoAtivo = false;
let itemSelecionado = null;
let corAtual = JOGO_CONFIG.coresMagicas[0].cor;
let modoBrilhante = false;
let desenhando = false;
let canvas, ctx, ctxAnalise;
let pixelsTotaisDaLetra = 0;
let letrasConcluidas = 0;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.acerto);
const somClique = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CSS INJETADO (ESTILOS E ANIMAÇÃO DE BRILHO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .game-area { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; }
    
    /* MENU DE SELEÇÃO AJUSTADO */
    .menu-grid {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
        gap: 15px; width: 100%; max-width: 450px; padding: 20px;
    }
    .card-letra {
        aspect-ratio: 1/1; background: white; border: 4px solid #f0f0f0; border-radius: 20px;
        display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    .card-letra:hover { transform: scale(1.1); border-color: var(--primary-color); }
    .card-letra img { max-width: 75%; max-height: 75%; object-fit: contain; }

    /* ÁREA DE TRACING */
    .tracing-wrapper {
        position: relative; width: 300px; height: 380px;
        background: white; border-radius: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        overflow: hidden; touch-action: none;
    }
    .img-template {
        position: absolute; top:0; left:0; width:100%; height:100%;
        z-index: 5; pointer-events: none; padding: 25px; box-sizing: border-box;
        object-fit: contain; opacity: 1; /* Garante que as setas 1 e 2 do D apareçam */
    }
    #canvas-letra { position: absolute; top:0; left:0; z-index: 10; cursor: crosshair; }

    /* EFEITO MÁGICO DE PREENCHIMENTO */
    #magia-camada {
        position: absolute; top:0; left:0; width:100%; height:100%;
        z-index: 7; pointer-events: none; opacity: 0;
        transition: opacity 0.6s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        -webkit-mask-size: contain; mask-size: contain;
        -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
        -webkit-mask-position: center; mask-position: center;
    }
    #magia-camada.ativa { opacity: 1; transform: scale(1.05); }

    /* ANIMAÇÃO DE BRILHANTES (GLITTER) */
    .efeito-glitter {
        background-image: url('https://www.transparenttextures.com/patterns/stardust.png'), 
                          linear-gradient(45deg, #ff00ff, #00ffff, #ffff00);
        background-size: 200px 200px, 400% 400%;
        animation: glitterMove 2s infinite linear, rainbow 5s infinite linear;
    }

    @keyframes glitterMove { 0% { background-position: 0 0; } 100% { background-position: 200px 200px; } }
    @keyframes rainbow { 0% { background-color: #ff00ff; } 33% { background-color: #00ffff; } 66% { background-color: #ffff00; } 100% { background-color: #ff00ff; } }

    .btn-brilhante { 
        background: linear-gradient(45deg, #f09, #3cf, #f09); 
        background-size: 200%; animation: rainbow 2s infinite;
        border: 4px solid gold !important;
    }
`;
document.head.appendChild(style);

// ==========================================
// 3. FLUXO DO JOGO
// ==========================================
function mostrarCapa() {
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div class="game-area">
            <div class="tracing-wrapper">
                <img src="${DADOS_JOGO.caminhoRecursos + DADOS_JOGO.itens[0].img}" class="img-template">
            </div>
            <p style="text-align:center; color:#777; font-weight:800; margin-top:20px;">Contorna a letra e vê a magia!</p>
        </div>`;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `<button class="btn-play-rect" style="width:100%" onclick="mostrarMenu()">JOGAR</button>`;
}

function mostrarMenu() {
    document.getElementById('shell-footer-content').style.display = "none";
    document.getElementById('game-content').innerHTML = `
        <div class="menu-container">
            <h3 style="text-align:center; color:#555;">Escolhe uma Letra:</h3>
            <div class="menu-grid">
                ${DADOS_JOGO.itens.map(it => `
                    <div class="card-letra" onclick="iniciarTracing('${it.id}')">
                        <img src="${DADOS_JOGO.caminhoRecursos + it.img}">
                    </div>
                `).join('')}
            </div>
        </div>`;
}

function iniciarTracing(id) {
    itemSelecionado = DADOS_JOGO.itens.find(i => i.id === id);
    jogoAtivo = true;
    Engine.showStatusBar(letrasConcluidas + 1, DADOS_JOGO.itens.length, letrasConcluidas, 0);

    document.getElementById('game-content').innerHTML = `
        <div class="game-area">
            <div class="tracing-wrapper">
                <img src="${DADOS_JOGO.caminhoRecursos + itemSelecionado.img}" class="img-template">
                <div id="magia-camada"></div>
                <canvas id="canvas-letra" width="300" height="380"></canvas>
            </div>
            <div class="paleta">
                ${JOGO_CONFIG.coresMagicas.map(c => `<div class="btn-cor" style="background:${c.cor}" onclick="selecionarCor('${c.cor}', this, false)"></div>`).join('')}
                <div class="btn-cor btn-brilhante" onclick="selecionarCor('', this, true)" title="Modo Brilhante!">✨</div>
            </div>
            <button class="btn-play-rect" style="background:#6c757d; height:40px; width:120px; font-size:0.9rem;" onclick="mostrarMenu()">VOLTAR</button>
        </div>`;

    prepararCanvas();
}

function prepararCanvas() {
    canvas = document.getElementById('canvas-letra');
    ctx = canvas.getContext('2d');
    
    // Canvas Oculto para analisar os pixels da letra
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 300; offCanvas.height = 380;
    ctxAnalise = offCanvas.getContext('2d', { willReadFrequently: true });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        ctxAnalise.drawImage(img, 25, 25, 250, 330);
        const data = ctxAnalise.getImageData(0, 0, 300, 380).data;
        pixelsTotaisDaLetra = 0;
        for (let i = 3; i < data.length; i += 4) { if (data[i] > 30) pixelsTotaisDaLetra++; }
        ctxAnalise.clearRect(0, 0, 300, 380);
    };
    img.src = DADOS_JOGO.caminhoRecursos + itemSelecionado.img;

    configurarDesenho();
    selecionarCor(corAtual, document.querySelector('.btn-cor'), false);
}

function configurarDesenho() {
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const bx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const by = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x: bx, y: by };
    };

    const riscar = (e) => {
        if (!desenhando || !jogoAtivo) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y); ctx.stroke();
        
        ctxAnalise.lineWidth = 28; ctxAnalise.lineCap = 'round';
        ctxAnalise.lineTo(pos.x, pos.y); ctxAnalise.stroke();
        
        // Verifica se a letra foi coberta (80% de precisão)
        const data = ctxAnalise.getImageData(0, 0, 300, 380).data;
        let pintados = 0;
        for (let i = 3; i < data.length; i += 4) { if (data[i] > 30) pintados++; }
        
        if ((pintados / pixelsTotaisDaLetra) * 100 > 80) concluirComMagia();
    };

    canvas.onmousedown = (e) => { desenhando = true; ctx.beginPath(); ctxAnalise.beginPath(); };
    canvas.onmousemove = riscar;
    window.onmouseup = () => desenhando = false;
    canvas.ontouchstart = (e) => { desenhando = true; ctx.beginPath(); ctxAnalise.beginPath(); };
    canvas.ontouchmove = riscar;
}

function concluirComMagia() {
    if (!jogoAtivo) return;
    jogoAtivo = false;
    letrasConcluidas++;
    somAcerto.play();
    
    const magia = document.getElementById('magia-camada');
    const url = `url(${DADOS_JOGO.caminhoRecursos + itemSelecionado.img})`;
    
    magia.style.webkitMaskImage = url;
    magia.style.maskImage = url;
    
    if (modoBrilhante) {
        magia.className = "ativa efeito-glitter";
        magia.style.backgroundColor = "transparent";
    } else {
        magia.className = "ativa";
        magia.style.backgroundColor = corAtual;
    }

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setTimeout(() => {
            if (letrasConcluidas >= DADOS_JOGO.itens.length) finalizarJogo();
            else mostrarMenu();
        }, 1500);
    }, 600);
}

function selecionarCor(cor, el, brilhante) {
    corAtual = cor;
    modoBrilhante = brilhante;
    if (ctx) {
        ctx.strokeStyle = modoBrilhante ? "#FFD700" : cor;
        ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    }
    if (ctxAnalise) ctxAnalise.strokeStyle = "black";
    document.querySelectorAll('.btn-cor').forEach(b => b.classList.remove('ativa'));
    el.classList.add('ativa');
    somClique.play();
}

function finalizarJogo() {
    const rel = JOGO_CONFIG.relatorios[0];
    Engine.showResults(letrasConcluidas, 0, 0, rel);
}

mostrarCapa();
