// ==========================================
// 1. ESTADO GLOBAL E CONTROLO DE ÁUDIO
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0;
let itemDestaque = null;
let audioInstrucao = null;
let audioAnimal = null;

// Sons de Sistema (Caminhos baseados na tua estrutura)
const somAcerto = new Audio(JOGO_CONFIG.caminhoSonsSistema + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSonsSistema + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSonsSistema + JOGO_CONFIG.sons.clique);

// ==========================================
// 2. APLICAÇÃO DINÂMICA DE TEMAS (Cores e Textos)
// ==========================================
function aplicarTema() {
    const tema = BIBLIOTECA_TEMAS[JOGO_CONFIG.areaAtiva];
    const conteudo = BIBLIOTECA_CONTEUDO[JOGO_CONFIG.anoAtivo][JOGO_CONFIG.areaAtiva];

    // Injetar Cores no CSS
    const root = document.documentElement;
    root.style.setProperty('--primary-color', tema.corPrimaria);
    root.style.setProperty('--dark-color', tema.corEscura);
    root.style.setProperty('--bg-color', tema.corPagina);
    root.style.setProperty('--text-color', tema.corTexto);

    // Aplicar Fundo ao Body
    document.body.style.backgroundColor = tema.corPagina;

    // Atualizar Cabeçalho e Rodapé (se existirem os IDs no teu HTML)
    const header = document.getElementById('shell-header-content');
    if (header) {
        header.innerHTML = `<h2 style="color:${tema.corPrimaria}; font-weight:900; text-transform:uppercase; margin:0;">${conteudo.t1} ${conteudo.t2}</h2>`;
    }
}

// ==========================================
// 3. ESTILOS CORRIGIDOS (CSS)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    :root { --card-size: 110px; --dest-size: 150px; }
    
    #game-content { 
        display: flex; flex-direction: column; align-items: center; 
        justify-content: center; width: 100%; min-height: 300px; 
    }

    .destaque-box {
        width: var(--dest-size); height: var(--dest-size); 
        background: #fff; border-radius: 30px; 
        border: 4px solid var(--primary-color); 
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 20px; cursor: pointer; position: relative;
        box-shadow: 0 6px 0 rgba(0,0,0,0.05); transition: 0.2s;
    }
    .destaque-box:active { transform: translateY(3px); }
    .destaque-box img { width: 60%; height: 60%; object-fit: contain; }

    .grid-opcoes {
        display: grid; grid-template-columns: repeat(3, 1fr); 
        gap: 15px; width: fit-content;
    }

    .opcao-card {
        background: white; border: 3px solid #e0e0e0; border-radius: 20px; 
        width: var(--card-size); height: var(--card-size);
        display: flex; align-items: center; justify-content: center; 
        cursor: pointer; position: relative; transition: 0.2s;
        box-shadow: 0 4px 0 #ddd;
    }
    .opcao-card:hover { border-color: var(--primary-color); }
    .opcao-card img { width: 80%; height: 80%; object-fit: contain; }
    
    .feedback-icon { position: absolute; font-size: 3rem; z-index: 10; pointer-events: none; }
    .icon-v { color: #8cc63f; } .icon-x { color: #ff5a5f; }

    .btn-audio-circle { width: 65px; height: 65px; cursor: pointer; }
    .btn-play-rect { 
        flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); 
        color: white; border: none; font-size: 1.5rem; font-weight: 900; 
        cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 15px;
    }

    @media screen and (min-width: 1025px) {
        :root { --card-size: 150px; --dest-size: 180px; }
    }
`;
document.head.appendChild(style);

// ==========================================
// 4. LÓGICA DE SOM E CAPA
// ==========================================
function tocarAudioInstrucoes() {
    if (audioInstrucao && !audioInstrucao.paused) return; // Não repete se estiver a tocar
    somClique.play();
    audioInstrucao = new Audio(JOGO_CONFIG.caminhoSonsSistema + DADOS_JOGO.somInstrucoes);
    audioInstrucao.play();
}

function pararSons() {
    if (audioInstrucao) { audioInstrucao.pause(); audioInstrucao.currentTime = 0; }
    if (audioAnimal) { audioAnimal.pause(); audioAnimal.currentTime = 0; }
}

function tocarSomAnimal() {
    if (!itemDestaque) return;
    if (audioAnimal) { audioAnimal.pause(); audioAnimal.currentTime = 0; }
    audioAnimal = new Audio(JOGO_CONFIG.caminhoSons + itemDestaque.som);
    audioAnimal.play();
}

function mostrarCapa() {
    aplicarTema();
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div class="destaque-box" style="cursor:default;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png">
        </div>
        <p style="color:var(--text-color); font-weight:800; text-align:center;">${JOGO_CONFIG.descricao}</p>
    `;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="tocarAudioInstrucoes()">
        <button class="btn-play-rect" onclick="iniciarJogo()"><i class="fas fa-play"></i> JOGAR</button>`;
}

// ==========================================
// 5. MECÂNICA DO JOGO
// ==========================================
function iniciarJogo() { 
    pararSons();
    somClique.play();
    jogoAtivo = true; 
    rondaAtual = 1; certos = 0; erros = 0; 
    proximaRonda(); 
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    
    // Engine do sistema (StatusBar)
    if (typeof Engine !== 'undefined') Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);

    // Baralhar e selecionar 3 animais
    const todos = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todos[0];
    const opcoesRonda = todos.slice(0, 3).sort(() => Math.random() - 0.5);

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div class="destaque-box" onclick="tocarSomAnimal()">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png">
            <small style="position:absolute; bottom:10px; color:var(--primary-color); font-weight:bold;">OUVIR</small>
        </div>
        <div class="grid-opcoes">
            ${opcoesRonda.map(item => `
                <div class="opcao-card" id="card-${item.id}" onclick="verificarResposta(${item.id}, this)">
                    <img src="../../img/${item.pasta}/${item.img}">
                </div>`).join('')}
        </div>`;

    // Tocar som do animal automaticamente (com pequeno atraso para o browser permitir)
    setTimeout(tocarSomAnimal, 600);
}

function verificarResposta(id, el) {
    if (!jogoAtivo) return;
    document.querySelectorAll('.opcao-card').forEach(c => c.style.pointerEvents = 'none');

    if (id === itemDestaque.id) {
        certos++; somAcerto.play();
        el.style.borderColor = "#8cc63f";
        el.style.boxShadow = "0 4px 0 #6da32f";
        el.innerHTML += '<i class="fas fa-check feedback-icon icon-v"></i>';
    } else {
        erros++; somErro.play();
        el.style.borderColor = "#ff5a5f";
        el.style.boxShadow = "0 4px 0 #d44348";
        el.innerHTML += '<i class="fas fa-times feedback-icon icon-x"></i>';
        const correto = document.getElementById(`card-${itemDestaque.id}`);
        if(correto) {
            correto.style.borderColor = "#8cc63f";
            correto.style.boxShadow = "0 4px 0 #6da32f";
        }
    }
    setTimeout(() => { rondaAtual++; proximaRonda(); }, 1500);
}

function finalizarJogo() {
    jogoAtivo = false;
    pararSons();
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    if (typeof Engine !== 'undefined') Engine.showResults(certos, erros, 0, rel);
}

// Inicializar ao carregar
window.onload = mostrarCapa;
