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

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .btn-play-rect { flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); color: white; border: none; font-size: 1.5rem; font-weight: 900; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: 0.2s; }
    .btn-audio-circle { width: 65px; height: 65px; cursor: pointer; flex-shrink: 0; }

    .grafismo-area {
        position: relative; width: 100%; max-width: 800px; height: 300px;
        background: #fdfdfd; border: 4px dashed #e0e0e0; border-radius: 30px;
        margin: 0 auto; display: flex; justify-content: space-between; align-items: center;
        padding: 0 20px; overflow: hidden;
    }

    .graf-img {
        width: 100px; height: 100px; object-fit: contain; z-index: 10;
        pointer-events: none; filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.1));
    }
    .graf-img.animating { animation: pulse 1s infinite alternate; }
    @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.1); } }

    canvas { position: absolute; top: 0; left: 0; z-index: 5; cursor: crosshair; touch-action: none; }

    @media screen and (max-width: 500px) {
        .grafismo-area { height: 220px; padding: 0 10px; }
        .graf-img { width: 75px; height: 75px; }
    }
`;
document.head.appendChild(style);

// ==========================================
// 3. LÓGICA DE CAPA
// ==========================================
function tocarAudioInstrucoes() {
    somClique.pause(); somClique.currentTime = 0; somClique.play();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioInstrucoes) { audioInstrucoes.pause(); audioInstrucoes.currentTime = 0; }
    else { audioInstrucoes = new Audio(JOGO_CONFIG.caminhoSons + DADOS_JOGO.somInstrucoes); }
    audioInstrucoes.play().catch(() => {
        const utter = new SpeechSynthesisUtterance("Usa o dedo para ligar a imagem seguindo a linha.");
        utter.lang = 'pt-PT'; window.speechSynthesis.speak(utter);
    });
}

function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width: 100%;">
            <div style="font-size: 4rem; color: var(--primary-color); margin-bottom: 15px;"><i class="fas fa-pencil-alt"></i></div>
            <p style="color:var(--text-grey); font-weight:800; text-align:center; font-size:1.1rem; max-width: 500px;">
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
}

// ==========================================
// 4. LÓGICA DE JOGO (GRAFISMOS)
// ==========================================
function iniciarJogo() {
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0; 
    totalRondas = DADOS_JOGO.itens.length; 
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    const area = document.getElementById('game-content');
    itemDestaque = DADOS_JOGO.itens[rondaAtual - 1]; 
    
    area.innerHTML = `
        <div class="grafismo-area" id="area-desenho">
            <img src="${DADOS_JOGO.caminhoImagens + itemDestaque.imgA}" class="graf-img" id="img-start">
            <canvas id="linhaCanvas"></canvas>
            <img src="${DADOS_JOGO.caminhoImagens + itemDestaque.imgB}" class="graf-img" id="img-end" style="opacity: 0.5;">
        </div>
    `;
    setTimeout(configurarCanvas, 100); 
}

function configurarCanvas() {
    const container = document.getElementById('area-desenho');
    canvas = document.getElementById('linhaCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    desenharGuia(itemDestaque.tipo);

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDrawing);
}

function desenharGuia(tipo) {
    const startImg = document.getElementById('img-start');
    const endImg = document.getElementById('img-end');
    const startX = startImg.offsetLeft + (startImg.offsetWidth / 2);
    const startY = canvas.height / 2;
    posFinalX = endImg.offsetLeft + (endImg.offsetWidth / 2);
    posFinalY = canvas.height / 2;

    ctx.beginPath();
    ctx.setLineDash([15, 15]); 
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#d0d0d0";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(startX, startY);

    const widthDist = posFinalX - startX;
    if (tipo === "reta") {
        ctx.lineTo(posFinalX, posFinalY);
    } else if (tipo === "curva") {
        ctx.quadraticCurveTo(startX + (widthDist / 2), -50, posFinalX, posFinalY);
    } else if (tipo === "ziguezague") {
        const picos = 4;
        const espaco = widthDist / picos;
        for (let i = 1; i <= picos; i++) {
            let x = startX + (espaco * i);
            let y = (i % 2 === 0) ? startY : startY - 80;
            if (i === picos) y = posFinalY;
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    ctx.setLineDash([]); 
}

function getClientOffset(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function startDrawing(e) {
    if (!jogoAtivo) return;
    e.preventDefault();
    isDrawing = true;
    const pos = getClientOffset(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 12;
    ctx.strokeStyle = "var(--primary-color)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
}

function draw(e) {
    if (!isDrawing || !jogoAtivo) return;
    e.preventDefault();
    const pos = getClientOffset(e);
    posAtualX = pos.x; posAtualY = pos.y;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function stopDrawing(e) {
    if (!isDrawing) return;
    isDrawing = false;
    ctx.closePath();
    avaliarJogada();
}

function avaliarJogada() {
    const distancia = Math.hypot(posFinalX - posAtualX, posFinalY - posAtualY);
    if (distancia < 70) {
        jogoAtivo = false; certos++; somAcerto.play();
        const endImg = document.getElementById('img-end');
        endImg.style.opacity = "1";
        endImg.classList.add('animating');
        document.getElementById('area-desenho').style.borderColor = "#8cc63f";
        setTimeout(() => { rondaAtual++; jogoAtivo = true; proximaRonda(); }, 1500);
    } else {
        erros++; somErro.play();
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        desenharGuia(itemDestaque.tipo); 
        Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    }
}

function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++; somClique.play();
    const endImg = document.getElementById('img-end');
    endImg.classList.add('animating');
    setTimeout(() => { endImg.classList.remove('animating'); }, 2000);
}

function finalizarJogo() {
    jogoAtivo = false;
    if(audioInstrucoes) audioInstrucoes.pause();
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, ajudasUsadas, rel);
}
