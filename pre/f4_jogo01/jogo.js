// ==========================================
// 1. ESTADO GLOBAL E CONFIGURAÇÃO
// ==========================================
let jogoAtivo = false;
let itemSelecionado = null;
let corAtual = JOGO_CONFIG.coresMagicas[0].cor;
let modoBrilhante = false;
let desenhando = false;
let canvas, ctx, ctxAnalise;
let pixelsTotaisDaLetra = 0;
let simuInterval;
let letrasConcluidas = 0;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.acerto);
const somClique = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CSS RIGOROSO (LAYOUT + SCROLL + BRILHO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .status-pill { background: #6c757d; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 1.1rem; }

    /* MENU COM SCROLL */
    .menu-scroll-container {
        width: 100%; max-height: 320px; overflow-y: auto; 
        padding: 10px; box-sizing: border-box;
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;
    }
    .card-letra {
        aspect-ratio: 1/1; background: white; border: 3px solid #eee; border-radius: 15px;
        display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
    }
    .card-letra:hover { border-color: var(--primary-color); transform: scale(1.05); }
    .card-letra img { max-width: 70%; max-height: 70%; object-fit: contain; }

    /* ÁREA DE JOGO */
    .game-stage {
        position: relative; width: 100%; max-width: 400px; margin: 0 auto;
        display: flex; flex-direction: column; align-items: center; min-height: 420px;
    }
    .tracing-wrapper {
        position: relative; width: 280px; height: 350px;
        background: white; border-radius: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        overflow: hidden; touch-action: none;
    }
    /* A imagem com as setas e números fica aqui sempre visível */
    .img-template {
        position: absolute; top:0; left:0; width:100%; height:100%;
        z-index: 5; pointer-events: none; padding: 25px; box-sizing: border-box;
        object-fit: contain; opacity: 1;
    }
    #canvas-letra { position: absolute; top:0; left:0; z-index: 10; cursor: crosshair; }

    /* CAMADA MÁGICA DE PREENCHIMENTO */
    #magia-camada {
        position: absolute; top:0; left:0; width:100%; height:100%;
        z-index: 7; pointer-events: none; opacity: 0;
        transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        -webkit-mask-size: contain; mask-size: contain;
        -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
        -webkit-mask-position: center; mask-position: center;
    }
    #magia-camada.ativa { opacity: 1; transform: scale(1.05); }

    /* EFEITO BRILHANTES (GLITTER) */
    .efeito-glitter {
        background: linear-gradient(45deg, #ff00ff, #ffeb3b, #00ffff, #ff00ff);
        background-size: 400% 400%;
        animation: gradientAnim 3s ease infinite;
        position: relative;
    }
    .efeito-glitter::after {
        content: ''; position: absolute; top:0; left:0; width:100%; height:100%;
        background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
        opacity: 0.5;
    }
    @keyframes gradientAnim { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

    .paleta { display: flex; gap: 8px; margin: 15px 0; justify-content: center; flex-wrap: wrap; }
    .btn-cor { width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .btn-cor.ativa { transform: scale(1.2); border-color: #333; }
    .btn-brilho { background: linear-gradient(45deg, gold, white, gold); font-size: 1.2rem; display: flex; align-items: center; justify-content: center; }

    #simu-hand { position: absolute; font-size: 3.5rem; z-index: 100; pointer-events: none; transition: all 0.8s ease; }
    .btn-play-rect { width: 100%; height: 65px; border-radius: 35px; background: var(--primary-color); color: white; border: none; font-size: 1.5rem; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; }
`;
document.head.appendChild(style);

// ==========================================
// 3. CAPA E SIMULAÇÃO
// ==========================================
function mostrarCapa() {
    clearInterval(simuInterval);
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div id="simu-hand" style="display:none;">👆</div>
        <div class="game-stage">
            <div class="tracing-wrapper">
                <img src="${DADOS_JOGO.caminhoRecursos + DADOS_JOGO.itens[0].img}" class="img-template">
            </div>
            <p style="text-align:center; color:var(--text-grey); font-weight:800; margin-top:15px;">Segue as setas para aprender!</p>
        </div>`;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" style="width:65px; cursor:pointer;" onclick="tocarAudioInstrucoes()">
        <button class="btn-play-rect" onclick="mostrarMenuLetras()">JOGAR</button>`;
    correrSimulacao();
}

function correrSimulacao() {
    const hand = document.getElementById('simu-hand');
    const animar = () => {
        hand.style.display = "block"; hand.style.opacity = "0";
        hand.style.top = "180px"; hand.style.left = "40%";
        setTimeout(() => {
            hand.style.opacity = "1";
            setTimeout(() => { hand.style.top = "80px"; hand.style.left = "50%"; }, 600); // Sobe (traço 1)
            setTimeout(() => { hand.style.top = "200px"; hand.style.left = "65%"; }, 1400); // Curva (traço 2)
            setTimeout(() => { hand.style.opacity = "0"; }, 2000);
        }, 300);
    };
    animar(); simuInterval = setInterval(animar, 4000);
}

// ==========================================
// 4. MENU DE SELEÇÃO COM SCROLL
// ==========================================
function mostrarMenuLetras() {
    clearInterval(simuInterval);
    document.getElementById('shell-footer-content').style.display = "none";
    document.getElementById('game-content').innerHTML = `
        <div class="game-stage">
            <h3 style="color:#555; margin-bottom:10px;">Escolhe uma letra:</h3>
            <div class="menu-scroll-container">
                ${DADOS_JOGO.itens.map(it => `
                    <div class="card-letra" onclick="iniciarJogo('${it.id}')">
                        <img src="${DADOS_JOGO.caminhoRecursos + it.img}">
                    </div>
                `).join('')}
            </div>
            <button class="btn-play-rect" style="background:#6c757d; margin-top:15px; height:50px; font-size:1rem;" onclick="mostrarCapa()">VOLTAR</button>
        </div>`;
}

// ==========================================
// 5. LÓGICA DE TRACING E MAGIA
// ==========================================
function iniciarJogo(id) {
    itemSelecionado = DADOS_JOGO.itens.find(i => i.id === id);
    jogoAtivo = true;
    Engine.showStatusBar(letrasConcluidas + 1, DADOS_JOGO.itens.length, letrasConcluidas, 0);

    document.getElementById('game-content').innerHTML = `
        <div class="game-stage">
            <div class="tracing-wrapper">
                <img src="${DADOS_JOGO.caminhoRecursos + itemSelecionado.img}" class="img-template">
                <div id="magia-camada"></div>
                <canvas id="canvas-letra" width="280" height="350"></canvas>
            </div>
            <div class="paleta">
                ${JOGO_CONFIG.coresMagicas.map(c => `<div class="btn-cor" style="background:${c.cor}" onclick="selecionarCor('${c.cor}', this, false)"></div>`).join('')}
                <div class="btn-cor btn-brilho" onclick="selecionarCor('', this, true)">✨</div>
            </div>
            <button class="btn-play-rect" style="background:#6c757d; height:45px; width:140px; font-size:0.9rem;" onclick="mostrarMenuLetras()">SAIR</button>
        </div>`;

    prepararCanvas();
}

function prepararCanvas() {
    canvas = document.getElementById('canvas-letra');
    ctx = canvas.getContext('2d');
    
    // Canvas oculto para detectar preenchimento
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 280; offCanvas.height = 350;
    ctxAnalise = offCanvas.getContext('2d', { willReadFrequently: true });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        ctxAnalise.drawImage(img, 20, 20, 240, 310);
        const data = ctxAnalise.getImageData(0, 0, 280, 350).data;
        pixelsTotaisDaLetra = 0;
        for (let i = 3; i < data.length; i += 4) { if (data[i] > 40) pixelsTotaisDaLetra++; }
        ctxAnalise.clearRect(0, 0, 280, 350);
    };
    img.src = DADOS_JOGO.caminhoRecursos + itemSelecionado.img;

    configurarDesenho();
    selecionarCor(corAtual, document.querySelector('.btn-cor'), false);
}

function configurarDesenho() {
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x: cx, y: cy };
    };

    const riscar = (e) => {
        if (!desenhando || !jogoAtivo) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y); ctx.stroke();
        
        ctxAnalise.lineWidth = 30; ctxAnalise.lineCap = 'round';
        ctxAnalise.lineTo(pos.x, pos.y); ctxAnalise.stroke();
        
        // Verificação automática de conclusão
        const data = ctxAnalise.getImageData(0, 0, 280, 350).data;
        let pintados = 0;
        for (let i = 3; i < data.length; i += 4) { if (data[i] > 40) pintados++; }
        if ((pintados / pixelsTotaisDaLetra) * 100 > 80) concluirLetra();
    };

    canvas.onmousedown = (e) => { desenhando = true; ctx.beginPath(); ctxAnalise.beginPath(); };
    canvas.onmousemove = riscar;
    window.onmouseup = () => desenhando = false;
    canvas.ontouchstart = (e) => { desenhando = true; ctx.beginPath(); ctxAnalise.beginPath(); };
    canvas.ontouchmove = riscar;
}

function concluirLetra() {
    if (!jogoAtivo) return;
    jogoAtivo = false;
    letrasConcluidas++;
    somAcerto.play();
    
    const magia = document.getElementById('magia-camada');
    const url = `url(${DADOS_JOGO.caminhoRecursos + itemSelecionado.img})`;
    magia.style.webkitMaskImage = url; magia.style.maskImage = url;

    if (modoBrilhante) {
        magia.className = "efeito-glitter ativa";
        magia.style.backgroundColor = "transparent";
    } else {
        magia.className = "ativa";
        magia.style.backgroundColor = corAtual;
    }

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setTimeout(() => {
            if (letrasConcluidas >= DADOS_JOGO.itens.length) {
                Engine.showResults(letrasConcluidas, 0, 0, JOGO_CONFIG.relatorios[0]);
            } else {
                mostrarMenuLetras();
            }
        }, 1200);
    }, 600);
}

function selecionarCor(cor, el, brilhante) {
    corAtual = cor; modoBrilhante = brilhante;
    if (ctx) {
        ctx.strokeStyle = modoBrilhante ? "gold" : cor;
        ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    }
    if (ctxAnalise) ctxAnalise.strokeStyle = "black";
    document.querySelectorAll('.btn-cor').forEach(b => b.classList.remove('ativa'));
    el.classList.add('ativa');
    somClique.play();
}

function tocarAudioInstrucoes() {
    new Audio(DADOS_JOGO.caminhoRecursos + DADOS_JOGO.somInstrucoes).play();
}

mostrarCapa();
