// ==========================================
// 1. ESTADO E CONFIGURAÇÃO
// ==========================================
let itemSelecionado = null;
let corAtual = JOGO_CONFIG.coresMagicas[0].cor;
let desenhando = false;
let canvas, ctx, ctxAnalise;
let pixelsTotaisDaLetra = 0;
let jogoFinalizado = false;

// CSS Injetado para layout responsivo e animações
const style = document.createElement('style');
style.innerHTML = `
    .game-area-tracing { 
        display: flex; flex-direction: column; align-items: center; 
        width: 100%; height: 100%; justify-content: space-between; padding: 10px; box-sizing: border-box;
    }
    
    .tracing-container { 
        position: relative; width: 300px; height: 380px; 
        background: #fff; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        touch-action: none; overflow: hidden;
    }
    
    #canvas-letra { position: absolute; top:0; left:0; z-index: 10; cursor: crosshair; }
    
    /* Imagem com as SETAS e NÚMEROS sempre visível ao fundo */
    .img-template { 
        position: absolute; top:0; left:0; width:100%; height:100%; 
        z-index: 5; pointer-events: none; padding: 25px; box-sizing: border-box;
        object-fit: contain; opacity: 1;
    }

    #magia-preenchimento {
        position: absolute; top:0; left:0; width:100%; height:100%;
        z-index: 6; pointer-events: none; opacity: 0;
        transition: opacity 0.8s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        -webkit-mask-size: contain; mask-size: contain;
        -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
        -webkit-mask-position: center; mask-position: center;
    }

    #magia-preenchimento.ativa { opacity: 1; transform: scale(1.08); }

    .paleta { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin: 10px 0; }
    .btn-cor { width: 45px; height: 45px; border-radius: 50%; border: 4px solid white; cursor: pointer; transition: 0.2s; }
    .btn-cor.ativa { transform: scale(1.2); border-color: #333; }

    .controles-baixo { display: flex; gap: 15px; }
    .btn-acao { padding: 12px 25px; border: none; border-radius: 30px; color: white; font-weight: 900; cursor: pointer; }
`;
document.head.appendChild(style);

// ==========================================
// 2. NAVEGAÇÃO
// ==========================================
function mostrarCapa() {
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div style="text-align:center; width:100%;">
            <h2 style="color:#555; margin-bottom:20px;">Escolhe uma letra:</h2>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap:15px; padding:10px;">
                ${DADOS_JOGO.itens.map(it => `
                    <div style="background:white; border-radius:15px; height:90px; display:flex; align-items:center; justify-content:center; cursor:pointer; border:3px solid #eee;" onclick="abrirLetra('${it.id}')">
                        <img src="${DADOS_JOGO.caminhoRecursos + it.img}" style="max-width:70%;">
                    </div>
                `).join('')}
            </div>
        </div>`;
}

function abrirLetra(id) {
    itemSelecionado = DADOS_JOGO.itens.find(i => i.id === id);
    jogoFinalizado = false;

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div class="game-area-tracing">
            <div class="tracing-container">
                <!-- Template com as SETAS -->
                <img src="${DADOS_JOGO.caminhoRecursos + itemSelecionado.img}" class="img-template" id="img-guia">
                
                <!-- Camada de cor final -->
                <div id="magia-preenchimento"></div>
                
                <!-- Onde a criança desenha -->
                <canvas id="canvas-letra" width="300" height="380"></canvas>
            </div>

            <div class="paleta">
                ${JOGO_CONFIG.coresMagicas.map(c => `
                    <div class="btn-cor" style="background:${c.cor}" onclick="selecionarCor('${c.cor}', this)"></div>
                `).join('')}
            </div>

            <div class="controles-baixo">
                <button class="btn-acao" style="background:#6c757d" onclick="limparQuadro()">Apagar</button>
                <button class="btn-acao" style="background:#ff5a5f" onclick="mostrarCapa()">Voltar</button>
            </div>
        </div>`;

    inicializarCanvasEAnalise();
}

// ==========================================
// 3. LÓGICA DE DESENHO E DETEÇÃO AUTOMÁTICA
// ==========================================
function inicializarCanvasEAnalise() {
    canvas = document.getElementById('canvas-letra');
    ctx = canvas.getContext('2d');
    
    // Canvas escondido para calcular a percentagem de preenchimento
    const canvasOculto = document.createElement('canvas');
    canvasOculto.width = 300; canvasOculto.height = 380;
    ctxAnalise = canvasOculto.getContext('2d', { willReadFrequently: true });

    // 1. Mapear a letra para saber quantos pixels precisam de ser pintados
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        ctxAnalise.drawImage(img, 25, 25, 250, 330); // Mesma escala do template
        const dados = ctxAnalise.getImageData(0, 0, 300, 380).data;
        pixelsTotaisDaLetra = 0;
        for (let i = 3; i < dados.length; i += 4) {
            if (dados[i] > 10) pixelsTotaisDaLetra++; // Conta pixels não transparentes
        }
        ctxAnalise.clearRect(0, 0, 300, 380);
    };
    img.src = DADOS_JOGO.caminhoRecursos + itemSelecionado.img;

    configurarEventos();
    selecionarCor(corAtual, document.querySelector('.btn-cor'));
}

function configurarEventos() {
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const bx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const by = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x: bx, y: by };
    };

    const iniciar = (e) => {
        if (jogoFinalizado) return;
        desenhando = true;
        ctx.beginPath();
        const pos = getPos(e);
        ctx.moveTo(pos.x, pos.y);
    };

    const mover = (e) => {
        if (!desenhando || jogoFinalizado) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        
        // Desenha também no canvas invisível de análise
        ctxAnalise.lineWidth = 20;
        ctxAnalise.lineCap = 'round';
        ctxAnalise.lineTo(pos.x, pos.y);
        ctxAnalise.stroke();

        verificarProgresso();
    };

    const parar = () => { desenhando = false; ctxAnalise.beginPath(); };

    canvas.addEventListener('mousedown', iniciar);
    canvas.addEventListener('mousemove', mover);
    window.addEventListener('mouseup', parar);
    canvas.addEventListener('touchstart', iniciar, {passive: false});
    canvas.addEventListener('touchmove', mover, {passive: false});
}

function verificarProgresso() {
    // Só verifica a cada 10 movimentos para performance
    const dadosPintados = ctxAnalise.getImageData(0, 0, 300, 380).data;
    let pixelsPintadosCorretos = 0;

    // Comparamos o que foi desenhado com a máscara da letra original
    // (Simplificado: verificamos a densidade de pixels no canvas de análise)
    for (let i = 3; i < dadosPintados.length; i += 4) {
        if (dadosPintados[i] > 10) pixelsPintadosCorretos++;
    }

    const percentagem = (pixelsPintadosCorretos / pixelsTotaisDaLetra) * 100;

    // Se a criança pintou 80% da letra, consideramos concluído!
    if (percentagem > 80 && !jogoFinalizado) {
        concluirAutomatico();
    }
}

function concluirAutomatico() {
    jogoFinalizado = true;
    desenhando = false;

    // Som de sucesso e som da letra
    const audioSucesso = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.acerto);
    audioSucesso.play();
    const audioLetra = new Audio(DADOS_JOGO.caminhoRecursos + itemSelecionado.som);
    setTimeout(() => audioLetra.play(), 500);

    // Ativa a animação mágica de preenchimento
    const magia = document.getElementById('magia-preenchimento');
    const urlImg = `url(${DADOS_JOGO.caminhoRecursos + itemSelecionado.img})`;
    
    magia.style.webkitMaskImage = urlImg;
    magia.style.maskImage = urlImg;
    magia.style.backgroundColor = corAtual;
    magia.classList.add('ativa');

    // Limpa o traço manual para mostrar a letra perfeita
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 400);
}

function selecionarCor(cor, el) {
    corAtual = cor;
    if (ctx) {
        ctx.strokeStyle = cor;
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }
    if (ctxAnalise) {
        ctxAnalise.strokeStyle = "black"; // Para análise não importa a cor
        ctxAnalise.lineWidth = 20;
    }
    document.querySelectorAll('.btn-cor').forEach(b => b.classList.remove('ativa'));
    if (el) el.classList.add('ativa');
}

function limparQuadro() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxAnalise.clearRect(0, 0, 300, 380);
    const magia = document.getElementById('magia-preenchimento');
    magia.classList.remove('ativa');
    jogoFinalizado = false;
}

// Inicia o jogo
mostrarCapa();
