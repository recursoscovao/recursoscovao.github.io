// Variáveis de controlo do estado do jogo
let ronda = 1;
let acertos = 0;
let erros = 0;
let itemAlvo = null;

/**
 * CONFIGURAÇÃO DA APRESENTAÇÃO (SOBREPÕE O INDEX.HTML)
 */
function configurarApresentacao() {
    const areaConteudo = document.getElementById('area-jogo-conteudo');
    if (areaConteudo) {
        areaConteudo.innerHTML = `
        <style>
            .demo-container { display: flex; flex-direction: column; align-items: center; gap: 15px; position: relative; width: 100%; height: 100%; justify-content: center; }
            .demo-target { width: 100px; height: 100px; border: 4px dashed var(--cor-dinamica); border-radius: 20px; display: flex; align-items: center; justify-content: center; animation: pulseDemo 2s infinite; background: white; }
            .demo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
            .demo-card { width: 60px; height: 60px; border: 2px solid #eee; border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; }
            .demo-hand { position: absolute; font-size: 35px; color: var(--cor-dinamica); animation: moveHandDemo 3s infinite; pointer-events: none; z-index: 10; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.2)); }
            @keyframes pulseDemo { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
            @keyframes moveHandDemo {
                0% { transform: translate(60px, 160px); opacity: 0; }
                20% { transform: translate(60px, 160px); opacity: 1; }
                50% { transform: translate(5px, 115px); opacity: 1; } 
                70% { transform: translate(5px, 115px); scale: 0.8; opacity: 1; }
                100% { transform: translate(5px, 115px); opacity: 0; }
            }
            .flash-win { animation: flashWinDemo 3s infinite; }
            @keyframes flashWinDemo { 0%, 50% { background: white; } 60% { background: #8ed131; border-color: #8ed131; } 100% { background: white; } }
            
            /* CSS para esconder elementos no view-jogo quando ativo */
            #view-jogo .card-topo, #view-jogo .card-fundo { display: none !important; }
            #view-jogo .card-meio { border-radius: 25px; height: 100%; }
        </style>
        <div class="demo-container">
            <div class="demo-target"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[0].img}" style="width:75%"></div>
            <div class="demo-grid">
                <div class="demo-card"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[1].img}" style="width:70%"></div>
                <div class="demo-card flash-win"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[0].img}" style="width:70%"></div>
                <div class="demo-card"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[2].img}" style="width:70%"></div>
            </div>
            <i class="fas fa-mouse-pointer demo-hand"></i>
        </div>`;
    }

    const infoTexto = document.getElementById('info-texto');
    if (infoTexto) {
        infoTexto.innerHTML = `
            <div style="text-align: left; padding: 10px; font-size: 1rem;">
                <h3 style="color: var(--cor-dinamica); margin-bottom: 10px; font-weight: 900;">OBJETIVO DO JOGO</h3>
                <p>Observa atentamente o animal apresentado no topo do ecrã e encontra a imagem igual entre as várias opções.</p>
                <h3 style="color: var(--cor-dinamica); margin-top: 20px; margin-bottom: 10px; font-weight: 900;">COMO JOGAR</h3>
                <ul style="padding-left: 20px; line-height: 1.5;">
                    <li>Observa o animal no topo.</li>
                    <li>Clica na imagem <b>exatamente igual</b> na grelha.</li>
                    <li>Cada escolha (certa ou errada) conta como uma ronda.</li>
                    <li>O jogo termina após 10 rondas.</li>
                </ul>
                <h3 style="color: var(--cor-dinamica); margin-top: 20px; margin-bottom: 10px; font-weight: 900;">DICAS</h3>
                <p>Observa as cores e detalhes! Alguns animais são muito parecidos.</p>
            </div>`;
    }
}

setTimeout(configurarApresentacao, 150);

/**
 * LÓGICA DO JOGO
 */

function initJogo() {
    ronda = 1; acertos = 0; erros = 0;
    renderInterface();
    gerarRonda();
}

function renderInterface() {
    const container = document.getElementById('game-injection-point');
    container.innerHTML = `
    <style>
        .status-bar { display: flex; align-items: center; justify-content: space-between; padding: 12px 15px; border-bottom: 2px solid #f0f2f5; background: #fff; width: 100%; }
        .stat-group { display: flex; align-items: center; gap: 8px; }
        .round-tag { background: #f0f2f5; color: #5d7082; padding: 5px 12px; border-radius: 10px; font-weight: 900; font-size: 0.9rem; }
        .score { color: white; padding: 5px 12px; border-radius: 10px; font-weight: 900; min-width: 40px; text-align: center; }
        .s-certo { background: #8ed131; } .s-erro { background: #ff5e5e; }
        .btn-mini-info { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--cor-dinamica); color: var(--cor-dinamica); display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer; font-style: italic; font-family: 'Georgia', serif; }
        .play-area { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px; gap: 15px; flex: 1; }
        .target-box { width: 120px; height: 120px; border: 4px dashed #adb5bd; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: #fff; }
        .target-box img { max-width: 80%; max-height: 80%; object-fit: contain; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; max-width: 500px; }
        .card { aspect-ratio: 1; border: 2px solid #eee; border-radius: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: white; transition: 0.2s; }
        .card img { max-width: 75%; max-height: 75%; object-fit: contain; }
    </style>
    <div class="status-bar">
        <div class="stat-group">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}lampada.png" style="width:35px;cursor:pointer" onclick="ajuda()">
            <div class="round-tag" id="ronda-txt">1 / 10</div>
        </div>
        <div class="stat-group">
            <div class="score s-certo">✓ <span id="v-acertos">0</span></div>
            <div class="score s-erro">X <span id="v-erros">0</span></div>
            <div class="btn-mini-info" onclick="toggleInfoScreen(true)">i</div>
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
        setTimeout(() => mudarEcra('resultados'), 400); 
        return; 
    }
    
    document.getElementById('ronda-txt').innerText = `${ronda} / 10`;
    
    itemAlvo = DADOS_JOGO.itens[Math.floor(Math.random() * DADOS_JOGO.itens.length)];
    document.getElementById('alvo').innerHTML = `<img src="${DADOS_JOGO.caminhoImagens}${itemAlvo.img}">`;

    let opcoes = [itemAlvo];
    let outros = DADOS_JOGO.itens.filter(i => i.id !== itemAlvo.id).sort(() => 0.5 - Math.random());
    opcoes = [...opcoes, ...outros.slice(0, 7)].sort(() => 0.5 - Math.random());

    const grid = document.getElementById('opcoes');
    grid.innerHTML = '';
    
    opcoes.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<img src="${DADOS_JOGO.caminhoImagens}${item.img}">`;
        div.onclick = () => {
            // Bloqueia cliques imediatos para processar a ronda
            const cards = document.querySelectorAll('.card');
            cards.forEach(c => c.style.pointerEvents = 'none');

            if (item.id === itemAlvo.id) {
                acertos++;
                div.style.borderColor = "#8ed131";
                div.style.background = "#f1f8e9";
            } else {
                erros++;
                div.style.borderColor = "#ff5e5e";
                div.style.background = "#fff5f5";
            }
            
            document.getElementById('v-acertos').innerText = acertos;
            document.getElementById('v-erros').innerText = erros;

            // Em ambos os casos (acerto ou erro), avança a ronda
            setTimeout(() => {
                ronda++;
                gerarRonda();
            }, 700);
        };
        grid.appendChild(div);
    });
}

function ajuda() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(c => {
        if (c.innerHTML.includes(itemAlvo.img)) {
            c.style.background = "#fff9c4";
            c.style.transform = "scale(1.05)";
            setTimeout(() => {
                c.style.background = "white";
                c.style.transform = "scale(1)";
            }, 1000);
        }
    });
}
