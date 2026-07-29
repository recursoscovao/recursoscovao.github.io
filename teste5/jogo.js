// jogo.js

function mostrarCapa() {
    const area = document.getElementById('game-content');
    const footer = document.getElementById('shell-footer');

    // Usamos a escala da Engine para tamanhos dinâmicos
    const imgSize = Engine.viewport.h * 0.5; // A imagem ocupa 50% da altura disponível

    area.innerHTML = `
        <div style="text-align:center">
            <img src="${DADOS_JOGO.caminhoImagens + DADOS_JOGO.itens[0].img}" 
                 style="height: ${imgSize}px; width: auto; margin-bottom: 20px;">
            <p style="font-size: calc(1.2rem * var(--ui-scale)); color: var(--text-grey); font-weight:700;">
                ${JOGO_CONFIG.descricao}
            </p>
        </div>
    `;

    footer.innerHTML = `
        <div class="btn-info-circle" onclick="alert('Instruções...')">i</div>
        <button class="btn-play-rect" onclick="iniciarJogo()">
            <i class="fas fa-play"></i> JOGAR
        </button>
    `;
}

// Esta função é chamada automaticamente pela Engine se o utilizador rodar o telemóvel
function onResizeGame(viewport) {
    console.log("O jogo agora tem: ", viewport.w, "x", viewport.h);
    // Aqui podes mandar redesenhar os elementos para não cortarem
    mostrarCapa(); 
}

function iniciarJogo() {
    const area = document.getElementById('game-content');
    area.innerHTML = "<h1>O Jogo Começou!</h1>";
    // Lógica do jogo aqui...
}
