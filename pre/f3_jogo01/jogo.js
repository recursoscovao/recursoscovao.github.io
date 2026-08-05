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
    /* ESTRUTURA DE STATUS E UI */
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .status-pill { background: #6c757d; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 1.1rem; }
    .score-group { display: flex; gap: 10px; }
    .score-box { padding: 5px 12px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; min-width: 60px; justify-content: center; }
    .box-v { background: #8cc63f; box-shadow: 0 3px 0 #6da32f; }
    .box-x { background: #ff5a5f; box-shadow: 0 3px 0 #d44348; }

    .btn-play-rect { 
        flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); 
        color: white; border: none; font-size: 1.5rem; font-weight: 900; 
        text-transform: uppercase; cursor: pointer; display: flex; 
        align-items: center; justify-content: center; gap: 15px; 
    }
    .btn-audio-circle { width: 65px; height: 65px; cursor: pointer; flex-shrink: 0; }

    /* ÁREA DO JOGO CENTRADA */
    .game-stage {
        position: relative;
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 420px;
        padding: 10px;
        box-sizing: border-box;
    }

    .coluna {
        display: flex;
        flex-direction: column;
        gap: 15px;
        z-index: 10;
        width: 42%;
    }

    .item-matching {
        display: flex;
        align-items: center;
        width: 100%;
        height: var(--card-size);
    }

    /* ESQUERDA: [IMAGEM] [PONTO] | DIREITA: [PONTO] [SOMBRA] */
    .esq { justify-content: flex-end; gap: 12px; }
    .dir { justify-content: flex-start; gap: 12px; flex-direction: row-reverse; }

    .card-img {
        width: var(--card-size);
        height: var(--card-size);
        background: white;
        border: 3px solid #eee;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    .card-img img { max-width: 80%; max-height: 80%; object-fit: contain; pointer-events: none; }
    .sombra-img img { filter: brightness(0) contrast(100%); }

    .ponto {
        width: 24px;
        height: 24px;
        background: #adb5bd;
        border-radius: 50%;
        border: 4px solid #fff;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        cursor: pointer;
        flex-shrink: 0;
        transition: 0.2s;
    }
    .ponto.ativo { background: var(--primary-color); transform: scale(1.2); box-shadow: 0 0 10px var(--primary-color); }
    .ponto.conectado { background: #8cc63f; cursor: default; }

    /* SVG DAS LINHAS */
    #svg-linhas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; }
    .linha-matching { stroke: #8cc63f; stroke-width: 6; stroke-linecap: round; opacity: 0.8; }

    /* ANIMAÇÃO DA MÃO */
    #simu-hand { 
        position: absolute; font-size: 3.5rem; z-index: 100; 
        pointer-events: none; transition: all 0.8s ease-in-out; 
        filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.2));
    }

    :root { --card-size: 80px; }
    @media screen and (min-width: 768px) { :root { --card-size: 100px; } }
`;
document.head.appendChild(style);

// ==========================================
// 3. CAPA E SIMULAÇÃO (ANIMAÇÃO)
// ==========================================
function tocarAudioInstrucoes() {
    somClique.play();
    new Audio(JOGO_CONFIG.caminhoSonsBase + DADOS_JOGO.somInstrucoes).play();
}

function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div id="simu-hand" style="display:none;">👆</div>
        <div class="game-stage" id="stage-capa">
            <svg id="svg-linhas"></svg>
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
    const animar = () => {
        const p1 = document.getElementById('p-simu-1').getBoundingClientRect();
        const p2 = document.getElementById('p-simu-2').getBoundingClientRect();
        const stage = document.getElementById('stage-capa').getBoundingClientRect();

        hand.style.display = "block";
        hand.style.top = (p1.top - stage.top + 10) + "px";
        hand.style.left = (p1.left - stage.left + 10) + "px";
        hand.style.opacity = "1";

        setTimeout(() => {
            hand.style.top = (p2.top - stage.top + 10) + "px";
            hand.style.left = (p2.left - stage.left + 10) + "px";
            setTimeout(() => { hand.style.opacity = "0"; }, 800);
        }, 1200);
    };
    animar(); simuInterval = setInterval(animar, 4000);
}

// ==========================================
// 4. LÓGICA DE JOGO (10 RONDAS)
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
    
    // Selecionar 4 itens aleatórios
    itensDestaRonda = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5).slice(0, 4);
    const itensEsq = [...itensDestaRonda].sort(() => Math.random() - 0.5);
    const itensDir = [...itensDestaRonda].sort(() => Math.random() - 0.5);

    document.getElementById('game-content').innerHTML = `
        <div class="game-stage" id="stage">
            <svg id="svg-linhas"></svg>
            <div class="coluna">
                ${itensEsq.map(it => `
                    <div class="item-matching esq">
                        <div class="card-img"><img src="${DADOS_JOGO.caminhoImagens + it.img}"></div>
                        <div class="ponto" id="origem-${it.id}" onclick="selecionarPonto('origem', ${it.id}, this)"></div>
                    </div>`).join('')}
            </div>
            <div class="coluna">
                ${itensDir.map(it => `
                    <div class="item-matching dir">
                        <div class="card-img sombra-img"><img src="${DADOS_JOGO.caminhoImagens + it.img}"></div>
                        <div class="ponto" id="destino-${it.id}" onclick="selecionarPonto('destino', ${it.id}, this)"></div>
                    </div>`).join('')}
            </div>
        </div>`;
}

function selecionarPonto(tipo, id, el) {
    if (!jogoAtivo || el.classList.contains('conectado')) return;
    somClique.play();

    if (tipo === 'origem') {
        document.querySelectorAll('.esq .ponto').forEach(p => p.classList.remove('ativo'));
        el.classList.add('ativo');
        selecionadoOrigem = { id: id, el: el };
    } else {
        if (!selecionadoOrigem) return;
        
        if (id === selecionadoOrigem.id) {
            certos++; paresConcluidos++;
            somAcerto.play();
            selecionadoOrigem.el.classList.replace('ativo', 'conectado');
            el.classList.add('conectado');
            desenharLinha(selecionadoOrigem.el, el);
            selecionadoOrigem = null;
            if (paresConcluidos === 4) {
                setTimeout(() => { rondaAtual++; proximaRonda(); }, 1500);
            }
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
    const b1 = el1.getBoundingClientRect();
    const b2 = el2.getBoundingClientRect();

    const x1 = b1.left - stageRect.left + b1.width / 2;
    const y1 = b1.top - stageRect.top + b1.height / 2;
    const x2 = b2.left - stageRect.left + b2.width / 2;
    const y2 = b2.top - stageRect.top + b2.height / 2;

    const linha = document.createElementNS("http://www.w3.org/2000/svg", "line");
    linha.setAttribute("x1", x1); linha.setAttribute("y1", y1);
    linha.setAttribute("x2", x2); linha.setAttribute("y2", y2);
    linha.setAttribute("class", "linha-matching");
    svg.appendChild(linha);
}

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, 0, rel);
}
