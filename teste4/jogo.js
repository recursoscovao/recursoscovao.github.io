let rondaAtual = 1;
const totalRondas = 10;
let certos = 0;
let errados = 0;
let ajudasUsadas = 0;
let itemAlvo = null;

// ==========================================
// 1. INSTRUÇÕES DETALHADAS ORGANIZADAS
// ==========================================
function carregarInstrucoes() {
    const infoContainer = document.getElementById("info-instructions");
    if (!infoContainer) return;

    infoContainer.innerHTML = `
        <div style="border-left: 6px solid var(--cor-primaria); padding-left: 15px; margin-bottom: 30px;">
            <h2 style="margin:0; font-size: 1.6rem; text-transform:uppercase;">Objetivo do jogo</h2>
            <p style="margin-top:10px; font-size:1.05rem;">Observa atentamente o animal apresentado no topo do ecrã e encontra a imagem igual entre as várias opções.</p>
        </div>
        
        <h2 style="color: var(--cor-primaria); text-transform: uppercase; font-size: 1.3rem; margin-top: 30px; margin-bottom: 15px;">Como jogar</h2>
        <ul style="list-style: none; padding: 0; margin-bottom:30px;">
            <li style="margin-bottom: 10px;">➔ Observa o animal que aparece no topo do ecrã.</li>
            <li style="margin-bottom: 10px;">➔ Analisa todas as imagens apresentadas na grelha.</li>
            <li style="margin-bottom: 10px;">➔ Clica na imagem <strong>exatamente igual</strong> ao modelo.</li>
            <li style="margin-bottom: 10px;">➔ Se acertares, passas de ronda. Se errares, mostramos a certa e avançamos.</li>
        </ul>

        <h2 style="color: var(--cor-primaria); text-transform: uppercase; font-size: 1.3rem; margin-bottom: 15px;">Regras</h2>
        <p style="margin-bottom:30px;">Existe apenas uma resposta correta em cada ronda. Observa com atenção. Não há limite de tempo.</p>

        <h2 style="color: var(--cor-primaria); text-transform: uppercase; font-size: 1.3rem; margin-bottom: 15px;">Dicas</h2>
        <p style="margin-bottom:30px;">Observa a forma, as cores e os detalhes (orelhas, patas, asas, cauda). Alguns animais podem ser muito parecidos!</p>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 20px; border:1px solid #eee; margin-top: 30px;">
            <h2 style="margin:0 0 10px 0; font-size: 1.1rem;">O que vais desenvolver?</h2>
            <p style="font-size: 0.95rem; margin:0; line-height:1.5;">
                Atenção e concentração; Memória visual; Capacidade de observação; Discriminação visual.
            </p>
        </div>
    `;
}

// ==========================================
// 2. TUTORIAL ANIMADO (SIMULADOR DE JOGO)
// ==========================================
function iniciarTutorialVisual() {
    const container = document.getElementById("container-animacao-tutorial");
    if (!container || !DADOS_JOGO.itens.length) return;

    const item1 = DADOS_JOGO.itens[0]; // Galo
    const item2 = DADOS_JOGO.itens[1] || item1; // Galinha
    const item3 = DADOS_JOGO.itens[2] || item1; // Cabra
    const caminho = DADOS_JOGO.caminhoImagens;

    container.innerHTML = `
        <div class="tut-alvo-box"><img src="${caminho}${item1.img}"></div>
        <div style="font-size: 0.75rem; font-weight: 800; color: #8792a1; letter-spacing:1px; text-transform:uppercase;">Encontra o igual</div>
        <div class="tut-grid-opcoes">
            <div class="tut-card-opcao"><img src="${caminho}${item2.img}"></div>
            <div class="tut-card-opcao tut-alvo-simulado"><img src="${caminho}${item1.img}"></div>
            <div class="tut-card-opcao"><img src="${caminho}${item3.img}"></div>
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
