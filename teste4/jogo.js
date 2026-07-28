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
    const areaTitulo = document.getElementById('shell-title');
    const areaConteudo = document.getElementById('game-content');
    const areaFooter = document.getElementById('shell-footer');
    const tema = BIBLIOTECA_TEMAS[JOGO_CONFIG.areaAtiva];

    areaTitulo.innerText = JOGO_CONFIG.nomeDoJogo;
    areaTitulo.style.color = tema.corPrimaria;

    areaConteudo.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p style="color: #5d7082; font-size: 1.3rem; max-width: 500px; margin: 0 auto; font-weight: 700; line-height: 1.4;">
                ${JOGO_CONFIG.descricao}
            </p>
        </div>
    `;

    areaFooter.innerHTML = `
        <div class="btn-info-circle" title="Instruções">i</div>
        <button class="btn-play-rect" id="btn-start">
            <i class="fas fa-play"></i> JOGAR
        </button>
    `;

    document.getElementById('btn-start').onclick = iniciarJogo;
}

// 2. Iniciar
function iniciarJogo() {
    estado.ronda = 1;
    estado.pontos = 0;
    document.getElementById('shell-footer').innerHTML = ""; 
    document.getElementById('shell-footer').style.padding = "0"; 
    proximaRonda();
}

// 3. Proxima Ronda (Gera 10 Animais)
function proximaRonda() {
    if (estado.ronda > estado.maxRondas) {
        mostrarResultado();
        return;
    }

    estado.bloqueado = false;
    const areaConteudo = document.getElementById('game-content');
    const tema = BIBLIOTECA_TEMAS[JOGO_CONFIG.areaAtiva];

    // Sorteio de 10 animais
    const todosItens = [...DADOS_JOGO.itens].sort(() => 0.5 - Math.random());
    estado.itemCorreto = todosItens[0];
    let opcoes = todosItens.slice(0, 10).sort(() => 0.5 - Math.random());

    areaConteudo.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%; justify-content: space-around; padding: 10px;">
            
            <div style="text-align: center;">
                <p style="font-weight: 800; color: #8792a1; margin-bottom: 8px; text-transform: uppercase; font-size: 0.85rem;">Encontra o par igual:</p>
                <div style="background: white; width: 120px; height: 120px; border-radius: 35px; border: 5px solid ${tema.corPrimaria}; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 0 rgba(0,0,0,0.03);">
                    <img src="${DADOS_JOGO.caminhoImagens}${estado.itemCorreto.img}" style="width: 85px; height: 85px; object-fit: contain;">
                </div>
            </div>

            <div id="grelha" style="
                display: grid; 
                grid-template-columns: repeat(5, 1fr); 
                gap: 12px; 
                width: 100%; 
                max-width: 850px;
            "></div>

            <p style="font-weight: 900; color: #cbd5e0; font-size: 0.9rem; letter-spacing: 2px;">
                RONDA ${estado.ronda} / ${estado.maxRondas}
            </p>
        </div>
    `;

    const grelha = document.getElementById('grelha');
    // Responsividade da grelha
    if(window.innerWidth < 800) grelha.style.gridTemplateColumns = "repeat(4, 1fr)";
    if(window.innerWidth < 600) grelha.style.gridTemplateColumns = "repeat(3, 1fr)";
    if(window.innerWidth < 450) grelha.style.gridTemplateColumns = "repeat(2, 1fr)";

    opcoes.forEach(item => {
        const card = document.createElement('div');
        card.style.cssText = "background:white; padding:10px; border-radius:20px; border:2px solid #f2f2f2; cursor:pointer; text-align:center; box-shadow:0 4px 0 rgba(0,0,0,0.02); transition: 0.2s; display:flex; flex-direction:column; align-items:center; justify-content:center;";
        card.innerHTML = `
            <img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="width: 60px; height: 60px; object-fit: contain; pointer-events:none;">
            <p style="font-size: 0.7rem; font-weight: 800; color: #8792a1; margin-top: 5px; pointer-events:none;">${item.nome}</p>
        `;
        card.onclick = () => verificar(item.id, card);
        grelha.appendChild(card);
    });
}

// 4. Verificar Resposta
function verificar(id, el) {
    if (estado.bloqueado) return;
    estado.bloqueado = true;
    const tema = BIBLIOTECA_TEMAS[JOGO_CONFIG.areaAtiva];

    if (id === estado.itemCorreto.id) {
        estado.pontos++;
        el.style.borderColor = tema.corPrimaria;
        el.style.backgroundColor = tema.corPagina;
        tocarSom("acerto");
    } else {
        el.style.borderColor = "#ff6b6b";
        el.style.backgroundColor = "#fff5f5";
        tocarSom("erro");
    }

    setTimeout(() => {
        estado.ronda++;
        proximaRonda();
    }, 850);
}

// 5. Resultado Final
function mostrarResultado() {
    const rel = JOGO_CONFIG.relatorios.find(r => estado.pontos >= r.min && estado.pontos <= r.max);
    const areaConteudo = document.getElementById('game-content');
    const tema = BIBLIOTECA_TEMAS[JOGO_CONFIG.areaAtiva];

    areaConteudo.innerHTML = `
        <div style="text-align: center; display: flex; flex-direction: column; align-items: center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}${rel.img}" style="width: 110px; margin-bottom: 20px;">
            <h2 style="color: ${tema.corPrimaria}; font-weight: 900; font-size: 2.2rem;">${rel.titulo}</h2>
            <p style="margin: 15px 0; font-size: 1.4rem; font-weight: 800; color: #5d7082;">Acertaste ${estado.pontos} de ${estado.maxRondas}!</p>
            <button onclick="location.reload()" style="background:${tema.corPrimaria}; color:white; border:none; padding: 18px 50px; border-radius: 40px; font-weight:900; cursor:pointer; font-size:1.2rem; box-shadow: 0 5px 0 rgba(0,0,0,0.1);">JOGAR NOVAMENTE</button>
        </div>
    `;
}

// Auxiliar de Som
function tocarSom(tipo) {
    const somFile = JOGO_CONFIG.sons[tipo];
    if (somFile) {
        const a = new Audio(JOGO_CONFIG.caminhoSons + somFile);
        a.play().catch(() => {});
    }
}
