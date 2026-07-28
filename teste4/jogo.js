// ==========================================
// JOGO: ENCONTRAR O PAR (LÓGICA COMPLETA)
// ==========================================

let estado = {
    ronda: 1,
    maxRondas: 10,
    pontos: 0,
    itemCorreto: null,
    bloqueado: false
};

// --- 1. MOSTRAR CAPA ---
function mostrarCapa() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <div class="game-intro-card">
            <h1>${JOGO_CONFIG.nomeDoJogo}</h1>
            <p>${JOGO_CONFIG.descricao}</p>
            <button class="btn-jogar" onclick="iniciarJogo()">COMEÇAR JOGO</button>
        </div>
    `;
}

// --- 2. INICIAR ---
function iniciarJogo() {
    estado.ronda = 1;
    estado.pontos = 0;
    desenharPalco();
    proximaRonda();
}

function desenharPalco() {
    document.getElementById('game-container').innerHTML = `
        <div id="jogo-display" style="text-align:center; width:100%;">
            <!-- Modelo em Destaque -->
            <div id="box-modelo" style="margin-bottom: 30px;">
                <p style="font-weight: 800; color: #5d7082; margin-bottom: 10px;">Encontra o animal igual:</p>
                <div id="modelo-img-container" style="background:white; width:130px; height:130px; margin:0 auto; border-radius:30px; border:5px solid var(--primary-color); display:flex; align-items:center; justify-content:center; box-shadow: 0 8px 0 rgba(0,0,0,0.05);">
                    <img id="img-alvo" src="" style="width:90px; height:90px; object-fit:contain;">
                </div>
            </div>
            <!-- Grelha de Opções -->
            <div id="grelha-opcoes" style="display:grid; grid-template-columns: repeat(2, 120px); gap:15px; justify-content:center; margin: 0 auto;"></div>
            <!-- Contador -->
            <p id="contador-texto" style="margin-top:25px; font-weight:900; color:var(--text-grey); font-size:0.9rem;"></p>
        </div>
    `;
}

// --- 3. LÓGICA DA RONDA ---
function proximaRonda() {
    if (estado.ronda > estado.maxRondas) {
        mostrarResultado();
        return;
    }

    estado.bloqueado = false;
    document.getElementById('contador-texto').innerText = `RONDA ${estado.ronda} DE ${estado.maxRondas}`;

    // 1. Sortear o item correto
    const todosItens = [...DADOS_JOGO.itens];
    const sorteio = todosItens.sort(() => 0.5 - Math.random());
    estado.itemCorreto = sorteio[0];

    // 2. Criar lista de 4 opções (incluindo a correta)
    let opcoes = sorteio.slice(0, 4);
    opcoes = opcoes.sort(() => 0.5 - Math.random());

    // 3. Atualizar Imagem Alvo
    document.getElementById('img-alvo').src = DADOS_JOGO.caminhoImagens + estado.itemCorreto.img;

    // 4. Desenhar Opções (Imagens pequenas)
    const grelha = document.getElementById('grelha-opcoes');
    grelha.innerHTML = "";

    opcoes.forEach(item => {
        const div = document.createElement('div');
        div.style.cssText = "background:white; padding:10px; border-radius:20px; border:2px solid #eee; cursor:pointer; box-shadow: 0 4px 0 rgba(0,0,0,0.05); transition:0.1s; display:flex; flex-direction:column; align-items:center;";
        div.innerHTML = `
            <img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="width:70px; height:70px; object-fit:contain; pointer-events:none;">
            <p style="font-size:0.7rem; font-weight:800; color:#8792a1; margin-top:5px; pointer-events:none;">${item.nome}</p>
        `;

        div.onclick = () => clicarOpcao(item.id, div);
        grelha.appendChild(div);
    });
}

// --- 4. VERIFICAÇÃO ---
function clicarOpcao(id, elemento) {
    if (estado.bloqueado) return;
    estado.bloqueado = true;

    if (id === estado.itemCorreto.id) {
        estado.pontos++;
        elemento.style.borderColor = "#45cfa8";
        elemento.style.background = "#e8f9f4";
        tocarAudio("acerto");
    } else {
        elemento.style.borderColor = "#ff6b6b";
        elemento.style.background = "#fff5f5";
        tocarAudio("erro");
    }

    setTimeout(() => {
        estado.ronda++;
        proximaRonda();
    }, 1000);
}

// --- 5. RESULTADOS ---
function mostrarResultado() {
    const rel = JOGO_CONFIG.relatorios.find(r => estado.pontos >= r.min && estado.pontos <= r.max);
    const container = document.getElementById('game-container');
    
    container.innerHTML = `
        <div class="game-intro-card">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}${rel.img}" style="width:100px; margin-bottom:15px;">
            <h1 style="color:var(--primary-color)">${rel.titulo}</h1>
            <p style="font-size:1.4rem; font-weight:900; margin: 10px 0;">Fizeste ${estado.pontos} pontos!</p>
            <p>Concluíste as ${estado.maxRondas} rondas com sucesso.</p>
            <button class="btn-jogar" style="margin-top:20px;" onclick="iniciarJogo()">JOGAR NOVAMENTE</button>
        </div>
    `;
}

// Auxiliar de Som
function tocarAudio(tipo) {
    const som = JOGO_CONFIG.sons[tipo];
    if (som) {
        const audio = new Audio(JOGO_CONFIG.caminhoSons + som);
        audio.play().catch(e => console.log("Som bloqueado pelo browser"));
    }
}
