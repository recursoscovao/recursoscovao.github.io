// ==========================================
// 1. ESTADO GLOBAL
// ==========================================
let jogoAtivo = false;
let rondaAtual = 1, totalRondas = 3, certos = 0, erros = 0;
let selecionadoOrigem = null;
let paresConcluidos = 0;
let itensDestaRonda = [];

// ==========================================
// 2. CSS INJETADO
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    #game-content { position: relative; width: 100%; max-width: 600px; margin: 0 auto; display: flex; justify-content: space-between; padding: 20px; box-sizing: border-box; }
    .coluna { display: flex; flex-direction: column; gap: 20px; z-index: 10; }
    
    .item-container { display: flex; align-items: center; gap: 10px; position: relative; }
    .col-direita { flex-direction: row-reverse; }

    .card-img { width: 70px; height: 70px; background: white; border: 3px solid #f0f0f0; border-radius: 15px; display: flex; align-items: center; justify-content: center; padding: 5px; }
    .card-img img { max-width: 90%; max-height: 90%; object-fit: contain; }
    .sombra img { filter: brightness(0); }

    .ponto { 
        width: 18px; height: 18px; background: #6c757d; border-radius: 50%; border: 3px solid #fff; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.2); cursor: pointer; transition: 0.2s;
    }
    .ponto:hover { transform: scale(1.3); background: var(--primary-color); }
    .ponto.ativo { background: var(--primary-color); box-shadow: 0 0 10px var(--primary-color); }
    .ponto.conectado { background: #8cc63f; cursor: default; }

    /* SVG para as linhas */
    #svg-linhas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; }
    .linha-matching { stroke: #8cc63f; stroke-width: 4; stroke-linecap: round; transition: opacity 0.5s; }

    @media screen and (min-width: 768px) {
        .card-img { width: 90px; height: 90px; }
        .ponto { width: 22px; height: 22px; }
    }
`;
document.head.appendChild(style);

// ==========================================
// 3. LÓGICA DE JOGO
// ==========================================
function mostrarCapa() {
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    document.getElementById('game-content').innerHTML = `<div style="text-align:center; width:100%;"><p>${JOGO_CONFIG.descricao}</p><img src="${DADOS_JOGO.caminhoImagens}morango.png" style="width:100px; filter:grayscale(1); opacity:0.5;"></div>`;
    
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="tocarAudioInstrucoes()">
        <button class="btn-play-rect" onclick="iniciarJogo()"><i class="fas fa-play"></i> JOGAR</button>`;
}

function tocarAudioInstrucoes() {
    new Audio(JOGO_CONFIG.caminhoSonsBase + DADOS_JOGO.somInstrucoes).play();
}

function iniciarJogo() {
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0;
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    
    paresConcluidos = 0;
    selecionadoOrigem = null;
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    
    // Escolher 4 frutos aleatórios para esta ronda
    itensDestaRonda = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5).slice(0, 4);
    const itensEsquerda = [...itensDestaRonda].sort(() => Math.random() - 0.5);
    const itensDireita = [...itensDestaRonda].sort(() => Math.random() - 0.5);

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <svg id="svg-linhas"></svg>
        <div class="coluna">
            ${itensEsquerda.map(it => `
                <div class="item-container col-esquerda">
                    <div class="card-img"><img src="${DADOS_JOGO.caminhoImagens + it.img}"></div>
                    <div class="ponto" id="origem-${it.id}" onclick="selecionarPonto('origem', ${it.id}, this)"></div>
                </div>`).join('')}
        </div>
        <div class="coluna">
            ${itensDireita.map(it => `
                <div class="item-container col-direita">
                    <div class="card-img sombra"><img src="${DADOS_JOGO.caminhoImagens + it.img}"></div>
                    <div class="ponto" id="destino-${it.id}" onclick="selecionarPonto('destino', ${it.id}, this)"></div>
                </div>`).join('')}
        </div>`;
}

function selecionarPonto(tipo, id, el) {
    if (!jogoAtivo || el.classList.contains('conectado')) return;

    if (tipo === 'origem') {
        document.querySelectorAll('.col-esquerda .ponto').forEach(p => p.classList.remove('ativo'));
        el.classList.add('ativo');
        selecionadoOrigem = { id: id, el: el };
        new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.clique).play();
    } else {
        if (!selecionadoOrigem) return;

        if (id === selecionadoOrigem.id) {
            // ACERTO
            certos++;
            paresConcluidos++;
            new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.acerto).play();
            
            const pontoOrigem = selecionadoOrigem.el;
            const pontoDestino = el;
            
            pontoOrigem.classList.remove('ativo');
            pontoOrigem.classList.add('conectado');
            pontoDestino.classList.add('conectado');
            
            desenharLinha(pontoOrigem, pontoDestino);
            selecionadoOrigem = null;
            Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);

            if (paresConcluidos === 4) {
                setTimeout(() => { rondaAtual++; proximaRonda(); }, 1500);
            }
        } else {
            // ERRO
            erros++;
            new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.erro).play();
            selecionadoOrigem.el.classList.remove('ativo');
            selecionadoOrigem = null;
            Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
        }
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
    linha.setAttribute("x1", x1);
    linha.setAttribute("y1", y1);
    linha.setAttribute("x2", x2);
    linha.setAttribute("y2", y2);
    linha.setAttribute("class", "linha-matching");
    svg.appendChild(linha);
}

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, 0, rel);
}
