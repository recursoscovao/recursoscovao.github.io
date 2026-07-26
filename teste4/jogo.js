// =============================================================================
// 1. VARIÁVEIS DE ESTADO GLOBAL (O que o jogo "lembra")
// =============================================================================
let ronda = 1;
let acertos = 0;
let erros = 0;
let itemAlvo = null;

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
        ronda = 1; acertos = 0; erros = 0;
        this.aplicarCorrecoesGlobais();
        this.renderizarEstrutura();
        this.proximaRonda();
    },

    // Remove o bloqueio de scroll do index.html para permitir visualização horizontal em telemóveis
    aplicarCorrecoesGlobais() {
        const style = document.createElement('style');
        style.innerHTML = `
            body { overflow-y: auto !important; height: auto !important; }
            main { overflow: visible !important; height: auto !important; max-height: none !important; }
            #view-jogo { height: auto !important; min-height: 500px; }
            
            /* Estilo da Barra de Progresso (tipo a imagem enviada) */
            .progress-container { display: flex; gap: 4px; flex: 1; justify-content: center; padding: 0 10px; }
            .prog-step { height: 12px; flex: 1; border-radius: 10px; background: #eee; transition: 0.3s; }
            .prog-active { background: var(--cor-dinamica); }
        `;
        document.head.appendChild(style);
    },

    renderizarEstrutura() {
        const container = document.getElementById('game-injection-point');
        container.innerHTML = `
        <style>
            .game-wrapper { display: flex; flex-direction: column; width: 100%; gap: 15px; }
            .status-bar { display: flex; align-items: center; justify-content: space-between; padding: 15px; background: #fff; border-bottom: 2px solid #f8f9fa; }
            
            .stat-bubble { background: #f0f2f5; color: #5d7082; padding: 6px 15px; border-radius: 20px; font-weight: 900; font-size: 1rem; display: flex; align-items: center; gap: 6px; }
            .certo-txt { color: #8ed131; }
            .erro-txt { color: #ff5e5e; }

            .play-area { display: flex; flex-direction: column; align-items: center; gap: 25px; padding: 10px; }
            
            /* Imagens aumentadas conforme solicitado */
            .target-box { width: clamp(140px, 25vh, 200px); height: clamp(140px, 25vh, 200px); border: 4px dashed #adb5bd; border-radius: 30px; display: flex; align-items: center; justify-content: center; background: #fff; }
            .target-box img { max-width: 90%; max-height: 90%; object-fit: contain; }

            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%; max-width: 650px; }
            .card { aspect-ratio: 1; border: 2px solid #eee; border-radius: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: white; transition: 0.2s; }
            .card img { max-width: 85%; max-height: 85%; object-fit: contain; }
            
            @media (max-height: 500px) {
                .play-area { flex-direction: row; justify-content: center; }
                .grid { grid-template-columns: repeat(4, 1fr); max-width: 400px; }
            }
        </style>
        <div class="game-wrapper">
            <div class="status-bar">
                <div class="stat-bubble" id="ronda-bubble">1 / 10</div>
                
                <div class="progress-container" id="barra-progresso">
                    ${Array(10).fill().map(() => `<div class="prog-step"></div>`).join('')}
                </div>

                <div class="stat-group" style="display:flex; gap:10px; align-items:center;">
                    <div class="stat-bubble certo-txt">✓ <span id="v-acertos">0</span></div>
                    <div class="stat-bubble erro-txt">X <span id="v-erros">0</span></div>
                    <div class="btn-info" style="width:35px; height:35px; font-size:1.2rem;" onclick="toggleInfoScreen(true)"><i>i</i></div>
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
            setTimeout(() => mudarEcra('resultados'), 300);
            return; 
        }
        
        // Atualizar Ronda e Barra de Progresso
        document.getElementById('ronda-bubble').innerText = `${ronda} / 10`;
        const steps = document.querySelectorAll('.prog-step');
        steps.forEach((step, idx) => {
            if (idx < ronda) step.classList.add('prog-active');
        });

        // Seleção do alvo
        itemAlvo = DADOS_JOGO.itens[Math.floor(Math.random() * DADOS_JOGO.itens.length)];
        document.getElementById('alvo').innerHTML = `<img src="${DADOS_JOGO.caminhoImagens}${itemAlvo.img}">`;

        // Gerar Opções
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
    }
};

// =============================================================================
// 4. MÓDULO: RESULTADOS (view-resultados)
// =============================================================================
const ECRA_RESULTADOS = {
    // Aqui podes adicionar funções para injetar confetes, sons ou tabelas de erros/acertos
    init() {
        console.log("Jogo terminado. Pontuação: " + pontuacaoFinal);
    }
};

// =============================================================================
// INICIALIZAÇÃO AUTOMÁTICA
// =============================================================================

// Função obrigatória que o index.html chama ao clicar no botão "JOGAR"
function initJogo() {
    ECRA_JOGO.init();
}

// Configuração inicial da Apresentação (espera pelo index.html)
setTimeout(() => {
    ECRA_APRESENTACAO.init();
}, 150);
