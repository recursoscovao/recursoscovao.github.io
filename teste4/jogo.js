let rondaAtual = 1; const totalRondas = 10;
let certos = 0, errados = 0, ajudasUsadas = 0, itemAlvo = null;

function engineInit() {
    renderIntro();
    carregarInstrucoes();
}

function carregarInstrucoes() {
    const area = document.getElementById("ui-area-instrucoes");
    const ins = JOGO_CONFIG.instrucoes;
    area.innerHTML = `
        <div style="border-left:6px solid var(--cor-primaria); padding-left:15px; margin-bottom:30px;">
            <h2 style="margin:0; font-size:1.6rem; text-transform:uppercase;">Objetivo</h2>
            <p style="margin-top:10px; font-size:1.1rem;">${ins.objetivo}</p>
        </div>
        <h2 style="color:var(--cor-primaria); text-transform:uppercase; font-size:1.2rem; margin-top:30px; margin-bottom:15px;">➔ Como jogar</h2>
        <ul style="list-style:none; padding:0;">${ins.comoJogar.map(s => `<li style="margin-bottom:12px; font-size:1.1rem; display:flex; gap:10px;">• ${s}</li>`).join('')}</ul>
        <h2 style="color:var(--cor-primaria); text-transform:uppercase; font-size:1.2rem; margin-top:30px; margin-bottom:15px;">➔ Regras</h2>
        <ul style="list-style:none; padding:0;">${ins.regras.map(r => `<li style="margin-bottom:10px; font-size:1.1rem; display:flex; gap:10px;">• ${r}</li>`).join('')}</ul>
        <h2 style="color:var(--cor-primaria); text-transform:uppercase; font-size:1.2rem; margin-top:30px; margin-bottom:15px;">➔ Dicas</h2>
        <p style="line-height:1.5; font-size:1.1rem;">${ins.dicas}</p>
    `;
}

function renderIntro() {
    const main = document.getElementById("game-engine");
    main.innerHTML = `
        <div class="tela" id="tela-apresentacao" style="display:flex; height:100%; width:100%; flex-direction:column; justify-content:space-between; background:white; border-radius:35px;">
            <div style="height:70px; display:flex; align-items:center; justify-content:center; text-align:center; padding:0 20px;">
                <h1 style="font-size:1.1rem; font-weight:900; color:var(--cor-primaria); text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h1>
            </div>
            <div id="container-tutorial" style="flex:1; display:flex; align-items:center; justify-content:center; padding:20px;">
                 <div style="text-align:center;">
                    <div style="border:3px solid var(--cor-primaria); border-radius:15px; width:100px; height:100px; margin:0 auto 15px; display:flex; align-items:center; justify-content:center; background:white;">
                        <img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[0].img}" style="height:70%;">
                    </div>
                    <p style="font-weight:900; color:var(--text-grey); font-size:0.9rem;">ENCONTRA O IGUAL</p>
                </div>
            </div>
            <div style="height:85px; display:flex; align-items:center; padding:0 25px; gap:15px; border-top:1px solid #f2f2f2;">
                <img src="${JOGO_CONFIG.caminhoIconsJogos}inform.png" width="50" style="cursor:pointer;" onclick="document.getElementById('page-info').classList.add('active')">
                <button onclick="irParaJogo()" style="flex:1; background:var(--cor-primaria); color:white; border:none; padding:15px; border-radius:50px; font-weight:900; font-size:1.4rem; cursor:pointer;">JOGAR</button>
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
        <div class="tela" style="display:flex; height:100%; width:100%; flex-direction:column;">
            <div style="height:75px; display:flex; align-items:center; justify-content:space-between; padding:0 20px; border-bottom:1px solid #f2f2f2; flex-shrink:0;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${JOGO_CONFIG.caminhoIconsJogos}lampada.png" height="45" style="cursor:pointer;" onclick="usarAjuda()">
                    <div id="ui-ronda" style="background:#6c757d; color:white; padding:5px 15px; border-radius:50px; font-weight:900; font-size:1rem;">1/10</div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="background:#8cc63f; color:white; padding:6px 12px; border-radius:10px; font-weight:900;">✓ <span id="ui-certos">0</span></div>
                    <div style="background:#ff5a5f; color:white; padding:6px 12px; border-radius:10px; font-weight:900;">X <span id="ui-errados">0</span></div>
                    <img src="${JOGO_CONFIG.caminhoIconsJogos}inform.png" width="35" style="cursor:pointer;" onclick="document.getElementById('page-info').classList.add('active')">
                </div>
            </div>
            <div id="jogo-grid-container" style="flex:1; padding:20px; display:grid; gap:10px; align-content:center; justify-content:center; overflow:hidden;">
            </div>
        </div>
    `;
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { renderResults(); return; }
    atualizarStats();
    
    const container = document.getElementById("jogo-grid-container");
    const isPortrait = window.innerHeight > window.innerWidth;
    
    // Configurar o Grid exato: 3 linhas (Landscape) vs 5 linhas (Portrait)
    if (isPortrait) {
        container.style.gridTemplateColumns = "repeat(2, 1fr)";
        container.style.gridTemplateRows = "1.5fr repeat(4, 1fr)";
    } else {
        container.style.gridTemplateColumns = "repeat(4, 1fr)";
        container.style.gridTemplateRows = "1.5fr 1fr 1fr";
    }

    const lista = [...DADOS_JOGO.itens];
    itemAlvo = lista[Math.floor(Math.random() * lista.length)];
    const opcoes = [...lista.filter(i => i.id !== itemAlvo.id).sort(() => 0.5 - Math.random()).slice(0, 7), itemAlvo].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <div style="grid-column: 1 / -1; justify-self: center; height: 100%; aspect-ratio: 1/1; background: white; border: 4px solid var(--cor-primaria); border-radius: 20px; display: flex; align-items: center; justify-content: center; padding: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <img src="${DADOS_JOGO.caminhoImagens}${itemAlvo.img}" style="height: 60%; width: auto; object-fit: contain;">
        </div>
        ${opcoes.map(item => `
            <div class="card-opcao" onclick="verificar(this, ${item.id})" style="background: white; border: 2px solid #eee; border-radius: 15px; display: flex; align-items: center; justify-content: center; height: 100%; cursor: pointer; transition: 0.2s;">
                <img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="height: 55%; width: auto; object-fit: contain;">
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
        const correto = Array.from(document.querySelectorAll('.card-opcao')).find(c => c.innerHTML.includes(itemAlvo.img));
        if (correto) { correto.style.boxShadow = "0 0 15px #8cc63f"; correto.style.borderColor = "#8cc63f"; }
        setTimeout(() => { rondaAtual++; proximaRonda(); }, 1800);
    }
}

function atualizarStats() {
    const r = document.getElementById("ui-ronda"); if(r) r.innerText = `${rondaAtual}/10`;
    const c = document.getElementById("ui-certos"); if(c) c.innerText = certos;
    const e = document.getElementById("ui-errados"); if(e) e.innerText = errados;
}

function usarAjuda() {
    ajudasUsadas++;
    const correto = Array.from(document.querySelectorAll('.card-opcao')).find(c => c.innerHTML.includes(itemAlvo.img));
    if (correto) { correto.style.boxShadow = "0 0 25px gold"; setTimeout(() => correto.style.boxShadow = "", 1500); }
}

function renderResults() {
    const main = document.getElementById("game-engine");
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    main.innerHTML = `
        <div class="tela" style="display:flex; align-items:center; justify-content:center; text-align:center; padding:20px; height:100%; width:100%;">
            <h2 style="color:var(--cor-primaria); font-weight:900; margin-bottom:20px; font-size:2rem;">RESULTADOS</h2>
            <img src="${JOGO_CONFIG.caminhoIconsJogos}${rel.img}" width="120" style="margin-bottom:15px;">
            <h3 style="color:var(--cor-primaria); margin-bottom:20px;">${rel.titulo}</h3>
            <div style="display:flex; gap:10px; margin-bottom:30px;">
                <div style="background:#8cc63f; color:white; padding:8px 20px; border-radius:15px; font-weight:900;">✓ ${certos}</div>
                <div style="background:#ff5a5f; color:white; padding:8px 20px; border-radius:15px; font-weight:900;">X ${errados}</div>
                <div style="background:#f39c12; color:white; padding:8px 20px; border-radius:15px; font-weight:900;">💡 ${ajudasUsadas}</div>
            </div>
            <button onclick="location.reload()" style="background:var(--cor-primaria); color:white; border:none; padding:15px 50px; border-radius:50px; font-weight:900; cursor:pointer; text-transform:uppercase;">REPETIR</button>
        </div>
    `;
}
