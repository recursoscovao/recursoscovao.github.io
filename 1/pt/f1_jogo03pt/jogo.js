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
let ajudaEmCurso = false; 
let posAtualX = 0, posAtualY = 0;

let tracosLetra = []; // Array de traços. Cada traço é um array de pontos
let tracoAtualIndex = 0; // Qual traço a criança está a desenhar agora
let saiuDoCaminho = false;
let simuTimer = null; 
let sequenciaNiveis = [];

// ==========================================
// 2. DICIONÁRIO DO ALFABETO (VETORES)
// L = Linha (x1, y1, x2, y2)
// A = Arco (cx, cy, raio, angulo_inicio, angulo_fim, sentido_inverso)
// ==========================================
const ALFABETO_VETORES = {
    'A': [["L", 0.5, 0.1, 0.2, 0.9], ["L", 0.5, 0.1, 0.8, 0.9], ["L", 0.35, 0.6, 0.65, 0.6]],
    'B': [["L", 0.3, 0.1, 0.3, 0.9], ["A", 0.3, 0.3, 0.2, 270, 90, false], ["A", 0.3, 0.7, 0.2, 270, 90, false]],
    'C': [["A", 0.6, 0.5, 0.4, 300, 60, true]], // true = anti-horário (desenha para a esquerda)
    'D': [["L", 0.3, 0.1, 0.3, 0.9], ["A", 0.3, 0.5, 0.4, 270, 90, false]],
    'E': [["L", 0.3, 0.1, 0.3, 0.9], ["L", 0.3, 0.1, 0.7, 0.1], ["L", 0.3, 0.5, 0.6, 0.5], ["L", 0.3, 0.9, 0.7, 0.9]],
    'F': [["L", 0.3, 0.1, 0.3, 0.9], ["L", 0.3, 0.1, 0.7, 0.1], ["L", 0.3, 0.5, 0.6, 0.5]],
    'G': [["A", 0.6, 0.5, 0.4, 300, 45, true], ["L", 0.9, 0.78, 0.9, 0.5], ["L", 0.9, 0.5, 0.6, 0.5]],
    'H': [["L", 0.3, 0.1, 0.3, 0.9], ["L", 0.7, 0.1, 0.7, 0.9], ["L", 0.3, 0.5, 0.7, 0.5]],
    'I': [["L", 0.5, 0.1, 0.5, 0.9]],
    'J': [["L", 0.7, 0.1, 0.7, 0.7], ["A", 0.5, 0.7, 0.2, 0, 180, false]],
    'K': [["L", 0.3, 0.1, 0.3, 0.9], ["L", 0.7, 0.1, 0.3, 0.5], ["L", 0.3, 0.5, 0.7, 0.9]],
    'L': [["L", 0.3, 0.1, 0.3, 0.9], ["L", 0.3, 0.9, 0.7, 0.9]],
    'M': [["L", 0.2, 0.9, 0.2, 0.1], ["L", 0.2, 0.1, 0.5, 0.5], ["L", 0.5, 0.5, 0.8, 0.1], ["L", 0.8, 0.1, 0.8, 0.9]],
    'N': [["L", 0.2, 0.9, 0.2, 0.1], ["L", 0.2, 0.1, 0.8, 0.9], ["L", 0.8, 0.9, 0.8, 0.1]],
    'O': [["A", 0.5, 0.5, 0.4, 270, 269, true]], // Círculo completo (quase 360)
    'P': [["L", 0.3, 0.1, 0.3, 0.9], ["A", 0.3, 0.3, 0.2, 270, 90, false]],
    'Q': [["A", 0.5, 0.5, 0.4, 270, 269, true], ["L", 0.6, 0.6, 0.9, 0.9]],
    'R': [["L", 0.3, 0.1, 0.3, 0.9], ["A", 0.3, 0.3, 0.2, 270, 90, false], ["L", 0.4, 0.5, 0.7, 0.9]],
    'S': [["A", 0.5, 0.3, 0.2, 60, 270, true], ["A", 0.5, 0.7, 0.2, 270, 90, false]],
    'T': [["L", 0.2, 0.1, 0.8, 0.1], ["L", 0.5, 0.1, 0.5, 0.9]],
    'U': [["L", 0.2, 0.1, 0.2, 0.6], ["A", 0.5, 0.6, 0.3, 180, 0, true], ["L", 0.8, 0.6, 0.8, 0.1]],
    'V': [["L", 0.2, 0.1, 0.5, 0.9], ["L", 0.5, 0.9, 0.8, 0.1]],
    'W': [["L", 0.1, 0.1, 0.3, 0.9], ["L", 0.3, 0.9, 0.5, 0.5], ["L", 0.5, 0.5, 0.7, 0.9], ["L", 0.7, 0.9, 0.9, 0.1]],
    'X': [["L", 0.2, 0.1, 0.8, 0.9], ["L", 0.8, 0.1, 0.2, 0.9]],
    'Y': [["L", 0.2, 0.1, 0.5, 0.5], ["L", 0.8, 0.1, 0.5, 0.5], ["L", 0.5, 0.5, 0.5, 0.9]],
    'Z': [["L", 0.2, 0.1, 0.8, 0.1], ["L", 0.8, 0.1, 0.2, 0.9], ["L", 0.2, 0.9, 0.8, 0.9]]
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
        background: #fdfdfd; border: 4px dashed #e0e0e0; border-radius: 30px;
        margin: 0 auto; display: flex; justify-content: center; align-items: center;
        overflow: hidden;
    }

    .ponto-inicio {
        position: absolute; width: 30px; height: 30px; border-radius: 50%; 
        background: var(--primary-color); border: 4px solid #fff; 
        box-shadow: 0 0 0 4px var(--primary-color), 0 4px 10px rgba(0,0,0,0.2); 
        z-index: 10; transform: translate(-50%, -50%); transition: 0.3s ease;
    }

    .animating { animation: pulse 1s infinite alternate; }
    @keyframes pulse { from { transform: translate(-50%, -50%) scale(1); } to { transform: translate(-50%, -50%) scale(1.3); } }

    canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 5; cursor: pointer; touch-action: none; }
    canvas:active { cursor: grabbing; }
`;
document.head.appendChild(style);

// ==========================================
// 4. LÓGICA DE CAPA (TUTORIAL DA LETRA A)
// ==========================================
function tocarAudioInstrucoes() {
    somClique.currentTime = 0; somClique.play().catch(e=>console.log(e));
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioInstrucoes) { audioInstrucoes.pause(); audioInstrucoes.currentTime = 0; }
    else { audioInstrucoes = new Audio(JOGO_CONFIG.caminhoSons + DADOS_JOGO.somInstrucoes); }
    audioInstrucoes.play().catch(() => {
        const utter = new SpeechSynthesisUtterance("Começa na bolinha azul e desenha todas as partes da letra!");
        utter.lang = 'pt-PT'; window.speechSynthesis.speak(utter);
    });
}

function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">Traça as Letras</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width: 100%;">
            <div class="grafismo-area" id="simu-area" style="transform: scale(0.8); height: 280px; border-color: var(--primary-color); margin-bottom: -10px;">
                <div class="ponto-inicio" id="simu-inicio" style="display:none;"></div>
                <canvas id="simu-canvas"></canvas>
                <div id="simu-hand" style="position:absolute; font-size:3rem; z-index:100; pointer-events:none; filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.3)); transition: opacity 0.3s;">👆</div>
            </div>
            <p style="color:var(--text-grey); font-weight:800; text-align:center; font-size:1.1rem; max-width: 500px; padding: 0 15px;">
                Toca na bola azul e desenha as letras passo a passo!
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
    
    // Gera a letra "A" para o tutorial
    const paths = gerarLetraTracos('A', sCanvas.width, sCanvas.height);
    const hand = document.getElementById('simu-hand');
    
    function desenhaFundo(ctx) {
        paths.forEach(stroke => {
            ctx.beginPath(); ctx.setLineDash([12, 12]); ctx.lineWidth = 10; ctx.strokeStyle = "#e0e0e0"; ctx.lineCap = "round"; ctx.lineJoin = "round";
            ctx.moveTo(stroke[0].x, stroke[0].y);
            stroke.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.stroke(); ctx.setLineDash([]);
        });
    }

    let currentS = 0; let step = 0;

    function animar() {
        if (!document.getElementById('simu-canvas')) return; 
        
        if (step === 0 && currentS === 0) {
            sCtx.clearRect(0,0, sCanvas.width, sCanvas.height);
            desenhaFundo(sCtx);
        }

        if (currentS < paths.length) {
            const traco = paths[currentS];
            
            if (step === 0) {
                sCtx.beginPath(); sCtx.lineWidth = 14; sCtx.strokeStyle = "var(--primary-color)"; sCtx.lineCap = "round"; sCtx.lineJoin = "round";
                sCtx.moveTo(traco[0].x, traco[0].y);
                hand.style.opacity = 1; hand.innerText = "👆";
            }

            if (step < traco.length) {
                const pt = traco[step];
                hand.style.left = (pt.x - 22) + "px"; hand.style.top = (pt.y - 5) + "px"; 
                if(step > 5) hand.innerText = "✊"; 
                
                sCtx.lineTo(pt.x, pt.y); sCtx.stroke();
                step += 3; // Velocidade da mão
                simuTimer = setTimeout(animar, 15); 
            } else {
                hand.innerText = "👆";
                step = 0; currentS++;
                simuTimer = setTimeout(animar, 400); // Pausa entre traços
            }
        } else {
            hand.style.opacity = 0; currentS = 0; step = 0;
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
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0; 
    totalRondas = 10; 
    ajudaEmCurso = false;
    
    // Escolhe 10 letras aleatórias
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
    
    atualizarPontoInicio();
    desenharGuiasJogo();

    canvas.addEventListener('mousedown', startDrawing); canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing); canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDrawing);
}

function atualizarPontoInicio() {
    const dot = document.getElementById('ponto-inicio');
    if (tracoAtualIndex < tracosLetra.length) {
        dot.style.display = 'block';
        dot.style.left = tracosLetra[tracoAtualIndex][0].x + "px";
        dot.style.top = tracosLetra[tracoAtualIndex][0].y + "px";
    } else {
        dot.style.display = 'none'; // Letra concluída
    }
}

// ==========================================
// GERADOR DE TRAÇOS DE LETRAS
// ==========================================
function gerarLetraTracos(letra, w, h) {
    const comandos = ALFABETO_VETORES[letra];
    let todosTracos = [];
    const steps = 150; // Resolução dos traços

    comandos.forEach(cmd => {
        let tipo = cmd[0];
        let pts = [];
        
        if (tipo === "L") {
            let [_, x1, y1, x2, y2] = cmd;
            for(let i=0; i<=steps; i++){
                pts.push({ 
                    x: (x1 + (x2-x1)*(i/steps)) * w, 
                    y: (y1 + (y2-y1)*(i/steps)) * h, 
                    hit: false 
                });
            }
        } 
        else if (tipo === "A") {
            let [_, cx, cy, r, a1, a2, anti] = cmd;
            let rad1 = a1 * Math.PI/180;
            let rad2 = a2 * Math.PI/180;
            
            // Ajuste trigonométrico de ângulos
            if(anti && rad2 > rad1) rad2 -= Math.PI*2;
            if(!anti && rad2 < rad1) rad2 += Math.PI*2;

            for(let i=0; i<=steps; i++){
                let ang = rad1 + (rad2-rad1)*(i/steps);
                pts.push({ 
                    x: (cx + Math.cos(ang)*r) * w, 
                    y: (cy + Math.sin(ang)*r) * h, 
                    hit: false 
                });
            }
        }
        todosTracos.push(pts);
    });

    return todosTracos;
}

function desenharGuiasJogo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fundo branco grosso de todas as linhas
    tracosLetra.forEach(traco => {
        ctx.beginPath(); ctx.lineWidth = 40; ctx.strokeStyle = "#ffffff"; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.moveTo(traco[0].x, traco[0].y); traco.forEach(pt => ctx.lineTo(pt.x, pt.y)); ctx.stroke();
    });

    // Tracejado
    tracosLetra.forEach((traco, index) => {
        ctx.beginPath(); ctx.lineCap = "round"; ctx.lineJoin = "round";
        
        if (index < tracoAtualIndex) {
            // Traço já feito (Verde contínuo)
            ctx.lineWidth = 14; ctx.strokeStyle = "#8cc63f"; ctx.setLineDash([]);
        } else if (index === tracoAtualIndex) {
            // Traço atual (Cinzento tracejado escuro)
            ctx.lineWidth = 10; ctx.strokeStyle = "#a0a0a0"; ctx.setLineDash([12, 12]);
        } else {
            // Traços futuros (Cinzento tracejado muito claro)
            ctx.lineWidth = 10; ctx.strokeStyle = "#e5e5e5"; ctx.setLineDash([12, 12]);
        }
        
        ctx.moveTo(traco[0].x, traco[0].y); traco.forEach(pt => ctx.lineTo(pt.x, pt.y)); ctx.stroke();
        ctx.setLineDash([]);
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
    
    // Verifica se tocou na bolinha do traço atual
    if (Math.hypot(pos.x - startPt.x, pos.y - startPt.y) > 40) return; 

    isDrawing = true; saiuDoCaminho = false;
    tracosLetra[tracoAtualIndex].forEach(p => p.hit = false); 
    posAtualX = pos.x; posAtualY = pos.y;
    
    // Esconde a bolinha enquanto desenha
    document.getElementById('ponto-inicio').style.opacity = '0';
    
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 14; ctx.strokeStyle = "var(--primary-color)"; ctx.lineCap = "round"; ctx.lineJoin = "round";
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
        
        if (minDist > 45) saiuDoCaminho = true; 
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
    avaliarJogada();
}

function avaliarJogada() {
    let trajetoAtual = tracosLetra[tracoAtualIndex];
    let ultimoPonto = trajetoAtual[trajetoAtual.length - 1];
    let distanciaFim = Math.hypot(ultimoPonto.x - posAtualX, ultimoPonto.y - posAtualY);
    
    let pontosAtingidos = trajetoAtual.filter(p => p.hit).length;
    let accuracia = pontosAtingidos / trajetoAtual.length;
    
    if (distanciaFim < 50 && accuracia >= 0.50 && !saiuDoCaminho) {
        // Acertou o traço atual!
        tracoAtualIndex++;
        somClique.currentTime = 0; somClique.play().catch(e=>console.log(e));
        
        if (tracoAtualIndex >= tracosLetra.length) {
            // Terminou a letra toda!
            jogoAtivo = false; certos++; 
            somAcerto.currentTime = 0; somAcerto.play().catch(e=>console.log(e));
            
            atualizarPontoInicio();
            desenharGuiasJogo();
            document.getElementById('area-desenho').style.borderColor = "#8cc63f";
            
            setTimeout(() => { 
                document.getElementById('area-desenho').style.borderColor = "#e0e0e0";
                rondaAtual++; jogoAtivo = true; proximaRonda(); 
            }, 1200);
        } else {
            // Faltam traços, prepara o próximo
            atualizarPontoInicio();
            desenharGuiasJogo();
        }
    } else {
        // Errou o traço, limpa e tenta de novo
        erros++; 
        somErro.currentTime = 0; somErro.play().catch(e=>console.log(e));
        trajetoAtual.forEach(p => p.hit = false);
        desenharGuiasJogo(); 
        Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    }
}

// ==========================================
// SISTEMA DE AJUDA ANIMADO (MOSTRA O CAMINHO)
// ==========================================
function darAjuda() {
    if (!jogoAtivo || ajudaEmCurso || tracoAtualIndex >= tracosLetra.length) return;
    ajudasUsadas++; 
    somClique.currentTime = 0; somClique.play().catch(e=>console.log(e));
    
    ajudaEmCurso = true; isDrawing = false; 
    document.getElementById('ponto-inicio').style.opacity = '0';
    
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
            ctx.beginPath(); ctx.lineWidth = 14; ctx.strokeStyle = "var(--primary-color)"; ctx.lineCap = "round"; ctx.lineJoin = "round";
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
                    desenharGuiasJogo(); // Limpa o desenho falso
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
