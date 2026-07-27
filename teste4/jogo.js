let rondaAtual = 1;
const totalRondas = 10;
let certos = 0;
let errados = 0;
let ajudasUsadas = 0;
let itemAlvo = null;

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

    if (id === itemAlvo.id) {
        certos++; el.classList.add('correto', 'respondido');
        document.querySelectorAll('.card-opcao').forEach(c => c.classList.add('respondido'));
        setTimeout(() => { rondaAtual++; proximaRonda(); }, 1000);
    } else {
        errados++; el.classList.add('errado');
        atualizarInterfaceStats();
        setTimeout(() => el.classList.remove('errado'), 500);
    }
}

document.getElementById("ui-help-lamp").onclick = () => {
    ajudasUsadas++; atualizarInterfaceStats();
    const cards = Array.from(document.querySelectorAll('.card-opcao'));
    const correto = cards.find(c => c.innerHTML.includes(itemAlvo.img));
    if (correto) {
        correto.style.boxShadow = "0 0 20px gold";
        correto.style.transform = "scale(1.1)";
        setTimeout(() => { correto.style.boxShadow = ""; correto.style.transform = ""; }, 1500);
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
