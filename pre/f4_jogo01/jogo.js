// ==========================================
// 1. CONFIGURAÇÃO E PONTOS DAS LETRAS
// ==========================================
// Exemplo de como deves estruturar os pontos para a letra A (coordenadas x, y)
// Podes ajustar estes números para baterem certo com a tua imagem
DADOS_JOGO.itens.forEach(item => {
    if (item.id === 'A') {
        item.pontos = [
            // Passo 1 (Esquerda descendo)
            { x: 150, y: 50, s: 1, v: false }, { x: 135, y: 90, s: 1, v: false }, { x: 120, y: 130, s: 1, v: false },
            { x: 105, y: 170, s: 1, v: false }, { x: 90, y: 210, s: 1, v: false }, { x: 75, y: 250, s: 1, v: false },
            { x: 60, y: 290, s: 1, v: false },
            // Passo 2 (Direita descendo)
            { x: 165, y: 90, s: 2, v: false }, { x: 180, y: 130, s: 2, v: false }, { x: 195, y: 170, s: 2, v: false },
            { x: 210, y: 210, s: 2, v: false }, { x: 225, y: 250, s: 2, v: false }, { x: 240, y: 290, s: 2, v: false },
            // Passo 3 (Traço meio)
            { x: 110, y: 200, s: 3, v: false }, { x: 140, y: 200, s: 3, v: false }, { x: 170, y: 200, s: 3, v: false }, { x: 200, y: 200, s: 3, v: false }
        ];
    }
    // Adiciona pontos para o D e outras letras seguindo o mesmo modelo
});

let itemSelecionado = null;
let jogoAtivo = false;
let letrasConcluidas = 0;
let corPontoAtivo = "#ffffff"; // Cor da bolinha quando preenchida (ex: branco)

// ==========================================
// 2. CSS INJETADO (ESTILO IGUAL À IMAGEM)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .tracing-area { position: relative; width: 300px; height: 400px; background: #0b2d2d; border-radius: 15px; overflow: hidden; }
    .letra-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; pointer-events: none; padding: 20px; box-sizing: border-box; }
    #canvas-pontos { position: absolute; top: 0; left: 0; z-index: 10; cursor: pointer; }
    
    .menu-scroll { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-height: 300px; overflow-y: auto; padding: 10px; }
    .card-letra { background: white; border-radius: 10px; padding: 10px; cursor: pointer; border: 2px solid #eee; display: flex; justify-content: center; }
    .card-letra img { width: 50px; }
`;
document.head.appendChild(style);

// ==========================================
// 3. FUNÇÕES DE NAVEGAÇÃO
// ==========================================
function mostrarCapa() {
    document.getElementById('game-content').innerHTML = `
        <div style="text-align:center; padding: 20px;">
            <h2 style="color:var(--primary-color)">JOGO DE TRAÇAR</h2>
            <button class="btn-play-rect" onclick="mostrarMenu()">JOGAR</button>
        </div>`;
}

function mostrarMenu() {
    document.getElementById('game-content').innerHTML = `
        <div style="padding:10px;">
            <h3 style="text-align:center;">Escolhe a letra:</h3>
            <div class="menu-scroll">
                ${DADOS_JOGO.itens.map(it => `
                    <div class="card-letra" onclick="abrirLetra('${it.id}')">
                        <img src="${DADOS_JOGO.caminhoRecursos + it.img}">
                    </div>
                `).join('')}
            </div>
        </div>`;
}

function abrirLetra(id) {
    itemSelecionado = JSON.parse(JSON.stringify(DADOS_JOGO.itens.find(i => i.id === id))); 
    jogoAtivo = true;
    
    document.getElementById('game-content').innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px;">
            <div class="tracing-area">
                <img src="${DADOS_JOGO.caminhoRecursos + itemSelecionado.img}" class="letra-bg">
                <canvas id="canvas-pontos" width="300" height="400"></canvas>
            </div>
            <button class="btn-acao" style="background:#ff5a5f" onclick="mostrarMenu()">VOLTAR</button>
        </div>`;

    Engine.showStatusBar(letrasConcluidas + 1, DADOS_JOGO.itens.length, letrasConcluidas, 0);
    renderizarPontos();
    configurarInteracao();
}

// ==========================================
// 4. LÓGICA DOS PONTOS (PREENCHIMENTO)
// ==========================================
function renderizarPontos() {
    const canvas = document.getElementById('canvas-pontos');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    itemSelecionado.pontos.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        // Cor da bolinha: se ativa (preenchida), usa branco. Se não, usa cinza escuro.
        ctx.fillStyle = p.v ? corPontoAtivo : "#1a1a1a";
        ctx.fill();
        ctx.closePath();
    });
}

function configurarInteracao() {
    const canvas = document.getElementById('canvas-pontos');
    
    const detectarPonto = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        itemSelecionado.pontos.forEach(p => {
            // Calcula distância entre o rato e o centro da bolinha
            const dist = Math.sqrt((x - p.x)**2 + (y - p.y)**2);
            if (dist < 15 && !p.v) { // Se estiver perto o suficiente e ainda não preenchido
                p.v = true;
                renderizarPontos();
                verificarConclusao();
            }
        });
    };

    canvas.addEventListener('mousemove', (e) => { if(e.buttons === 1) detectarPonto(e.clientX, e.clientY); });
    canvas.addEventListener('touchmove', (e) => { detectarPonto(e.touches[0].clientX, e.touches[0].clientY); }, {passive: false});
    canvas.addEventListener('mousedown', (e) => detectarPonto(e.clientX, e.clientY));
}

function verificarConclusao() {
    const todosPreenchidos = itemSelecionado.pontos.every(p => p.v);
    
    if (todosPreenchidos && jogoAtivo) {
        jogoAtivo = false;
        letrasConcluidas++;
        new Audio(JOGO_CONFIG.caminhoSonsBase + JOGO_CONFIG.sons.acerto).play();
        
        // Feedback visual: a letra brilha
        document.querySelector('.tracing-area').style.boxShadow = "0 0 30px #fff";
        
        setTimeout(() => {
            if (letrasConcluidas >= DADOS_JOGO.itens.length) {
                Engine.showResults(letrasConcluidas, 0, 0, JOGO_CONFIG.relatorios[0]);
            } else {
                mostrarMenu();
            }
        }, 1500);
    }
}

mostrarCapa();
