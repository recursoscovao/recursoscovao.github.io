// ==========================================
// MOTOR DO JOGO (CAMALEÃO)
// ==========================================

let estadoJogo = {
    rondaAtual: 1,
    totalRondas: 10,
    pontos: 0,
    itemCorreto: null
};

// 1. MOSTRAR A CAPA DO JOGO (Executado pelo Index)
function mostrarCapa() {
    const container = document.getElementById('game-container');
    
    container.innerHTML = `
        <div class="game-intro-card">
            <h1>${JOGO_CONFIG.nomeDoJogo}</h1>
            <p>${JOGO_CONFIG.descricao}</p>
            <button class="btn-jogar" onclick="iniciarPartida()">COMEÇAR JOGO</button>
        </div>
    `;
}

// 2. INICIAR A PARTIDA
function iniciarPartida() {
    estadoJogo.rondaAtual = 1;
    estadoJogo.pontos = 0;
    desenharEstruturaJogo();
    proximaRonda();
}

// 3. PREPARAR O PALCO DO JOGO
function desenharEstruturaJogo() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <div id="area-modelo" style="margin-bottom: 20px;"></div>
        <div id="area-opcoes" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 15px; max-width: 500px; width: 100%;"></div>
        <div id="info-ronda" style="margin-top: 20px; font-weight: 800; color: var(--text-grey);"></div>
    `;
}

// 4. LÓGICA DA RONDA (Universal)
function proximaRonda() {
    if (estadoJogo.rondaAtual > estadoJogo.totalRondas) {
        finalizarJogo();
        return;
    }

    document.getElementById('info-ronda').innerText = `Ronda ${estadoJogo.rondaAtual} de ${estadoJogo.totalRondas}`;

    // Sorteia itens dos dados
    const itensSorteados = [...DADOS_JOGO.itens].sort(() => 0.5 - Math.random());
    estadoJogo.itemCorreto = itensSorteados[0];
    const opcoesParaMostrar = itensSorteados.slice(0, 4).sort(() => 0.5 - Math.random());

    // Desenha o Modelo (Animal a encontrar)
    const areaModelo = document.getElementById('area-modelo');
    areaModelo.innerHTML = `
        <p style="margin-bottom: 10px; font-weight: 800; color: var(--text-grey);">Encontra o par:</p>
        <div style="background: white; padding: 15px; border-radius: 20px; border: 4px solid var(--primary-color); display: inline-block;">
            <img src="${DADOS_JOGO.caminhoImagens}${estadoJogo.itemCorreto.img}" style="width: 80px; height: 80px; object-fit: contain;">
        </div>
    `;

    // Desenha as Opções Pequenas
    const areaOpcoes = document.getElementById('area-opcoes');
    areaOpcoes.innerHTML = "";
    opcoesParaMostrar.forEach(item => {
        const btn = document.createElement('div');
        btn.style.cssText = "background: white; padding: 10px; border-radius: 20px; cursor: pointer; border: 2px solid #eee; text-align: center; box-shadow: 0 4px 0 rgba(0,0,0,0.05); transition: 0.1s;";
        btn.innerHTML = `
            <img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="width: 70px; height: 70px; object-fit: contain;">
            <p style="font-size: 0.7rem; font-weight: 800; color: #8792a1; margin-top: 5px;">${item.nome}</p>
        `;
        
        btn.onclick = () => verificarResposta(item.id, btn);
        areaOpcoes.appendChild(btn);
    });
}

// 5. VERIFICAÇÃO
function verificarResposta(id, elemento) {
    if (id === estadoJogo.itemCorreto.id) {
        estadoJogo.pontos++;
        elemento.style.borderColor = "#45cfa8"; // Verde se acertar
        // tocarSom("acerto");
    } else {
        elemento.style.borderColor = "#ff6b6b"; // Vermelho se errar
        // tocarSom("erro");
    }

    setTimeout(() => {
        estadoJogo.rondaAtual++;
        proximaRonda();
    }, 600);
}

// 6. TELA FINAL
function finalizarJogo() {
    const relatorio = JOGO_CONFIG.relatorios.find(r => estadoJogo.pontos >= r.min && estadoJogo.pontos <= r.max);
    const container = document.getElementById('game-container');
    
    container.innerHTML = `
        <div class="game-intro-card">
            <img src="../icons/${relatorio.img}" style="width: 100px; margin-bottom: 15px;">
            <h1>${relatorio.titulo}</h1>
            <p>Acertaste ${estadoJogo.pontos} de ${estadoJogo.totalRondas}!</p>
            <button class="btn-jogar" onclick="iniciarPartida()">REPETIR JOGO</button>
        </div>
    `;
}
