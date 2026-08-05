// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 3, certos = 0, erros = 0; 
let selecionadoOrigem = null;
let paresConcluidos = 0;
let itensDestaRonda = [];
let simuInterval;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    /* ESTRUTURA BASE */
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .status-pill { background: #6c757d; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 1.1rem; }
    .score-group { display: flex; gap: 10px; }
    .score-box { padding: 5px 12px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1.1rem; min-width: 60px; justify-content: center; }
    .box-v { background: #8cc63f; box-shadow: 0 3px 0 #6da32f; }
    .box-x { background: #ff5a5f; box-shadow: 0 3px 0 #d44348; }

    .btn-play-rect { 
        flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); 
        color: white; border: none; font-size: 1.5rem; font-weight: 900; 
        text-transform: uppercase; cursor: pointer; display: flex; 
        align-items: center; justify-content: center; gap: 15px; 
        box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: 0.2s;
    }
    .btn-audio-circle { width: 65px; height: 65px; cursor: pointer; flex-shrink: 0; }

    /* ÁREA DO JOGO */
    #game-content { 
        position: relative; width: 100%; max-width: 550px; margin: 0 auto; 
        display: flex; justify-content: space-between; padding: 20px; box-sizing: border-box; 
        background: rgba(255,255,255,0.3); border-radius: 30px;
    }

    .coluna { display: flex; flex-direction: column; gap: 20px; z-index: 10; width: 40%; }
    .item-ligar { display: flex; align-items: center; gap: 15px; width: 100%; }
    
    /* Lado Esquerdo: Imagem -> Ponto */
    .esq { justify-content: flex-end; } 
    /* Lado Direito: Ponto -> Sombra */
    .dir { justify-content: flex-start; flex-direction: row-reverse; }

    .card-img { 
        width: var(--card-size); height: var(--card-size); background: white; 
        border: 3px solid #eee; border-radius: 15px; display: flex; 
        align-items: center; justify-content: center; padding: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    }
    .card-img img { max-width: 85%; max-height: 85%; object-fit: contain; }

    /* FILTRO DE SOMBRA RIGOROSO */
    .sombra img { filter: brightness(0) contrast(100%); }

    .ponto { 
        width: 24px; height: 24px; background: #adb5bd; border-radius: 50%; border: 4px solid #fff; 
        box-shadow: 0 2px 5px rgba(0,0,0,0.2); cursor: pointer; transition: 0.2s; flex-shrink: 0;
    }
    .ponto.ativo { background: var(--primary-color); transform: scale(1.3); box-shadow: 0 0 15px var(--primary-color); }
    .ponto.conectado { background: #8cc63f; cursor: default; transform: scale(1); }

    /* LINHAS SVG */
    #svg-linhas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; }
    .linha-matching { stroke: #8cc63f; stroke-width: 6; stroke-linecap: round; opacity: 0.9; stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: dash 0.5s linear forwards; }
    @keyframes dash { to { stroke-dashoffset: 0; } }

    #simu-hand { position: absolute; font-size: 3.5rem; z-index: 100; pointer-events: none; transition: all 0.8s ease-in-out; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.2)); }

    :root { --card-size: 80px; }
    @media screen and (min-width: 768px) { :root { --card-size: 100px; } }
`;
document.head.appendChild(style);

// ==========================================
// 3. CAPA E SIMULAÇÃO
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
        <svg id="svg-linhas"></svg>
        <div class="coluna">
            <div class="item-ligar esq"><div class="card-img"><img src="${DADOS_JOGO.caminhoImagens}morango.png"></div><div class="ponto" id="simu-p1"></div></div>
        </div>
        <div class="coluna">
            <div class="item-ligar dir"><div class="card-img sombra"><img src="${DADOS_JOGO.caminhoImagens}morango.png"></div><div class="ponto" id="simu-p2"></div></div>
        </div>`;

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
        const p1 = document.getElementById('simu-p1').getBoundingClientRect();
        const p2 = document.getElementById('simu-p2').getBoundingClientRect();
        const container = document.getElementById('game-content').getBoundingClientRect();

        hand.style.display = "block";
        hand.style.top = (p1.top - container.top + 10) + "px";
        hand.style.left = (p1.left - container.left + 10) + "px";
        hand.style.opacity = "1";

        setTimeout(() => {
            hand.style.top = (p2.top - container.top + 10) + "px";
            hand.style.left = (p2.left - container.left + 10) + "px";
            setTimeout(() => { hand.style.opacity = "0"; }, 800);
        }, 1200);
    };
    animar(); simuInterval = setInterval(animar, 4000);
}

// ==========================================
// 4. LÓGICA DE JOGO
// ==========================================
function iniciarJogo() {
    clearInterval(simuInterval);
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0;
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    paresConcluidos = 0; selecionadoOrigem = null;
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    
    itensDestaRonda = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5).slice(0, 4);
    const itensEsq = [...itensDestaRonda].sort(() => Math.random() - 0.5);
    const itensDir = [...itensDestaRonda].sort(() => Math.random() - 0.5);

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <svg id="svg-linhas"></svg>
        <div class="coluna">
            ${itensEsq.map(it => `
                <div class="item-ligar esq">
                    <div class="card-img"><img src="${DADOS_JOGO.caminhoImagens + it.img}"></div>
                    <div class="ponto" id="origem-${it.id}" onclick="selecionarPonto('origem', ${it.id}, this)"></div>
                </div>`).join('')}
        </div>
        <div class="coluna">
            ${itensDir.map(it => `
                <div class="item-ligar dir">
                    <div class="card-img sombra"><img src="${DADOS_JOGO.caminhoImagens + it.img}"></div>
                    <div class="ponto" id="destino-${it.id}" onclick="selecionarPonto('destino', ${it.id}, this)"></div>
                </div>`).join('')}
        </div>`;
}

function selecionarPonto(tipo, id, el) {
    if (!jogoAtivo || el.classList.contains('conectado')) return;
    somClique.play();

    if (tipo === 'origem') {
        document.querySelectorAll('.coluna .ponto').forEach(p => p.classList.remove('ativo'));
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
                setTimeout(() => { rondaAtual++; proximaRonda(); }, 1800);
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
    const rect = svg.getBoundingClientRect();
    const b1 = el1.getBoundingClientRect();
    const b2 = el2.getBoundingClientRect();

    const x1 = b1.left - rect.left + b1.width / 2;
    const y1 = b1.top - rect.top + b1.height / 2;
    const x2 = b2.left - rect.left + b2.width / 2;
    const y2 = b2.top - rect.top + b2.height / 2;

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
