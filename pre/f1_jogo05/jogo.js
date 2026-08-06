// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0; 
let selecionadoOrigem = null;
let paresConcluidos = 0;
let itensDestaRonda = [];
let simuInterval;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS RIGOROSO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .status-pill { background: #6c757d; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 1.1rem; }
    .score-group { display: flex; gap: 10px; }
    .score-box { padding: 5px 12px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; min-width: 60px; justify-content: center; }
    .box-v { background: #8cc63f; box-shadow: 0 3px 0 #6da32f; }
    .box-x { background: #ff5a5f; box-shadow: 0 3px 0 #d44348; }

    .btn-play-rect { flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); color: white; border: none; font-size: 1.5rem; font-weight: 900; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 15px; }
    .btn-audio-circle { width: 65px; height: 65px; cursor: pointer; flex-shrink: 0; }

    .game-stage {
        position: relative; width: 100%; max-width: 500px; margin: 0 auto;
        display: flex; justify-content: space-between; align-items: center;
        min-height: 420px; padding: 10px; box-sizing: border-box;
    }

    .coluna { display: flex; flex-direction: column; gap: 15px; z-index: 10; width: 42%; }
    .item-matching { display: flex; align-items: center; width: 100%; height: var(--card-size); }
    .esq { justify-content: flex-end; gap: 12px; }
    .dir { justify-content: flex-start; gap: 12px; flex-direction: row-reverse; }

    .card-img {
        width: var(--card-size); height: var(--card-size); background: white;
        border: 3px solid #eee; border-radius: 15px; display: flex;
        align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    .card-img img { max-width: 80%; max-height: 80%; object-fit: contain; pointer-events: none; }
    .sombra-img img { filter: brightness(0) contrast(100%); }

    .ponto {
        width: 26px; height: 26px; background: #adb5bd; border-radius: 50%;
        border: 4px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        cursor: pointer; flex-shrink: 0; transition: 0.2s;
    }
    .ponto.ativo { background: var(--primary-color); transform: scale(1.2); }
    .ponto.conectado { background: #8cc63f; cursor: default; }
    
    /* ANIMAÇÃO DE AJUDA */
    .ponto-ajuda { animation: pulsarAjuda 0.6s infinite alternate; background: #ffc107 !important; border-color: #fff !important; }
    @keyframes pulsarAjuda { from { transform: scale(1); box-shadow: 0 0 0px #ffc107; } to { transform: scale(1.4); box-shadow: 0 0 15px #ffc107; } }

    #svg-linhas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; }
    .linha-matching { stroke: #8cc63f; stroke-width: 6; stroke-linecap: round; opacity: 0.8; }
    .linha-simu { stroke: var(--primary-color); stroke-width: 4; stroke-dasharray: 8; opacity: 0.5; }

    #simu-hand { 
        position: absolute; font-size: 3.5rem; z-index: 100; 
        pointer-events: none; transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); 
        filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.3));
    }

    :root { --card-size: 80px; }
    @media screen and (min-width: 768px) { :root { --card-size: 100px; } }
`;
document.head.appendChild(style);

// ==========================================
// 3. CAPA E SIMULAÇÃO MELHORADA
// ==========================================
function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div id="simu-hand" style="display:none;">👆</div>
        <div class="game-stage" id="stage-capa">
            <svg id="svg-linhas"><line id="line-simu" class="linha-simu" x1="0" y1="0" x2="0" y2="0" style="display:none;"></line></svg>
            <div class="coluna">
                <div class="item-matching esq"><div class="card-img"><img src="${DADOS_JOGO.caminhoImagens}morango.png"></div><div class="ponto" id="p-simu-1"></div></div>
            </div>
            <div class="coluna">
                <div class="item-matching dir"><div class="card-img sombra-img"><img src="${DADOS_JOGO.caminhoImagens}morango.png"></div><div class="ponto" id="p-simu-2"></div></div>
            </div>
        </div>
        <p style="text-align:center; color:var(--text-grey); font-weight:800; margin-top:10px;">${JOGO_CONFIG.descricao}</p>`;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="tocarAudioInstrucoes()">
        <button class="btn-play-rect" onclick="iniciarJogo()"><i class="fas fa-play"></i> JOGAR</button>`;
    correrSimulacao();
}

function correrSimulacao() {
    clearInterval(simuInterval);
    const hand = document.getElementById('simu-hand');
    const line = document.getElementById('line-simu');
    const animar = () => {
        const p1 = document.getElementById('p-simu-1').getBoundingClientRect();
        const p2 = document.getElementById('p-simu-2').getBoundingClientRect();
        const stage = document.getElementById('stage-capa').getBoundingClientRect();

        const x1 = p1.left - stage.left + 13, y1 = p1.top - stage.top + 13;
        const x2 = p2.left - stage.left + 13, y2 = p2.top - stage.top + 13;

        hand.style.display = "block"; hand.style.opacity = "0";
        hand.style.top = (y1 + 20) + "px"; hand.style.left = (x1 + 20) + "px";
        line.style.display = "none";

        setTimeout(() => {
            hand.style.opacity = "1"; hand.style.transform = "scale(0.8)"; // Clique
            setTimeout(() => {
                hand.style.transform = "scale(1)";
                hand.style.top = y2 + "px"; hand.style.left = x2 + "px";
                
                // Animar linha durante o movimento
                line.setAttribute("x1", x1); line.setAttribute("y1", y1);
                line.setAttribute("x2", x1); line.setAttribute("y2", y1);
                line.style.display = "block";
                
                let start = null;
                const draw = (timestamp) => {
                    if (!start) start = timestamp;
                    let progress = (timestamp - start) / 800;
                    if (progress > 1) progress = 1;
                    line.setAttribute("x2", x1 + (x2 - x1) * progress);
                    line.setAttribute("y2", y1 + (y2 - y1) * progress);
                    if (progress < 1) requestAnimationFrame(draw);
                };
                requestAnimationFrame(draw);

                setTimeout(() => {
                    hand.style.transform = "scale(0.8)"; // Clique final
                    setTimeout(() => { hand.style.opacity = "0"; }, 300);
                }, 900);
            }, 400);
        }, 500);
    };
    animar(); simuInterval = setInterval(animar, 4500);
}

// ==========================================
// 4. LÓGICA DE JOGO
// ==========================================
function iniciarJogo() {
    clearInterval(simuInterval);
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0;
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    paresConcluidos = 0; selecionadoOrigem = null;
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    
    itensDestaRonda = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5).slice(0, 4);
    const itensEsq = [...itensDestaRonda].sort(() => Math.random() - 0.5);
    const itensDir = [...itensDestaRonda].sort(() => Math.random() - 0.5);

    document.getElementById('game-content').innerHTML = `
        <div class="game-stage" id="stage">
            <svg id="svg-linhas"></svg>
            <div class="coluna">
                ${itensEsq.map(it => `<div class="item-matching esq"><div class="card-img"><img src="${DADOS_JOGO.caminhoImagens + it.img}"></div><div class="ponto" id="origem-${it.id}" onclick="selecionarPonto('origem', ${it.id}, this)"></div></div>`).join('')}
            </div>
            <div class="coluna">
                ${itensDir.map(it => `<div class="item-matching dir"><div class="card-img sombra-img"><img src="${DADOS_JOGO.caminhoImagens + it.img}"></div><div class="ponto" id="destino-${it.id}" onclick="selecionarPonto('destino', ${it.id}, this)"></div></div>`).join('')}
            </div>
        </div>`;
}

function selecionarPonto(tipo, id, el) {
    if (!jogoAtivo || el.classList.contains('conectado')) return;
    document.querySelectorAll('.ponto').forEach(p => p.classList.remove('ponto-ajuda')); // Limpa ajudas
    somClique.play();

    if (tipo === 'origem') {
        document.querySelectorAll('.esq .ponto').forEach(p => p.classList.remove('ativo'));
        el.classList.add('ativo');
        selecionadoOrigem = { id: id, el: el };
    } else {
        if (!selecionadoOrigem) return;
        if (id === selecionadoOrigem.id) {
            certos++; paresConcluidos++; somAcerto.play();
            selecionadoOrigem.el.classList.replace('ativo', 'conectado');
            el.classList.add('conectado');
            desenharLinha(selecionadoOrigem.el, el);
            selecionadoOrigem = null;
            if (paresConcluidos === 4) { setTimeout(() => { rondaAtual++; proximaRonda(); }, 1500); }
        } else {
            erros++; somErro.play();
            selecionadoOrigem.el.classList.remove('ativo');
            selecionadoOrigem = null;
        }
        Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    }
}

function desenharLinha(el1, el2) {
    const svg = document.getElementById('svg-linhas');
    const stageRect = document.getElementById('stage').getBoundingClientRect();
    const b1 = el1.getBoundingClientRect(), b2 = el2.getBoundingClientRect();
    const x1 = b1.left - stageRect.left + 13, y1 = b1.top - stageRect.top + 13;
    const x2 = b2.left - stageRect.left + 13, y2 = b2.top - stageRect.top + 13;
    const linha = document.createElementNS("http://www.w3.org/2000/svg", "line");
    linha.setAttribute("x1", x1); linha.setAttribute("y1", y1);
    linha.setAttribute("x2", x2); linha.setAttribute("y2", y2);
    linha.setAttribute("class", "linha-matching");
    svg.appendChild(linha);
}

// ==========================================
// 5. FUNÇÃO DE AJUDA (darAjuda)
// ==========================================
function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++;
    somClique.play();

    // Encontra o primeiro item da esquerda que ainda não está conectado
    let itemParaAjudar = itensDestaRonda.find(it => {
        const ponto = document.getElementById(`origem-${it.id}`);
        return ponto && !ponto.classList.contains('conectado');
    });

    if (itemParaAjudar) {
        const pEsq = document.getElementById(`origem-${itemParaAjudar.id}`);
        const pDir = document.getElementById(`destino-${itemParaAjudar.id}`);
        
        // Remove destaques anteriores
        document.querySelectorAll('.ponto').forEach(p => p.classList.remove('ponto-ajuda'));
        
        // Adiciona animação de pulsar aos dois pontos do par correto
        pEsq.classList.add('ponto-ajuda');
        pDir.classList.add('ponto-ajuda');
    }
}

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, ajudasUsadas, rel);
}

function tocarAudioInstrucoes() {
    somClique.play();
    new Audio(JOGO_CONFIG.caminhoSonsBase + DADOS_JOGO.somInstrucoes).play();
}
