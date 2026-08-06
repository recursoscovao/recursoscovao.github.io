// ==========================================
// 1. ESTADO GLOBAL
// ==========================================
let jogoAtivo = false;
let letraSelecionada = null;
let corAtual = JOGO_CONFIG.coresMagicas[0].cor;
let desenhando = false;
let canvas, ctx;
let ajudaVisivel = true;

const somClique = new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. CSS INJETADO (LAYOUT RIGOROSO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .game-area-tracing { display: flex; flex-direction: column; align-items: center; width: 100%; }

    /* MENU DE SELEÇÃO */
    .menu-selecao-letras { 
        display: grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); 
        gap: 12px; width: 100%; max-width: 600px; padding: 20px; margin: 0 auto;
    }
    .card-letra { 
        background: white; border: 3px solid #eee; border-radius: 15px; 
        font-size: 1.8rem; font-weight: 900; color: var(--primary-color); 
        cursor: pointer; height: 70px; display: flex; align-items: center; 
        justify-content: center; transition: 0.2s; box-shadow: 0 4px 0 #eee;
    }
    .card-letra:hover { transform: translateY(-3px); border-color: var(--primary-color); }

    /* CONTENTOR DA LETRA */
    .tracing-container { 
        position: relative; width: 300px; height: 400px; 
        background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        overflow: hidden; touch-action: none; margin-bottom: 20px;
    }
    #canvas-letra { position: absolute; top:0; left:0; z-index: 10; cursor: crosshair; }
    .letra-template { position: absolute; top:0; left:0; width:100%; height:100%; z-index: 5; pointer-events: none; padding: 25px; box-sizing: border-box; }

    /* PALETA (AGORA EM BAIXO DA LETRA) */
    .paleta { display: flex; gap: 20px; margin-bottom: 25px; justify-content: center; }
    .btn-cor { 
        width: 50px; height: 50px; border-radius: 50%; border: 4px solid white; 
        cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.1); transition: 0.2s; 
    }
    .btn-cor.ativa { transform: scale(1.2); border-color: #555; }

    /* CONTROLOS */
    .controles-escrita { display: flex; gap: 15px; width: 100%; justify-content: center; }
    .btn-acao { padding: 12px 25px; border-radius: 25px; border: none; font-weight: 900; color: white; cursor: pointer; text-transform: uppercase; font-size: 0.9rem; }
    .btn-apagar { background: #6c757d; }
    .btn-ajuda { background: #17a2b8; }
    .btn-voltar { background: #ff5a5f; }
`;
document.head.appendChild(style);

// ==========================================
// 3. NAVEGAÇÃO E MENU
// ==========================================
function mostrarCapa() {
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    const area = document.getElementById('game-content');
    
    area.innerHTML = `
        <div style="text-align:center; width:100%;">
            <p style="color:var(--text-grey); font-weight:800; margin-bottom:20px;">Escolhe uma letra para contornar:</p>
            <div class="menu-selecao-letras">
                ${DADOS_JOGO.alfabeto.map(l => `<div class="card-letra" onclick="abrirLetra('${l}')">${l}</div>`).join('')}
            </div>
        </div>`;
    
    document.getElementById('shell-footer-content').style.display = "none";
}

function abrirLetra(l) {
    letraSelecionada = l;
    const dados = DADOS_JOGO.bibliotecaLetras[l] || { viewBox: "0 0 100 120", corpo: "", guias: [] };
    
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div class="game-area-tracing">
            <!-- 1. LETRA -->
            <div class="tracing-container">
                <svg viewBox="${dados.viewBox}" class="letra-template">
                    <path d="${dados.corpo}" fill="#f9f9f9" stroke="#ddd" stroke-width="2" />
                    <g id="ajuda-visual" style="display: ${ajudaVisivel ? 'block' : 'none'}">
                        ${dados.guias.map(g => `
                            <path d="${g.d}" stroke="#bbb" stroke-dasharray="3" fill="none" stroke-width="1" marker-end="url(#seta)" />
                            <circle cx="${g.lx}" cy="${g.ly}" r="6" fill="#e9f0f8" stroke="#bbb" />
                            <text x="${g.lx}" y="${g.ly+4}" font-size="10" text-anchor="middle" font-weight="bold" fill="#666">${g.label}</text>
                        `).join('')}
                    </g>
                    <defs>
                        <marker id="seta" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                            <path d="M0,0 L8,4 L0,8 Z" fill="#bbb" />
                        </marker>
                    </defs>
                </svg>
                <canvas id="canvas-letra" width="300" height="400"></canvas>
            </div>

            <!-- 2. PALETA (Em baixo da letra) -->
            <div class="paleta">
                ${JOGO_CONFIG.coresMagicas.map(c => `
                    <div class="btn-cor" style="background:${c.cor}" onclick="selecionarCor('${c.cor}', this)"></div>
                `).join('')}
            </div>

            <!-- 3. CONTROLOS -->
            <div class="controles-escrita">
                <button class="btn-acao btn-apagar" onclick="limparQuadro()"><i class="fas fa-eraser"></i> Apagar</button>
                <button class="btn-acao btn-ajuda" onclick="toggleAjuda()"><i class="fas fa-eye"></i> Ajuda</button>
                <button class="btn-acao btn-voltar" onclick="mostrarCapa()"><i class="fas fa-arrow-left"></i> Voltar</button>
            </div>
        </div>`;

    inicializarCanvas();
    // Ativa a cor atual na paleta
    const btns = document.querySelectorAll('.btn-cor');
    btns.forEach(b => { if(b.style.backgroundColor.includes(corAtual)) selecionarCor(corAtual, b); });
}

// ==========================================
// 4. LÓGICA DE DESENHO
// ==========================================
function inicializarCanvas() {
    canvas = document.getElementById('canvas-letra');
    ctx = canvas.getContext('2d');
    configurarPincel();
    
    const moverPincel = (e) => {
        if (!desenhando) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        ctx.lineTo(x, y); ctx.stroke();
    };

    const iniciarPincel = (e) => {
        desenhando = true;
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        ctx.moveTo(x, y);
        moverPincel(e);
    };

    canvas.addEventListener('mousedown', iniciarPincel);
    canvas.addEventListener('mousemove', moverPincel);
    window.addEventListener('mouseup', () => { desenhando = false; });
    
    canvas.addEventListener('touchstart', iniciarPincel, {passive: false});
    canvas.addEventListener('touchmove', moverPincel, {passive: false});
    canvas.addEventListener('touchend', () => { desenhando = false; });
}

function configurarPincel() {
    ctx.strokeStyle = corAtual;
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

function selecionarCor(cor, el) {
    corAtual = cor;
    if(ctx) configurarPincel();
    document.querySelectorAll('.btn-cor').forEach(b => b.classList.remove('ativa'));
    el.classList.add('ativa');
    somClique.play();
}

function limparQuadro() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    somClique.play();
}

function toggleAjuda() {
    ajudaVisivel = !ajudaVisivel;
    const el = document.getElementById('ajuda-visual');
    if(el) el.style.display = ajudaVisivel ? 'block' : 'none';
    somClique.play();
}

function tocarAudioInstrucoes() {
    new Audio(JOGO_CONFIG.caminhoSonsBase + DADOS_JOGO.somInstrucoes).play();
}
