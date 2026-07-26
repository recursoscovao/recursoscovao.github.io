// Variáveis de controlo do estado do jogo
let ronda = 1;
let acertos = 0;
let erros = 0;
let itemAlvo = null;

/**
 * CONFIGURAÇÃO INICIAL (Executa ao carregar o ficheiro)
 * Injeta a animação e os textos detalhados na view-apresentacao
 */
(function setupApresentacao() {
    window.addEventListener('load', () => {
        // 1. Injetar Animação de Exemplo no card-meio da apresentação
        const areaConteudo = document.getElementById('area-jogo-conteudo');
        if (areaConteudo) {
            areaConteudo.innerHTML = `
            <style>
                .demo-container { display: flex; flex-direction: column; align-items: center; gap: 20px; position: relative; }
                .demo-target { width: 80px; height: 80px; border: 3px dashed #6c757d; border-radius: 15px; display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite; }
                .demo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
                .demo-card { width: 50px; height: 50px; border: 2px solid #eee; border-radius: 10px; background: white; display: flex; align-items: center; justify-content: center; }
                .demo-hand { position: absolute; font-size: 30px; color: var(--cor-dinamica); animation: moveHand 3s infinite; pointer-events: none; }
                
                @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
                @keyframes moveHand {
                    0% { transform: translate(50px, 150px); opacity: 0; }
                    20% { transform: translate(50px, 150px); opacity: 1; }
                    50% { transform: translate(0px, 120px); opacity: 1; } /* Move para o centro da grelha */
                    70% { transform: translate(0px, 120px); scale: 0.8; opacity: 1; } /* Simula clique */
                    100% { transform: translate(0px, 120px); opacity: 0; }
                }
                .correct-flash { animation: flashGreen 3s infinite; }
                @keyframes flashGreen { 0%, 50% { background: white; } 60% { background: #8ed131; border-color: #8ed131; } 100% { background: white; } }
            </style>
            <div class="demo-container">
                <div class="demo-target"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[0].img}" style="width:70%"></div>
                <div class="demo-grid">
                    <div class="demo-card"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[1].img}" style="width:70%"></div>
                    <div class="demo-card correct-flash"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[0].img}" style="width:70%"></div>
                    <div class="demo-card"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[2].img}" style="width:70%"></div>
                </div>
                <i class="fas fa-mouse-pointer demo-hand"></i>
            </div>`;
        }

        // 2. Injetar Texto Detalhado no ecrã de Informação
        const infoTexto = document.getElementById('info-texto');
        if (infoTexto) {
            infoTexto.innerHTML = `
                <div style="text-align: left; font-size: 0.95rem;">
                    <h3 style="color: var(--cor-dinamica)">Objetivo do jogo</h3>
                    <p>Observa atentamente o animal apresentado no topo do ecrã e encontra a imagem igual entre as várias opções. Clica ou toca no animal correto para avançares para a ronda seguinte.</p>
                    
                    <h3 style="color: var(--cor-dinamica); margin-top:15px;">Como jogar</h3>
                    <ul style="margin-left: 20px;">
                        <li>Observa o animal que aparece no topo do ecrã.</li>
                        <li>Analisa todas as imagens apresentadas.</li>
                        <li>Encontra a imagem exatamente igual ao modelo.</li>
                        <li>Clica ou toca no animal correto.</li>
                        <li>Se acertares, passas para a próxima ronda.</li>
                        <li>Se errares, tenta novamente até encontrares o par correto.</li>
                    </ul>

                    <h3 style="color: var(--cor-dinamica); margin-top:15px;">Regras</h3>
                    <ul style="margin-left: 20px;">
                        <li>Existe apenas uma resposta correta em cada ronda.</li>
                        <li>Observa com atenção antes de responder.</li>
                        <li>O objetivo é acertar no maior número possível de respostas em 10 rondas.</li>
                    </ul>

                    <h3 style="color: var(--cor-dinamica); margin-top:15px;">Dicas</h3>
                    <p>Observa cuidadosamente a <strong>forma</strong>, as <strong>cores</strong> e os <strong>detalhes</strong> (orelhas, patas, cauda, etc.). Alguns animais são parecidos, mas apenas um é idêntico!</p>

                    <h3 style="color: var(--cor-dinamica); margin-top:15px;">O que vais desenvolver?</h3>
                    <p>Este jogo ajuda a desenvolver a atenção, concentração, memória visual e capacidade de discriminação visual.</p>
                </div>`;
        }
    });
})();

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
        .score { color: white; padding: 5px 12px; border-radius: 10px; font-weight: 900; }
        .s-certo { background: #8ed131; } .s-erro { background: #ff5e5e; }
        .play-area { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; gap: 20px; flex: 1; }
        .target-box { width: 120px; height: 120px; border: 4px dashed #6c757d; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: #fff; }
        .target-box img { max-width: 80%; max-height: 80%; object-fit: contain; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; max-width: 500px; }
        .card { aspect-ratio: 1; border: 2px solid #eee; border-radius: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: white; transition: 0.2s; }
        .card:active { transform: scale(0.95); }
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
    itemAlvo = DADOS_JOGO.itens[Math.floor(Math.random() * DADOS_JOGO.itens.length)];
    document.getElementById('alvo').innerHTML = `<img src="${DADOS_JOGO.caminhoImagens}${itemAlvo.img}">`;

    // Gerar opções (1 correta + 7 erradas)
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
            if (item.id === itemAlvo.id) {
                acertos++;
                div.style.borderColor = "#8ed131";
                div.style.background = "#e8f5e9";
                // Desativar cliques para evitar múltiplos pontos
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
                div.style.pointerEvents = 'none'; // Impede clicar no mesmo erro
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
