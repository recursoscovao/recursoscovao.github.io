// ==========================================
// 1. ESTADO GLOBAL E CONFIGURAÇÃO
// ==========================================
let jogoAtivo = false;
let itemSelecionado = null;
let corAtual = JOGO_CONFIG.coresMagicas[0].cor;
let modoBrilhante = false;
let desenhando = false;
let canvas, ctx;
let listaDePontos = []; // Guardará a posição de cada bolinha preta
let simuInterval;
let letrasConcluidas = 0;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.acerto);
const somClique = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CSS INJETADO (ESTILO MODERNO + SCROLL)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .game-stage {
        position: relative; width: 100%; max-width: 400px; margin: 0 auto;
        display: flex; flex-direction: column; align-items: center;
    }

    .tracing-wrapper {
        position: relative; width: 300px; height: 350px;
        background: #fff; border-radius: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        overflow: hidden; touch-action: none; border: 6px solid #f0f0f0;
    }

    /* A imagem com as bolinhas pretas fica no fundo */
    .img-template {
        position: absolute; top:0; left:0; width:100%; height:100%;
        z-index: 5; pointer-events: none; padding: 30px; box-sizing: border-box;
        object-fit: contain; opacity: 0.3; /* Fica clarinho para o desenho brilhar por cima */
    }

    #canvas-letra { position: absolute; top:0; left:0; z-index: 10; cursor: crosshair; }

    /* MENU DE LETRAS COM SCROLL */
    .menu-scroll {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
        width: 100%; max-height: 280px; overflow-y: auto; padding: 10px;
    }
    .card-letra {
        aspect-ratio: 1/1; background: white; border: 3px solid #eee;
        border-radius: 15px; display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: 0.2s;
    }
    .card-letra:hover { transform: scale(1.05); border-color: var(--primary-color); }
    .card-letra img { width: 70%; height: 70%; object-fit: contain; }

    .paleta { display: flex; gap: 8px; margin: 15px 0; justify-content: center; flex-wrap: wrap; }
    .btn-cor { width: 42px; height: 42px; border-radius: 50%; border: 3px solid white; cursor: pointer; }
    .btn-cor.ativa { transform: scale(1.2); border-color: #333; }
    .btn-brilho { background: linear-gradient(45deg, gold, pink, cyan); font-size: 1.2rem; display: flex; align-items: center; justify-content: center; }

    #simu-hand { position: absolute; font-size: 3.5rem; z-index: 100; pointer-events: none; transition: all 0.7s; }
`;
document.head.appendChild(style);

// ==========================================
// 3. FLUXO DE NAVEGAÇÃO
// ==========================================
function mostrarCapa() {
    clearInterval(simuInterval);
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">LIGA AS BOLINHAS</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div id="simu-hand" style="display:none;">👆</div>
        <div class="game-stage">
            <div class="tracing-wrapper"><img src="${DADOS_JOGO.caminhoRecursos + DADOS_JOGO.itens[0].img}" class="img-template"></div>
            <p style="text-align:center; font-weight:800; margin-top:15px; color:#666;">Passa o dedo pelas bolinhas!</p>
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
                        <img src="${DADOS_JOGO.caminhoRecursos + it.img}">
                    </div>
                `).join('')}
            </div>
            <button class="btn-play-rect" style="background:#6c757d; margin-top:15px; height:50px;" onclick="mostrarCapa()">VOLTAR</button>
        </div>`;
}

// ==========================================
// 4. LÓGICA DE DETECÇÃO DE BOLINHAS
// ==========================================
function iniciarTracing(id) {
    itemSelecionado = DADOS_JOGO.itens.find(i => i.id === id);
    jogoAtivo = true;
    Engine.showStatusBar(letrasConcluidas + 1, DADOS_JOGO.itens.length, letrasConcluidas, 0);

    document.getElementById('game-content').innerHTML = `
        <div class="game-stage">
            <div class="tracing-wrapper">
                <img src="${DADOS_JOGO.caminhoRecursos + itemSelecionado.img}" class="img-template">
                <canvas id="canvas-letra" width="300" height="350"></canvas>
            </div>
            <div class="paleta">
                ${JOGO_CONFIG.coresMagicas.map(c => `<div class="btn-cor" style="background:${c.cor}" onclick="selecionarCor('${c.cor}', this, false)"></div>`).join('')}
                <div class="btn-cor btn-brilho" onclick="selecionarCor('', this, true)">✨</div>
            </div>
            <button class="btn-play-rect" style="background:#6c757d; height:45px; width:140px; font-size:1rem;" onclick="mostrarMenuLetras()">SAIR</button>
        </div>`;

    analisarBolinhasDaImagem();
}

function analisarBolinhasDaImagem() {
    canvas = document.getElementById('canvas-letra');
    ctx = canvas.getContext('2d');
    listaDePontos = [];

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 300; tempCanvas.height = 350;
        const tctx = tempCanvas.getContext('2d');
        tctx.drawImage(img, 30, 30, 240, 290);

        const pixels = tctx.getImageData(0, 0, 300, 350).data;
        // Percorre a imagem para encontrar onde estão as bolinhas pretas
        for (let y = 0; y < 350; y += 4) {
            for (let x = 0; x < 300; x += 4) {
                const i = (y * 300 + x) * 4;
                // Se o pixel for escuro (bolinha preta)
                if (pixels[i] < 100 && pixels[i+3] > 100) {
                    // Evita guardar pontos muito colados
                    if (!listaDePontos.some(p => Math.hypot(p.x - x, p.y - y) < 8)) {
                        listaDePontos.push({ x, y, concluido: false });
                    }
                }
            }
        }
        configurarDesenho();
    };
    img.src = DADOS_JOGO.caminhoRecursos + itemSelecionado.img;
    selecionarCor(corAtual, document.querySelector('.btn-cor'), false);
}

function configurarDesenho() {
    const checkProximidade = (ex, ey) => {
        const rect = canvas.getBoundingClientRect();
        const x = ex - rect.left;
        const y = ey - rect.top;

        listaDePontos.forEach(p => {
            if (!p.concluido && Math.hypot(p.x - x, p.y - y) < 20) {
                p.concluido = true;
                pintarBolinha(p.x, p.y);
            }
        });

        // Verifica se completou cerca de 90% das bolinhas
        const totalConcluidos = listaDePontos.filter(p => p.concluido).length;
        if (totalConcluidos / listaDePontos.length > 0.9) concluirAutomatico();
    };

    canvas.addEventListener('mousemove', (e) => { if (e.buttons === 1) checkProximidade(e.clientX, e.clientY); });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); checkProximidade(e.touches[0].clientX, e.touches[0].clientY); }, {passive: false});
    canvas.addEventListener('mousedown', (e) => checkProximidade(e.clientX, e.clientY));
}

function pintarBolinha(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = modoBrilhante ? `hsl(${Math.random() * 360}, 100%, 70%)` : corAtual;
    ctx.fill();
    
    // Pequeno efeito de brilho/estrela ao tocar na bolinha
    if (modoBrilhante) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function concluirAutomatico() {
    if (!jogoAtivo) return;
    jogoAtivo = false;
    letrasConcluidas++;
    somAcerto.play();

    // Efeito Mágico: Preenche a letra toda de uma vez
    ctx.globalAlpha = 0.8;
    listaDePontos.forEach(p => pintarBolinha(p.x, p.y));
    
    setTimeout(() => {
        if (letrasConcluidas >= DADOS_JOGO.itens.length) {
            Engine.showResults(letrasConcluidas, 0, 0, JOGO_CONFIG.relatorios[0]);
        } else {
            mostrarMenuLetras();
        }
    }, 1500);
}

function selecionarCor(cor, el, brilhante) {
    corAtual = cor; modoBrilhante = brilhante;
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
            setTimeout(() => { hand.style.top = "80px"; hand.style.left = "50%"; }, 600);
            setTimeout(() => { hand.style.top = "220px"; hand.style.left = "62%"; }, 1300);
            setTimeout(() => { hand.style.opacity = "0"; }, 2000);
        }, 300);
    };
    animar(); simuInterval = setInterval(animar, 4000);
}

mostrarCapa();
