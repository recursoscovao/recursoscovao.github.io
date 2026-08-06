// ==========================================
// 1. ESTADO GLOBAL
// ==========================================
let jogoAtivo = false;
let itemSelecionado = null;
let corAtual = JOGO_CONFIG.coresMagicas[0].cor;
let desenhando = false;
let canvas, ctx;

const somClique = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CSS INJETADO (LAYOUT E PINTURA MÁGICA)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .game-area-tracing { display: flex; flex-direction: column; align-items: center; width: 100%; }
    
    .menu-selecao-letras { 
        display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); 
        gap: 15px; width: 100%; max-width: 600px; padding: 20px;
    }
    .card-letra { 
        background: white; border: 3px solid #eee; border-radius: 15px; cursor: pointer; 
        height: 100px; display: flex; align-items: center; justify-content: center; transition: 0.2s;
    }
    .card-letra img { max-width: 70%; max-height: 70%; object-fit: contain; }
    .card-letra:hover { border-color: var(--primary-color); transform: scale(1.05); }

    .tracing-container { 
        position: relative; width: 300px; height: 400px; 
        background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        margin-bottom: 20px; touch-action: none;
    }
    
    #canvas-letra { position: absolute; top:0; left:0; z-index: 10; cursor: crosshair; }
    
    .img-template { 
        position: absolute; top:0; left:0; width:100%; height:100%; 
        z-index: 5; pointer-events: none; padding: 30px; box-sizing: border-box;
        object-fit: contain; transition: 0.5s ease;
    }

    /* Estilo para preencher a letra inteira com a cor */
    .letra-pintada {
        background-color: var(--cor-pincel);
        -webkit-mask-size: contain;
        mask-size: contain;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-position: center;
        mask-position: center;
        z-index: 6;
    }

    .paleta { display: flex; gap: 15px; margin-bottom: 20px; }
    .btn-cor { 
        width: 50px; height: 50px; border-radius: 50%; border: 4px solid white; 
        cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.1); 
    }
    .btn-cor.ativa { transform: scale(1.2); border-color: #333; }

    .controles { display: flex; gap: 10px; }
    .btn-acao { 
        padding: 12px 25px; border: none; border-radius: 25px; color: white; 
        font-weight: 900; cursor: pointer; text-transform: uppercase; font-size: 0.8rem;
    }
`;
document.head.appendChild(style);

// ==========================================
// 3. NAVEGAÇÃO E SONS
// ==========================================
function mostrarCapa() {
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div style="text-align:center; width:100%; padding:10px;">
            <p style="color:var(--text-grey); font-weight:800; margin-bottom:15px;">Escolhe uma letra:</p>
            <div class="menu-selecao-letras">
                ${DADOS_JOGO.itens.map(it => `
                    <div class="card-letra" onclick="abrirLetra('${it.id}')">
                        <img src="${DADOS_JOGO.caminhoRecursos + it.img}">
                    </div>
                `).join('')}
            </div>
        </div>`;
    document.getElementById('shell-footer-content').style.display = "none";
}

function tocarSomLetra(id) {
    const item = DADOS_JOGO.itens.find(i => i.id === id);
    if (item) {
        const audio = new Audio(DADOS_JOGO.caminhoRecursos + item.som);
        audio.play().catch(e => console.log("Erro audio letra"));
    }
}

function abrirLetra(id) {
    itemSelecionado = DADOS_JOGO.itens.find(i => i.id === id);
    tocarSomLetra(id);

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div class="game-area-tracing">
            <div class="tracing-container" id="box-letra">
                <img src="${DADOS_JOGO.caminhoRecursos + itemSelecionado.img}" class="img-template" id="img-fundo">
                <canvas id="canvas-letra" width="300" height="400"></canvas>
            </div>

            <div class="paleta">
                ${JOGO_CONFIG.coresMagicas.map(c => `
                    <div class="btn-cor" style="background:${c.cor}" onclick="selecionarCor('${c.cor}', this)"></div>
                `).join('')}
            </div>

            <div class="controles">
                <button class="btn-acao" style="background:#6c757d" onclick="limparQuadro()">Apagar</button>
                <button class="btn-acao" style="background:#8cc63f" onclick="concluirEMagica()">Concluir</button>
                <button class="btn-acao" style="background:#ff5a5f" onclick="mostrarCapa()">Voltar</button>
            </div>
        </div>`;

    inicializarCanvas();
    selecionarCor(corAtual, document.querySelector('.btn-cor'));
}

// ==========================================
// 4. LÓGICA DE DESENHO E EFEITO "MAGIA"
// ==========================================
function inicializarCanvas() {
    canvas = document.getElementById('canvas-letra');
    ctx = canvas.getContext('2d');
    
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return {x, y};
    };

    const iniciar = (e) => {
        desenhando = true;
        ctx.beginPath();
        const pos = getPos(e);
        ctx.moveTo(pos.x, pos.y);
    };

    const mover = (e) => {
        if (!desenhando) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y); ctx.stroke();
    };

    canvas.addEventListener('mousedown', iniciar);
    canvas.addEventListener('mousemove', mover);
    window.addEventListener('mouseup', () => desenhando = false);
    canvas.addEventListener('touchstart', iniciar, {passive: false});
    canvas.addEventListener('touchmove', mover, {passive: false});
}

function selecionarCor(cor, el) {
    corAtual = cor;
    ctx.strokeStyle = cor;
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    document.querySelectorAll('.btn-cor').forEach(b => b.classList.remove('ativa'));
    el.classList.add('ativa');
    somClique.play();
}

function limparQuadro() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const fundo = document.getElementById('img-fundo');
    fundo.classList.remove('letra-pintada');
    fundo.style.webkitMaskImage = "none";
    somClique.play();
}

function concluirEMagica() {
    // Toca som da letra e som de acerto
    tocarSomLetra(itemSelecionado.id);
    new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.acerto).play();

    // Aplica a cor mágica na letra inteira usando máscara
    const fundo = document.getElementById('img-fundo');
    fundo.style.setProperty('--cor-pincel', corAtual);
    const urlImg = `url(${DADOS_JOGO.caminhoRecursos + itemSelecionado.img})`;
    fundo.style.webkitMaskImage = urlImg;
    fundo.style.maskImage = urlImg;
    fundo.classList.add('letra-pintada');

    // Limpa o traço manual para revelar a letra perfeitamente pintada
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 400);
}

function tocarAudioInstrucoes() {
    new Audio(JOGO_CONFIG.caminhoSonsBase + DADOS_JOGO.somInstrucoes).play();
}
