// ==========================================
// CONFIGURAÇÕES INICIAIS
// ==========================================
let rondaAtual = 1;
let acertos = 0;
let erros = 0;
const totalRondas = 10;
let itemCorreto = null;

// Aceder aos dados do ficheiro pai (dados.js)
const dados = window.parent.DADOS_JOGO_MEMORIA;
const tema = window.parent.BIBLIOTECA_TEMAS[window.parent.JOGO_CONFIG.areaAtiva];

// ==========================================
// INICIALIZAÇÃO
// ==========================================
window.onload = () => {
    configurarCores();
    criarInterface();
    novaRonda();
};

function configurarCores() {
    // Aplica a cor do tema ao fundo e elementos
    document.body.style.backgroundColor = "#ffffff";
}

// ==========================================
// INTERFACE E BARRA DE STATUS
// ==========================================
function criarInterface() {
    const app = document.getElementById('jogo-app');
    app.innerHTML = `
        <style>
            .status-bar {
                display: flex; align-items: center; justify-content: space-between;
                padding: 10px 15px; background: #fff; border-bottom: 2px solid #eee;
                font-family: 'Nunito', sans-serif;
            }
            .status-left, .status-right { display: flex; align-items: center; gap: 10px; }
            .stat-box { 
                background: ${tema.corPrimaria}; color: white; padding: 5px 15px; 
                border-radius: 15px; font-weight: 800; font-size: 1.1rem;
            }
            .help-icon { width: 40px; cursor: pointer; transition: transform 0.2s; }
            .help-icon:hover { transform: scale(1.1); }
            .score-box { 
                display: flex; align-items: center; gap: 5px; padding: 5px 12px; 
                border-radius: 10px; color: white; font-weight: 800;
            }
            .score-certo { background: #8ed131; }
            .score-errado { background: #ff5e5e; }
            .btn-info-jogo {
                width: 35px; height: 35px; border-radius: 50%; border: 2px solid #666;
                display: flex; align-items: center; justify-content: center; 
                cursor: pointer; color: #666; font-weight: bold;
            }

            .game-content { padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 30px; }
            .target-area { 
                width: 180px; height: 180px; padding: 15px;
                border: 4px dashed ${tema.corPrimaria}; border-radius: 25px;
                display: flex; align-items: center; justify-content: center; background: #f9f9f9;
            }
            .target-area img { max-width: 100%; max-height: 100%; object-fit: contain; }
            
            .options-grid { 
                display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; 
                max-width: 600px; width: 100%; 
            }
            .option-card { 
                aspect-ratio: 1; background: white; border: 2px solid #eee; 
                border-radius: 20px; cursor: pointer; display: flex; 
                align-items: center; justify-content: center; padding: 10px;
                transition: 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .option-card:hover { transform: translateY(-3px); border-color: ${tema.corPrimaria}; }
            .option-card img { max-width: 100%; max-height: 100%; object-fit: contain; }
            
            @media (max-width: 500px) { .options-grid { grid-template-columns: repeat(3, 1fr); } }
        </style>

        <div class="status-bar">
            <div class="status-left">
                <img src="../icons/lampada.png" class="help-icon" onclick="darDica()" alt="Ajuda">
                <div class="stat-box" id="display-ronda">1 / 10</div>
            </div>
            <div class="status-right">
                <div class="score-box score-certo">✓ <span id="count-certos">0</span></div>
                <div class="score-box score-errado">X <span id="count-errados">0</span></div>
                <div class="btn-info-jogo" onclick="window.parent.toggleInfoScreen(true)">i</div>
            </div>
        </div>

        <div class="game-content">
            <div class="target-area" id="alvo-container"></div>
            <div class="options-grid" id="opcoes-container"></div>
        </div>
    `;
}

// ==========================================
// LÓGICA DO JOGO
// ==========================================

function novaRonda() {
    if (rondaAtual > totalRondas) {
        finalizarJogo();
        return;
    }

    // Atualizar UI
    document.getElementById('display-ronda').innerText = `${rondaAtual} / ${totalRondas}`;
    
    // Escolher item correto aleatoriamente
    const itensDisponiveis = [...dados.itens];
    itemCorreto = itensDisponiveis[Math.floor(Math.random() * itensDisponiveis.length)];

    // Mostrar alvo
    const alvoContainer = document.getElementById('alvo-container');
    alvoContainer.innerHTML = `<img src="../${dados.caminhoImagens}${itemCorreto.img}" alt="Alvo">`;

    // Gerar opções (8 imagens no total, incluindo a correta)
    let opcoes = [itemCorreto];
    let outrosItens = itensDisponiveis.filter(i => i.id !== itemCorreto.id);
    
    // Baralhar e pegar 7 itens errados
    outrosItens.sort(() => Math.random() - 0.5);
    opcoes = [...opcoes, ...outrosItens.slice(0, 7)];
    
    // Baralhar as 8 opções finais
    opcoes.sort(() => Math.random() - 0.5);

    // Renderizar grelha
    const grid = document.getElementById('opcoes-container');
    grid.innerHTML = '';
    opcoes.forEach(item => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.innerHTML = `<img src="../${dados.caminhoImagens}${item.img}">`;
        card.onclick = () => verificarResposta(item.id, card);
        grid.appendChild(card);
    });
}

function verificarResposta(id, elemento) {
    if (id === itemCorreto.id) {
        // ACERTO
        acertos++;
        document.getElementById('count-certos').innerText = acertos;
        elemento.style.backgroundColor = "#e8f9f4";
        elemento.style.borderColor = "#45cfa8";
        
        setTimeout(() => {
            rondaAtual++;
            novaRonda();
        }, 600);
    } else {
        // ERRO
        erros++;
        document.getElementById('count-errados').innerText = erros;
        elemento.style.backgroundColor = "#fff5f7";
        elemento.style.borderColor = "#ff5e5e";
        elemento.style.pointerEvents = "none"; // Impede clicar na mesma errada
        
        // Feedback visual de erro (abana)
        elemento.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], { duration: 200 });
    }
}

function darDica() {
    const cards = document.querySelectorAll('.option-card');
    cards.forEach(card => {
        // Se encontrar a imagem correta na grelha, dá um brilho temporário
        if (card.innerHTML.includes(itemCorreto.img)) {
            card.style.boxShadow = `0 0 20px ${tema.corPrimaria}`;
            setTimeout(() => card.style.boxShadow = "none", 800);
        }
    });
}

function finalizarJogo() {
    // Envia a pontuação para o index.html (parent) e muda para o ecrã de resultados
    // A pontuação é baseada nos acertos (0-10)
    window.parent.pontuacaoGanha = acertos; 
    window.parent.mudarEcra('resultados');
}
