// ==========================================
// 1. CONFIGURAÇÃO E ESTADO GLOBAL
// ==========================================
// Nota: Assume-se que JOGO_CONFIG e DADOS_JOGO já estão definidos globalmente 
// ou no início deste ficheiro. Se não, podes definir aqui:

let jogoAtivo = false;
let itemSelecionado = null;
let corAtual = JOGO_CONFIG.coresMagicas[0].cor;
let desenhando = false;
let canvas, ctx;

const somClique = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CSS INJETADO (LAYOUT RESPONSIVO E MAGIA)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .game-area-tracing { 
        display: flex; flex-direction: column; align-items: center; 
        width: 100%; height: 100%; justify-content: space-between;
    }
    
    .menu-selecao-letras { 
        display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); 
        gap: 12px; width: 100%; max-width: 600px; padding: 15px;
    }
    
    .card-letra { 
        background: white; border: 3px solid #eee; border-radius: 12px; cursor: pointer; 
        height: 80px; display: flex; align-items: center; justify-content: center; transition: 0.2s;
    }
    .card-letra img { max-width: 70%; max-height: 70%; object-fit: contain; }
    .card-letra:hover { border-color: var(--primary-color); transform: scale(1.05); }

    .tracing-container { 
        position: relative; width: 280px; height: 350px; 
        background: #fff; border-radius: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        margin-bottom: 10px; touch-action: none; overflow: hidden;
    }
    
    #canvas-letra { position: absolute; top:0; left:0; z-index: 10; cursor: crosshair; }
    
    .img-template { 
        position: absolute; top:0; left:0; width:100%; height:100%; 
        z-index: 5; pointer-events: none; padding: 25px; box-sizing: border-box;
        object-fit: contain; opacity: 0.9;
    }

    /* Camada que faz a letra ficar toda colorida */
    #magia-preenchimento {
        position: absolute; top:0; left:0; width:100%; height:100%;
        z-index: 6; pointer-events: none; opacity: 0;
        transition: opacity 0.6s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        -webkit-mask-size: contain; mask-size: contain;
        -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
        -webkit-mask-position: center; mask-position: center;
        background-color: transparent;
    }

    #magia-preenchimento.ativa {
        opacity: 1;
        transform: scale(1.05); /* Efeito de "pulo" ao completar */
    }

    .paleta { display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; justify-content: center; }
    .btn-cor { 
        width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; 
        cursor: pointer; box-shadow: 0 3px 6px rgba(0,0,0,0.1); transition: 0.2s;
    }
    .btn-cor.ativa { transform: scale(1.2); border-color: #444; }

    .controles { display: flex; gap: 8px; padding-bottom: 10px; }
    .btn-acao { 
        padding: 10px 18px; border: none; border-radius: 20px; color: white; 
        font-weight: 800; cursor: pointer; text-transform: uppercase; font-size: 0.7rem;
    }
`;
document.head.appendChild(style);

// ==========================================
// 3. NAVEGAÇÃO E SONS
// ==========================================
function mostrarCapa() {
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div style="text-align:center; width:100%;">
            <p style="color:var(--text-grey); font-weight:800; margin: 10px 0;">Escolhe uma letra:</p>
            <div class="menu-selecao-letras">
                ${DADOS_JOGO.itens.map(it => `
                    <div class="card-letra" onclick="abrirLetra('${it.id}')">
                        <img src="${DADOS_JOGO.caminhoRecursos + it.img}">
                    </div>
                `).join('')}
            </div>
        </div>`;
    if(document.getElementById('shell-footer-content')) 
        document.getElementById('shell-footer-content').style.display = "none";
}

function tocarSomLetra(id) {
    const item = DADOS_JOGO.itens.find(i => i.id === id);
    if (item && item.som) {
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
                <!-- Imagem com as SETAS e NÚMEROS (Template) -->
                <img src="${DADOS_JOGO.caminhoRecursos + itemSelecionado.img}" class="img-template">
                
                <!-- Camada da Magia (Preenchimento) -->
                <div id="magia-preenchimento"></div>
                
                <canvas id="canvas-letra" width="280" height="350"></canvas>
            </div>

            <div class="paleta">
                ${JOGO_CONFIG.coresMagicas.map(c => `
                    <div class="btn-cor" style="background:${c.cor}" onclick="selecionarCor('${c.cor}', this)"></div>
                `).join('')}
            </div>

            <div class="controles">
                <button class="btn-acao" style="background:#6c757d" onclick="limparQuadro()">Apagar</button>
                <button class="btn-acao" style="background:#8cc63f" onclick="concluirEMagica()">Concluir!</button>
                <button class="btn-acao" style="background:#ff5a5f" onclick="mostrarCapa()">Voltar</button>
            </div>
        </div>`;

    inicializarCanvas();
    // Inicia com a primeira cor
    const primeiraCor = document.querySelector('.btn-cor');
    selecionarCor(corAtual, primeiraCor);
}

// ==========================================
// 4. LÓGICA DE DESENHO E EFEITO MAGIA
// ==========================================
function inicializarCanvas() {
    canvas = document.getElementById('canvas-letra');
    ctx = canvas.getContext('2d');
    
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const iniciar = (e) => {
        desenhando = true;
        ctx.beginPath();
        const pos = getPos(e);
        ctx.moveTo(pos.x, pos.y);
        // Garante que as propriedades do pincel estão aplicadas
        ctx.strokeStyle = corAtual;
        ctx.lineWidth = 16;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    };

    const mover = (e) => {
        if (!desenhando) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y); 
        ctx.stroke();
    };

    const parar = () => desenhando = false;

    canvas.addEventListener('mousedown', iniciar);
    canvas.addEventListener('mousemove', mover);
    window.addEventListener('mouseup', parar);
    
    canvas.addEventListener('touchstart', iniciar, {passive: false});
    canvas.addEventListener('touchmove', mover, {passive: false});
    canvas.addEventListener('touchend', parar);
}

function selecionarCor(cor, el) {
    corAtual = cor;
    if (ctx) ctx.strokeStyle = cor;
    document.querySelectorAll('.btn-cor').forEach(b => b.classList.remove('ativa'));
    if (el) el.classList.add('ativa');
    somClique.play().catch(() => {});
}

function limparQuadro() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const magia = document.getElementById('magia-preenchimento');
    magia.classList.remove('ativa');
    magia.style.backgroundColor = "transparent";
    somClique.play().catch(() => {});
}

function concluirEMagica() {
    if (!itemSelecionado) return;

    // Toca sons de vitória
    tocarSomLetra(itemSelecionado.id);
    new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.acerto).play().catch(() => {});

    // Ativa a camada mágica
    const magia = document.getElementById('magia-preenchimento');
    const urlImg = `url(${DADOS_JOGO.caminhoRecursos + itemSelecionado.img})`;
    
    magia.style.webkitMaskImage = urlImg;
    magia.style.maskImage = urlImg;
    magia.style.backgroundColor = corAtual;
    magia.classList.add('ativa');

    // Limpa o traço manual após um curto delay para revelar o preenchimento perfeito
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 400);
}

function tocarAudioInstrucoes() {
    if(DADOS_JOGO.somInstrucoes)
        new Audio(JOGO_CONFIG.caminhoSonsBase + DADOS_JOGO.somInstrucoes).play().catch(() => {});
}

// Iniciar na capa ao carregar o script
mostrarCapa();
