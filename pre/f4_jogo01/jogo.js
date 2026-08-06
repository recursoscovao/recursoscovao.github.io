// ==========================================
// 1. ESTADO GLOBAL E CONFIGURAÇÃO
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = DADOS_JOGO.itens.length, certos = 0, erros = 0, ajudasUsadas = 0;
let itemSelecionado = null;
let corAtual = JOGO_CONFIG.coresMagicas[0].cor;
let desenhando = false;
let canvas, ctx, ctxAnalise;
let pixelsTotaisDaLetra = 0;
let simuInterval;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.acerto);
const somClique = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CSS INJETADO (ESTILO STATUS + TRACING)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .status-pill { background: #6c757d; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 1.1rem; }
    
    .game-stage {
        position: relative; width: 100%; max-width: 400px; margin: 0 auto;
        display: flex; flex-direction: column; align-items: center;
        min-height: 400px; padding: 10px; box-sizing: border-box;
    }

    .tracing-wrapper {
        position: relative; width: 280px; height: 350px;
        background: white; border-radius: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        overflow: hidden; touch-action: none;
    }

    /* As setas e números vêm nesta imagem de template */
    .img-template {
        position: absolute; top:0; left:0; width:100%; height:100%;
        z-index: 5; pointer-events: none; padding: 20px; box-sizing: border-box;
        object-fit: contain; opacity: 1; /* Garante que as setas apareçam bem */
    }

    #canvas-letra { position: absolute; top:0; left:0; z-index: 10; cursor: crosshair; }

    /* Efeito Mágico de Preenchimento */
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
    .btn-cor { width: 38px; height: 38px; border-radius: 50%; border: 3px solid white; cursor: pointer; transition: 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .btn-cor.ativa { transform: scale(1.2); border-color: #444; }

    #simu-hand { 
        position: absolute; font-size: 3rem; z-index: 100; 
        pointer-events: none; transition: all 0.8s ease; 
    }

    .btn-play-rect { width: 100%; height: 60px; border-radius: 30px; background: var(--primary-color); color: white; border: none; font-size: 1.3rem; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; }
    .btn-audio-circle { width: 60px; height: 60px; cursor: pointer; }
`;
document.head.appendChild(style);

// ==========================================
// 3. CAPA COM SIMULAÇÃO DE CONTORNO
// ==========================================
function mostrarCapa() {
    if (jogoAtivo) return;
    const itemSimu = DADOS_JOGO.itens[0];
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div id="simu-hand" style="display:none;">👆</div>
        <div class="game-stage">
            <div class="tracing-wrapper">
                <img src="${DADOS_JOGO.caminhoRecursos + itemSimu.img}" class="img-template">
            </div>
            <p style="text-align:center; color:var(--text-grey); font-weight:800; margin-top:15px;">Contorna as letras seguindo as setas!</p>
        </div>`;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="tocarAudioInstrucoes()">
        <button class="btn-play-rect" onclick="iniciarJogo()">JOGAR</button>`;
    correrSimulacao();
}

function correrSimulacao() {
    clearInterval(simuInterval);
    const hand = document.getElementById('simu-hand');
    const animar = () => {
        hand.style.display = "block";
        hand.style.opacity = "0";
        hand.style.top = "150px"; hand.style.left = "40%";
        
        setTimeout(() => {
            hand.style.opacity = "1";
            // Simular o movimento do "A" (Sobe e desce)
            setTimeout(() => { hand.style.top = "60px"; hand.style.left = "50%"; }, 500);
            setTimeout(() => { hand.style.top = "200px"; hand.style.left = "65%"; }, 1200);
            setTimeout(() => { hand.style.opacity = "0"; }, 1800);
        }, 200);
    };
    animar(); simuInterval = setInterval(animar, 3000);
}

// ==========================================
// 4. LÓGICA DO JOGO (PIXEL TRACKING)
// ==========================================
function iniciarJogo() {
    clearInterval(simuInterval);
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0;
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    itemSelecionado = DADOS_JOGO.itens[rondaAtual - 1];
    
    // Barra de Status usando a Engine
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);

    document.getElementById('game-content').innerHTML = `
        <div class="game-area-tracing">
            <div class="game-stage">
                <div class="tracing-wrapper" id="box-letra">
                    <!-- A imagem com setas fica aqui no fundo -->
                    <img src="${DADOS_JOGO.caminhoRecursos + itemSelecionado.img}" class="img-template">
                    <div id="magia-camada"></div>
                    <canvas id="canvas-letra" width="280" height="350"></canvas>
                </div>

                <div class="paleta">
                    ${JOGO_CONFIG.coresMagicas.map(c => `
                        <div class="btn-cor" style="background:${c.cor}" onclick="selecionarCor('${c.cor}', this)"></div>
                    `).join('')}
                </div>
            </div>
        </div>`;

    inicializarCanvasEAnalise();
}

function inicializarCanvasEAnalise() {
    canvas = document.getElementById('canvas-letra');
    ctx = canvas.getContext('2d');
    
    // Canvas oculto para contar pixels da letra
    const canvasOculto = document.createElement('canvas');
    canvasOculto.width = 280; canvasOculto.height = 350;
    ctxAnalise = canvasOculto.getContext('2d', { willReadFrequently: true });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        ctxAnalise.drawImage(img, 20, 20, 240, 310);
        const dados = ctxAnalise.getImageData(0, 0, 280, 350).data;
        pixelsTotaisDaLetra = 0;
        for (let i = 3; i < dados.length; i += 4) { if (dados[i] > 20) pixelsTotaisDaLetra++; }
        ctxAnalise.clearRect(0, 0, 280, 350);
    };
    img.src = DADOS_JOGO.caminhoRecursos + itemSelecionado.img;

    configurarDesenho();
    selecionarCor(corAtual, document.querySelector('.btn-cor'));
}

function configurarDesenho() {
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x: cx, y: cy };
    };

    const riscar = (e) => {
        if (!desenhando) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y); ctx.stroke();
        
        ctxAnalise.lineWidth = 25; ctxAnalise.lineCap = 'round';
        ctxAnalise.lineTo(pos.x, pos.y); ctxAnalise.stroke();
        
        verificarProgresso();
    };

    canvas.addEventListener('mousedown', (e) => { desenhando = true; ctx.beginPath(); ctxAnalise.beginPath(); });
    canvas.addEventListener('mousemove', riscar);
    window.addEventListener('mouseup', () => desenhando = false);
    canvas.addEventListener('touchstart', (e) => { desenhando = true; ctx.beginPath(); ctxAnalise.beginPath(); }, {passive:false});
    canvas.addEventListener('touchmove', riscar, {passive:false});
}

function verificarProgresso() {
    const dados = ctxAnalise.getImageData(0, 0, 280, 350).data;
    let pintados = 0;
    for (let i = 3; i < dados.length; i += 4) { if (dados[i] > 20) pintados++; }

    // Se preencher 75% da letra, completa automático
    if ((pintados / pixelsTotaisDaLetra) * 100 > 75) {
        concluirMagia();
    }
}

function concluirMagia() {
    if (!jogoAtivo) return;
    jogoAtivo = false; // Bloqueia desenho
    certos++;
    somAcerto.play();
    
    const magia = document.getElementById('magia-camada');
    const url = `url(${DADOS_JOGO.caminhoRecursos + itemSelecionado.img})`;
    magia.style.webkitMaskImage = url;
    magia.style.maskImage = url;
    magia.style.backgroundColor = corAtual;
    magia.classList.add('ativa');

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setTimeout(() => {
            jogoAtivo = true;
            rondaAtual++;
            proximaRonda();
        }, 1000);
    }, 500);
}

function selecionarCor(cor, el) {
    corAtual = cor;
    if (ctx) {
        ctx.strokeStyle = cor; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    }
    if (ctxAnalise) ctxAnalise.strokeStyle = "black";
    document.querySelectorAll('.btn-cor').forEach(b => b.classList.remove('ativa'));
    if (el) el.classList.add('ativa');
    somClique.play();
}

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, 0, rel);
}

function tocarAudioInstrucoes() {
    new Audio(DADOS_JOGO.caminhoRecursos + DADOS_JOGO.somInstrucoes).play();
}

// Iniciar
mostrarCapa();
