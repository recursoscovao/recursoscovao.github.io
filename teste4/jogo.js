let rondaAtual = 1;
const totalRondas = 10;
let certos = 0;
let errados = 0;
let ajudasUsadas = 0;
let itemAlvo = null;

// ==========================================
// 1. INSTRUÇÕES DETALHADAS (INJETADAS)
// ==========================================
function carregarInstrucoes() {
    const infoContainer = document.getElementById("info-instructions");
    if (!infoContainer) return;

    infoContainer.innerHTML = `
        <div style="border-left: 6px solid var(--cor-primaria); padding-left: 15px; margin-bottom: 40px;">
            <h2 style="margin:0; font-size: 1.8rem; text-transform:uppercase;">Objetivo do jogo</h2>
            <p style="margin-top:10px; font-size:1.1rem;">Observa atentamente o animal apresentado no topo do ecrã e encontra a imagem igual entre as várias opções. Clica ou toca no animal correto para avançares para a ronda seguinte.</p>
        </div>
        
        <h2 style="color: var(--cor-primaria); text-transform: uppercase; font-size: 1.4rem; margin-bottom: 20px; margin-top: 40px;">Como jogar</h2>
        <ul style="list-style: none; padding: 0; margin-bottom:40px;">
            <li style="margin-bottom: 12px;">• Observa o animal que aparece no topo do ecrã.</li>
            <li style="margin-bottom: 12px;">• Analisa todas as imagens apresentadas na grelha.</li>
            <li style="margin-bottom: 12px;">• Encontra a imagem exatamente igual ao modelo.</li>
            <li style="margin-bottom: 12px;">• Clica ou toca no animal correto.</li>
            <li style="margin-bottom: 12px;">• Se acertares, passas para a próxima ronda.</li>
            <li style="margin-bottom: 12px;">• Se errares, o jogo mostrará a resposta certa antes de avançar.</li>
            <li style="margin-bottom: 12px;">• Completa 10 rondas e descobre a tua pontuação.</li>
        </ul>

        <h2 style="color: var(--cor-primaria); text-transform: uppercase; font-size: 1.4rem; margin-bottom: 20px;">Regras</h2>
        <p style="margin-bottom:40px;">Existe apenas uma resposta correta em cada ronda. Observa com atenção antes de responder. Não há limite de tempo.</p>

        <h2 style="color: var(--cor-primaria); text-transform: uppercase; font-size: 1.4rem; margin-bottom: 20px;">Dicas</h2>
        <p style="margin-bottom:40px;">Observa cuidadosamente: a forma do animal, as cores e os detalhes (orelhas, patas, asas, cauda, etc.). Alguns animais podem ser muito parecidos.</p>

        <div style="background: #f9f9f9; padding: 25px; border-radius: 20px; border:1px solid #eee;">
            <h2 style="margin:0 0 15px 0; font-size: 1.2rem;">O que vais desenvolver?</h2>
            <p style="font-size: 1rem; margin:0; line-height:1.6;">
                Atenção e concentração; Memória visual; Capacidade de observação; Rapidez de identificação; Discriminação visual.
            </p>
        </div>
    `;
}

// ==========================================
// 2. TUTORIAL ANIMADO
// ==========================================
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

// ==========================================
// 3. LÓGICA DO JOGO
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
    const todosCards = document.querySelectorAll('.card-opcao');
    todosCards.forEach(c => c.classList.add('respondido'));

    if (id === itemAlvo.id) {
        certos++; el.classList.add('correto');
        setTimeout(() => { rondaAtual++; proximaRonda(); }, 1000);
    } else {
        errados++; el.classList.add('errado');
        const correto = Array.from(todosCards).find(c => c.innerHTML.includes(itemAlvo.img));
        if (correto) correto.classList.add('revelar-correto');
        atualizarInterfaceStats();
        setTimeout(() => { rondaAtual++; proximaRonda(); }, 1800);
    }
}

document.getElementById("ui-help-lamp").onclick = () => {
    ajudasUsadas++; atualizarInterfaceStats();
    const correto = Array.from(document.querySelectorAll('.card-opcao')).find(c => c.innerHTML.includes(itemAlvo.img));
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
