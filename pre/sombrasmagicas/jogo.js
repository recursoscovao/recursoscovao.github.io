// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0;
let itemDestaque = null, opcoesRonda = [], simuInterval;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; }
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

    /* Estilo da Sombra */
    .sombra-misteriosa { 
        filter: brightness(0) !important; 
        transition: filter 0.5s ease;
    }

    .destaque-box {
        width: var(--dest-size); height: var(--dest-size); background: #fff; border-radius: 30px; 
        border: 4px dashed var(--primary-color); display: flex; align-items: center; justify-content: center;
        margin-bottom: 25px; position: relative;
    }
    .destaque-box img { max-width: 70%; max-height: 70%; object-fit: contain; }
    
    .opcao-card {
        background: white; border: 3px solid #f0f0f0; border-radius: 20px; 
        width: var(--card-size); height: var(--card-size);
        display: flex; align-items: center; justify-content: center; 
        cursor: pointer; position: relative; transition: transform 0.2s;
    }
    .opcao-card:hover { transform: scale(1.05); }
    .opcao-card img { width: 75%; height: 75%; object-fit: contain; }
    
    .feedback-icon { position: absolute; font-size: 3.5rem; z-index: 10; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3)); pointer-events: none; }
    .icon-v { color: #8cc63f; } .icon-x { color: #ff5a5f; }

    /* Responsividade específica para este jogo (3 colunas) */
    @media screen and (min-width: 600px) {
        :root { --grid-cols: 3; --card-size: 150px; --dest-size: 200px; }
    }
    @media screen and (max-width: 599px) {
        :root { --grid-cols: 3; --card-size: 100px; --dest-size: 160px; }
    }
`;
document.head.appendChild(style);

// ==========================================
// 3. LÓGICA DE CAPA E SIMULAÇÃO
// ==========================================
function tocarAudioInstrucoes() {
    somClique.play();
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance("Olha para a sombra preta em cima e tenta descobrir qual é a fruta correta em baixo!");
    utter.lang = 'pt-PT'; synth.speak(utter);
}

function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div id="simu-hand" style="position:absolute; font-size:3rem; z-index:100; pointer-events:none; display:none;">👆</div>
        <div style="display:flex; flex-direction:column; align-items:center;">
            <div class="destaque-box"><img id="simu-destaque" class="sombra-misteriosa" src=""></div>
            <div style="display:flex; gap:10px;">
                <div class="opcao-card" style="width:70px; height:70px;" id="simu-opt-0"><img src=""></div>
                <div class="opcao-card" style="width:70px; height:70px;" id="simu-opt-1"><img src=""></div>
                <div class="opcao-card" style="width:70px; height:70px;" id="simu-opt-2"><img src=""></div>
            </div>
            <p style="color:var(--text-grey); font-weight:800; text-align:center; margin-top:20px;">${JOGO_CONFIG.descricao}</p>
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
        const imgD = document.getElementById('simu-destaque');
        if(!imgD) return;
        
        imgD.src = DADOS_JOGO.caminhoImagens + itens[certoIdx].img;
        itens.forEach((it, i) => { 
            const card = document.getElementById(`simu-opt-${i}`);
            card.querySelector('img').src = DADOS_JOGO.caminhoImagens + it.img;
            card.style.borderColor = "#f0f0f0";
        });

        const container = document.getElementById('game-content').getBoundingClientRect();
        hand.style.display = "block"; hand.style.opacity = "0"; hand.style.top = "80%"; hand.style.left = "80%";
        
        setTimeout(() => {
            const target = document.getElementById(`simu-opt-${certoIdx}`).getBoundingClientRect();
            hand.style.transition = "all 0.8s ease-in-out"; hand.style.opacity = "1";
            hand.style.top = (target.top - container.top + 25) + "px";
            hand.style.left = (target.left - container.left + 25) + "px";
            setTimeout(() => { 
                const opt = document.getElementById(`simu-opt-${certoIdx}`);
                if(opt) {
                    opt.style.borderColor = "#8cc63f";
                    imgD.classList.remove('sombra-misteriosa');
                }
                setTimeout(() => { 
                    hand.style.opacity = "0"; 
                    imgD.classList.add('sombra-misteriosa');
                }, 800);
            }, 900);
        }, 200);
    };
    animar(); simuInterval = setInterval(animar, 4500);
}

// ==========================================
// 4. LÓGICA DE JOGO (CORRESPONDÊNCIA DE SOMBRA)
// ==========================================
function iniciarJogo() { 
    clearInterval(simuInterval); 
    jogoAtivo = true; 
    rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0;
    proximaRonda(); 
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    const area = document.getElementById('game-content');
    
    // Selecionar 3 frutas diferentes
    let selecao = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5).slice(0, 3);
    // Definir qual delas será a sombra
    itemDestaque = selecao[Math.floor(Math.random() * 3)];
    opcoesRonda = selecao;

    area.innerHTML = `
        <div class="destaque-box">
            <img id="imagem-sombra" src="${DADOS_JOGO.caminhoImagens + itemDestaque.img}" class="sombra-misteriosa">
        </div>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:15px; width:fit-content;">
            ${opcoesRonda.map(item => `
                <div class="opcao-card" id="card-${item.id}" onclick="verificarResposta(${item.id}, this)">
                    <img src="${DADOS_JOGO.caminhoImagens + item.img}">
                </div>`).join('')}
        </div>`;
}

function verificarResposta(id, el) {
    if (!jogoAtivo) return;
    document.querySelectorAll('.opcao-card').forEach(c => c.style.pointerEvents = 'none');
    
    const sombra = document.getElementById('imagem-sombra');

    if (id === itemDestaque.id) {
        certos++; somAcerto.play();
        el.style.borderColor = "#8cc63f";
        el.innerHTML += '<i class="fas fa-check feedback-icon icon-v"></i>';
        // Efeito: Revelar a fruta na sombra
        sombra.classList.remove('sombra-misteriosa');
    } else {
        erros++; somErro.play();
        el.style.borderColor = "#ff5a5f";
        el.innerHTML += '<i class="fas fa-times feedback-icon icon-x"></i>';
        
        // Mostrar a correta e revelar a sombra
        const correto = document.getElementById(`card-${itemDestaque.id}`);
        if(correto) correto.style.borderColor = "#8cc63f";
        sombra.classList.remove('sombra-misteriosa');
    }
    
    setTimeout(() => { 
        rondaAtual++; 
        proximaRonda(); 
    }, 2000);
}

function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++;
    somClique.play();
    const correto = document.getElementById(`card-${itemDestaque.id}`);
    if (correto) {
        correto.style.borderColor = "var(--primary-color)";
        correto.animate([
            {transform:'scale(1)', boxShadow:'0 0 0px var(--primary-color)'},
            {transform:'scale(1.1)', boxShadow:'0 0 20px var(--primary-color)'},
            {transform:'scale(1)', boxShadow:'0 0 0px var(--primary-color)'}
        ], {duration:600, iterations:2});
    }
}

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, ajudasUsadas, rel);
}

// Inicia a aplicação mostrando a capa
mostrarCapa();
