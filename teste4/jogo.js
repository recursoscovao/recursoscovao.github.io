let rondaAtual = 1;
const totalRondas = 10;
let certos = 0;
let errados = 0;
let ajudasUsadas = 0;
let itemAlvo = null;

// ==========================================
// 1. INSTRUÇÕES (COM MAIS ESPAÇO)
// ==========================================
function carregarInstrucoes() {
    const infoContainer = document.getElementById("info-instructions");
    if (!infoContainer) return;

    infoContainer.innerHTML = `
        <div style="border-left: 5px solid var(--cor-primaria); padding-left: 15px; margin-bottom: 35px;">
            <h2 style="margin:0; font-size: 1.8rem;">Objetivo</h2>
            <p style="margin-top:10px;">Encontra o animal idêntico ao modelo em destaque no topo.</p>
        </div>
        
        <h3 style="color: var(--cor-primaria); text-transform: uppercase; font-size: 1.1rem; margin-bottom: 20px; margin-top: 30px;">➔ Como Jogar</h3>
        <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 12px; display: flex; gap: 10px;"><strong>1.</strong> Observa o animal no topo do ecrã.</li>
            <li style="margin-bottom: 12px; display: flex; gap: 10px;"><strong>2.</strong> Analisa as 8 opções na grelha abaixo.</li>
            <li style="margin-bottom: 12px; display: flex; gap: 10px;"><strong>3.</strong> Clica na imagem exatamente igual.</li>
        </ul>

        <h3 style="color: var(--cor-primaria); text-transform: uppercase; font-size: 1.1rem; margin-bottom: 20px; margin-top: 35px;">➔ Regras e Dicas</h3>
        <p style="line-height: 1.6;">• Apenas uma resposta está correta.<br>
           • Se errares, o jogo mostrará a resposta certa antes de avançar.<br>
           • Observa as <strong>cores e detalhes</strong> com atenção.</p>
        
        <div style="background: var(--cor-pagina); padding: 20px; border-radius: 15px; margin-top: 40px;">
            <h3 style="margin:0 0 10px 0; font-size: 1rem;">O que vais desenvolver?</h3>
            <p style="font-size: 0.95rem; margin:0;">Atenção, Memória Visual e Discriminação Visual.</p>
        </div>
    `;
}

// ==========================================
// 2. LÓGICA DO JOGO
// ==========================================
function irParaJogo() {
    rondaAtual = 1; certos = 0; errados = 0; ajudasUsadas = 0;
    atualizarInterfaceStats();
    trocarEcra('tela-jogo');
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    atualizarInterfaceStats();

    const listaItens = [...DADOS_JOGO.itens];
    itemAlvo = listaItens[Math.floor(Math.random() * listaItens.length)];

    const distratores = listaItens.filter(i => i.id !== itemAlvo.id).sort(() => 0.5 - Math.random()).slice(0, 7);
    const opcoesGrid = [...distratores, itemAlvo].sort(() => 0.5 - Math.random());

    const container = document.getElementById("container-jogo-injetado");
    container.innerHTML = `
        <div class="jogo-wrapper">
            <div class="zona-alvo">
                <div class="card-alvo anim-entrada"><img src="${DADOS_JOGO.caminhoImagens}${itemAlvo.img}"></div>
            </div>
            <div class="zona-opcoes">
                ${opcoesGrid.map(item => `
                    <div class="card-opcao anim-entrada" onclick="verificarResposta(this, ${item.id})">
                        <img src="${DADOS_JOGO.caminhoImagens}${item.img}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function verificarResposta(el, id) {
    if (el.classList.contains('respondido')) return;

    // Bloquear todos os cartões para evitar múltiplos cliques
    const todosCards = document.querySelectorAll('.card-opcao');
    todosCards.forEach(c => c.classList.add('respondido'));

    if (id === itemAlvo.id) {
        // ACERTO
        certos++;
        el.classList.add('correto');
        setTimeout(() => {
            rondaAtual++;
            proximaRonda();
        }, 1000);
    } else {
        // ERRO
        errados++;
        el.classList.add('errado');
        
        // Encontrar o cartão que era o correto para mostrar ao utilizador
        const cardsArray = Array.from(todosCards);
        const oCorreto = cardsArray.find(c => c.innerHTML.includes(itemAlvo.img));
        
        if (oCorreto) {
            setTimeout(() => oCorreto.classList.add('revelar-correto'), 200);
        }

        atualizarInterfaceStats();

        // Aguarda um pouco mais para o utilizador ver onde errou
        setTimeout(() => {
            rondaAtual++;
            proximaRonda();
        }, 1800);
    }
}

// Lâmpada de Ajuda
document.getElementById("ui-help-lamp").onclick = () => {
    ajudasUsadas++;
    atualizarInterfaceStats();
    const cards = Array.from(document.querySelectorAll('.card-opcao'));
    const correto = cards.find(c => c.innerHTML.includes(itemAlvo.img));
    if (correto) {
        correto.classList.add('revelar-correto');
        setTimeout(() => correto.classList.remove('revelar-correto'), 1500);
    }
};

function atualizarInterfaceStats() {
    document.getElementById("ui-ronda").innerText = `${rondaAtual} / ${totalRondas}`;
    document.getElementById("ui-certos").innerText = certos;
    document.getElementById("ui-errados").innerText = errados;
}

function finalizarJogo() {
    trocarEcra('tela-resultados');
    document.getElementById("res-val-certos").innerText = certos;
    document.getElementById("res-val-errados").innerText = errados;
    document.getElementById("res-val-ajudas").innerText = ajudasUsadas;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    if (rel) {
        document.getElementById("res-feedback-titulo").innerText = rel.titulo;
        document.getElementById("res-img").src = JOGO_CONFIG.caminhoIconsJogos + rel.img;
    }
}

function iniciarTutorialVisual() {
    const container = document.getElementById("container-animacao-tutorial");
    if (!container || !DADOS_JOGO.itens.length) return;
    const item1 = DADOS_JOGO.itens[0];
    const item2 = DADOS_JOGO.itens[1] || item1;
    const item3 = DADOS_JOGO.itens[2] || item1;
    const caminho = DADOS_JOGO.caminhoImagens;
    container.innerHTML = `
        <div class="tut-alvo"><img src="${caminho}${item1.img}"></div>
        <div style="font-size: 0.8rem; font-weight: 800; color: #8792a1;">ENCONTRA O IGUAL</div>
        <div class="tut-grid">
            <div class="tut-card"><img src="${caminho}${item2.img}"></div>
            <div class="tut-card alvo-simulado"><img src="${caminho}${item1.img}"></div>
            <div class="tut-card"><img src="${caminho}${item3.img}"></div>
        </div>
        <img src="${JOGO_CONFIG.caminhoIconsJogos}mao.png" class="tut-mao">
    `;
}
