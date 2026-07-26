// Variáveis de controlo do estado do jogo
let ronda = 1;
let acertos = 0;
let erros = 0;
let itemAlvo = null;

/**
 * INJEÇÃO DE CONTEÚDO NA APRESENTAÇÃO
 * Usamos um pequeno delay para garantir que o script do index.html (inviolável)
 * não apague as nossas alterações após carregar.
 */
function configurarApresentacao() {
    // Injetar Animação de Exemplo no card-meio
    const areaConteudo = document.getElementById('area-jogo-conteudo');
    if (areaConteudo) {
        areaConteudo.innerHTML = `
        <style>
            .demo-container { display: flex; flex-direction: column; align-items: center; gap: 20px; position: relative; width: 100%; }
            .demo-target { width: 100px; height: 100px; border: 4px dashed var(--cor-dinamica); border-radius: 20px; display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite; background: white; }
            .demo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
            .demo-card { width: 60px; height: 60px; border: 2px solid #eee; border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; }
            .demo-hand { position: absolute; font-size: 35px; color: var(--cor-dinamica); animation: moveHand 3s infinite; pointer-events: none; z-index: 10; }
            
            @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
            @keyframes moveHand {
                0% { transform: translate(60px, 160px); opacity: 0; }
                20% { transform: translate(60px, 160px); opacity: 1; }
                50% { transform: translate(0px, 130px); opacity: 1; } 
                70% { transform: translate(0px, 130px); scale: 0.8; opacity: 1; }
                100% { transform: translate(0px, 130px); opacity: 0; }
            }
            .correct-flash { animation: flashGreen 3s infinite; }
            @keyframes flashGreen { 0%, 50% { background: white; } 60% { background: #8ed131; border-color: #8ed131; } 100% { background: white; } }
        </style>
        <div class="demo-container">
            <div class="demo-target"><img src="${DADOS_JOGO_MEMORIA.caminhoImagens}${DADOS_JOGO_MEMORIA.itens[0].img}" style="width:70%"></div>
            <div class="demo-grid">
                <div class="demo-card"><img src="${DADOS_JOGO_MEMORIA.caminhoImagens}${DADOS_JOGO_MEMORIA.itens[1].img}" style="width:70%"></div>
                <div class="demo-card correct-flash"><img src="${DADOS_JOGO_MEMORIA.caminhoImagens}${DADOS_JOGO_MEMORIA.itens[0].img}" style="width:70%"></div>
                <div class="demo-card"><img src="${DADOS_JOGO_MEMORIA.caminhoImagens}${DADOS_JOGO_MEMORIA.itens[2].img}" style="width:70%"></div>
            </div>
            <i class="fas fa-mouse-pointer demo-hand"></i>
        </div>`;
    }

    // Injetar Texto Detalhado no ecrã de Informação
    const infoTexto = document.getElementById('info-texto');
    if (infoTexto) {
        infoTexto.innerHTML = `
            <div style="text-align: left; padding: 10px;">
                <h3 style="color: var(--cor-dinamica); margin-bottom: 10px;">Objetivo do jogo</h3>
                <p>Observa atentamente o animal apresentado no topo do ecrã e encontra a imagem igual entre as várias opções. Clica ou toca no animal correto para avançares para a ronda seguinte.</p>
                
                <h3 style="color: var(--cor-dinamica); margin-top: 20px; margin-bottom: 10px;">Como jogar</h3>
                <ul style="padding-left: 20px; line-height: 1.6;">
                    <li>Observa o animal que aparece no topo do ecrã.</li>
                    <li>Analisa todas as imagens apresentadas na grelha.</li>
                    <li>Encontra a imagem <b>exatamente igual</b> ao modelo.</li>
                    <li>Clica ou toca no animal correto.</li>
                    <li>Se acertares, passas para a próxima ronda. Se errares, podes tentar de novo!</li>
                </ul>

                <h3 style="color: var(--cor-dinamica); margin-top: 20px; margin-bottom: 10px;">O que vais desenvolver?</h3>
                <p>Este jogo ajuda a treinar a tua atenção, concentração e memória visual.</p>
            </div>`;
    }
}

// Executa a configuração logo após o carregamento total, com um pequeno atraso
// para "ganhar" ao script que está dentro do index.html
setTimeout(configurarApresentacao, 100);

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
        .status-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; border-bottom: 2px solid #eee; background: #fff; }
        .stat-group { display: flex; align-items: center; gap: 10px; }
        .round-tag { background: var(--cor-dinamica); color: white; padding: 5px 15px; border-radius: 12px; font-weight: 900; }
        .score { color: white; padding: 5px 12px; border-radius: 10px; font-weight: 900; min-width: 45px; text-align: center; }
        .s-certo { background: #8ed131; } .s-erro { background: #ff5e5e; }
        .play-area { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; gap: 20px; flex: 1; }
        .target-box { width: 120px; height: 120px; border: 4px dashed #6c757d; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: #fff; }
        .target-box img { max-width: 80%; max-height: 80%; object-fit: contain; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; max-width: 500px; }
        .card { aspect-ratio: 1; border: 2px solid #eee; border-radius: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: white; transition: 0.2s; }
        .card:active { transform: scale(0.9); }
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
    if (ronda > 10) { 
        pontuacaoFinal = acertos; 
        mudarEcra('resultados'); 
        return; 
    }
    
    document.getElementById('ronda-txt').innerText = `${ronda} / 10`;
    
    // Escolher item alvo aleatório
    itemAlvo = DADOS_JOGO_MEMORIA.itens[Math.floor(Math.random() * DADOS_JOGO_MEMORIA.itens.length)];
    document.getElementById('alvo').innerHTML = `<img src="${DADOS_JOGO_MEMORIA.caminhoImagens}${itemAlvo.img}">`;

    // Gerar opções (1 correta + 7 erradas)
    let opcoes = [itemAlvo];
    let outros = DADOS_JOGO_MEMORIA.itens.filter(i => i.id !== itemAlvo.id).sort(() => 0.5 - Math.random());
    opcoes = [...opcoes, ...outros.slice(0, 7)].sort(() => 0.5 - Math.random());

    const grid = document.getElementById('opcoes');
    grid.innerHTML = '';
    
    opcoes.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<img src="${DADOS_JOGO_MEMORIA.caminhoImagens}${item.img}">`;
        div.onclick = () => {
            if (item.id === itemAlvo.id) {
                acertos++;
                div.style.borderColor = "#8ed131";
                div.style.background = "#e8f5e9";
                
                // Bloqueia cliques para evitar pontuação repetida na mesma ronda
                const cards = document.querySelectorAll('.card');
                cards.forEach(c => c.style.pointerEvents = 'none');
                
                setTimeout(() => {
                    ronda++;
                    gerarRonda();
                }, 600);
            } else {
                erros++;
                div.style.borderColor = "#ff5e5e";
                div.style.opacity = "0.4";
                div.style.pointerEvents = 'none'; // Bloqueia clicar no mesmo erro de novo
            }
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
            c.style.transform = "scale(1.1)";
            setTimeout(() => {
                c.style.background = "white";
                c.style.transform = "scale(1)";
            }, 1000);
        }
    });
}
