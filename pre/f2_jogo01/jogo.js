// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0; 
let itensRonda = [], colocadosNaRonda = 0;
let simuInterval;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .game-area {
        display: flex; flex-direction: column; align-items: center; gap: 30px; width: 100%; max-width: 800px;
    }
    
    /* Contentores de Sombras e Imagens */
    .row-slots, .row-items {
        display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; width: 100%;
    }

    /* Estilo dos Quadrados */
    .box-sombra, .box-item {
        background: white; border: 3px dashed #ccc; border-radius: 15px;
        aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center;
        position: relative; touch-action: none;
    }

    .box-sombra { border-color: var(--primary-color); background: rgba(255,255,255,0.5); }
    .box-sombra img { width: 70%; height: 70%; object-fit: contain; filter: brightness(0); opacity: 0.3; }
    
    /* Quando o item é acertado e fixado na sombra */
    .box-sombra.filled { border-style: solid; border-color: #8cc63f; background: white; }
    .box-sombra.filled img { filter: none; opacity: 1; }

    /* Itens que o aluno arrasta */
    .box-item { border-style: solid; border-color: #f0f0f0; cursor: grab; z-index: 5; }
    .box-item img { width: 75%; height: 75%; object-fit: contain; pointer-events: none; }
    .box-item.dragging { opacity: 0.5; cursor: grabbing; z-index: 100; }
    .box-item.hidden { visibility: hidden; }

    /* Botão e Rodapé */
    .btn-play-rect { 
        flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); 
        color: white; border: none; font-size: 1.5rem; font-weight: 900; 
        text-transform: uppercase; cursor: pointer; display: flex; 
        align-items: center; justify-content: center; gap: 15px; 
    }
    .btn-audio-circle { width: 65px; height: 65px; cursor: pointer; }

    /* Responsividade */
    @media screen and (max-width: 600px) {
        .row-slots, .row-items { gap: 8px; }
        .box-sombra, .box-item { border-radius: 10px; }
    }
`;
document.head.appendChild(style);

// ==========================================
// 3. LÓGICA DE DRAG & DROP (Touch & Mouse)
// ==========================================
let activeItem = null;
let startPos = { x: 0, y: 0 };

function initDragEvents(el) {
    el.onpointerdown = (e) => {
        if (!jogoAtivo) return;
        activeItem = el;
        el.classList.add('dragging');
        el.setPointerCapture(e.pointerId);
        const rect = el.getBoundingClientRect();
        startPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        somClique.play();
    };

    el.onpointermove = (e) => {
        if (!activeItem || activeItem !== el) return;
        const x = e.clientX - startPos.x;
        const y = e.clientY - startPos.y;
        el.style.position = 'fixed';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.width = '100px'; // Tamanho fixo durante o arrasto
    };

    el.onpointerup = (e) => {
        if (!activeItem || activeItem !== el) return;
        el.classList.remove('dragging');
        
        // Verificar se caiu sobre uma sombra
        const targets = document.querySelectorAll('.box-sombra:not(.filled)');
        let hit = false;
        
        targets.forEach(slot => {
            const rect = slot.getBoundingClientRect();
            if (e.clientX > rect.left && e.clientX < rect.right &&
                e.clientY > rect.top && e.clientY < rect.bottom) {
                
                if (slot.dataset.id === el.dataset.id) {
                    // ACERTO
                    slot.classList.add('filled');
                    el.classList.add('hidden');
                    certos++;
                    colocadosNaRonda++;
                    somAcerto.play();
                    hit = true;
                    if (colocadosNaRonda === 4) {
                        setTimeout(() => { rondaAtual++; proximaRonda(); }, 1000);
                    }
                } else {
                    // ERRO
                    erros++;
                    somErro.play();
                }
            }
        });

        // Resetar posição se não acertou ou se errou
        el.style.position = '';
        el.style.left = '';
        el.style.top = '';
        el.style.width = '';
        activeItem = null;
    };
}

// ==========================================
// 4. LÓGICA DE CAPA E SIMULAÇÃO
// ==========================================
function tocarAudioInstrucoes() {
    somClique.play();
    const audioInst = new Audio(JOGO_CONFIG.caminhoSons + DADOS_JOGO.somInstrucoes);
    audioInst.play().catch(() => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance("Arrasta cada objeto para a sua sombra correspondente.");
        utter.lang = 'pt-PT'; synth.speak(utter);
    });
}

function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
            <div class="box-sombra" style="width:120px; opacity:0.6;"><img src="${DADOS_JOGO.caminhoImagens + DADOS_JOGO.itens[0].img}" style="filter:brightness(0)"></div>
            <div id="simu-hand" style="font-size:3rem; margin-top:-30px; transition: 0.5s">👆</div>
            <div class="box-item" style="width:100px;"><img src="${DADOS_JOGO.caminhoImagens + DADOS_JOGO.itens[0].img}"></div>
            <p style="color:var(--text-grey); font-weight:800; text-align:center; font-size:0.9rem;">${JOGO_CONFIG.descricao}</p>
        </div>`;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="tocarAudioInstrucoes()">
        <button class="btn-play-rect" onclick="iniciarJogo()"><i class="fas fa-play"></i> JOGAR</button>`;
}

// ==========================================
// 5. LÓGICA DO JOGO
// ==========================================
function iniciarJogo() { 
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0; 
    proximaRonda(); 
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    colocadosNaRonda = 0;

    // Selecionar 4 itens únicos
    const sorteados = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5).slice(0, 4);
    const sombras = [...sorteados]; // Sombras na ordem do sorteio
    const itensParaArrastar = [...sorteados].sort(() => Math.random() - 0.5); // Itens baralhados em baixo

    document.getElementById('game-content').innerHTML = `
        <div class="game-area">
            <div class="row-slots">
                ${sombras.map(it => `
                    <div class="box-sombra" data-id="${it.id}">
                        <img src="${DADOS_JOGO.caminhoImagens + it.img}">
                    </div>`).join('')}
            </div>
            <div class="row-items">
                ${itensParaArrastar.map(it => `
                    <div class="box-item" data-id="${it.id}">
                        <img src="${DADOS_JOGO.caminhoImagens + it.img}">
                    </div>`).join('')}
            </div>
        </div>`;

    document.querySelectorAll('.box-item').forEach(el => initDragEvents(el));
}

function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++;
    somClique.play();
    
    // Encontrar o primeiro item que ainda não foi colocado
    const itensVisiveis = document.querySelectorAll('.box-item:not(.hidden)');
    if (itensVisiveis.length > 0) {
        const item = itensVisiveis[0];
        const sombraAlvo = document.querySelector(`.box-sombra[data-id="${item.dataset.id}"]`);
        
        item.style.borderColor = "var(--primary-color)";
        sombraAlvo.style.background = "rgba(140, 198, 63, 0.2)";
        
        setTimeout(() => {
            item.style.borderColor = "";
            sombraAlvo.style.background = "";
        }, 1500);
    }
}

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, ajudasUsadas, rel);
}
