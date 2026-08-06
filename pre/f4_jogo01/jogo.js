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
// 2. CSS RIGOROSO (LAYOUT + MÁSCARA + BRILHO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .game-stage {
        position: relative; width: 100%; max-width: 400px; margin: 0 auto;
        display: flex; flex-direction: column; align-items: center; min-height: 420px;
    }

    /* Contentor do Desenho */
    .tracing-wrapper {
        position: relative; width: 280px; height: 350px;
        background: #fdfdfd; border-radius: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        overflow: hidden; touch-action: none;
    }

    /* Camada 1: Imagem com Setas e Números (Fica no fundo para guiar) */
    .img-guia {
        position: absolute; top:0; left:0; width:100%; height:100%;
        z-index: 5; pointer-events: none; padding: 25px; box-sizing: border-box;
        object-fit: contain; opacity: 0.8;
    }

    /* Camada 2: O Canvas onde a "mágica" acontece */
    #canvas-letra {
        position: absolute; top:0; left:0; z-index: 10; cursor: crosshair;
        /* A MÁSCARA: Faz com que qualquer desenho ocupe apenas o corpo da letra */
        -webkit-mask-size: contain; mask-size: contain;
        -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
        -webkit-mask-position: center; mask-position: center;
    }

    /* EFEITO BRILHANTES (Ajustado para o pincel) */
    .efeito-brilhante-cor {
        filter: drop-shadow(0 0 5px gold);
    }

    .menu-scroll {
        width: 100%; max-height: 300px; overflow-y: auto; padding: 15px;
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
    }
    .card-letra {
        aspect-ratio: 1/1; background: white; border: 3px solid #eee; border-radius: 15px;
        display: flex; align-items: center; justify-content: center; cursor: pointer;
    }

    .paleta { display: flex; gap: 8px; margin: 15px 0; justify-content: center; }
    .btn-cor { width: 42px; height: 42px; border-radius: 50%; border: 3px solid white; cursor: pointer; }
    .btn-cor.ativa { transform: scale(1.2); border-color: #333; }
    .btn-brilho { background: linear-gradient(45deg, gold, pink, cyan); font-size: 1.2rem; display: flex; align-items: center; justify-content: center; }
    
    #simu-hand { position: absolute; font-size: 3.5rem; z-index: 100; pointer-events: none; transition: all 0.7s; }
`;
document.head.appendChild(style);

// ==========================================
// 3. NAVEGAÇÃO E MENU
// ==========================================
function mostrarCapa() {
    clearInterval(simuInterval);
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">CONTORNA AS LETRAS</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div id="simu-hand" style="display:none;">👆</div>
        <div class="game-stage">
            <div class="tracing-wrapper"><img src="${DADOS_JOGO.caminhoRecursos + DADOS_JOGO.itens[0].img}" class="img-guia"></div>
            <p style="text-align:center; font-weight:800; margin-top:15px;">Desenha por cima das setas!</p>
        </div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `<button class="btn-play-rect" style="width:100%" onclick="mostrarMenuLetras()">JOGAR</button>`;
    correrSimulacao();
}

function mostrarMenuLetras() {
    clearInterval(simuInterval);
    document.getElementById('shell-footer-content').style.display = "none";
    document.getElementById('game-content').innerHTML = `
        <div class="game-stage">
            <h3 style="color:#555;">Escolhe uma letra:</h3>
            <div class="menu-scroll">
                ${DADOS_JOGO.itens.map(it => `
                    <div class="card-letra" onclick="iniciarTracing('${it.id}')">
                        <img src="${DADOS_JOGO.caminhoRecursos + it.img}" style="width:70%">
                    </div>
                `).join('')}
            </div>
            <button class="btn-play-rect" style="background:#6c757d; margin-top:15px; height:50px;" onclick="mostrarCapa()">VOLTAR</button>
        </div>`;
}

// ==========================================
// 4. LÓGICA DE PREENCHIMENTO TOTAL
// ==========================================
function iniciarTracing(id) {
    itemSelecionado = DADOS_JOGO.itens.find(i => i.id === id);
    jogoAtivo = true;
    Engine.showStatusBar(letrasConcluidas + 1, DADOS_JOGO.itens.length, letrasConcluidas, 0);

    document.getElementById('game-content').innerHTML = `
        <div class="game-stage">
            <div class="tracing-wrapper">
                <img src="${DADOS_JOGO.caminhoRecursos + itemSelecionado.img}" class="img-guia">
                <canvas id="canvas-letra" width="280" height="350"></canvas>
            </div>
            <div class="paleta">
                ${JOGO_CONFIG.coresMagicas.map(c => `<div class="btn-cor" style="background:${c.cor}" onclick="selecionarCor('${c.cor}', this, false)"></div>`).join('')}
                <div class="btn-cor btn-brilho" onclick="selecionarCor('', this, true)">✨</div>
            </div>
            <button class="btn-play-rect" style="background:#6c757d; height:45px; width:140px;" onclick="mostrarMenuLetras()">SAIR</button>
        </div>`;

    prepararCanvas();
}

function prepararCanvas() {
    canvas = document.getElementById('canvas-letra');
    ctx = canvas.getContext('2d');
    
    // Aplicar a imagem da letra como máscara do Canvas
    const imgURL = DADOS_JOGO.caminhoRecursos + itemSelecionado.img;
    canvas.style.webkitMaskImage = `url(${imgURL})`;
    canvas.style.maskImage = `url(${imgURL})`;

    // Canvas oculto para detectar progresso
    const off = document.createElement('canvas');
    off.width = 280; off.height = 350;
    ctxAnalise = off.getContext('2d', { willReadFrequently: true });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        ctxAnalise.drawImage(img, 20, 20, 240, 310);
        const data = ctxAnalise.getImageData(0,0,280,350).data;
        pixelsTotaisDaLetra = 0;
        for (let i = 3; i < data.length; i += 4) if (data[i] > 40) pixelsTotaisDaLetra++;
        ctxAnalise.clearRect(0,0,280,350);
    };
    img.src = imgURL;

    configurarDesenho();
    selecionarCor(corAtual, document.querySelector('.btn-cor'), false);
}

function configurarDesenho() {
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
            y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
        };
    };

    const riscar = (e) => {
        if (!desenhando || !jogoAtivo) return;
        e.preventDefault();
        const pos = getPos(e);

        // CONFIGURAÇÃO DO PINCEL (GROSSO PARA PREENCHER TUDO)
        ctx.lineWidth = 60; // Pincel largo para ocupar a grossura da letra
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        ctxAnalise.lineWidth = 60;
        ctxAnalise.lineTo(pos.x, pos.y);
        ctxAnalise.stroke();

        verificarFim();
    };

    canvas.onmousedown = (e) => { desenhando = true; ctx.beginPath(); ctxAnalise.beginPath(); };
    canvas.onmousemove = riscar;
    window.onmouseup = () => desenhando = false;
    canvas.ontouchstart = (e) => { desenhando = true; ctx.beginPath(); ctxAnalise.beginPath(); };
    canvas.ontouchmove = riscar;
}

function verificarFim() {
    const data = ctxAnalise.getImageData(0,0,280,350).data;
    let pintados = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 40) pintados++;
    
    if ((pintados / pixelsTotaisDaLetra) * 100 > 85) {
        jogoAtivo = false;
        letrasConcluidas++;
        somAcerto.play();
        
        // Efeito visual de conclusão (Zoom)
        canvas.style.transition = "transform 0.5s ease";
        canvas.style.transform = "scale(1.1)";
        
        setTimeout(() => {
            if (letrasConcluidas >= DADOS_JOGO.itens.length) {
                Engine.showResults(letrasConcluidas, 0, 0, JOGO_CONFIG.relatorios[0]);
            } else {
                mostrarMenuLetras();
            }
        }, 1500);
    }
}

function selecionarCor(cor, el, brilhante) {
    corAtual = cor;
    modoBrilhante = brilhante;
    
    if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (modoBrilhante) {
            // Pincel Dourado Brilhante
            ctx.strokeStyle = "#FFD700";
            canvas.classList.add('efeito-brilhante-cor');
        } else {
            ctx.strokeStyle = cor;
            canvas.classList.remove('efeito-brilhante-cor');
        }
    }
    
    if (ctxAnalise) ctxAnalise.strokeStyle = "black";
    document.querySelectorAll('.btn-cor').forEach(b => b.classList.remove('ativa'));
    el.classList.add('ativa');
    somClique.play().catch(() => {});
}

function correrSimulacao() {
    const hand = document.getElementById('simu-hand');
    const animar = () => {
        hand.style.display = "block"; hand.style.opacity = "0";
        hand.style.top = "180px"; hand.style.left = "42%";
        setTimeout(() => {
            hand.style.opacity = "1";
            setTimeout(() => { hand.style.top = "80px"; }, 600);
            setTimeout(() => { hand.style.top = "200px"; hand.style.left = "62%"; }, 1200);
            setTimeout(() => { hand.style.opacity = "0"; }, 2000);
        }, 300);
    };
    animar(); simuInterval = setInterval(animar, 4000);
}

function tocarAudioInstrucoes() {
    new Audio(DADOS_JOGO.caminhoRecursos + DADOS_JOGO.somInstrucoes).play();
}

mostrarCapa();
