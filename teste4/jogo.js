let rondaAtual = 1;
const totalRondas = 10;
let certos = 0, errados = 0, ajudasUsadas = 0, itemAlvo = null;

// Inicialização
function engineInit() {
    renderIntro();
    carregarInstrucoes();
}

// ------------------------------------------
// ECRÃ 1: APRESENTAÇÃO
// ------------------------------------------
function renderIntro() {
    const main = document.getElementById("game-engine");
    main.innerHTML = `
        <div style="height:100%; width:100%; background:white; border-radius:35px; border:3px solid var(--cor-primaria-alpha); display:flex; flex-direction:column; justify-content:space-between; overflow:hidden;">
            <div style="height:70px; display:flex; align-items:center; justify-content:center; text-align:center; padding:0 20px;">
                <h1 style="font-size:1.2rem; font-weight:900; color:var(--cor-primaria); text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h1>
            </div>
            <div id="container-tutorial" style="flex:1; display:flex; align-items:center; justify-content:center; padding:10px;">
                <!-- Aqui podes colocar a animação que fizemos antes -->
                <div style="text-align:center; color:#ccc;">[ ANIMAÇÃO TUTORIAL ]</div>
            </div>
            <div style="height:85px; display:flex; align-items:center; padding:0 25px; gap:15px; border-top:1px solid #f2f2f2;">
                <img src="${JOGO_CONFIG.caminhoIconsJogos}inform.png" width="50" style="cursor:pointer;" onclick="abrirInfo()">
                <button onclick="irParaJogo()" style="flex:1; background:var(--cor-primaria); color:white; border:none; padding:15px; border-radius:50px; font-weight:900; font-size:1.4rem; cursor:pointer;">JOGAR</button>
            </div>
        </div>
    `;
}

// ------------------------------------------
// ECRÃ 2: JOGO (Layout Dinâmico 3 ou 5 linhas)
// ------------------------------------------
function irParaJogo() {
    rondaAtual = 1; certos = 0; errados = 0; ajudasUsadas = 0;
    renderGameScreen();
    proximaRonda();
}

function renderGameScreen() {
    const main = document.getElementById("game-engine");
    main.innerHTML = `
        <div style="height:100%; width:100%; background:white; border-radius:35px; border:3px solid var(--cor-primaria-alpha); display:flex; flex-direction:column; overflow:hidden;">
            <div style="height:75px; display:flex; align-items:center; justify-content:space-between; padding:0 20px; border-bottom:1px solid #f2f2f2;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img id="btn-lampada" src="${JOGO_CONFIG.caminhoIconsJogos}lampada.png" height="40" style="cursor:pointer;" onclick="usarAjuda()">
                    <div id="ui-ronda" style="background:#6c757d; color:white; padding:4px 12px; border-radius:50px; font-weight:900; font-size:0.9rem;">1/10</div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="background:#8cc63f; color:white; padding:4px 10px; border-radius:8px; font-weight:900; font-size:0.9rem;">✓ <span id="ui-certos">0</span></div>
                    <div style="background:#ff5a5f; color:white; padding:4px 10px; border-radius:8px; font-weight:900; font-size:0.9rem;">X <span id="ui-errados">0</span></div>
                    <img src="${JOGO_CONFIG.caminhoIconsJogos}inform.png" width="30" style="cursor:pointer;" onclick="abrirInfo()">
                </div>
            </div>
            <div id="jogo-grid-container" style="flex:1; padding:15px; display:grid; gap:10px; align-content:center; justify-content:center;">
                <!-- Injetado na proximaRonda() -->
            </div>
        </div>
    `;
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { renderResults(); return; }
    atualizarStats();
    
    const container = document.getElementById("jogo-grid-container");
    const isPortrait = window.innerHeight > window.innerWidth;
    
    // Configurar o Grid exato conforme pedido
    if (isPortrait) {
        container.style.gridTemplateColumns = "repeat(2, 1fr)";
        container.style.gridTemplateRows = "1.2fr repeat(4, 1fr)"; // 5 linhas
    } else {
        container.style.gridTemplateColumns = "repeat(4, 1fr)";
        container.style.gridTemplateRows = "1.5fr 1fr 1fr"; // 3 linhas
    }

    const lista = [...DADOS_JOGO.itens];
    itemAlvo = lista[Math.floor(Math.random() * lista.length)];
    const opcoes = [...lista.filter(i => i.id !== itemAlvo.id).sort(() => 0.5 - Math.random()).slice(0, 8), itemAlvo].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <div style="grid-column: 1 / -1; justify-self: center; height: 100%; aspect-ratio: 1/1; background: white; border: 3px solid var(--cor-primaria); border-radius: 15px; display: flex; align-items: center; justify-content: center; padding: 5px;">
            <img src="${DADOS_JOGO.caminhoImagens}${itemAlvo.img}" style="height: 55%; width: auto; object-fit: contain;">
        </div>
        ${opcoes.map(item => `
            <div class="card-opcao" onclick="verificar(this, ${item.id})" style="background: white; border: 2px solid #eee; border-radius: 12px; display: flex; align-items: center; justify-content: center; height: 100%; cursor: pointer;">
                <img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="height: 50%; width: auto; object-fit: contain;">
            </div>
        `).join('')}
    `;
}

// ------------------------------------------
// LÓGICA DE APOIO
// ------------------------------------------
function verificar(el, id) {
    if (document.querySelector('.bloqueio')) return;
    document.querySelectorAll('.card-opcao').forEach(c => c.style.pointerEvents = "none");
    if (id === itemAlvo.id) {
        certos++; el.style.background = "#eef9e5";
        setTimeout(() => { rondaAtual++; proximaRonda(); }, 1000);
    } else {
        errados++; el.style.background = "#ffebeb";
        // Mostrar correto
        const correctCard = Array.from(document.querySelectorAll('.card-opcao')).find(c => c.innerHTML.includes(itemAlvo.img));
        if (correctCard) correctCard.style.boxShadow = "0 0 15px #8cc63f";
        setTimeout(() => { rondaAtual++; proximaRonda(); }, 1800);
    }
}

function carregarInstrucoes() {
    const area = document.getElementById("ui-area-instrucoes");
    const ins = JOGO_CONFIG.instrucoes;
    area.innerHTML = `
        <div style="border-left:6px solid var(--cor-primaria); padding-left:15px; margin-bottom:30px;"><h2 style="margin:0; font-size:1.5rem;">Objetivo</h2><p>${ins.objetivo}</p></div>
        <h2 style="color:var(--cor-primaria); font-size:1.1rem; margin-top:20px;">COMO JOGAR</h2><ul>${ins.comoJogar.map(s => `<li style="margin-bottom:8px">➔ ${s}</li>`).join('')}</ul>
        <h2 style="color:var(--cor-primaria); font-size:1.1rem; margin-top:20px;">REGRAS</h2><ul>${ins.regras.map(r => `<li style="margin-bottom:8px">➔ ${r}</li>`).join('')}</ul>
    `;
}

function abrirInfo() { document.getElementById("page-info").classList.add("active"); }
function atualizarStats() {
    document.getElementById("ui-ronda").innerText = `${rondaAtual}/10`;
    document.getElementById("ui-certos").innerText = certos;
    document.getElementById("ui-errados").innerText = errados;
}
function usarAjuda() { 
    ajudasUsadas++; atualizarStats(); 
    const correctCard = Array.from(document.querySelectorAll('.card-opcao')).find(c => c.innerHTML.includes(itemAlvo.img));
    if (correctCard) { correctCard.style.boxShadow = "0 0 20px gold"; setTimeout(()=>correctCard.style.boxShadow="", 1500); }
}

function renderResults() {
    const main = document.getElementById("game-engine");
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    main.innerHTML = `
        <div style="height:100%; width:100%; background:white; border-radius:35px; border:3px solid var(--cor-primaria-alpha); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:20px;">
            <h2 style="color:var(--cor-primaria); font-weight:900; margin-bottom:20px;">RESULTADOS</h2>
            <img src="${JOGO_CONFIG.caminhoIconsJogos}${rel.img}" width="120" style="margin-bottom:15px;">
            <h3 style="color:var(--cor-primaria); margin-bottom:20px;">${rel.titulo}</h3>
            <div style="display:flex; gap:10px; margin-bottom:30px;">
                <div style="background:#8cc63f; color:white; padding:8px 20px; border-radius:12px; font-weight:900;">✓ ${certos}</div>
                <div style="background:#ff5a5f; color:white; padding:8px 20px; border-radius:12px; font-weight:900;">X ${errados}</div>
            </div>
            <button onclick="location.reload()" style="background:var(--cor-primaria); color:white; border:none; padding:15px 40px; border-radius:50px; font-weight:900; cursor:pointer;">REPETIR</button>
        </div>
    `;
}
