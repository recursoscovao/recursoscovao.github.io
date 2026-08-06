// ==========================================
// 1. ESTADO GLOBAL E CONFIGURAÇÃO
// ==========================================
let jogoAtivo = false;
let itemSelecionado = null;
let corAtual = JOGO_CONFIG.coresMagicas[0].cor;
let desenhando = false;
let canvas, ctx, ctxAnalise;
let pixelsTotaisDaLetra = 0;
let simuInterval;
let letrasConcluidas = 0;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.acerto);
const somClique = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CSS INJETADO (ESTILO STATUS + MENU + TRACING)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .status-pill { background: #6c757d; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 900; }

    /* MENU DE SELEÇÃO */
    .menu-grid {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 15px; width: 100%; max-width: 450px; padding: 10px;
    }
    .card-selecao {
        background: white; border: 3px solid #eee; border-radius: 15px;
        height: 90px; display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .card-selecao:hover { transform: scale(1.1); border-color: var(--primary-color); }
    .card-selecao img { max-width: 70%; max-height: 70%; object-fit: contain; }

    /* ÁREA DE DESENHO */
    .game-stage {
        position: relative; width: 100%; display: flex; flex-direction: column; align-items: center;
    }
    .tracing-wrapper {
        position: relative; width: 280px; height: 350px;
        background: white; border-radius: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        overflow: hidden; touch-action: none;
    }
    .img-template {
        position: absolute; top:0; left:0; width:100%; height:100%;
        z-index: 5; pointer-events: none; padding: 25px; box-sizing: border-box;
        object-fit: contain; opacity: 1; /* Setas visíveis */
    }
    #canvas-letra { position: absolute; top:0; left:0; z-index: 10; cursor: crosshair; }

    /* Animação Mágica */
    #magia-camada {
        position: absolute; top:0; left:0; width:100%; height:100%;
        z-index: 7; pointer-events: none; opacity: 0;
        transition: opacity 0.6s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        -webkit-mask-size: contain; mask-size: contain;
        -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
        -webkit-mask-position: center; mask-position: center;
    }
    #magia-camada.ativa { opacity: 1; transform: scale(1.08); }

    .paleta { display: flex; gap: 8px; margin-top: 15px; flex-wrap: wrap; justify-content: center; }
    .btn-cor { width: 38px; height: 38px; border-radius: 50%; border: 3px solid white; cursor: pointer; transition: 0.2s; }
    .btn-cor.ativa { transform: scale(1.2); border-color: #444; }

    #simu-hand { position: absolute; font-size: 3rem; z-index: 100; pointer-events: none; transition: all 0.8s; }
    .btn-play-rect { width: 100%; height: 60px; border-radius: 30px; background: var(--primary-color); color: white; border: none; font-size: 1.3rem; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .btn-audio-circle { width: 60px; height: 60px; cursor: pointer; }
`;
document.head.appendChild(style);

// ==========================================
// 3. CAPA E MENU DE SELEÇÃO
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
            <p style="text-align:center; color:var(--text-grey); font-weight:800; margin-top:15px;">Aprende a escrever as letras!</p>
        </div>`;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="tocarAudioInstrucoes()">
        <button class="btn-play-rect" onclick="mostrarMenuLetras()">JOGAR</button>`;
    correrSimulacao();
}

function correrSimulacao() {
    const hand = document.getElementById('simu-hand');
    const animar = () => {
        hand.style.display = "block"; hand.style.opacity = "0";
        hand.style.top = "160px"; hand.style.left = "40%";
        setTimeout(() => {
            hand.style.opacity = "1";
            setTimeout(() => { hand.style.top = "70px"; hand.style.left = "50%"; }, 500);
            setTimeout(() => { hand.style.top = "200px"; hand.style.left = "60%"; }, 1200);
        }, 200);
    };
    animar(); simuInterval = setInterval(animar, 3000);
}

function mostrarMenuLetras() {
    clearInterval(simuInterval);
    document.getElementById('shell-footer-content').style.display = "none";
    document.getElementById('game-content').innerHTML = `
        <div class="game-stage">
            <h3 style="color:#555;">Escolhe uma letra:</h3>
            <div class="menu-grid">
                ${DADOS_JOGO.itens.map(it => `
                    <div class="card-selecao" onclick="iniciarTracing('${it.id}')">
                        <img src="${DADOS_JOGO.caminhoRecursos + it.img}">
                    </div>
                `).join('')}
            </div>
        </div>`;
}

// ==========================================
// 4. LÓGICA DO JOGO (TRACING AUTOMÁTICO)
// ==========================================
function iniciarTracing(id) {
    itemSelecionado = DADOS_JOGO.itens.find(i => i.id === id);
    jogoAtivo = true;
    
    // Atualiza barra de status (letras concluídas / total)
    Engine.showStatusBar(letrasConcluidas + 1, DADOS_JOGO.itens.length, letrasConcluidas, 0);

    document.getElementById('game-content').innerHTML = `
        <div class="game-stage">
            <div class="tracing-wrapper">
                <img src="${DADOS_JOGO.caminhoRecursos + itemSelecionado.img}" class="img-template">
                <div id="magia-camada"></div>
                <canvas id="canvas-letra" width="280" height="350"></canvas>
            </div>
            <div class="paleta">
                ${JOGO_CONFIG.coresMagicas.map(c => `<div class="btn-cor" style="background:${c.cor}" onclick="selecionarCor('${c.cor}', this)"></div>`).join('')}
            </div>
            <button class="btn-play-rect" style="margin-top:15px; background:#6c757d; height:45px; font-size:1rem;" onclick="mostrarMenuLetras()">VOLTAR</button>
        </div>`;

    prepararAnalise();
}

function prepararAnalise() {
    canvas = document.getElementById('canvas-letra');
    ctx = canvas.getContext('2d');
    
    const canvasOculto = document.createElement('canvas');
    canvasOculto.width = 280; canvasOculto.height = 350;
    ctxAnalise = canvasOculto.getContext('2d', { willReadFrequently: true });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        ctxAnalise.drawImage(img, 25, 25, 230, 300);
        const dados = ctxAnalise.getImageData(0, 0, 280, 350).data;
        pixelsTotaisDaLetra = 0;
        for (let i = 3; i < dados.length; i += 4) { if (dados[i] > 30) pixelsTotaisDaLetra++; }
        ctxAnalise.clearRect(0, 0, 280, 350);
    };
    img.src = DADOS_JOGO.caminhoRecursos + itemSelecionado.img;

    configurarPincel();
    selecionarCor(corAtual, document.querySelector('.btn-cor'));
}

function configurarPincel() {
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
        
        ctxAnalise.lineWidth = 26; ctxAnalise.lineCap = 'round';
        ctxAnalise.lineTo(pos.x, pos.y); ctxAnalise.stroke();
        
        // Verifica se completou a letra
        const dados = ctxAnalise.getImageData(0, 0, 280, 350).data;
        let pintados = 0;
        for (let i = 3; i < dados.length; i += 4) { if (dados[i] > 30) pintados++; }
        
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
    
    // Animação Mágica
    const magia = document.getElementById('magia-camada');
    const url = `url(${DADOS_JOGO.caminhoRecursos + itemSelecionado.img})`;
    magia.style.webkitMaskImage = url;
    magia.style.maskImage = url;
    magia.style.backgroundColor = corAtual;
    magia.classList.add('ativa');

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setTimeout(() => {
            if (letrasConcluidas >= DADOS_JOGO.itens.length) {
                const rel = JOGO_CONFIG.relatorios[0];
                Engine.showResults(letrasConcluidas, 0, 0, rel);
            } else {
                mostrarMenuLetras();
            }
        }, 1200);
    }, 500);
}

function selecionarCor(cor, el) {
    corAtual = cor;
    if (ctx) {
        ctx.strokeStyle = cor; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    }
    if (ctxAnalise) ctxAnalise.strokeStyle = "black";
    document.querySelectorAll('.btn-cor').forEach(b => b.classList.remove('ativa'));
    if (el) el.classList.add('ativa');
    somClique.play().catch(() => {});
}

function tocarAudioInstrucoes() {
    new Audio(DADOS_JOGO.caminhoRecursos + DADOS_JOGO.somInstrucoes).play();
}

mostrarCapa();
