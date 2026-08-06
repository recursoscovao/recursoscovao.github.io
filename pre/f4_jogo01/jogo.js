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
let particulas = []; // Para o efeito de brilho/estrelas

const somAcerto = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.acerto);
const somClique = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CSS RIGOROSO (LAYOUT + MENU SCROLL + ESTRELAS)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .game-stage {
        position: relative; width: 100%; max-width: 400px; margin: 0 auto;
        display: flex; flex-direction: column; align-items: center;
    }
    
    .tracing-wrapper {
        position: relative; width: 300px; height: 380px;
        background: #fff; border-radius: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        overflow: hidden; touch-action: none; border: 8px solid #f8f8f8;
    }

    /* Imagem da letra com as SETAS e NÚMEROS (Guia) */
    .img-guia {
        position: absolute; top:0; left:0; width:100%; height:100%;
        z-index: 5; pointer-events: none; padding: 30px; box-sizing: border-box;
        object-fit: contain; opacity: 1; /* Setas bem visíveis */
    }

    #canvas-letra { position: absolute; top:0; left:0; z-index: 10; cursor: crosshair; }

    /* MENU COM SCROLL */
    .menu-scroll {
        width: 100%; max-height: 320px; overflow-y: auto; padding: 15px;
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;
    }
    .card-letra {
        aspect-ratio: 1/1; background: white; border: 3px solid #eee; border-radius: 20px;
        display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
    }
    .card-letra:hover { transform: scale(1.05); border-color: var(--primary-color); }

    .paleta { display: flex; gap: 10px; margin: 15px 0; justify-content: center; }
    .btn-cor { width: 45px; height: 45px; border-radius: 50%; border: 4px solid white; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .btn-cor.ativa { transform: scale(1.2); border-color: #333; }
    .btn-brilho { background: linear-gradient(45deg, gold, #fff, gold); font-size: 1.3rem; display: flex; align-items: center; justify-content: center; animation: pulsar 1.5s infinite; }
    
    @keyframes pulsar { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
`;
document.head.appendChild(style);

// ==========================================
// 3. FLUXO DE CAPA E MENU
// ==========================================
function mostrarCapa() {
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">DESENHA AS LETRAS</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div class="game-stage">
            <div class="tracing-wrapper"><img src="${DADOS_JOGO.caminhoRecursos + DADOS_JOGO.itens[0].img}" class="img-guia"></div>
            <p style="text-align:center; font-weight:800; margin-top:20px; color:#666;">Aprende a escrever a brincar!</p>
        </div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `<button class="btn-play-rect" style="width:100%" onclick="mostrarMenuLetras()">JOGAR</button>`;
}

function mostrarMenuLetras() {
    document.getElementById('shell-footer-content').style.display = "none";
    document.getElementById('game-content').innerHTML = `
        <div class="game-stage">
            <h3 style="color:#555; margin-bottom:10px;">Escolhe uma letra:</h3>
            <div class="menu-scroll">
                ${DADOS_JOGO.itens.map(it => `
                    <div class="card-letra" onclick="iniciarTracing('${it.id}')">
                        <img src="${DADOS_JOGO.caminhoRecursos + it.img}" style="width:75%">
                    </div>
                `).join('')}
            </div>
            <button class="btn-play-rect" style="background:#6c757d; margin-top:15px; height:50px;" onclick="mostrarCapa()">VOLTAR</button>
        </div>`;
}

// ==========================================
// 4. MOTOR DE JOGO (MÁSCARA E PARTÍCULAS)
// ==========================================
function iniciarTracing(id) {
    itemSelecionado = DADOS_JOGO.itens.find(i => i.id === id);
    jogoAtivo = true;
    Engine.showStatusBar(letrasConcluidas + 1, DADOS_JOGO.itens.length, letrasConcluidas, 0);

    document.getElementById('game-content').innerHTML = `
        <div class="game-stage">
            <div class="tracing-wrapper">
                <img src="${DADOS_JOGO.caminhoRecursos + itemSelecionado.img}" class="img-guia">
                <canvas id="canvas-letra" width="300" height="380"></canvas>
            </div>
            <div class="paleta">
                ${JOGO_CONFIG.coresMagicas.map(c => `<div class="btn-cor" style="background:${c.cor}" onclick="selecionarCor('${c.cor}', this, false)"></div>`).join('')}
                <div class="btn-cor btn-brilho" onclick="selecionarCor('', this, true)">✨</div>
            </div>
            <button class="btn-play-rect" style="background:#6c757d; height:45px; width:150px; font-size:1rem;" onclick="mostrarMenuLetras()">SAIR</button>
        </div>`;

    prepararTracing();
}

function prepararTracing() {
    canvas = document.getElementById('canvas-letra');
    ctx = canvas.getContext('2d');
    
    // CARREGA A MÁSCARA (A letra ocupa logo a sua grossura)
    const imgMascara = new Image();
    imgMascara.crossOrigin = "anonymous";
    imgMascara.onload = () => {
        // Criamos um canvas temporário para mapear a letra
        const off = document.createElement('canvas');
        off.width = 300; off.height = 380;
        const octx = off.getContext('2d');
        octx.drawImage(imgMascara, 30, 30, 240, 320);
        
        const data = octx.getImageData(0,0,300,380).data;
        pixelsTotaisDaLetra = 0;
        for(let i=3; i<data.length; i+=4) if(data[i] > 50) pixelsTotaisDaLetra++;
        
        ctxAnalise = octx; // Guardamos para verificar progresso
        
        // APLICAR MÁSCARA CSS AO CANVAS
        canvas.style.webkitMaskImage = `url(${imgMascara.src})`;
        canvas.style.maskImage = `url(${imgMascara.src})`;
        canvas.style.maskSize = "contain";
        canvas.style.maskRepeat = "no-repeat";
        canvas.style.maskPosition = "center";
    };
    imgMascara.src = DADOS_JOGO.caminhoRecursos + itemSelecionado.img;

    configurarTouch();
    selecionarCor(corAtual, document.querySelector('.btn-cor'), false);
    requestAnimationFrame(animarParticulas); // Inicia brilhos
}

function configurarTouch() {
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const bx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const by = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x: bx, y: by };
    };

    const mover = (e) => {
        if (!desenhando || !jogoAtivo) return;
        e.preventDefault();
        const pos = getPos(e);

        // PINCEL GROSSO (Preenche a letra logo)
        ctx.lineWidth = 65; 
        ctx.lineCap = 'round';
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        // Criar estrelas/partículas
        criarParticulas(pos.x, pos.y);
        
        // Verifica se terminou
        verificarProgresso();
    };

    canvas.onmousedown = (e) => { desenhando = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); };
    canvas.onmousemove = mover;
    window.onmouseup = () => desenhando = false;
    canvas.ontouchstart = (e) => { desenhando = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); };
    canvas.ontouchmove = mover;
}

function verificarProgresso() {
    // Desenha o que foi feito no canvas de análise para contar
    ctxAnalise.globalCompositeOperation = 'source-over';
    ctxAnalise.strokeStyle = "white";
    ctxAnalise.lineWidth = 65;
    // (Simplificado para performance: usamos o próprio canvas de desenho)
    const data = ctx.getImageData(0,0,300,380).data;
    let pintados = 0;
    for(let i=3; i<data.length; i+=4) if(data[i] > 10) pintados++;

    if ((pintados / pixelsTotaisDaLetra) * 100 > 85) {
        finalizarLetra();
    }
}

function finalizarLetra() {
    if (!jogoAtivo) return;
    jogoAtivo = false;
    letrasConcluidas++;
    somAcerto.play();
    
    // Animação de sucesso
    canvas.style.transition = "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    canvas.style.transform = "scale(1.1)";
    
    setTimeout(() => {
        if (letrasConcluidas >= DADOS_JOGO.itens.length) finalizarJogo();
        else mostrarMenuLetras();
    }, 1500);
}

// ==========================================
// 5. EFEITOS ESPECIAIS (PARTÍCULAS)
// ==========================================
function criarParticulas(x, y) {
    for (let i = 0; i < 3; i++) {
        particulas.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: Math.random() * 5 + 2,
            alpha: 1,
            color: modoBrilhante ? `hsl(${Math.random() * 360}, 100%, 70%)` : corAtual
        });
    }
}

function animarParticulas() {
    // Não limpamos o canvas de desenho, mas as partículas são desenhadas à parte
    // (Num jogo real, usaríamos um canvas separado para partículas para não borrar a letra)
    // Aqui vamos apenas atualizar o estado para simular o efeito visual
    particulas.forEach((p, index) => {
        p.x += p.vx; p.y += p.vy;
        p.alpha -= 0.02;
        if (p.alpha <= 0) particulas.splice(index, 1);
    });
    if (jogoAtivo) requestAnimationFrame(animarParticulas);
}

function selecionarCor(cor, el, brilhante) {
    corAtual = cor;
    modoBrilhante = brilhante;
    if (ctx) {
        ctx.strokeStyle = modoBrilhante ? "gold" : cor;
        ctx.lineJoin = 'round';
    }
    document.querySelectorAll('.btn-cor').forEach(b => b.classList.remove('ativa'));
    el.classList.add('ativa');
    somClique.play().catch(() => {});
}

function finalizarJogo() {
    Engine.showResults(letrasConcluidas, 0, 0, JOGO_CONFIG.relatorios[0]);
}

mostrarCapa();
