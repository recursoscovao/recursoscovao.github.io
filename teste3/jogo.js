let ronda = 1;
let acertos = 0;
let erros = 0;
let itemAlvo = null;

function initJogo() {
    ronda = 1; acertos = 0; erros = 0;
    renderInterface();
    gerarRonda();
}

function renderInterface() {
    const container = document.getElementById('game-injection-point');
    container.innerHTML = `
    <style>
        .status-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; border-bottom: 2px solid #eee; background: #fff; }
        .stat-group { display: flex; align-items: center; gap: 10px; }
        .round-tag { background: var(--cor-dinamica); color: white; padding: 5px 15px; border-radius: 12px; font-weight: 900; }
        .score { color: white; padding: 5px 12px; border-radius: 10px; font-weight: 900; }
        .s-certo { background: #8ed131; } .s-erro { background: #ff5e5e; }
        .play-area { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; gap: 20px; }
        .target-box { width: 120px; height: 120px; border: 4px dashed #6c757d; border-radius: 20px; display: flex; align-items: center; justify-content: center; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; max-width: 500px; }
        .card { aspect-ratio: 1; border: 2px solid #eee; border-radius: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: white; }
        .card img { max-width: 75%; max-height: 75%; object-fit: contain; }
    </style>
    <div class="status-bar">
        <div class="stat-group">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}lampada.png" style="width:40px;cursor:pointer" onclick="ajuda()">
            <div class="round-tag" id="ronda-txt">1 / 10</div>
        </div>
        <div class="stat-group">
            <div class="score s-certo">✓ <span id="v-acertos">0</span></div>
            <div class="score s-erro">X <span id="v-erros">0</span></div>
        </div>
    </div>
    <div class="play-area">
        <div class="target-box" id="alvo"></div>
        <div class="grid" id="opcoes"></div>
    </div>`;
}

function gerarRonda() {
    if (ronda > 10) { pontuacaoFinal = acertos; mudarEcra('resultados'); return; }
    document.getElementById('ronda-txt').innerText = `${ronda} / 10`;
    itemAlvo = DADOS_JOGO_MEMORIA.itens[Math.floor(Math.random() * DADOS_JOGO_MEMORIA.itens.length)];
    document.getElementById('alvo').innerHTML = `<img src="${DADOS_JOGO_MEMORIA.caminhoImagens}${itemAlvo.img}">`;

    let opcoes = [itemAlvo];
    let outros = DADOS_JOGO_MEMORIA.itens.filter(i => i.id !== itemAlvo.id).sort(() => 0.5 - Math.random());
    opcoes = [...opcoes, ...outros.slice(0, 7)].sort(() => 0.5 - Math.random());

    const grid = document.getElementById('opcoes');
    grid.innerHTML = '';
    opcoes.forEach(item => {
        const div = document.createElement('div'); div.className = 'card';
        div.innerHTML = `<img src="${DADOS_JOGO_MEMORIA.caminhoImagens}${item.img}">`;
        div.onclick = () => {
            if (item.id === itemAlvo.id) { acertos++; div.style.borderColor = "#8ed131"; setTimeout(() => { ronda++; gerarRonda(); }, 600); } 
            else { erros++; div.style.borderColor = "#ff5e5e"; div.style.opacity = "0.4"; }
            document.getElementById('v-acertos').innerText = acertos;
            document.getElementById('v-erros').innerText = erros;
        };
        grid.appendChild(div);
    });
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
