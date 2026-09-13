// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0;
let itemDestaque = null;
let audioInstrucoes = null;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.clique);

let canvas, ctx;
let isDrawing = false;
let posFinalX = 0, posFinalY = 0;
let posAtualX = 0, posAtualY = 0;

let pontosCaminho = []; 
let saiuDoCaminho = false;
let simuTimer = null; 
let sequenciaNiveis = [];

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .btn-play-rect { flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); color: white; border: none; font-size: 1.5rem; font-weight: 900; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: 0.2s; z-index: 100; }
    .btn-audio-circle { width: 65px; height: 65px; cursor: pointer; flex-shrink: 0; z-index: 100; }

    .grafismo-area {
        position: relative; width: 100%; max-width: 800px; height: 300px;
        background: #fdfdfd; border: 4px dashed #e0e0e0; border-radius: 30px;
        margin: 0 auto; display: flex; justify-content: space-between; 
        padding: 0 40px; overflow: hidden;
    }

    /* CLASSES DE POSIÇÃO PARA CRIAR AS DIAGONAIS */
    .pos-top { align-self: flex-start; margin-top: 30px; }
    .pos-center { align-self: center; }
    .pos-bottom { align-self: flex-end; margin-bottom: 30px; }

    .ponto-inicio {
        width: 35px; height: 35px; border-radius: 50%; 
        background: var(--primary-color); border: 4px solid #fff; 
        box-shadow: 0 0 0 5px var(--primary-color), 0 4px 10px rgba(0,0,0,0.2); 
        z-index: 10; position: relative; flex-shrink: 0;
    }
    
    .ponto-fim { 
        font-size: 3.5rem; color: #d0d0d0; z-index: 10; position: relative; 
        transition: 0.3s; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    }

    .animating { animation: pulse 1s infinite alternate; }
    @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.3); } }

    canvas { position: absolute; top: 0; left: 0; z-index: 5; cursor: pointer; touch-action: none; }
    canvas:active { cursor: grabbing; }

    @media screen and (max-width: 500px) {
        .grafismo-area { height: 220px; padding: 0 20px; }
        .ponto-inicio { width: 25px; height: 25px; }
        .ponto-fim { font-size: 2.5rem; }
        .pos-top { margin-top: 15px; }
        .pos-bottom { margin-bottom: 15px; }
    }
`;
document.head.appendChild(style);

// ==========================================
// 3. LÓGICA DE CAPA COM SIMULAÇÃO ANIMADA
// ==========================================
function tocarAudioInstrucoes() {
    somClique.pause(); somClique.currentTime = 0; somClique.play();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioInstrucoes) { audioInstrucoes.pause(); audioInstrucoes.currentTime = 0; }
    else { audioInstrucoes = new Audio(JOGO_CONFIG.caminhoSons + DADOS_JOGO.somInstrucoes); }
    audioInstrucoes.play().catch(() => {
        const utter = new SpeechSynthesisUtterance("Começa na bola e arrasta o dedo pela linha até à seta, sem sair do caminho!");
        utter.lang = 'pt-PT'; window.speechSynthesis.speak(utter);
    });
}

function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width: 100%;">
            <div class="grafismo-area" id="simu-area" style="transform: scale(0.8); height: 220px; border-color: var(--primary-color); margin-bottom: -10px;">
                <div class="ponto-inicio pos-bottom" id="simu-inicio"></div>
                <canvas id="simu-canvas"></canvas>
                <div class="ponto-fim pos-top" id="simu-fim"><i class="fas fa-arrow-right"></i></div>
                <div id="simu-hand" style="position:absolute; font-size:3rem; z-index:100; pointer-events:none; filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.3));">👆</div>
            </div>
            <p style="color:var(--text-grey); font-weight:800; text-align:center; font-size:1.1rem; max-width: 500px; padding: 0 15px;">
                ${JOGO_CONFIG.descricao}
            </p>
        </div>
    `;
    
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="tocarAudioInstrucoes()"> 
        <button class="btn-play-rect" onclick="iniciarJogo()"><i class="fas fa-play"></i> JOGAR</button>
    `;

    setTimeout(iniciarSimulacaoAnimada, 100);
}

function iniciarSimulacaoAnimada() {
    const sCanvas = document.getElementById('simu-canvas');
    if(!sCanvas) return;
    const sCtx = sCanvas.getContext('2d');
    const sArea = document.getElementById('simu-area');
    
    sCanvas.width = sArea.clientWidth; sCanvas.height = sArea.clientHeight;
    
    const cRect = sArea.getBoundingClientRect();
    const startEl = document.getElementById('simu-inicio').getBoundingClientRect();
    const endEl = document.getElementById('simu-fim').getBoundingClientRect();
    
    // Calcula Centros da Simulação
    const startX = startEl.left - cRect.left + (startEl.width / 2);
    const startY = startEl.top - cRect.top + (startEl.height / 2);
    const endX = endEl.left - cRect.left;
    const endY = endEl.top - cRect.top + (endEl.height / 2);

    const path = gerarPontosLinhaReta(startX, startY, endX, endY);
    
    sCtx.beginPath(); sCtx.setLineDash([15, 15]); sCtx.lineWidth = 6; sCtx.strokeStyle = "#d0d0d0";
    sCtx.moveTo(path[0].x, path[0].y); path.forEach(p => sCtx.lineTo(p.x, p.y)); sCtx.stroke(); sCtx.setLineDash([]);

    const hand = document.getElementById('simu-hand');
    let step = 0;
    
    function animar() {
        if (!document.getElementById('simu-canvas')) return; 
        if (step === 0) {
            sCtx.clearRect(0,0, sCanvas.width, sCanvas.height);
            sCtx.beginPath(); sCtx.setLineDash([15, 15]); sCtx.lineWidth = 6; sCtx.strokeStyle = "#d0d0d0";
            sCtx.moveTo(path[0].x, path[0].y); path.forEach(p => sCtx.lineTo(p.x, p.y)); sCtx.stroke(); sCtx.setLineDash([]);
            sCtx.beginPath(); sCtx.lineWidth = 14; sCtx.strokeStyle = "var(--primary-color)"; sCtx.lineCap = "round"; sCtx.lineJoin = "round";
            sCtx.moveTo(path[0].x, path[0].y);
            hand.style.opacity = 1; hand.innerText = "👆";
        }

        if (step < path.length) {
            const pt = path[step];
            hand.style.left = (pt.x - 15) + "px"; hand.style.top = (pt.y + 5) + "px";
            if(step > 5) hand.innerText = "✊"; 
            
            sCtx.lineTo(pt.x, pt.y); sCtx.stroke();
            step++;
            simuTimer = setTimeout(animar, 15); // Rápido e suave
        } else {
            hand.style.opacity = 0; step = 0;
            simuTimer = setTimeout(animar, 1500); 
        }
    }
    animar();
}

// ==========================================
// 4. LÓGICA DE JOGO PRINCIPAL
// ==========================================
function iniciarJogo() {
    clearTimeout(simuTimer); 
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0; 
    totalRondas = 10; 
    
    // GERAÇÃO DE MÚLTIPLOS PADRÕES DE LINHAS RETAS (DIAGONAIS, HORIZONTAIS)
    const basePontoA = ["pos-top", "pos-center", "pos-bottom"];
    const basePontoB = ["pos-top", "pos-center", "pos-bottom"];
    
    sequenciaNiveis = [];
    
    // Cria todas as 9 combinações possíveis e baralha
    let deck = [];
    basePontoA.forEach(a => {
        basePontoB.forEach(b => { deck.push({ posIni: a, posFim: b }); });
    });
    
    // Baralha o deck e tira as primeiras 10 rondas (repete 1 aleatória para dar 10)
    deck.sort(() => Math.random() - 0.5);
    sequenciaNiveis = [...deck, deck[0]]; 

    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    const area = document.getElementById('game-content');
    itemDestaque = sequenciaNiveis[rondaAtual - 1]; 
    
    area.innerHTML = `
        <div class="grafismo-area" id="area-desenho">
            <div class="ponto-inicio ${itemDestaque.posIni}" id="ponto-inicio"></div>
            <canvas id="linhaCanvas"></canvas>
            <div class="ponto-fim ${itemDestaque.posFim}" id="ponto-fim"><i class="fas fa-arrow-right"></i></div>
        </div>
    `;
    // Dá 150ms para o CSS posicionar os itens flex antes de medir com o Canvas
    setTimeout(configurarCanvas, 150); 
}

function configurarCanvas() {
    const container = document.getElementById('area-desenho');
    canvas = document.getElementById('linhaCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = container.clientWidth; canvas.height = container.clientHeight;

    // CÁLCULO MILIMÉTRICO (Começa no centro da bola, acaba no inicio da seta)
    const cRect = container.getBoundingClientRect();
    const startRect = document.getElementById('ponto-inicio').getBoundingClientRect();
    const endRect = document.getElementById('ponto-fim').getBoundingClientRect();
    
    const startX = startRect.left - cRect.left + (startRect.width / 2);
    const startY = startRect.top - cRect.top + (startRect.height / 2);
    
    // O final é exatamente o ponto esquerdo (left) da "caixa" da seta, com +5px para encostar ao icone
    posFinalX = endRect.left - cRect.left + 5; 
    posFinalY = endRect.top - cRect.top + (endRect.height / 2);

    pontosCaminho = gerarPontosLinhaReta(startX, startY, posFinalX, posFinalY);
    
    ctx.beginPath(); ctx.setLineDash([15, 15]); ctx.lineWidth = 6; ctx.strokeStyle = "#d0d0d0"; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.moveTo(pontosCaminho[0].x, pontosCaminho[0].y);
    pontosCaminho.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.stroke(); ctx.setLineDash([]);

    canvas.addEventListener('mousedown', startDrawing); canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing); canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDrawing);
}

// GERA OS PONTOS APENAS PARA LINHAS RETAS
function gerarPontosLinhaReta(sX, sY, eX, eY) {
    let pts = [];
    const steps = 100; // Divide a linha em 100 pontos minúsculos de verificação
    for(let i=0; i<=steps; i++) {
        pts.push({ 
            x: sX + (eX - sX) * (i/steps), 
            y: sY + (eY - sY) * (i/steps), 
            hit: false 
        });
    }
    return pts;
}

function getClientOffset(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function startDrawing(e) {
    if (!jogoAtivo) return;
    e.preventDefault();
    
    // OBRIGA A COMEÇAR NO CENTRO DA BOLA (Tolerância de 35px)
    const pos = getClientOffset(e);
    const startPt = pontosCaminho[0];
    if (Math.hypot(pos.x - startPt.x, pos.y - startPt.y) > 35) return; 

    isDrawing = true; saiuDoCaminho = false;
    pontosCaminho.forEach(p => p.hit = false); 
    posAtualX = pos.x; posAtualY = pos.y;
    
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 14; ctx.strokeStyle = "var(--primary-color)"; ctx.lineCap = "round"; ctx.lineJoin = "round";
}

function draw(e) {
    if (!isDrawing || !jogoAtivo) return;
    e.preventDefault();
    const pos = getClientOffset(e);
    
    // Interpolation (verifica pontos intermédios caso o rato se mova muito depressa)
    let dist = Math.hypot(pos.x - posAtualX, pos.y - posAtualY);
    let steps = Math.max(1, Math.floor(dist / 5)); 
    
    for(let s = 1; s <= steps; s++) {
        let chkX = posAtualX + (pos.x - posAtualX)*(s/steps);
        let chkY = posAtualY + (pos.y - posAtualY)*(s/steps);
        
        let minDist = Infinity; let closestIdx = -1;
        for(let i=0; i<pontosCaminho.length; i++) {
            let d = Math.hypot(chkX - pontosCaminho[i].x, chkY - pontosCaminho[i].y);
            if(d < minDist) { minDist = d; closestIdx = i; }
        }
        
        // Se a criança se afastar mais de 35px da linha central traçada -> INVALIDEZ
        if (minDist > 35) {
            saiuDoCaminho = true; 
        } else if (closestIdx !== -1) {
            pontosCaminho[closestIdx].hit = true; 
        }
    }

    posAtualX = pos.x; posAtualY = pos.y;
    ctx.lineTo(pos.x, pos.y); ctx.stroke();
}

function stopDrawing(e) {
    if (!isDrawing) return;
    isDrawing = false;
    ctx.closePath();
    avaliarJogada();
}

function avaliarJogada() {
    // Tolerância para soltar o rato de 50px do inicio da seta
    const distanciaFim = Math.hypot(posFinalX - posAtualX, posFinalY - posAtualY);
    let pontosAtingidos = pontosCaminho.filter(p => p.hit).length;
    let accuracia = pontosAtingidos / pontosCaminho.length;
    
    // VALIDAÇÃO: Chegou ao fim E cobriu 90% da linha E não se desviou para fora
    if (distanciaFim < 50 && accuracia >= 0.90 && !saiuDoCaminho) {
        jogoAtivo = false; certos++; somAcerto.play();
        const endEl = document.getElementById('ponto-fim');
        endEl.style.color = "#8cc63f"; endEl.classList.add('animating');
        document.getElementById('area-desenho').style.borderColor = "#8cc63f";
        setTimeout(() => { rondaAtual++; jogoAtivo = true; proximaRonda(); }, 1500);
    } else {
        erros++; somErro.play();
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.beginPath(); ctx.setLineDash([15, 15]); ctx.lineWidth = 6; ctx.strokeStyle = "#d0d0d0";
        ctx.moveTo(pontosCaminho[0].x, pontosCaminho[0].y); pontosCaminho.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke(); ctx.setLineDash([]);
        Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    }
}

function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++; somClique.play();
    const endEl = document.getElementById('ponto-fim');
    endEl.classList.add('animating');
    setTimeout(() => { endEl.classList.remove('animating'); }, 2000);
}

function finalizarJogo() {
    jogoAtivo = false;
    if(audioInstrucoes) audioInstrucoes.pause();
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, ajudasUsadas, rel);
}
