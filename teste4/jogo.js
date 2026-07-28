// jogo.js

let estado = {
    ronda: 1,
    maxRondas: 10,
    pontos: 0,
    itemCorreto: null,
    bloqueado: false
};

// 1. Mostrar Capa seguindo o novo Design
function mostrarCapa() {
    const areaTitulo = document.getElementById('shell-title');
    const areaConteudo = document.getElementById('game-content');
    const areaFooter = document.getElementById('shell-footer');
    
    const tema = BIBLIOTECA_TEMAS[JOGO_CONFIG.areaAtiva];

    // Título da Moldura
    areaTitulo.innerText = JOGO_CONFIG.nomeDoJogo;
    areaTitulo.style.color = tema.corPrimaria;

    // Conteúdo Central (Imagem do Jogo)
    areaConteudo.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p style="color: #5d7082; font-size: 1.2rem; max-width: 400px; margin: 0 auto; font-weight: 700;">
                ${JOGO_CONFIG.descricao}
            </p>
        </div>
    `;

    // Rodapé (Botões como na imagem)
    areaFooter.innerHTML = `
        <div class="btn-info-circle">i</div>
        <button class="btn-play-rect" id="btn-start" style="background-color: ${tema.corPrimaria}">
            <i class="fas fa-play"></i> JOGAR
        </button>
    `;

    document.getElementById('btn-start').onclick = iniciarJogo;
}

// 2. Iniciar
function iniciarJogo() {
    estado.ronda = 1;
    estado.pontos = 0;
    
    // Limpa o footer para o jogo (ou podes deixar botões lá se quiseres)
    document.getElementById('shell-footer').innerHTML = ""; 
    document.getElementById('shell-footer').style.padding = "0"; // Remove espaço no jogo se quiseres mais área
    
    proximaRonda();
}

// 3. Ronda do Jogo
function proximaRonda() {
    if (estado.ronda > estado.maxRondas) {
        mostrarResultado();
        return;
    }

    estado.bloqueado = false;
    const areaConteudo = document.getElementById('game-content');
    const tema = BIBLIOTECA_TEMAS[JOGO_CONFIG.areaAtiva];

    const todosItens = [...DADOS_JOGO.itens].sort(() => 0.5 - Math.random());
    estado.itemCorreto = todosItens[0];
    let opcoes = todosItens.slice(0, 10).sort(() => 0.5 - Math.random());

    areaConteudo.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            
            <div style="margin-bottom: 20px; text-align: center;">
                <p style="font-weight: 800; color: #8792a1; margin-bottom: 5px; text-transform: uppercase; font-size: 0.8rem;">Encontra este:</p>
                <div style="background: white; width: 110px; height: 110px; border-radius: 30px; border: 4px solid ${tema.corPrimaria}; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 0 rgba(0,0,0,0.03);">
                    <img src="${DADOS_JOGO.caminhoImagens}${estado.itemCorreto.img}" style="width: 75px; height: 75px; object-fit: contain;">
                </div>
            </div>

            <div id="grelha" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; width: 100%; max-width: 600px;"></div>

            <p style="margin-top: 20px; font-weight: 900; color: #cbd5e0; font-size: 0.8rem;">RONDA ${estado.ronda} DE ${estado.maxRondas}</p>
        </div>
    `;

    const grelha = document.getElementById('grelha');
    if(window.innerWidth < 600) grelha.style.gridTemplateColumns = "repeat(2, 1fr)";

    opcoes.forEach(item => {
        const card = document.createElement('div');
        card.style.cssText = "background:white; padding:10px; border-radius:20px; border:2px solid #f0f0f0; cursor:pointer; text-align:center; box-shadow:0 3px 0 rgba(0,0,0,0.02); transition: 0.2s;";
        card.innerHTML = `
            <img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="width: 55px; height: 55px; object-fit: contain; pointer-events:none;">
            <p style="font-size: 0.65rem; font-weight: 800; color: #8792a1; margin-top: 5px; pointer-events:none;">${item.nome}</p>
        `;
        card.onclick = () => verificar(item.id, card);
        grelha.appendChild(card);
    });
}

function verificar(id, el) {
    if (estado.bloqueado) return;
    estado.bloqueado = true;
    const tema = BIBLIOTECA_TEMAS[JOGO_CONFIG.areaAtiva];

    if (id === estado.itemCorreto.id) {
        estado.pontos++;
        el.style.borderColor = tema.corPrimaria;
        el.style.backgroundColor = tema.corPagina;
    } else {
        el.style.borderColor = "#ff6b6b";
        el.style.backgroundColor = "#fff5f5";
    }

    setTimeout(() => {
        estado.ronda++;
        proximaRonda();
    }, 800);
}

function mostrarResultado() {
    const rel = JOGO_CONFIG.relatorios.find(r => estado.pontos >= r.min && estado.pontos <= r.max);
    const areaConteudo = document.getElementById('game-content');
    const tema = BIBLIOTECA_TEMAS[JOGO_CONFIG.areaAtiva];

    areaConteudo.innerHTML = `
        <div style="text-align: center;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}${rel.img}" style="width: 100px; margin-bottom: 20px;">
            <h2 style="color: ${tema.corPrimaria}; font-weight: 900; font-size: 2rem;">${rel.titulo}</h2>
            <p style="margin: 15px 0; font-size: 1.2rem; font-weight: 800; color: #5d7082;">Acertaste ${estado.pontos} de ${estado.maxRondas}!</p>
            <button onclick="iniciarJogo()" style="background:${tema.corPrimaria}; color:white; border:none; padding: 15px 40px; border-radius: 30px; font-weight:900; cursor:pointer; font-size:1.1rem;">REPETIR</button>
        </div>
    `;
}
