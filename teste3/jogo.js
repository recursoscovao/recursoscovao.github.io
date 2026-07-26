let ronda = 1;
let acertos = 0;
let erros = 0;
let itemAlvo = null;

// Função chamada pelo Index quando o botão Jogar é clicado
function initJogo() {
    ronda = 1;
    acertos = 0;
    erros = 0;
    renderInterface();
    gerarRonda();
}

function renderInterface() {
    const container = document.getElementById('game-injection-point');
    container.innerHTML = `
    <style>
        .status-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; border-bottom: 2px solid #eee; background: #fff; }
        .stat-group { display: flex; align-items: center; gap: 10px; }
        .btn-lamp { width: 40px; cursor: pointer; transition: 0.2s; }
        .round-tag { background: var(--cor-dinamica); color: white; padding: 5px 15px; border-radius: 12px; font-weight: 900; }
        .score { color: white; padding: 5px 12px; border-radius: 10px; font-weight: 900; }
        .s-certo { background: #8ed131; } .s-erro { background: #ff5e5e; }
        .btn-i-jogo { width: 30px; height: 30px; border: 2px solid #8792a1; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #8792a1; font-weight: 900; cursor: pointer; }
        
        .play-area { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; gap: 20px; }
        .target-box { width: 120px; height: 120px; border: 4px dashed #6c757d; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: #f9f9f9; }
        .target-box img { max-width: 80%; max-height: 80%; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; max-width: 500px; }
        .card { aspect-ratio: 1; border: 2px solid #eee; border-radius: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: white; transition: 0.2s; }
        .card img { max-width: 70%; max-height: 70%; }
        .card:hover { border-color: var(--cor-dinamica); transform: scale(1.02); }

        @media (max-width: 500px) {
            .grid { grid-template-columns: repeat(3, 1fr); }
            .card:nth-child(n+7) { display: flex; } /* Ajuste para mobile se necessário */
        }
    </style>
    <div class="status-bar">
        <div class="stat-group">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}lampada.png" class="btn-lamp" onclick="ajuda()">
            <div class="round-tag" id="ronda-txt">1 / 10</div>
        </div>
        <div class="stat-group">
            <div class="score s-certo">✓ <span id="v-acertos">0</span></div>
            <div class="score s-erro">X <span id="v-erros">0</span></div>
            <div class="btn-i-jogo" onclick="toggleInfoScreen(true)">i</div>
        </div>
    </div>
    <div class="play-area">
        <div class="target-box" id="alvo"></div>
        <div class="grid" id="opcoes"></div>
    </div>`;
}

function gerarRonda() {
    if (ronda > 10) {
        pontuacaoFinal = acertos;
        mudarEcra('resultados');
        return;
    }
    
    document.getElementById('ronda-txt').innerText = `${ronda} / 10`;
    document.getElementById('v-acertos').innerText = acertos;
    document.getElementById('v-erros').innerText = erros;
    
    // Escolher alvo aleatório
    itemAlvo = DADOS_JOGO_MEMORIA.itens[Math.floor(Math.random() * DADOS_JOGO_MEMORIA.itens.length)];
    document.getElementById('alvo').innerHTML = `<img src="${DADOS_JOGO_MEMORIA.caminhoImagens}${itemAlvo.img}">`;

    // Criar opções (1 correta + 7 erradas)
    let opcoes = [itemAlvo];
    let outros = DADOS_JOGO_MEMORIA.itens.filter(i => i.id !== itemAlvo.id).sort(() => 0.5 - Math.random());
    opcoes = [...opcoes, ...outros.slice(0, 7)].sort(() => 0.5 - Math.random());

    const grid = document.getElementById('opcoes');
    grid.innerHTML = '';
    opcoes.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<img src="${DADOS_JOGO_MEMORIA.caminhoImagens}${item.img}">`;
        div.onclick = () => validar(item.id, div);
        grid.appendChild(div);
    });
}

function validar(id, el) {
    if (id === itemAlvo.id) {
        acertos++;
        document.getElementById('v-acertos').innerText = acertos;
        el.style.borderColor = "#8ed131";
        el.style.background = "#e8f5e9";
        document.getElementById('opcoes').style.pointerEvents = "none";
        setTimeout(() => { 
            ronda++; 
            document.getElementById('opcoes').style.pointerEvents = "auto";
            gerarRonda(); 
        }, 800);
    } else {
        erros++;
        document.getElementById('v-erros').innerText = erros;
        el.style.borderColor = "#ff5e5e";
        el.style.opacity = "0.4";
        el.style.pointerEvents = "none"; 
    }
}

function ajuda() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(c => {
        if (c.innerHTML.includes(itemAlvo.img)) {
            c.style.background = "#fff9c4";
            c.style.transform = "scale(1.1)";
            setTimeout(() => {
                c.style.background = "white";
                c.style.transform = "scale(1)";
            }, 1000);
        }
    });
}
