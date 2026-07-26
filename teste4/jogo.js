// Variáveis de controlo do estado do jogo
let ronda = 1;
let acertos = 0;
let erros = 0;
let itemAlvo = null;

/**
 * CONFIGURAÇÃO DA APRESENTAÇÃO (SOBREPÕE O INDEX.HTML)
 * Esta função injeta a animação e o texto detalhado ignorando o que está no JOGO_CONFIG
 */
function configurarApresentacao() {
    // 1. Injetar a Animação no "card-meio" (Substitui o ícone estático)
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
        </style>
        <div class="demo-container">
            <!-- Simulação do Alvo -->
            <div class="demo-target"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[0].img}" style="width:75%"></div>
            <!-- Simulação das Opções -->
            <div class="demo-grid">
                <div class="demo-card"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[1].img}" style="width:70%"></div>
                <div class="demo-card flash-win"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[0].img}" style="width:70%"></div>
                <div class="demo-card"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[2].img}" style="width:70%"></div>
            </div>
            <i class="fas fa-mouse-pointer demo-hand"></i>
        </div>`;
    }

    // 2. Injetar o Texto Completo (Substitui a descrição curta do ficheiro dados)
    const infoTexto = document.getElementById('info-texto');
    if (infoTexto) {
        infoTexto.innerHTML = `
            <div style="text-align: left; padding: 10px; font-size: 1rem;">
                <h3 style="color: var(--cor-dinamica); margin-bottom: 10px; font-weight: 900;">OBJETIVO DO JOGO</h3>
                <p>Observa atentamente o animal apresentado no topo do ecrã e encontra a imagem igual entre as várias opções. Clica ou toca no animal correto para avançares para a ronda seguinte.</p>
                
                <h3 style="color: var(--cor-dinamica); margin-top: 20px; margin-bottom: 10px; font-weight: 900;">COMO JOGAR</h3>
                <ul style="padding-left: 20px; line-height: 1.5; margin-bottom: 15px;">
                    <li>Observa o animal que aparece no topo do ecrã.</li>
                    <li>Analisa todas as imagens apresentadas.</li>
                    <li>Encontra a imagem <b>exatamente igual</b> ao modelo.</li>
                    <li>Clica ou toca no animal correto.</li>
                    <li>Se acertares, passas para a próxima ronda.</li>
                    <li>Se errares, tenta novamente até encontrares o par correto.</li>
                    <li>Completa as 10 rondas para veres a tua pontuação.</li>
                </ul>

                <h3 style="color: var(--cor-dinamica); margin-top: 20px; margin-bottom: 10px; font-weight: 900;">REGRAS</h3>
                <ul style="padding-left: 20px; line-height: 1.5;">
                    <li>Existe apenas uma resposta correta em cada ronda.</li>
                    <li>Observa com atenção antes de responder.</li>
                    <li>Não há limite de tempo.</li>
                </ul>

                <h3 style="color: var(--cor-dinamica); margin-top: 20px; margin-bottom: 10px; font-weight: 900;">DICAS</h3>
                <p>Observa cuidadosamente: <b>a forma, as cores e os detalhes</b> (orelhas, patas, asas, cauda, etc.). Alguns animais podem ser parecidos, escolhe apenas o que é idêntico.</p>

                <h3 style="color: var(--cor-dinamica); margin-top: 20px; margin-bottom: 10px; font-weight: 900;">O QUE VAIS DESENVOLVER?</h3>
                <p>Atenção e concentração, memória visual, capacidade de observação e discriminação visual.</p>
            </div>`;
    }
}

// Pequeno atraso para garantir que o window.onload do index.html já terminou
setTimeout(configurarApresentacao, 150);

/**
 * LÓGICA DO JOGO (Executada ao clicar em JOGAR)
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
        .target-box { width: 130px; height: 130px; border: 4px dashed #adb5bd; border-radius: 25px; display: flex; align-items: center; justify-content: center; background: #fff; box-shadow: inset 0 0 10px rgba(0,0,0,0.05); }
        .target-box img { max-width: 85%; max-height: 85%; object-fit: contain; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%; max-width: 550px; }
        .card { aspect-ratio: 1; border: 2px solid #eee; border-radius: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: white; transition: 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
        .card:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.05); }
        .card:active { transform: scale(0.95); }
        .card img { max-width: 75%; max-height: 75%; object-fit: contain; }
    </style>
    <div class="status-bar">
        <div class="stat-group">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}lampada.png" style="width:38px;cursor:pointer" onclick="ajuda()">
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
    
    // Escolher item alvo usando DADOS_JOGO
    itemAlvo = DADOS_JOGO.itens[Math.floor(Math.random() * DADOS_JOGO.itens.length)];
    document.getElementById('alvo').innerHTML = `<img src="${DADOS_JOGO.caminhoImagens}${itemAlvo.img}">`;

    // Gerar grelha (1 certa + 7 erradas)
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
                div.style.background = "#f1f8e9";
                
                // Bloqueia cliques imediatos para não somar pontos extra
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
                div.style.pointerEvents = 'none'; // Bloqueia clicar no mesmo erro
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
