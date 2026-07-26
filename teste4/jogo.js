// =============================================================================
// 1. VARIÁVEIS DE ESTADO GLOBAL (O que o jogo "lembra")
// =============================================================================
let ronda = 1;
let acertos = 0;
let erros = 0;
let itemAlvo = null;
let ajudasContador = 0;

// =============================================================================
// MÓDULO: APRESENTAÇÃO (view-apresentacao)
// =============================================================================
const ECRA_APRESENTACAO = {
    init() {
        this.injetarAnimacao();
        this.injetarInstrucoes();
        this.limparLayoutBase();
    },

    limparLayoutBase() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Define a cor do título do jogo igual ao título 1 do header */
            #jogo-titulo { color: var(--cor-dinamica) !important; }

            /* Ajustes de layout para o ecrã de jogo */
            #view-jogo .card-topo, #view-jogo .card-fundo { display: none !important; }
            #view-jogo .card-meio { border-radius: 25px; height: 100% !important; border: none; background: #fff; }
        `;
        document.head.appendChild(style);
    },

    injetarAnimacao() {
        const area = document.getElementById('area-jogo-conteudo');
        if (!area) return;
        area.innerHTML = `
        <style>
            .demo-container { display: flex; flex-direction: column; align-items: center; gap: 15px; position: relative; height: 100%; justify-content: center; }
            .demo-target { width: 90px; height: 90px; border: 4px dashed var(--cor-dinamica); border-radius: 20px; display: flex; align-items: center; justify-content: center; animation: pulseDemo 2s infinite; background: white; }
            .demo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
            .demo-card { width: 55px; height: 55px; border: 2px solid #eee; border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; }
            .demo-hand { position: absolute; font-size: 32px; color: var(--cor-dinamica); animation: moveHandDemo 3s infinite; pointer-events: none; z-index: 10; }
            @keyframes pulseDemo { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
            @keyframes moveHandDemo {
                0% { transform: translate(55px, 150px); opacity: 0; }
                20% { transform: translate(55px, 150px); opacity: 1; }
                50% { transform: translate(0px, 110px); opacity: 1; } 
                70% { transform: translate(0px, 110px); scale: 0.8; opacity: 1; }
                100% { transform: translate(0px, 110px); opacity: 0; }
            }
        </style>
        <div class="demo-container">
            <div class="demo-target"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[0].img}" style="width:75%"></div>
            <div class="demo-grid">
                <div class="demo-card"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[1].img}" style="width:70%"></div>
                <div class="demo-card" style="border-color:#8ed131"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[0].img}" style="width:70%"></div>
                <div class="demo-card"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[2].img}" style="width:70%"></div>
            </div>
            <i class="fas fa-mouse-pointer demo-hand"></i>
        </div>`;
    },

    injetarInstrucoes() {
        const info = document.getElementById('info-texto');
        if (!info) return;
        info.innerHTML = `
            <div style="text-align: left; padding: 5px; font-size: 0.95rem; line-height: 1.5;">
                <h3 style="color: var(--cor-dinamica); font-weight: 900; margin-bottom: 5px; text-transform: uppercase;">Objetivo do jogo</h3>
                <p>Observa atentamente o animal apresentado no topo do ecrã e encontra a imagem igual entre as várias opções. Clica ou toca no animal correto para avançares para a ronda seguinte.</p>
                
                <h3 style="color: var(--cor-dinamica); font-weight: 900; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase;">Como jogar</h3>
                <ul style="padding-left: 20px; margin-bottom: 10px;">
                    <li>Observa o animal que aparece no topo do ecrã.</li>
                    <li>Analisa todas as imagens apresentadas.</li>
                    <li>Encontra a imagem exatamente igual ao modelo.</li>
                    <li>Clica ou toca no animal correto.</li>
                    <li>Se acertares, passas para a próxima ronda.</li>
                    <li>Se errares, a ronda também avança. Tenta acertar o máximo possível!</li>
                    <li>Completa as 10 rondas e descobre a tua pontuação final.</li>
                </ul>

                <h3 style="color: var(--cor-dinamica); font-weight: 900; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase;">Regras</h3>
                <ul style="padding-left: 20px; margin-bottom: 10px;">
                    <li>Existe apenas uma resposta correta em cada ronda.</li>
                    <li>Observa com atenção antes de responder.</li>
                    <li>Não há limite de tempo.</li>
                    <li>O objetivo é acertar no maior número possível de respostas.</li>
                </ul>

                <h3 style="color: var(--cor-dinamica); font-weight: 900; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase;">Dicas</h3>
                <p>Observa cuidadosamente: a forma do animal; as cores; os detalhes (orelhas, patas, asas, cauda, etc.). Alguns animais podem ser parecidos, escolhe o que é idêntico.</p>

                <h3 style="color: var(--cor-dinamica); font-weight: 900; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase;">O que vais desenvolver?</h3>
                <ul style="padding-left: 20px;">
                    <li>Atenção e concentração;</li>
                    <li>Memória visual;</li>
                    <li>Capacidade de observação;</li>
                    <li>Rapidez de identificação;</li>
                    <li>Discriminação visual.</li>
                </ul>
            </div>`;
    }
};

// Inicialização
setTimeout(() => ECRA_APRESENTACAO.init(), 150);

// =============================================================================
// MÓDULO: JOGO (view-jogo)
// =============================================================================
const ECRA_JOGO = {
    init() {
        ronda = 1; acertos = 0; erros = 0; ajudasContador = 0; // Reset das ajudas aqui
        this.aplicarCorrecoesLayout();
        this.renderizarEstrutura();
        this.proximaRonda();
    },

    // Ajusta o comportamento de scroll e altura conforme o dispositivo
    aplicarCorrecoesLayout() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Telemóveis: Permite scroll para não cortar conteúdo */
            @media (max-width: 767px) {
                body, main { overflow-y: auto !important; height: auto !important; }
                #view-jogo { min-height: 550px; }
            }
            /* PC/Tablet: Bloqueia scroll para encaixar no ecrã */
            @media (min-width: 768px) {
                body, main { overflow: hidden !important; height: 100vh !important; }
                #view-jogo { height: 100% !important; }
            }
            
            /* Barra de Progresso - Escondida em Mobile, Visível em PC/Tablet */
            .progress-container { display: none; gap: 4px; flex: 1; justify-content: center; padding: 0 15px; }
            @media (min-width: 768px) { .progress-container { display: flex; } }
            
            .prog-step { height: 10px; flex: 1; border-radius: 10px; background: #e0e0e0; transition: 0.3s; }
            .prog-active { background: var(--cor-dinamica) !important; }
        `;
        document.head.appendChild(style);
    },

    renderizarEstrutura() {
        const container = document.getElementById('game-injection-point');
        container.innerHTML = `
        <style>
            .game-wrapper { display: flex; flex-direction: column; height: 100%; width: 100%; }
            
            /* Card-topo limitado a 60px conforme pedido */
            .status-bar { 
                display: flex; align-items: center; justify-content: space-between; 
                height: 60px; min-height: 60px; padding: 0 15px; 
                background: #fff; border-bottom: 2px solid #f0f2f5; 
            }
            
            .stat-bubble { 
                height: 38px; padding: 0 12px; border-radius: 12px; 
                display: flex; align-items: center; justify-content: center; 
                font-weight: 900; font-size: 1rem; color: white; gap: 5px;
            }
            .b-ronda { background: #f0f2f5; color: #5d7082; min-width: 70px; }
            .b-certo { background: #8ed131; min-width: 50px; }
            .b-erro { background: #ff5e5e; min-width: 50px; }

            .btn-i-mini { 
                width: 35px; height: 35px; border-radius: 50%; 
                border: 2px solid var(--cor-dinamica); color: var(--cor-dinamica); 
                display: flex; align-items: center; justify-content: center; 
                font-weight: bold; cursor: pointer; font-style: italic; font-family: serif; 
            }

            /* Área Central - Otimizada para PC sem scroll */
            .play-area { 
                flex: 1; display: flex; flex-direction: column; 
                align-items: center; justify-content: center; 
                padding: 10px; gap: 2vh; overflow: hidden;
            }
            
            .target-box { 
                width: clamp(130px, 28vh, 180px); height: clamp(130px, 28vh, 180px); 
                border: 4px dashed #adb5bd; border-radius: 25px; 
                display: flex; align-items: center; justify-content: center; background: #fff; 
            }
            .target-box img { max-width: 85%; max-height: 85%; object-fit: contain; }

            .grid { 
                display: grid; grid-template-columns: repeat(4, 1fr); 
                gap: 10px; width: 100%; max-width: 600px; 
            }
            .card { 
                aspect-ratio: 1; border: 2px solid #eee; border-radius: 18px; 
                display: flex; align-items: center; justify-content: center; 
                cursor: pointer; background: white; transition: 0.15s; 
            }
            .card img { max-width: 80%; max-height: 80%; object-fit: contain; }
            .card:active { transform: scale(0.92); }

            /* Ajuste para ecrãs baixos (Landscape) */
            @media (max-height: 550px) {
                .play-area { flex-direction: row; gap: 30px; }
                .grid { grid-template-columns: repeat(4, 1fr); max-width: 380px; }
            }
        </style>
        
        <div class="game-wrapper">
            <div class="status-bar">
                <div style="display:flex; gap:10px; align-items:center;">
                    <img src="${JOGO_CONFIG.caminhoIconsMenu}lampada.png" style="width:38px; cursor:pointer" onclick="ECRA_JOGO.ajuda()" title="Ajuda">
                    <div class="stat-bubble b-ronda" id="ronda-bubble">1 / 10</div>
                </div>

                <div class="progress-container" id="barra-progresso">
                    ${Array(10).fill().map(() => `<div class="prog-step"></div>`).join('')}
                </div>

                <div style="display:flex; gap:8px; align-items:center;">
                    <div class="stat-bubble b-certo">✓ <span id="v-acertos">0</span></div>
                    <div class="stat-bubble b-erro">X <span id="v-erros">0</span></div>
                    <div class="btn-i-mini" onclick="toggleInfoScreen(true)">i</div>
                </div>
            </div>

            <div class="play-area">
                <div class="target-box" id="alvo"></div>
                <div class="grid" id="opcoes"></div>
            </div>
        </div>`;
    },

    proximaRonda() {
        if (ronda > 10) { 
            pontuacaoFinal = acertos; 
            ECRA_RESULTADOS.init(); // Ativa a renderização dos resultados antes de mudar
            setTimeout(() => mudarEcra('resultados'), 300);
            return; 
        }
        
        // Atualiza texto da bolha e a barra de progresso (se visível)
        document.getElementById('ronda-bubble').innerText = `${ronda} / 10`;
        const steps = document.querySelectorAll('.prog-step');
        steps.forEach((step, idx) => {
            step.classList.toggle('prog-active', idx < ronda);
        });

        // Seleção do alvo aleatório
        itemAlvo = DADOS_JOGO.itens[Math.floor(Math.random() * DADOS_JOGO.itens.length)];
        document.getElementById('alvo').innerHTML = `<img src="${DADOS_JOGO.caminhoImagens}${itemAlvo.img}">`;

        // Baralhar opções (1 correta + 7 erradas)
        let opcoes = [itemAlvo];
        let outros = DADOS_JOGO.itens.filter(i => i.id !== itemAlvo.id).sort(() => 0.5 - Math.random());
        opcoes = [...opcoes, ...outros.slice(0, 7)].sort(() => 0.5 - Math.random());

        const grid = document.getElementById('opcoes');
        grid.innerHTML = '';
        opcoes.forEach(item => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `<img src="${DADOS_JOGO.caminhoImagens}${item.img}">`;
            div.onclick = () => this.validarResposta(item, div);
            grid.appendChild(div);
        });
    },

    validarResposta(item, elemento) {
        // Bloqueia cliques durante o feedback
        document.querySelectorAll('.card').forEach(c => c.style.pointerEvents = 'none');

        if (item.id === itemAlvo.id) {
            acertos++;
            elemento.style.borderColor = "#8ed131";
            elemento.style.background = "#f1f8e9";
        } else {
            erros++;
            elemento.style.borderColor = "#ff5e5e";
            elemento.style.background = "#fff5f5";
        }
        
        document.getElementById('v-acertos').innerText = acertos;
        document.getElementById('v-erros').innerText = erros;

        setTimeout(() => {
            ronda++;
            this.proximaRonda();
        }, 700);
    },

    ajuda() {
        ajudasContador++; // Incremento das ajudas aqui
        const cards = document.querySelectorAll('.card');
        cards.forEach(c => {
            if (c.innerHTML.includes(itemAlvo.img)) {
                c.style.background = "#fff9c4";
                c.style.transform = "scale(1.1)";
                c.style.borderColor = "var(--cor-dinamica)";
                setTimeout(() => {
                    c.style.background = "white";
                    c.style.transform = "scale(1)";
                    c.style.borderColor = "#eee";
                }, 1200);
            }
        });
    }
};
// =============================================================================
// MÓDULO: RESULTADOS (view-resultados)
// =============================================================================
const ECRA_RESULTADOS = {
    init() {
        this.configurarEstilo();
        this.renderizarConteudo();
    },

    configurarEstilo() {
        const style = document.createElement('style');
        style.innerHTML = `
            #view-resultados h2 { color: var(--cor-dinamica) !important; }
            
            .stats-container { 
                display: flex; justify-content: center; gap: 15px; 
                margin-top: 20px; width: 100%; padding: 0 10px;
            }
            
            .stat-card {
                flex: 1; min-width: 80px; max-width: 120px;
                background: white; border-radius: 15px; padding: 12px 5px;
                display: flex; flex-direction: column; align-items: center;
                box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                border: 2px solid #f0f2f5;
            }
            
            .sc-verde { border-color: #e8f5e9; }
            .sc-vermelho { border-color: #ffebee; }
            .sc-laranja { border-color: #fff3e0; }

            .stat-num { font-size: 1.8rem; font-weight: 900; line-height: 1; margin-bottom: 2px; }
            .sn-verde { color: #8ed131; }
            .sn-vermelho { color: #ff5e5e; }
            .sn-laranja { color: #ff9800; }

            .stat-label { font-size: 0.65rem; font-weight: 800; color: #8792a1; text-transform: uppercase; margin-bottom: 8px; }
            
            .stat-icon {
                width: 28px; height: 28px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                color: white; font-size: 0.9rem;
            }
            .si-verde { background: #8ed131; }
            .si-vermelho { background: #ff5e5e; }
            .si-laranja { background: #ff9800; }

            .res-btn-group { display: flex; gap: 10px; width: 100%; }
            .btn-outro { background: #8792a1 !important; }
        `;
        document.head.appendChild(style);
    },

    renderizarConteudo() {
        const cardMeio = document.querySelector('#view-resultados .card-meio');
        const rel = JOGO_CONFIG.relatorios.find(r => acertos >= r.min && acertos <= r.max) || JOGO_CONFIG.relatorios[0];

        cardMeio.innerHTML = `
            <div style="text-align:center; width: 100%;">
                <img src="${JOGO_CONFIG.caminhoIconsMenu}${rel.img}" class="img-resultado">
                <div class="feedback-txt">${rel.titulo}</div>
                <p style="color: #8792a1; font-weight: 700; margin-bottom: 10px;">Completaste o desafio!</p>
                
                <div class="stats-container">
                    <div class="stat-card sc-verde">
                        <span class="stat-num sn-verde">${acertos}</span>
                        <span class="stat-label">Certos</span>
                        <div class="stat-icon si-verde"><i class="fas fa-check"></i></div>
                    </div>
                    <div class="stat-card sc-vermelho">
                        <span class="stat-num sn-vermelho">${erros}</span>
                        <span class="stat-label">Erros</span>
                        <div class="stat-icon si-vermelho"><i class="fas fa-times"></i></div>
                    </div>
                    <div class="stat-card sc-laranja">
                        <span class="stat-num sn-laranja">${ajudasContador}</span>
                        <span class="stat-label">Ajudas</span>
                        <div class="stat-icon si-laranja"><i class="fas fa-question"></i></div>
                    </div>
                </div>
            </div>
        `;

        const cardFundo = document.querySelector('#view-resultados .card-fundo');
        cardFundo.innerHTML = `
            <div class="res-btn-group">
                <button class="btn-jogar" onclick="mudarEcra('jogo')">
                    <i class="fas fa-redo"></i> JOGAR DE NOVO
                </button>
                <button class="btn-jogar btn-outro" onclick="voltarPagina()">
                    <i class="fas fa-th"></i> OUTRO JOGO
                </button>
            </div>
        `;
    }
};

// =============================================================================
// INICIALIZAÇÃO AUTOMÁTICA
// =============================================================================

function initJogo() {
    ECRA_JOGO.init();
}

setTimeout(() => {
    ECRA_APRESENTACAO.init();
}, 150);
