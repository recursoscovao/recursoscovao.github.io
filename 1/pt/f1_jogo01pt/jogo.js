// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0;
let itemDestaque = null;
let audioInstrucoes = null;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// Variáveis para o Canvas (Grafismos)
let canvas, ctx;
let isDrawing = false;
let posFinalX = 0; 
let posFinalY = 0;

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .btn-play-rect { 
        flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); 
        color: white; border: none; font-size: 1.5rem; font-weight: 900; 
        text-transform: uppercase; cursor: pointer; display: flex; 
        align-items: center; justify-content: center; gap: 15px; 
        box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: 0.2s;
    }
    .btn-audio-circle { width: 65px; height: 65px; cursor: pointer; flex-shrink: 0; }

    /* Estilos específicos para o jogo de grafismos */
    .grafismo-area {
        position: relative;
        width: 100%;
        max-width: 800px;
        height: 300px;
        background: #fdfdfd;
        border: 4px dashed #e0e0e0;
        border-radius: 30px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        overflow: hidden;
    }

    .graf-img {
        width: 90px;
        height: 90px;
        object-fit: contain;
        z-index: 10;
        pointer-events: none; /* Para não interferir no canvas */
        filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.1));
    }

    .graf-img.animating {
        animation: pulse 1s infinite alternate;
    }

    @keyframes pulse {
        from { transform: scale(1); }
        to { transform: scale(1.1); }
    }

    canvas {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
        cursor: crosshair;
        touch-action: none; /* Previne scroll no telemóvel ao desenhar */
    }

    @media screen and (max-width: 500px) {
        .grafismo-area { height: 220px; padding: 0 10px; }
        .graf-img { width: 65px; height: 65px; }
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
            <div style="font-size: 5rem; color: var(--primary-color); margin-bottom: 20px;"><i class="fas fa-pencil-alt"></i></div>
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
    totalRondas = DADOS_JOGO.itens.length; // 10 rondas
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    const area = document.getElementById('game-content');
    itemDestaque = DADOS_JOGO.itens[rondaAtual - 1]; // Pega no nível atual em ordem
    
    area.innerHTML = `
        <div class="grafismo-area" id="area-desenho">
            <img src="${DADOS_JOGO.caminhoImagens + itemDestaque.imgA}" class="graf-img" id="img-start">
            <canvas id="linhaCanvas"></canvas>
            <img src="${DADOS_JOGO.caminhoImagens + itemDestaque.imgB}" class="graf-img" id="img-end" style="opacity: 0.5;">
        </div>
    `;

    setTimeout(configurarCanvas, 100); // Dá tempo ao DOM para renderizar e ler tamanhos
}

function configurarCanvas() {
    const container = document.getElementById('area-desenho');
    canvas = document.getElementById('linhaCanvas');
    ctx = canvas.getContext('2d');

    // Ajustar tamanho do canvas ao container
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Desenhar a linha guia (tracejada) de fundo
    desenharGuia(itemDestaque.tipo);

    // Eventos de Rato
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Eventos de Toque (Mobile/Tablet)
    canvas.addEventListener('touchstart', startDrawing, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDrawing);
}

function desenharGuia(tipo) {
    const startImg = document.getElementById('img-start');
    const endImg = document.getElementById('img-end');
    
    // Ponto de início (meio da imagem 1)
    const startX = startImg.offsetLeft + (startImg.offsetWidth / 2);
    const startY = canvas.height / 2;
    
    // Ponto de destino (meio da imagem 2)
    posFinalX = endImg.offsetLeft + (endImg.offsetWidth / 2);
    posFinalY = canvas.height / 2;

    ctx.beginPath();
    ctx.setLineDash([15, 15]); // Linha tracejada
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#d0d0d0";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.moveTo(startX, startY);

    // Matemáticas simples para desenhar os caminhos
    const widthDist = posFinalX - startX;

    if (tipo === "reta") {
        ctx.lineTo(posFinalX, posFinalY);
    } 
    else if (tipo === "curva") {
        // Faz uma curva tipo ponte
        ctx.quadraticCurveTo(startX + (widthDist / 2), 10, posFinalX, posFinalY);
    } 
    else if (tipo === "ziguezague") {
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
    ctx.setLineDash([]); // Reset ao tracejado para a criança desenhar linha sólida
}

// Lógica de Desenho Livre
function getClientOffset(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
    }
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

let posAtualX = 0; let posAtualY = 0;

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
    // Verifica a que distância a criança largou o dedo do ponto final
    const distancia = Math.hypot(posFinalX - posAtualX, posFinalY - posAtualY);
    
    // Se largou a menos de 70px do centro da imagem de destino (sucesso)
    if (distancia < 70) {
        jogoAtivo = false;
        certos++;
        somAcerto.play();
        
        // Animação de sucesso na imagem de destino
        const endImg = document.getElementById('img-end');
        endImg.style.opacity = "1";
        endImg.classList.add('animating');

        // Fazer brilhar o canvas de verde
        document.getElementById('area-desenho').style.borderColor = "#8cc63f";

        setTimeout(() => {
            rondaAtual++;
            jogoAtivo = true;
            proximaRonda();
        }, 1500);
    } else {
        // Se largou a meio do caminho, conta erro e apaga a linha para tentar de novo
        erros++;
        somErro.play();
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        desenharGuia(itemDestaque.tipo); // Redesenha a guia
        Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    }
}

function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++;
    somClique.play();
    
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
