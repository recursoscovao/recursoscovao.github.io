// jogo.js

let estado = {
    ronda: 1,
    maxRondas: 10,
    pontos: 0,
    itemCorreto: null,
    bloqueado: false
};

// 1. Mostrar Capa
function mostrarCapa() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <div class="game-intro-card">
            <h1 style="color: var(--primary-color); font-weight: 900; margin-bottom: 10px;">${JOGO_CONFIG.nomeDoJogo}</h1>
            <p style="color: #5d7082; margin-bottom: 30px;">${JOGO_CONFIG.descricao}</p>
            <button class="btn-jogar" onclick="iniciarJogo()">COMEÇAR JOGO</button>
        </div>
    `;
}

// 2. Iniciar
function iniciarJogo() {
    estado.ronda = 1;
    estado.pontos = 0;
    proximaRonda();
}

// 3. Gerar Ronda com 10 animais
function proximaRonda() {
    if (estado.ronda > estado.maxRondas) {
        mostrarResultado();
        return;
    }

    estado.bloqueado = false;
    const container = document.getElementById('game-container');

    // Sorteio
    const todosItens = [...DADOS_JOGO.itens].sort(() => 0.5 - Math.random());
    estado.itemCorreto = todosItens[0];
    
    // Pega 10 animais (ou o máximo disponível se for menos de 10)
    let opcoes = todosItens.slice(0, 10).sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            
            <div id="alvo" style="margin-bottom: 20px; text-align: center;">
                <p style="font-weight: 800; color: #5d7082; margin-bottom: 8px;">Encontra este:</p>
                <div style="background: white; width: 110px; height: 110px; border-radius: 25px; border: 4px solid var(--primary-color); display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 5px 0 rgba(0,0,0,0.05);">
                    <img src="${DADOS_JOGO.caminhoImagens}${estado.itemCorreto.img}" style="width: 75px; height: 75px; object-fit: contain;">
                </div>
            </div>

            <div id="grelha" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; width: 100%; max-width: 600px;">
            </div>

            <p style="margin-top: 20px; font-weight: 900; color: var(--text-grey); font-size: 0.8rem; text-transform: uppercase;">
                Ronda ${estado.ronda} de ${estado.maxRondas}
            </p>
        </div>
    `;

    // Ajuste para telemóveis (2 colunas para caberem os 10)
    const grelha = document.getElementById('grelha');
    if(window.innerWidth < 600) grelha.style.gridTemplateColumns = "repeat(2, 1fr)";

    opcoes.forEach(item => {
        const card = document.createElement('div');
        card.style.cssText = "background:white; padding:8px; border-radius:15px; border:2px solid #eee; cursor:pointer; text-align:center; box-shadow:0 3px 0 rgba(0,0,0,0.05);";
        card.innerHTML = `
            <img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="width: 50px; height: 50px; object-fit: contain; pointer-events:none;">
            <p style="font-size: 0.6rem; font-weight: 800; color: #8792a1; margin-top: 4px; pointer-events:none;">${item.nome}</p>
        `;
        card.onclick = () => verificar(item.id, card);
        grelha.appendChild(card);
    });
}

function verificar(id, el) {
    if (estado.bloqueado) return;
    estado.bloqueado = true;

    if (id === estado.itemCorreto.id) {
        estado.pontos++;
        el.style.borderColor = "#45cfa8";
        el.style.background = "#e8f9f4";
    } else {
        el.style.borderColor = "#ff6b6b";
        el.style.background = "#fff5f5";
    }

    setTimeout(() => {
        estado.ronda++;
        proximaRonda();
    }, 800);
}

function mostrarResultado() {
    const rel = JOGO_CONFIG.relatorios.find(r => estado.pontos >= r.min && estado.pontos <= r.max);
    document.getElementById('game-container').innerHTML = `
        <div class="game-intro-card">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}${rel.img}" style="width: 80px; margin-bottom: 15px;">
            <h2 style="color: var(--primary-color); font-weight: 900;">${rel.titulo}</h2>
            <p style="margin: 10px 0; font-weight: 800;">Acertaste ${estado.pontos} de ${estado.maxRondas}!</p>
            <button class="btn-jogar" onclick="iniciarJogo()">REPETIR</button>
        </div>
    `;
}
