let ronda = 1;
let acertos = 0;
let erros = 0;
let itemAlvo = null;

const dadosMemoria = window.parent.DADOS_JOGO_MEMORIA;
const configPai = window.parent.JOGO_CONFIG;

function init() {
    renderInterface();
    gerarRonda();
}

function renderInterface() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
    <style>
        .status-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; border-bottom: 2px solid #eee; }
        .stat-group { display: flex; align-items: center; gap: 10px; }
        .btn-lamp { width: 40px; cursor: pointer; transition: 0.2s; }
        .round-tag { background: #E691A7; color: white; padding: 5px 15px; border-radius: 12px; font-weight: 900; }
        .score { color: white; padding: 5px 12px; border-radius: 10px; font-weight: 900; }
        .s-certo { background: #8ed131; } .s-erro { background: #ff5e5e; }
        .btn-i { width: 30px; height: 30px; border: 2px solid #8792a1; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #8792a1; font-weight: 900; cursor: pointer; }
        
        .play-area { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; gap: 20px; }
        .target-box { width: 150px; height: 150px; border: 4px dashed #6c757d; border-radius: 20px; display: flex; align-items: center; justify-content: center; }
        .target-box img { max-width: 80%; max-height: 80%; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; max-width: 500px; }
        .card { aspect-ratio: 1; border: 2px solid #eee; border-radius: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: white; transition: 0.2s; }
        .card img { max-width: 70%; max-height: 70%; }
        .card:hover { border-color: #6c757d; transform: scale(1.05); }
    </style>
    <div class="status-bar">
        <div class="stat-group">
            <img src="${configPai.caminhoIconsMenu}lampada.png" class="btn-lamp" onclick="ajuda()">
            <div class="round-tag" id="ronda-txt">1 / 10</div>
        </div>
        <div class="stat-group">
            <div class="score s-certo">✓ <span id="v-acertos">0</span></div>
            <div class="score s-erro">X <span id="v-erros">0</span></div>
            <div class="btn-i" onclick="window.parent.toggleInfoScreen(true)">i</div>
        </div>
    </div>
    <div class="play-area">
        <div class="target-box" id="alvo"></div>
        <div class="grid" id="opcoes"></div>
    </div>`;
}

function gerarRonda() {
    if (ronda > 10) {
        window.parent.pontuacaoFinal = acertos;
        window.parent.mudarEcra('resultados');
        return;
    }
    document.getElementById('ronda-txt').innerText = `${ronda} / 10`;
    
    // Escolher alvo
    itemAlvo = dadosMemoria.itens[Math.floor(Math.random() * dadosMemoria.itens.length)];
    document.getElementById('alvo').innerHTML = `<img src="${dadosMemoria.caminhoImagens}${itemAlvo.img}">`;

    // Criar 8 opções (1 correta + 7 erradas)
    let opcoes = [itemAlvo];
    let outros = dadosMemoria.itens.filter(i => i.id !== itemAlvo.id).sort(() => 0.5 - Math.random());
    opcoes = [...opcoes, ...outros.slice(0, 7)].sort(() => 0.5 - Math.random());

    const grid = document.getElementById('opcoes');
    grid.innerHTML = '';
    opcoes.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<img src="${dadosMemoria.caminhoImagens}${item.img}">`;
        div.onclick = () => validar(item.id, div);
        grid.appendChild(div);
    });
}

function validar(id, el) {
    if (id === itemAlvo.id) {
        acertos++;
        document.getElementById('v-acertos').innerText = acertos;
        el.style.borderColor = "#8ed131";
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
        el.style.opacity = "0.5";
        el.style.pointerEvents = "none"; // Impede clicar no mesmo erro
    }
}

function ajuda() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(c => {
        if (c.innerHTML.includes(itemAlvo.img)) {
            c.style.background = "#fff9c4";
            setTimeout(() => c.style.background = "white", 1000);
        }
    });
}

init();
