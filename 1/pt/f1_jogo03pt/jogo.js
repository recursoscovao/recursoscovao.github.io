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

let canvas, ctx, corTemaAtual = "#5EA2E6"; 
let isDrawing = false;
let ajudaEmCurso = false; 
let posAtualX = 0, posAtualY = 0;

let tracosLetra = []; 
let tracoAtualIndex = 0; 
let saiuDoCaminho = false;
let simuTimer = null; 
let sequenciaNiveis = [];

// ==========================================
// 2. DICIONÁRIO ALFABETO MANUSCRIPT CORRIGIDO
// L = Linha reta (x1, y1, x2, y2)
// A = Arco (centroX, centroY, raio, angulo_inicio, angulo_fim, sentido_inverso)
// ==========================================
const ALFABETO_VETORES = {
    'A': [ [["L", 0.5, 0.2, 0.2, 0.8]], [["L", 0.5, 0.2, 0.8, 0.8]], [["L", 0.35, 0.5, 0.65, 0.5]] ],
    'B': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["A", 0.3, 0.35, 0.15, 270, 90, false]], [["A", 0.3, 0.65, 0.15, 270, 90, false]] ],
    'C': [ [["A", 0.55, 0.5, 0.3, 330, 45, true]] ],
    'D': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["A", 0.3, 0.5, 0.3, 270, 90, false]] ],
    'E': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["L", 0.3, 0.2, 0.7, 0.2]], [["L", 0.3, 0.5, 0.6, 0.5]], [["L", 0.3, 0.8, 0.7, 0.8]] ],
    'F': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["L", 0.3, 0.2, 0.7, 0.2]], [["L", 0.3, 0.5, 0.6, 0.5]] ],
    'G': [ [["A", 0.55, 0.5, 0.3, 330, 0, true], ["L", 0.85, 0.5, 0.6, 0.5]] ],
    'H': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["L", 0.7, 0.2, 0.7, 0.8]], [["L", 0.3, 0.5, 0.7, 0.5]] ],
    'I': [ [["L", 0.5, 0.2, 0.5, 0.8]] ],
    'J': [ [["L", 0.65, 0.2, 0.65, 0.65], ["A", 0.5, 0.65, 0.15, 0, 180, false]] ],
    'K': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["L", 0.7, 0.2, 0.3, 0.5]], [["L", 0.3, 0.5, 0.7, 0.8]] ],
    'L': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["L", 0.3, 0.8, 0.7, 0.8]] ],
    'M': [ [["L", 0.2, 0.8, 0.2, 0.2]], [["L", 0.2, 0.2, 0.5, 0.5]], [["L", 0.5, 0.5, 0.8, 0.2]], [["L", 0.8, 0.2, 0.8, 0.8]] ],
    'N': [ [["L", 0.2, 0.8, 0.2, 0.2]], [["L", 0.2, 0.2, 0.8, 0.8]], [["L", 0.8, 0.8, 0.8, 0.2]] ],
    'O': [ [["A", 0.5, 0.5, 0.3, 270, 280, true]] ],
    'P': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["A", 0.3, 0.35, 0.15, 270, 90, false]] ],
    'Q': [ [["A", 0.5, 0.5, 0.3, 270, 280, true]], [["L", 0.5, 0.5, 0.8, 0.8]] ],
    'R': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["A", 0.3, 0.35, 0.15, 270, 90, false]], [["L", 0.45, 0.5, 0.7, 0.8]] ],
    'S': [ [["A", 0.5, 0.35, 0.15, 330, 90, true], ["A", 0.5, 0.65, 0.15, 270, 150, false]] ],
    'T': [ [["L", 0.5, 0.2, 0.5, 0.8]], [["L", 0.2, 0.2, 0.8, 0.2]] ],
    'U': [ [["L", 0.3, 0.2, 0.3, 0.65], ["A", 0.5, 0.65, 0.2, 180, 0, true], ["L", 0.7, 0.65, 0.7, 0.2]] ],
    'V': [ [["L", 0.2, 0.2, 0.5, 0.8]], [["L", 0.5, 0.8, 0.8, 0.2]] ],
    'W': [ [["L", 0.1, 0.2, 0.3, 0.8]], [["L", 0.3, 0.8, 0.5, 0.4]], [["L", 0.5, 0.4, 0.7, 0.8]], [["L", 0.7, 0.8, 0.9, 0.2]] ],
    'X': [ [["L", 0.2, 0.2, 0.8, 0.8]], [["L", 0.8, 0.2, 0.2, 0.8]] ],
    'Y': [ [["L", 0.2, 0.2, 0.5, 0.5]], [["L", 0.8, 0.2, 0.5, 0.5]], [["L", 0.5, 0.5, 0.5, 0.8]] ],
    'Z': [ [["L", 0.2, 0.2, 0.8, 0.2]], [["L", 0.8, 0.2, 0.2, 0.8]], [["L", 0.2, 0.8, 0.8, 0.8]] ]
};

// ==========================================
// 3. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .btn-play-rect { flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); color: white; border: none; font-size: 1.5rem; font-weight: 900; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: 0.2s; z-index: 100; }
    .btn-audio-circle { width: 65px; height: 65px; cursor: pointer; flex-shrink: 0; z-index: 100; }

    .grafismo-area {
        position: relative; width: 100%; max-width: 500px; height: 350px;
        background: #fffdf5; border: 4px solid #e0e0e0; border-radius: 20px;
        margin: 0 auto; display: flex; justify-content: center; align-items: center;
        overflow: hidden; box-shadow: inset 0 0 20px rgba(0,0,0,0.02);
    }

    .ponto-inicio, .ponto-fim {
        position: absolute; width: 36px; height: 36px; border-radius: 50%; 
        border: 5px solid #fff; z-index: 10; 
        transform: translate(-50%, -50%); transition: opacity 0.2s ease;
    }
    .ponto-inicio { background: var(--primary-color); box-shadow: 0 0 0 3px var(--primary-color), 0 4px 10px rgba(0,0,0,0.3); }
    .ponto-fim { background: #8cc63f; box-shadow: 0 0 0 3px #8cc63f, 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; }

    .animating { animation: pulse 1s infinite alternate; }
    @keyframes pulse { from { transform: translate(-50%, -50%) scale(1); } to { transform: translate(-50%, -50%) scale(1.15); } }

    .letra-sucesso { animation: popSuccess 0.8s ease forwards; }
    @keyframes popSuccess { 
        0% { transform: scale(1); } 
        50% { transform: scale(1.10); filter: drop-shadow(0 0 15px var(--primary-color)); } 
        100% { transform: scale(1); } 
    }

    canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 5; cursor: pointer; touch-action: none; }
    canvas:active { cursor: grabbing; }
`;
document.head.appendChild(style);

function lerCorDoTema() {
    let cor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    if (cor) corTemaAtual = cor;
}

// ==========================================
// 4. LÓGICA DE CAPA (TUTORIAL DA LETRA A)
// ==========================================
function tocarAudioInstrucoes() {
    somClique.currentTime = 0; somClique.play().catch(e=>console.log(e));
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioInstrucoes) { audioInstrucoes.pause(); audioInstrucoes.currentTime = 0; }
    else { audioInstrucoes = new Audio(JOGO_CONFIG.caminhoSons + DADOS_JOGO.somInstrucoes); }
    audioInstrucoes.play().catch(() => {
        const utter = new SpeechSynthesisUtterance("Começa na bola azul e arrasta o dedo até chegares à bola verde!");
        utter.lang = 'pt-PT'; window.speechSynthesis.speak(utter);
    });
}

function mostrarCapa() {
    if (jogoAtivo) return;
    lerCorDoTema(); 
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">Traça as Letras</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width: 100%;">
            <div class="grafismo-area" id="simu-area" style="transform: scale(0.8); height: 280px; border-color: var(--primary-color); margin-bottom: -10px;">
                <div class="ponto-inicio" id="simu-inicio" style="display:none;"></div>
                <div class="ponto-fim" id="simu-fim" style="display:none;"><i class="fas fa-star" style="font-size:12px;"></i></div>
                <canvas id="simu-canvas"></canvas>
                <div id="simu-hand" style="position:absolute; font-size:3rem; z-index:100; pointer-events:none; filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.3)); transition: opacity 0.3s;">👆</div>
            </div>
            <p style="color:var(--text-grey); font-weight:800; text-align:center; font-size:1.1rem; max-width: 500px; padding: 0 15px;">
                Vai da bola azul até à bola verde!
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

// DESENHA PAUTAS PERFEITAMENTE PROPORCIONAIS
function desenharPautas(context, w, h) {
    let size = Math.min(w, h);
    let offsetY = (h - size) / 2;

    let yTop = offsetY + 0.2 * size;
    let yBot = offsetY + 0.8 * size;
    let yMid = offsetY + 0.5 * size;

    context.beginPath();
    context.lineWidth = 3; context.strokeStyle = "#b3d4ff"; 
    context.moveTo(w*0.05, yTop); context.lineTo(w*0.95, yTop); 
    context.moveTo(w*0.05, yBot); context.lineTo(w*0.95, yBot); 
    context.stroke();
    
    context.beginPath();
    context.lineWidth = 2; context.strokeStyle = "#d1e5ff";
    context.setLineDash([15, 10]);
    context.moveTo(w*0.05, yMid); context.lineTo(w*0.95, yMid); 
    context.stroke();
    context.setLineDash([]);
}

function iniciarSimulacaoAnimada() {
    const sCanvas = document.getElementById('simu-canvas');
    if(!sCanvas) return;
    const sCtx = sCanvas.getContext('2d');
    const sArea = document.getElementById('simu-area');
    
    sCanvas.width = sArea.clientWidth; sCanvas.height = sArea.clientHeight;
    
    const paths = gerarLetraTracos('A', sCanvas.width, sCanvas.height);
    const hand = document.getElementById('simu-hand');
    const sStart = document.getElementById('simu-inicio');
    const sEnd = document.getElementById('simu-fim');
    
    let currentS = 0; let step = 0;

    function animar() {
        if (!document.getElementById('simu-canvas')) return; 
        
        if (step === 0 && currentS === 0) {
            sCtx.clearRect(0,0, sCanvas.width, sCanvas.height);
            desenharPautas(sCtx, sCanvas.width, sCanvas.height);
            
            paths.forEach(stroke => {
                sCtx.beginPath(); sCtx.setLineDash([12, 12]); sCtx.lineWidth = 14; sCtx.strokeStyle = "#e0e0e0"; sCtx.lineCap = "round"; sCtx.lineJoin = "round";
                sCtx.moveTo(stroke[0].x, stroke[0].y);
                stroke.forEach(p => sCtx.lineTo(p.x, p.y));
                sCtx.stroke(); sCtx.setLineDash([]);
            });
        }

        if (currentS < paths.length) {
            const traco = paths[currentS];
            
            if (step === 0) {
                sStart.style.display = 'flex'; sStart.style.left = traco[0].x + "px"; sStart.style.top = traco[0].y + "px";
                sEnd.style.display = 'flex'; sEnd.style.left = traco[traco.length-1].x + "px"; sEnd.style.top = traco[traco.length-1].y + "px";
                
                sCtx.beginPath(); sCtx.lineWidth = 18; sCtx.strokeStyle = corTemaAtual; sCtx.lineCap = "round"; sCtx.lineJoin = "round";
                sCtx.moveTo(traco[0].x, traco[0].y);
                hand.style.opacity = 1; hand.innerText = "👆";
            }

            if (step < traco.length) {
                const pt = traco[step];
                hand.style.left = (pt.x - 22) + "px"; hand.style.top = (pt.y - 5) + "px"; 
                if(step > 5) hand.innerText = "✊"; 
                
                sCtx.lineTo(pt.x, pt.y); sCtx.stroke();
                step += 3; 
                simuTimer = setTimeout(animar, 15); 
            } else {
                hand.innerText = "👆";
                step = 0; currentS++;
                simuTimer = setTimeout(animar, 400); 
            }
        } else {
            hand.style.opacity = 0; currentS = 0; step = 0;
            sStart.style.display = 'none'; sEnd.style.display = 'none';
            simuTimer = setTimeout(animar, 1500); 
        }
    }
    animar();
}

// ==========================================
// 5. LÓGICA DE JOGO PRINCIPAL
// ==========================================
function iniciarJogo() {
    clearTimeout(simuTimer); 
    lerCorDoTema(); 
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0; 
    totalRondas = 10; 
    ajudaEmCurso = false;
    
    const todasLetras = Object.keys(ALFABETO_VETORES);
    sequenciaNiveis = [];
    todasLetras.sort(() => Math.random() - 0.5); 
    for(let i=0; i<10; i++) sequenciaNiveis.push({ letra: todasLetras[i] });

    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    
    ajudaEmCurso = false;
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    const area = document.getElementById('game-content');
    itemDestaque = sequenciaNiveis[rondaAtual - 1]; 
    
    area.innerHTML = `
        <h3 style="color: var(--text-grey); margin-bottom: 10px; font-weight: 900; text-transform: uppercase;">Letra ${itemDestaque.letra}</h3>
        <div class="grafismo-area" id="area-desenho">
            <div class="ponto-inicio animating" id="ponto-inicio"></div>
            <div class="ponto-fim animating" id="ponto-fim"><i class="fas fa-star" style="font-size:12px;"></i></div>
            <canvas id="linhaCanvas"></canvas>
            <div id="game-hand" style="position:absolute; font-size:3rem; z-index:100; pointer-events:none; opacity:0; filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.3)); transition: opacity 0.3s;">👆</div>
        </div>
    `;
    setTimeout(configurarCanvas, 100); 
}

function configurarCanvas() {
    const container = document.getElementById('area-desenho');
    canvas = document.getElementById('linhaCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = container.clientWidth; canvas.height = container.clientHeight;

    tracosLetra = gerarLetraTracos(itemDestaque.letra, canvas.width, canvas.height);
    tracoAtualIndex = 0;
    
    atualizarPontos();
    desenharGuiasJogo();

    canvas.addEventListener('mousedown', startDrawing); canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing); canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDrawing);
}

function atualizarPontos() {
    const startDot = document.getElementById('ponto-inicio');
    const endDot = document.getElementById('ponto-fim');

    if (tracoAtualIndex < tracosLetra.length) {
        const traco = tracosLetra[tracoAtualIndex];
        const ptInicio = traco[0];
        const ptFim = traco[traco.length - 1];

        startDot.style.display = 'flex';
        startDot.style.left = ptInicio.x + "px"; startDot.style.top = ptInicio.y + "px";
        startDot.style.opacity = '1';

        endDot.style.display = 'flex';
        endDot.style.left = ptFim.x + "px"; endDot.style.top = ptFim.y + "px";
        endDot.style.opacity = '1';
    } else {
        startDot.style.display = 'none'; endDot.style.display = 'none'; 
    }
}

// ==========================================
// MOTOR MATEMÁTICO COM PROPORÇÃO QUADRADA
// ==========================================
function gerarLetraTracos(letra, w, h) {
    const strokes = ALFABETO_VETORES[letra];
    let todosTracos = [];
    const steps = 80; 

    // Garante que a letra é perfeitamente proporcional (não estica)
    let size = Math.min(w, h);
    let offsetX = (w - size) / 2;
    let offsetY = (h - size) / 2;

    strokes.forEach(strokeCmds => {
        let pts = [];
        
        strokeCmds.forEach(cmd => {
            let tipo = cmd[0];
            
            if (tipo === "L") {
                let [_, x1, y1, x2, y2] = cmd;
                for(let i=0; i<=steps; i++){
                    pts.push({ 
                        x: offsetX + (x1 + (x2-x1)*(i/steps)) * size, 
                        y: offsetY + (y1 + (y2-y1)*(i/steps)) * size, 
                        hit: false 
                    });
                }
            } 
            else if (tipo === "A") {
                let [_, cx, cy, r, a1, a2, anti] = cmd;
                let rad1 = a1 * Math.PI/180; 
                let rad2 = a2 * Math.PI/180;
                
                if (anti) {
                    while (rad2 >= rad1) rad2 -= Math.PI * 2;
                } else {
                    while (rad2 <= rad1) rad2 += Math.PI * 2;
                }

                for(let i=0; i<=steps; i++){
                    let ang = rad1 + (rad2-rad1)*(i/steps);
                    pts.push({ 
                        x: offsetX + (cx + Math.cos(ang)*r) * size, 
                        y: offsetY + (cy + Math.sin(ang)*r) * size, 
                        hit: false 
                    });
                }
            }
        });
        todosTracos.push(pts);
    });

    return todosTracos;
}

function desenharGuiasJogo(mostrarConcluido = false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharPautas(ctx, canvas.width, canvas.height);
    
    // Fundo branco grosso (destaque)
    tracosLetra.forEach(traco => {
        ctx.beginPath(); ctx.lineWidth = 44; ctx.strokeStyle = "#ffffff"; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.moveTo(traco[0].x, traco[0].y); traco.forEach(pt => ctx.lineTo(pt.x, pt.y)); ctx.stroke();
    });

    tracosLetra.forEach((traco, index) => {
        ctx.beginPath(); ctx.lineCap = "round"; ctx.lineJoin = "round";
        
        if (mostrarConcluido || index < tracoAtualIndex) {
            // TRAÇOS JÁ CONCLUÍDOS (Cor Principal Sólida e Visível!)
            ctx.lineWidth = 18; ctx.strokeStyle = corTemaAtual; ctx.setLineDash([]);
            ctx.moveTo(traco[0].x, traco[0].y); traco.forEach(pt => ctx.lineTo(pt.x, pt.y)); ctx.stroke();
        } 
        else if (index === tracoAtualIndex) {
            // TRAÇO ATUAL (Tracejado)
            ctx.lineWidth = 14; ctx.strokeStyle = "#a0a0a0"; ctx.setLineDash([15, 15]);
            ctx.moveTo(traco[0].x, traco[0].y); traco.forEach(pt => ctx.lineTo(pt.x, pt.y)); ctx.stroke();
            ctx.setLineDash([]);
        } 
        else {
            // TRAÇOS FUTUROS (Mais claros)
            ctx.lineWidth = 14; ctx.strokeStyle = "#e5e5e5"; ctx.setLineDash([15, 15]);
            ctx.moveTo(traco[0].x, traco[0].y); traco.forEach(pt => ctx.lineTo(pt.x, pt.y)); ctx.stroke();
            ctx.setLineDash([]);
        }
    });
}

function getClientOffset(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function startDrawing(e) {
    if (!jogoAtivo || ajudaEmCurso || tracoAtualIndex >= tracosLetra.length) return; 
    e.preventDefault();
    
    const pos = getClientOffset(e);
    const startPt = tracosLetra[tracoAtualIndex][0];
    
    if (Math.hypot(pos.x - startPt.x, pos.y - startPt.y) > 60) return; 

    isDrawing = true; saiuDoCaminho = false;
    tracosLetra[tracoAtualIndex].forEach(p => p.hit = false); 
    posAtualX = pos.x; posAtualY = pos.y;
    
    document.getElementById('ponto-inicio').style.opacity = '0.2';
    document.getElementById('ponto-fim').style.opacity = '0.5';
    
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 18; ctx.strokeStyle = corTemaAtual; ctx.lineCap = "round"; ctx.lineJoin = "round";
}

function draw(e) {
    if (!isDrawing || !jogoAtivo || ajudaEmCurso) return;
    e.preventDefault();
    const pos = getClientOffset(e);
    
    let dist = Math.hypot(pos.x - posAtualX, pos.y - posAtualY);
    let steps = Math.max(1, Math.floor(dist / 5)); 
    let trajetoAtual = tracosLetra[tracoAtualIndex];
    
    for(let s = 1; s <= steps; s++) {
        let chkX = posAtualX + (pos.x - posAtualX)*(s/steps); 
        let chkY = posAtualY + (pos.y - posAtualY)*(s/steps);
        
        let minDist = Infinity; let closestIdx = -1;
        for(let i=0; i<trajetoAtual.length; i++) {
            let d = Math.hypot(chkX - trajetoAtual[i].x, chkY - trajetoAtual[i].y);
            if(d < minDist) { minDist = d; closestIdx = i; }
        }
        
        if (minDist > 65) saiuDoCaminho = true; 
        else if (closestIdx !== -1) trajetoAtual[closestIdx].hit = true; 
    }
    posAtualX = pos.x; posAtualY = pos.y;
    ctx.lineTo(pos.x, pos.y); ctx.stroke();
}

function stopDrawing(e) {
    if (!isDrawing || ajudaEmCurso) return;
    isDrawing = false;
    ctx.closePath();
    document.getElementById('ponto-inicio').style.opacity = '1';
    document.getElementById('ponto-fim').style.opacity = '1';
    avaliarJogada();
}

function avaliarJogada() {
    let trajetoAtual = tracosLetra[tracoAtualIndex];
    let ultimoPonto = trajetoAtual[trajetoAtual.length - 1];
    
    let distanciaFim = Math.hypot(ultimoPonto.x - posAtualX, ultimoPonto.y - posAtualY);
    let pontosAtingidos = trajetoAtual.filter(p => p.hit).length;
    let accuracia = pontosAtingidos / trajetoAtual.length;
    
    if (distanciaFim < 70 && accuracia >= 0.45 && !saiuDoCaminho) {
        tracoAtualIndex++; 
        somClique.currentTime = 0; somClique.play().catch(e=>console.log(e));
        
        if (tracoAtualIndex >= tracosLetra.length) {
            jogoAtivo = false; certos++; 
            somAcerto.currentTime = 0; somAcerto.play().catch(e=>console.log(e));
            
            atualizarPontos(); 
            desenharGuiasJogo(true); 
            
            const area = document.getElementById('area-desenho');
            area.classList.add('letra-sucesso'); 
            
            setTimeout(() => { 
                area.classList.remove('letra-sucesso');
                rondaAtual++; jogoAtivo = true; proximaRonda(); 
            }, 1800);
        } else {
            atualizarPontos(); 
            desenharGuiasJogo(); 
        }
    } else {
        erros++; 
        somErro.currentTime = 0; somErro.play().catch(e=>console.log(e));
        trajetoAtual.forEach(p => p.hit = false); 
        desenharGuiasJogo(); 
        Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    }
}

function darAjuda() {
    if (!jogoAtivo || ajudaEmCurso || tracoAtualIndex >= tracosLetra.length) return;
    ajudasUsadas++; 
    somClique.currentTime = 0; somClique.play().catch(e=>console.log(e));
    
    ajudaEmCurso = true; isDrawing = false; 
    document.getElementById('ponto-inicio').style.opacity = '0';
    document.getElementById('ponto-fim').style.opacity = '0';
    
    desenharGuiasJogo();
    
    const hand = document.getElementById('game-hand');
    hand.style.opacity = 1; hand.innerText = "👆";
    
    let trajetoAtual = tracosLetra[tracoAtualIndex];
    let step = 0;
    
    function animarAjuda() {
        if (!jogoAtivo || !document.getElementById('game-hand')) {
            ajudaEmCurso = false; return;
        }
        
        if (step === 0) {
            ctx.beginPath(); ctx.lineWidth = 18; ctx.strokeStyle = corTemaAtual; ctx.lineCap = "round"; ctx.lineJoin = "round";
            ctx.moveTo(trajetoAtual[0].x, trajetoAtual[0].y);
        }

        if (step < trajetoAtual.length) {
            const pt = trajetoAtual[step];
            hand.style.left = (pt.x - 22) + "px"; hand.style.top = (pt.y - 5) + "px";
            if(step > 10) hand.innerText = "✊"; 
            
            ctx.lineTo(pt.x, pt.y); ctx.stroke();
            step += 4; 
            
            if (step >= trajetoAtual.length) step = trajetoAtual.length - 1; 
            if (step < trajetoAtual.length - 1) {
                setTimeout(animarAjuda, 10); 
            } else {
                const lastPt = trajetoAtual[trajetoAtual.length - 1];
                hand.style.left = (lastPt.x - 22) + "px"; hand.style.top = (lastPt.y - 5) + "px";
                ctx.lineTo(lastPt.x, lastPt.y); ctx.stroke();
                
                setTimeout(() => {
                    hand.style.opacity = 0;
                    document.getElementById('ponto-inicio').style.opacity = '1';
                    document.getElementById('ponto-fim').style.opacity = '1';
                    desenharGuiasJogo(); 
                    ajudaEmCurso = false; 
                }, 800);
            }
        }
    }
    animarAjuda();
}

function finalizarJogo() {
    jogoAtivo = false;
    if(audioInstrucoes) audioInstrucoes.pause();
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, ajudasUsadas, rel);
}
