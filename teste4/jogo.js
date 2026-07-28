let rondaAtual = 1; const totalRondas = 10;
let certos = 0, errados = 0, ajudasUsadas = 0, itemAlvo = null;

function engineInit() {
    renderIntro();
    carregarInstrucoes();
}

// ==========================================
// 1. INSTRUÇÕES ORGANIZADAS POR SECCÕES
// ==========================================
function carregarInstrucoes() {
    const area = document.getElementById("ui-area-instrucoes");
    const ins = JOGO_CONFIG.instrucoes;
    area.innerHTML = `
        <section style="margin-bottom: 30px; border-left: 6px solid var(--cor-primaria); padding-left: 15px;">
            <h2 style="font-size: 1.6rem; text-transform: uppercase; margin-bottom: 10px;">Objetivo</h2>
            <p style="font-size: 1.1rem; line-height: 1.4;">${ins.objetivo}</p>
        </section>

        <section style="margin-bottom: 30px;">
            <h2 style="color: var(--cor-primaria); font-size: 1.3rem; text-transform: uppercase; margin-bottom: 15px;">Como Jogar</h2>
            <ul style="list-style: none; padding: 0;">
                ${ins.comoJogar.map(step => `<li style="display: flex; gap: 10px; margin-bottom: 10px; font-size: 1.1rem;"><strong>➔</strong> ${step}</li>`).join('')}
            </ul>
        </section>

        <section style="margin-bottom: 30px;">
            <h2 style="color: var(--cor-primaria); font-size: 1.3rem; text-transform: uppercase; margin-bottom: 15px;">Regras e Dicas</h2>
            <ul style="list-style: none; padding: 0;">
                ${ins.regras.map(rule => `<li style="display: flex; gap: 10px; margin-bottom: 8px; font-size: 1.1rem;">• ${rule}</li>`).join('')}
                <li style="margin-top: 15px; font-style: italic; color: var(--cor-texto);">${ins.dicas}</li>
            </ul>
        </section>

        <section style="background: #f9f9f9; padding: 20px; border-radius: 20px; border: 1px solid #eee;">
            <h2 style="font-size: 1.1rem; text-transform: uppercase; margin-bottom: 10px;">O que vais desenvolver?</h2>
            <p style="font-size: 1rem; line-height: 1.5;">${ins.desenvolvimento.join("; ")}.</p>
        </section>
    `;
}

// ==========================================
// 2. ECRÃS E JOGO (CENTRADO E RESPONSIVO)
// ==========================================
function renderIntro() {
    const main = document.getElementById("game-engine");
    main.innerHTML = `
        <div class="tela active-tela">
            <div style="display:flex; flex-direction:column; height:100%; justify-content:space-between; width:100%;">
                <div style="height:85px; display:flex; align-items:center; justify-content:center; text-align:center; padding:0 20px;">
                    <h1 style="font-size:1.2rem; font-weight:900; color:var(--cor-primaria); text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h1>
                </div>
                <div id="container-tutorial" style="flex:1; display:flex; align-items:center; justify-content:center; padding:20px;">
                    <!-- Tutorial Animado Simples -->
                    <div style="text-align:center;">
                        <div style="border:3px solid var(--cor-primaria); border-radius:15px; width:90px; height:90px; margin:0 auto 20px; display:flex; align-items:center; justify-content:center; background:white;">
                            <img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[0].img}" style="height:60%;">
                        </div>
                        <p style="font-weight:900; color:var(--text-grey); font-size:0.9rem;">ENCONTRA O IGUAL</p>
                    </div>
                </div>
                <div style="height:85px; display:flex; align-items:center; padding:0 30px; gap:20px; border-top:1px solid #f2f2f2;">
                    <img src="${JOGO_CONFIG.caminhoIconsJogos}inform.png" width="50" style="cursor:pointer;" onclick="abrirInfo()">
                    <button onclick="irParaJogo()" style="flex:1; background:var(--cor-primaria); color:white; border:none; padding:15px; border-radius:50px; font-weight:900; font-size:1.5rem; cursor:pointer; text-transform:uppercase;">JOGAR</button>
                </div>
            </div>
        </div>
    `;
}

function irParaJogo() {
    rondaAtual = 1; certos = 0; errados = 0; ajudasUsadas = 0;
    renderGameScreen();
    proximaRonda();
}

function renderGameScreen() {
    const main = document.getElementById("game-engine");
    main.innerHTML = `
        <div class="tela active-tela">
            <div class="game-container">
                <div class="game-topo">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img id="btn-lampada" src="${JOGO_CONFIG.caminhoIconsJogos}lampada.png" height="45" style="cursor:pointer;" onclick="usarAjuda()">
                        <div id="ui-ronda" class="round-pill">1/10</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div class="stat-box" style="background:#8cc63f;">✓ <span id="ui-certos">0</span></div>
                        <div class="stat-box" style="background:#ff5a5f;">X <span id="ui-errados">0</span></div>
                        <img src="${JOGO_CONFIG.caminhoIconsJogos}inform.png" width="35" style="cursor:pointer;" onclick="abrirInfo()">
                    </div>
                </div>
                <div id="jogo-grid-container" style="flex:1; display:grid; gap:10px; padding:15px; align-content:center; justify-content:center; width:100%;">
                    <!-- Cartas injetadas aqui -->
                </div>
            </div>
        </div>
    `;
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { renderResults(); return; }
    atualizarStats();
    
    const container = document.getElementById("jogo-grid-container");
    const isPortrait = window.innerHeight > window.innerWidth;
    
    container.style.gridTemplateColumns = isPortrait ? "repeat(2, 1fr)" : "repeat(4, 1fr)";

    const lista = [...DADOS_JOGO.itens];
    itemAlvo = lista[Math.floor(Math.random() * lista.length)];
    const distratores = lista.filter(i => i.id !== itemAlvo.id).sort(() => 0.5 - Math.random()).slice(0, 7);
    const opcoes = [...distratores, itemAlvo].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <div style="grid-column: 1 / -1; justify-self: center; height: 100px; aspect-ratio: 1/1; background: white; border: 3px solid var(--cor-primaria); border-radius: 15px; display: flex; align-items: center; justify-content: center; padding: 5px; margin-bottom:10px;">
            <img src="${DADOS_JOGO.caminhoImagens}${itemAlvo.img}" style="height: 55%; width: auto; object-fit: contain;">
        </div>
        ${opcoes.map(item => `
            <div class="card-opcao" onclick="verificar(this, ${item.id})" style="background: white; border: 2px solid #eee; border-radius: 12px; display: flex; align-items: center; justify-content: center; height: 65px; cursor: pointer; padding: 5px;">
                <img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="height: 50%; width: auto; object-fit: contain;">
            </div>
        `).join('')}
    `;
}

function verificar(el, id) {
    if (document.querySelector('.bloqueio')) return;
    document.querySelectorAll('.card-opcao').forEach(c => c.classList.add('bloqueio'));
    
    if (id === itemAlvo.id) {
        certos++; el.style.background = "#eef9e5"; el.style.borderColor = "#8cc63f";
        setTimeout(() => { rondaAtual++; proximaRonda(); }, 1000);
    } else {
        errados++; el.style.background = "#ffebeb"; el.style.borderColor = "#ff5a5f";
        const oCorreto = Array.from(document.querySelectorAll('.card-opcao')).find(c => c.innerHTML.includes(itemAlvo.img));
        if (oCorreto) { oCorreto.style.boxShadow = "0 0 15px #8cc63f"; oCorreto.style.borderColor = "#8cc63f"; }
        setTimeout(() => { rondaAtual++; proximaRonda(); }, 1800);
    }
}

function usarAjuda() {
    ajudasUsadas++; atualizarStats();
    const correto = Array.from(document.querySelectorAll('.card-opcao')).find(c => c.innerHTML.includes(itemAlvo.img));
    if (correto) { correto.style.boxShadow = "0 0 25px gold"; setTimeout(() => correto.style.boxShadow = "", 1500); }
}

function atualizarStats() {
    document.getElementById("ui-ronda").innerText = `${rondaAtual}/10`;
    document.getElementById("ui-certos").innerText = certos;
    document.getElementById("ui-errados").innerText = errados;
}

function renderResults() {
    const main = document.getElementById("game-engine");
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    main.innerHTML = `
        <div class="tela active-tela" style="align-items:center; justify-content:center; text-align:center; padding:20px;">
            <h2 style="color:var(--cor-primaria); font-weight:900; margin-bottom:20px; font-size:2rem;">RESULTADOS</h2>
            <img src="${JOGO_CONFIG.caminhoIconsJogos}${rel.img}" width="120" style="margin-bottom:15px;">
            <h3 style="color:var(--cor-primaria); margin-bottom:20px; font-size:1.5rem;">${rel.titulo}</h3>
            <div style="display:flex; gap:10px; margin-bottom:30px;">
                <div class="stat-box" style="background:#8cc63f; padding:8px 20px;">✓ ${certos}</div>
                <div class="stat-box" style="background:#ff5a5f; padding:8px 20px;">X ${errados}</div>
                <div class="stat-box" style="background:#f39c12; padding:8px 20px;">💡 ${ajudasUsadas}</div>
            </div>
            <button onclick="location.reload()" style="background:var(--cor-primaria); color:white; border:none; padding:15px 50px; border-radius:50px; font-weight:900; cursor:pointer; text-transform:uppercase;">REPETIR</button>
        </div>
    `;
}
