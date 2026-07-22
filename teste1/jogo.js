let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let indicePergunta = 0;
let jogoAtivo = false;
let ajudaDisponivel = true;
let categoriaAtual = "maiusculas";
let letrasNoEcra = [];
let spawnInterval;
let gameLoopInterval;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() {
    if (!categoriaAtual) categoriaAtual = "maiusculas";
    const cat = JOGO_CATEGORIAS[categoriaAtual];
    
    document.getElementById('intro-title').innerText = cat.nome;
    document.getElementById('intro-instr').innerText = cat.descricao;

    const helpContainer = document.getElementById('help-btn-container');
    if (helpContainer) {
        helpContainer.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:28px; cursor:pointer;" onclick="usarAjuda()">`;
    }
    renderTutorialAnimation();
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
    window.startLogic();
};

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    const isUpper = JOGO_CATEGORIAS[categoriaAtual].tipo === "upper";
    container.innerHTML = `
        <style>
            .tut-circle { width: 160px; height: 160px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 4px solid #f0f4f8; }
            .tut-letter { font-size: 70px; font-weight: 900; color: var(--primary-blue); position: absolute; animation: fallAnim 3s infinite ease-in; }
            @keyframes fallAnim { 0% { transform: translateY(-60px); opacity: 0; } 30% { opacity: 1; } 60% { transform: translateY(0); opacity: 1; } 80%, 100% { opacity: 0; } }
        </style>
        <div class="tut-circle">
            <div class="tut-letter">${isUpper ? 'A' : 'a'}</div>
            <div style="position:absolute; bottom: 10px; font-size: 30px; animation: tapAnim 3s infinite;">☝️</div>
        </div>
        <style> @keyframes tapAnim { 0%, 50% { transform: scale(1); opacity: 0; } 60% { transform: scale(0.8); opacity: 1; } 100% { opacity: 0; } } </style>
    `;
}

window.initGame = function() {
    acertos = 0; erros = 0; ajudasUtilizadas = 0; indicePergunta = 0;
    letrasNoEcra = [];
    jogoAtivo = true;
    ajudaDisponivel = true;
    
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    document.getElementById('round-val').innerText = "1 / 10";

    renderEstruturaJogo();
    
    spawnLetra(); 
    spawnInterval = setInterval(spawnLetra, 4000); 
    gameLoopInterval = setInterval(atualizarLetras, 50);

    window.addEventListener('keydown', lidarTeclado);
};

function renderEstruturaJogo() {
    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <style>
            .rain-outer { width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden; background: #fdfdfd; }
            .sky-area { flex: 1; position: relative; width: 100%; overflow: hidden; border-bottom: 2px solid #f0f0f0; }
            .falling-letter { position: absolute; font-size: 38px; font-weight: 900; color: var(--primary-blue); cursor: pointer; background: white; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; border-radius: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.06); transition: transform 0.2s; border: 1px solid #f0f0f0; }
            .keyboard-area { padding: 12px; display: flex; flex-direction: column; gap: 6px; background: #fff; }
            .kb-row { display: flex; justify-content: center; gap: 6px; }
            .key-btn { flex: 1; height: 48px; background: #f8fafc; border: none; border-radius: 12px; font-weight: 900; font-size: 18px; color: var(--text-grey); cursor: pointer; box-shadow: 0 4px 0 #e2e8f0; display: flex; align-items: center; justify-content: center; }
            .key-btn:active { transform: translateY(2px); box-shadow: none; }
            .ajuda-key { animation: pulseAjuda 0.5s infinite alternate; background: #fff5e6 !important; color: #ff9f43 !important; box-shadow: 0 4px 0 #ffdcb0 !important; }
            @keyframes pulseAjuda { from { transform: scale(1); } to { transform: scale(1.05); } }
        </style>
        <div class="rain-outer">
            <div class="sky-area" id="sky"></div>
            <div class="keyboard-area" id="kb-container"></div>
        </div>
    `;
    gerarTecladoDinamico();
}

function gerarTecladoDinamico() {
    const kbContainer = document.getElementById('kb-container');
    const letras = JOGO_CATEGORIAS[categoriaAtual].letras;
    const isPortrait = window.innerHeight > window.innerWidth;
    const numRows = isPortrait ? 4 : 3;
    const itemsPerRow = Math.ceil(letras.length / numRows);
    kbContainer.innerHTML = '';
    for (let i = 0; i < numRows; i++) {
        const row = document.createElement('div');
        row.className = 'kb-row';
        const slice = letras.slice(i * itemsPerRow, (i + 1) * itemsPerRow);
        row.innerHTML = slice.map(l => `<div class="key-btn" data-letra="${l}" onclick="verificarLetra('${l}')">${l}</div>`).join('');
        kbContainer.appendChild(row);
    }
}

function spawnLetra() {
    if (!jogoAtivo || indicePergunta >= 10) return;
    const sky = document.getElementById('sky');
    const letrasPossiveis = JOGO_CATEGORIAS[categoriaAtual].letras;
    const char = letrasPossiveis[Math.floor(Math.random() * letrasPossiveis.length)];
    const div = document.createElement('div');
    div.className = 'falling-letter';
    div.innerText = char;
    div.style.left = (10 + Math.random() * 75) + "%";
    div.style.top = "-80px";
    const letraObj = { char, element: div, top: -80 };
    div.onclick = () => verificarLetra(char);
    sky.appendChild(div);
    letrasNoEcra.push(letraObj);
}

function atualizarLetras() {
    if (!jogoAtivo) return;
    const skyHeight = document.getElementById('sky').clientHeight;
    for (let i = letrasNoEcra.length - 1; i >= 0; i--) {
        let letra = letrasNoEcra[i];
        letra.top += 0.9; 
        letra.element.style.top = letra.top + "px";
        if (letra.top > skyHeight) {
            somErro.play();
            erros++;
            indicePergunta++;
            atualizarPlacar();
            letra.element.remove();
            letrasNoEcra.splice(i, 1);
            if (indicePergunta >= 10) finalizarJogoComAtraso();
        }
    }
}

function lidarTeclado(e) {
    if (!jogoAtivo) return;
    const tecla = e.key;
    if (/^[a-zA-Z]$/.test(tecla)) {
        verificarLetra(JOGO_CATEGORIAS[categoriaAtual].tipo === "upper" ? tecla.toUpperCase() : tecla.toLowerCase());
    }
}

function verificarLetra(charDigitado) {
    if (!jogoAtivo || indicePergunta >= 10) return;
    const index = letrasNoEcra.findIndex(l => l.char === charDigitado);
    if (index !== -1) {
        const letra = letrasNoEcra[index];
        somAcerto.play();
        acertos++;
        letra.element.style.transform = "scale(0)";
        setTimeout(() => letra.element.remove(), 200);
        letrasNoEcra.splice(index, 1);
        indicePergunta++;
        atualizarPlacar();
    } else {
        somErro.play();
        // Opcional: penalizar erro? No teu código anterior incrementava índicePergunta.
        // Se quiseres que errar uma tecla conte como jogada:
        // erros++; indicePergunta++; atualizarPlacar();
    }
    if (indicePergunta >= 10) finalizarJogoComAtraso();
}

function atualizarPlacar() {
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    document.getElementById('round-val').innerText = `${Math.min(indicePergunta + 1, 10)} / 10`;
}

function finalizarJogoComAtraso() {
    jogoAtivo = false;
    setTimeout(finalizarJogo, 800);
}

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel || letrasNoEcra.length === 0) return;
    ajudaDisponivel = false;
    ajudasUtilizadas++;
    const maisBaixa = letrasNoEcra.reduce((prev, curr) => (prev.top > curr.top) ? prev : curr);
    const tecla = document.querySelector(`.key-btn[data-letra="${maisBaixa.char}"]`);
    if (tecla) {
        tecla.classList.add('ajuda-key');
        setTimeout(() => { tecla.classList.remove('ajuda-key'); ajudaDisponivel = true; }, 2000);
    }
};

function finalizarJogo() {
    clearInterval(spawnInterval);
    clearInterval(gameLoopInterval);
    window.removeEventListener('keydown', lidarTeclado);
    somVitoria.play();
    
    const perc = (acertos / 10) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    document.getElementById('status-bar').style.display = 'none';
    
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 30px; text-align: center;">
            <img src="${JOGO_CONFIG.caminhoImg}${rel.img}" style="height: 120px; margin-bottom: 20px;">
            <h1 style="color:var(--primary-blue); font-weight:900; font-size:2.4rem; margin-bottom:10px;">${rel.titulo}</h1>
            <p style="font-weight:700; color:#88a; margin-bottom:30px;">Concluíste o desafio com sucesso!</p>
            
            <div style="display:flex; gap:15px; justify-content:center; margin-bottom:40px;">
                <div style="background:#f8fafc; padding:15px; border-radius:20px; min-width:90px;">
                    <div style="font-size:24px; font-weight:900; color:#4ade80;">${acertos}</div>
                    <div style="font-size:10px; font-weight:900; color:#aab; text-transform:uppercase;">Acertos</div>
                </div>
                <div style="background:#f8fafc; padding:15px; border-radius:20px; min-width:90px;">
                    <div style="font-size:24px; font-weight:900; color:#f87171;">${erros}</div>
                    <div style="font-size:10px; font-weight:900; color:#aab; text-transform:uppercase;">Erros</div>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:350px; margin: 0 auto;">
                <button class="btn-jogar-stretch" onclick="location.reload()">JOGAR DE NOVO</button>
                <button onclick="openRDMenu()" style="padding:15px; border:2px solid var(--primary-blue); background:transparent; color:var(--primary-blue); border-radius:18px; font-weight:900; cursor:pointer;">OUTRO NÍVEL</button>
            </div>
        </div>
    `;
}
