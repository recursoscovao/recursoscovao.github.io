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
        padding: 0 40px; overflow: hidden;
    }

    /* BOLA DE INÍCIO */
    .ponto-inicio {
        width: 35px; height: 35px; 
        border-radius: 50%; 
        background: var(--primary-color); 
        border: 4px solid #fff; 
        box-shadow: 0 0 0 5px var(--primary-color), 0 4px 10px rgba(0,0,0,0.2); 
        z-index: 10;
    }

    /* SETA DE DESTINO */
    .ponto-fim {
        font-size: 3.5rem; 
        color: #d0d0d0; /* Fica verde quando ganha */
        z-index: 10;
        transition: 0.3s;
    }

    .animating { animation: pulse 1s infinite alternate; }
    @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.3); } }

    canvas { position: absolute; top: 0; left: 0; z-index: 5; cursor: crosshair; touch-action: none; }

    @media screen and (max-width: 500px) {
        .grafismo-area { height: 220px; padding: 0 20px; }
        .ponto-inicio { width: 25px; height: 25px; }
        .ponto-fim { font-size: 2.5rem; }
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
        const utter = new SpeechSynthesisUtterance("Começa na bola e arrasta o dedo pela linha até à seta.");
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
                Começa na bola colorida e segue a linha até à seta sem largar o dedo!
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
    
    // Pega as definições do nível atual (se é reta, curva, etc)
    itemDestaque = DADOS_JOGO.itens[rondaAtual - 1]; 
    
    area.innerHTML = `
        <div class="grafismo-area" id="area-desenho">
            <div class="ponto-inicio" id="ponto-inicio"></div>
            <canvas id="linhaCanvas"></canvas>
            <div class="ponto-fim" id="ponto-fim"><i class="fas fa-arrow-right"></i></div>
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
    const startEl = document.getElementById('ponto-inicio');
    const endEl = document.getElementById('ponto-fim');
    
    // Calcula o meio da bola de início
    const startX = startEl.offsetLeft + (startEl.offsetWidth / 2);
    const startY = canvas.height / 2;
    
    // Calcula o meio da seta de fim
    posFinalX = endEl.offsetLeft + (endEl.offsetWidth / 2);
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
    ctx.setLineDash([]); // Limpa o tracejado para o risco que a criança vai fazer
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
    ctx.lineWidth = 14; // Grossura do traço da criança
    ctx.strokeStyle = "var(--primary-color)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
}

function draw(e) {
    if (!isDrawing || !jogoAtivo) return;
    e.preventDefault();
    const pos = getClientOffset(e);
    posAtualX = pos.x; 
    posAtualY = pos.y;
    
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
    // Calcula se a criança largou o dedo perto da seta (tolerância de 70px)
    const distancia = Math.hypot(posFinalX - posAtualX, posFinalY - posAtualY);
    
    if (distancia < 70) {
        jogoAtivo = false; 
        certos++; 
        somAcerto.play();
        
        // Pinta a seta de verde e faz a animação
        const endEl = document.getElementById('ponto-fim');
        endEl.style.color = "#8cc63f";
        endEl.classList.add('animating');
        
        // Coloca a borda da caixa verde
        document.getElementById('area-desenho').style.borderColor = "#8cc63f";
        
        setTimeout(() => { rondaAtual++; jogoAtivo = true; proximaRonda(); }, 1500);
    } else {
        erros++; 
        somErro.play();
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Apaga o traço que a criança fez
        desenharGuia(itemDestaque.tipo); // Redesenha a linha tracejada
        Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    }
}

function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++; 
    somClique.play();
    
    // Faz a seta piscar e aumentar
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
