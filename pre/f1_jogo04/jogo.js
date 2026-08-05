// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0; 
let itemDestaque = null, opcoesRonda = [], simuInterval;
let audioAnimalAtual = null;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSonsSistema + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSonsSistema + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSonsSistema + JOGO_CONFIG.sons.clique);

// Função auxiliar para obter o caminho correto da imagem baseada na pasta definida nos dados
const getCaminhoImagem = (item) => {
    return item.pasta === "domesticos" ? DADOS_JOGO.caminhoDomesticos : DADOS_JOGO.caminhoSelvagens;
};

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .status-pill { background: #6c757d; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 1.1rem; }
    .score-group { display: flex; gap: 10px; }
    .score-box { padding: 5px 12px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1.1rem; min-width: 60px; justify-content: center; }
    .box-v { background: #8cc63f; box-shadow: 0 3px 0 #6da32f; }
    .box-x { background: #ff5a5f; box-shadow: 0 3px 0 #d44348; }

    .btn-play-rect { 
        flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); 
        color: white; border: none; font-size: 1.5rem; font-weight: 900; 
        text-transform: uppercase; cursor: pointer; display: flex; 
        align-items: center; justify-content: center; gap: 15px; 
        box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: 0.2s;
    }
    .btn-audio-circle { width: 65px; height: 65px; cursor: pointer; flex-shrink: 0; }

    /* CAIXA DE SOM (DESTAQUE) */
    .destaque-box {
        width: var(--dest-size); height: var(--dest-size); background: #fff; border-radius: 30px; 
        border: 3.5px dashed var(--primary-color); display: flex; flex-direction: column; 
        align-items: center; justify-content: center; cursor: pointer; margin-bottom: 10px;
        transition: transform 0.2s;
    }
    .destaque-box:active { transform: scale(0.95); }
    .destaque-box img { width: 50%; margin-bottom: 5px; }
    .texto-quem-sou { color: var(--primary-color); font-weight: 900; font-size: 1rem; text-transform: uppercase; }

    .frase-intermedia { 
        color: var(--text-grey); font-weight: 700; margin-bottom: 20px; text-align: center; font-size: 1.1rem; 
    }

    .opcoes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: fit-content; }
    
    .opcao-card {
        background: white; border: 3px solid #f0f0f0; border-radius: 20px; 
        width: var(--card-size); height: var(--card-size);
        display: flex; align-items: center; justify-content: center; 
        cursor: pointer; position: relative; transition: 0.2s;
    }
    .opcao-card img { width: 75%; height: 75%; object-fit: contain; }
    
    .feedback-icon { position: absolute; font-size: 3rem; z-index: 10; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3)); pointer-events: none; }
    .icon-v { color: #8cc63f; } .icon-x { color: #ff5a5f; }

    :root { 
        --card-size: 100px; 
        --dest-size: 150px; 
    }

    @media screen and (min-width: 1025px) {
        :root { --card-size: 140px; --dest-size: 180px; }
    }
`;
document.head.appendChild(style);

// ==========================================
// 3. LÓGICA DE ÁUDIO, CAPA E SIMULAÇÃO
// ==========================================
function pararAudios() {
    if (audioAnimalAtual) {
        audioAnimalAtual.pause();
        audioAnimalAtual.currentTime = 0;
    }
}

function tocarSomAnimal() {
    if (!itemDestaque) return;
    pararAudios();
    somClique.play();
    audioAnimalAtual = new Audio(JOGO_CONFIG.caminhoSonsAnimais + itemDestaque.som);
    audioAnimalAtual.play().catch(e => console.log("Erro ao tocar som:", e));
}

function tocarAudioInstrucoes() {
    somClique.play();
    const audioInst = new Audio(JOGO_CONFIG.caminhoSonsSistema + DADOS_JOGO.somInstrucoes);
    audioInst.play().catch(() => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(JOGO_CONFIG.descricao);
        utter.lang = 'pt-PT'; synth.speak(utter);
    });
}

function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div id="simu-hand" style="position:absolute; font-size:3rem; z-index:100; pointer-events:none; display:none;">👆</div>
        <div style="display:flex; flex-direction:column; align-items:center;">
            <div class="destaque-box" id="simu-box">
                <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png">
                <span class="texto-quem-sou">${JOGO_CONFIG.textoDestaque}</span>
            </div>
            <div style="display:flex; gap:10px; margin-top:10px;">
                <div class="opcao-card" style="width:70px; height:70px;" id="simu-opt-0"><img src=""></div>
                <div class="opcao-card" style="width:70px; height:70px;" id="simu-opt-1"><img src=""></div>
                <div class="opcao-card" style="width:70px; height:70px;" id="simu-opt-2"><img src=""></div>
            </div>
            <p style="color:var(--text-grey); font-weight:800; text-align:center; margin-top:15px; font-size:0.9rem;">${JOGO_CONFIG.descricao}</p>
        </div>`;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="tocarAudioInstrucoes()">
        <button class="btn-play-rect" onclick="iniciarJogo()"><i class="fas fa-play"></i> JOGAR</button>`;
    
    correrSimulacao();
}

function correrSimulacao() {
    clearInterval(simuInterval);
    const hand = document.getElementById('simu-hand');
    const animar = () => {
        const itens = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5).slice(0,3);
        const certoIdx = Math.floor(Math.random() * 3);
        
        itens.forEach((it, i) => { 
            const card = document.getElementById(`simu-opt-${i}`);
            if(card) {
                card.querySelector('img').src = getCaminhoImagem(it) + it.img;
                card.style.borderColor = "#f0f0f0";
            }
        });

        const container = document.getElementById('game-content').getBoundingClientRect();
        hand.style.display = "block"; hand.style.opacity = "0"; hand.style.top = "50%"; hand.style.left = "50%";
        
        setTimeout(() => {
            const box = document.getElementById('simu-box').getBoundingClientRect();
            hand.style.transition = "all 0.6s ease-in-out"; hand.style.opacity = "1";
            hand.style.top = (box.top - container.top + 40) + "px"; hand.style.left = (box.left - container.left + 40) + "px";
            
            setTimeout(() => {
                const target = document.getElementById(`simu-opt-${certoIdx}`).getBoundingClientRect();
                hand.style.top = (target.top - container.top + 20) + "px"; hand.style.left = (target.left - container.left + 20) + "px";
                setTimeout(() => { 
                    const opt = document.getElementById(`simu-opt-${certoIdx}`);
                    if(opt) opt.style.borderColor = "#8cc63f";
                    setTimeout(() => { hand.style.opacity = "0"; }, 500);
                }, 700);
            }, 1000);
        }, 200);
    };
    animar(); simuInterval = setInterval(animar, 4000);
}

// ==========================================
// 4. LÓGICA DE JOGO
// ==========================================
function iniciarJogo() { 
    clearInterval(simuInterval); 
    jogoAtivo = true; 
    rondaAtual = 1; 
    certos = 0; 
    erros = 0; 
    ajudasUsadas = 0; 
    proximaRonda(); 
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    pararAudios();
    
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    const area = document.getElementById('game-content');
    
    // Selecionar item e distractores
    const todos = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todos[0];
    opcoesRonda = todos.slice(0, 3).sort(() => Math.random() - 0.5);

    area.innerHTML = `
        <div class="destaque-box" onclick="tocarSomAnimal()">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png">
            <span class="texto-quem-sou">${JOGO_CONFIG.textoDestaque}</span>
        </div>
        
        <p class="frase-intermedia">${JOGO_CONFIG.fraseIntermedia}</p>

        <div class="opcoes-grid">
            ${opcoesRonda.map(item => `
                <div class="opcao-card" id="card-${item.id}" onclick="verificarResposta(${item.id}, this)">
                    <img src="${getCaminhoImagem(item) + item.img}">
                </div>`).join('')}
        </div>`;

    // Tocar o som automaticamente no início da ronda
    setTimeout(tocarSomAnimal, 500);
}

function verificarResposta(id, el) {
    if (!jogoAtivo) return;
    document.querySelectorAll('.opcao-card').forEach(c => c.style.pointerEvents = 'none');
    pararAudios();

    if (id === itemDestaque.id) {
        certos++; somAcerto.play();
        el.style.borderColor = "#8cc63f";
        el.innerHTML += '<i class="fas fa-check feedback-icon icon-v"></i>';
    } else {
        erros++; somErro.play();
        el.style.borderColor = "#ff5a5f";
        el.innerHTML += '<i class="fas fa-times feedback-icon icon-x"></i>';
        const correto = document.getElementById(`card-${itemDestaque.id}`);
        if(correto) correto.style.borderColor = "#8cc63f";
    }
    setTimeout(() => { rondaAtual++; proximaRonda(); }, 2000);
}

function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++; 
    somClique.play();
    const correto = document.getElementById(`card-${itemDestaque.id}`);
    if (correto) {
        correto.style.borderColor = "var(--primary-color)";
        correto.animate([
            {transform:'scale(1)'}, {transform:'scale(1.1)'}, {transform:'scale(1)'}
        ], {duration:500, iterations:2});
    }
}

function finalizarJogo() {
    jogoAtivo = false;
    pararAudios();
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, ajudasUsadas, rel);
}
