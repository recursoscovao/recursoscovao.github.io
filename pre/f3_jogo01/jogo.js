// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 3, certos = 0, erros = 0; 
let selecionadoOrigem = null;
let paresConcluidos = 0;
let itensDestaRonda = [];

const somAcerto = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CSS INJETADO (LAYOUT DE COLUNAS)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    /* CONTENTOR PRINCIPAL */
    #game-container-ligar {
        position: relative;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        min-height: 450px;
        background: rgba(255,255,255,0.5);
        border-radius: 30px;
        padding: 20px;
        box-sizing: border-box;
    }

    #game-content {
        display: grid;
        grid-template-columns: 1fr 1fr; /* DUAS COLUNAS LADO A LADO */
        gap: 40px;
        position: relative;
        z-index: 10;
    }

    /* COLUNAS */
    .coluna {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    /* ITEM DE LIGAR (LINHA) */
    .item-ligar {
        display: flex;
        align-items: center;
        height: var(--card-size);
        width: 100%;
    }

    /* LADO ESQUERDO: [IMAGEM] [PONTO] */
    .esq { justify-content: flex-end; gap: 15px; }

    /* LADO DIREITO: [PONTO] [IMAGEM] */
    .dir { justify-content: flex-start; gap: 15px; flex-direction: row-reverse; }

    /* CARTÕES DE IMAGEM */
    .card-img {
        width: var(--card-size);
        height: var(--card-size);
        background: white;
        border: 3px solid #eee;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    .card-img img { max-width: 85%; max-height: 85%; object-fit: contain; }

    /* FILTRO DA SOMBRA */
    .sombra-img img { filter: brightness(0) contrast(100%); }

    /* PONTOS DE LIGAÇÃO */
    .ponto {
        width: 26px;
        height: 26px;
        background: #ced4da;
        border: 5px solid #fff;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: 0.2s;
        flex-shrink: 0;
    }
    .ponto.ativo { background: var(--primary-color); transform: scale(1.3); box-shadow: 0 0 15px var(--primary-color); }
    .ponto.conectado { background: #8cc63f; cursor: default; }

    /* SVG DAS LINHAS */
    #svg-linhas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 5;
    }
    .linha-matching {
        stroke: #8cc63f;
        stroke-width: 6;
        stroke-linecap: round;
        opacity: 0.8;
    }

    /* UI RIGOROSA (BOTÕES E STATUS) */
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .status-pill { background: #6c757d; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 1.1rem; }
    .score-group { display: flex; gap: 10px; }
    .score-box { padding: 5px 12px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; min-width: 60px; justify-content: center; }
    .box-v { background: #8cc63f; box-shadow: 0 3px 0 #6da32f; }
    .box-x { background: #ff5a5f; box-shadow: 0 3px 0 #d44348; }
    .btn-play-rect { flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); color: white; border: none; font-size: 1.5rem; font-weight: 900; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 15px; }
    .btn-audio-circle { width: 65px; height: 65px; cursor: pointer; flex-shrink: 0; }

    :root { --card-size: 80px; }
    @media screen and (min-width: 768px) { :root { --card-size: 100px; } }
`;
document.head.appendChild(style);

// ==========================================
// 3. CAPA E INSTRUÇÕES
// ==========================================
function tocarAudioInstrucoes() {
    somClique.play();
    new Audio(JOGO_CONFIG.caminhoSonsBase + DADOS_JOGO.somInstrucoes).play();
}

function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div style="grid-column: span 2; text-align:center; padding: 40px 0;">
            <p style="font-weight:800; color:var(--text-grey);">${JOGO_CONFIG.descricao}</p>
            <div style="display:flex; justify-content:center; gap:20px; margin-top:20px;">
                <div class="card-img"><img src="${DADOS_JOGO.caminhoImagens}morango.png"></div>
                <div class="card-img sombra-img"><img src="${DADOS_JOGO.caminhoImagens}morango.png"></div>
            </div>
        </div>`;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="tocarAudioInstrucoes()">
        <button class="btn-play-rect" onclick="iniciarJogo()"><i class="fas fa-play"></i> JOGAR</button>`;
}

// ==========================================
// 4. LÓGICA DE JOGO
// ==========================================
function iniciarJogo() {
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0;
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    paresConcluidos = 0; selecionadoOrigem = null;
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    
    // Preparar os itens da ronda
    itensDestaRonda = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5).slice(0, 4);
    const itensEsq = [...itensDestaRonda].sort(() => Math.random() - 0.5);
    const itensDir = [...itensDestaRonda].sort(() => Math.random() - 0.5);

    const container = document.getElementById('game-content');
    container.parentElement.id = "game-container-ligar"; // Garante o ID do container
    
    container.parentElement.innerHTML = `
        <svg id="svg-linhas"></svg>
        <div id="game-content">
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
            // ACERTO
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
            // ERRO
            erros++;
            somErro.play();
            selecionadoOrigem.el.classList.remove('ativo');
            selecionadoOrigem = null;
        }
        Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    }
}

function desenharLinha(el1, el2) {
    const svg = document.getElementById('svg-linhas');
    const containerRect = document.getElementById('game-container-ligar').getBoundingClientRect();
    const b1 = el1.getBoundingClientRect();
    const b2 = el2.getBoundingClientRect();

    const x1 = b1.left - containerRect.left + b1.width / 2;
    const y1 = b1.top - containerRect.top + b1.height / 2;
    const x2 = b2.left - containerRect.left + b2.width / 2;
    const y2 = b2.top - containerRect.top + b2.height / 2;

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
