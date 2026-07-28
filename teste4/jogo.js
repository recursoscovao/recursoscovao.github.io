let rondaAtual = 1; const totalRondas = 10;
let certos = 0, errados = 0, ajudasUsadas = 0, itemAlvo = null;

const tocarSom = (tipo) => {
    try {
        const audio = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons[tipo]);
        audio.play();
    } catch(e) {}
};

function engineInit() {
    renderIntro();
    carregarInstrucoes();
}

function carregarInstrucoes() {
    const area = document.getElementById("ui-area-instrucoes");
    const ins = JOGO_CONFIG.instrucoes;
    area.innerHTML = `
        <div style="border-left: 6px solid var(--cor-primaria); padding-left: 15px; margin-bottom: 40px;">
            <h2 style="margin:0; font-size:1.6rem; text-transform:uppercase;">Objetivo</h2>
            <p style="margin-top:10px; font-size:1.1rem;">${ins.objetivo}</p>
        </div>
        <h2 style="color:var(--cor-primaria); text-transform:uppercase; font-size:1.3rem; margin-top:35px; margin-bottom:15px;">Como jogar</h2>
        <ul style="list-style:none; padding:0;">${ins.comoJogar.map(s => `<li style="margin-bottom:12px; display:flex; gap:10px; font-size:1.1rem;">➔ ${s}</li>`).join('')}</ul>
        <h2 style="color:var(--cor-primaria); text-transform:uppercase; font-size:1.3rem; margin-top:35px; margin-bottom:15px;">Regras</h2>
        <ul style="list-style:none; padding:0;">${ins.regras.map(r => `<li style="margin-bottom:12px; display:flex; gap:10px; font-size:1.1rem;">• ${r}</li>`).join('')}</ul>
        <h2 style="color:var(--cor-primaria); text-transform:uppercase; font-size:1.3rem; margin-top:35px; margin-bottom:15px;">Dicas</h2>
        <p style="line-height:1.5; font-size:1.1rem;">${ins.dicas}</p>
    `;
}

function renderIntro() {
    const container = document.getElementById("tela-apresentacao");
    const item = DADOS_JOGO.itens[0];
    const path = DADOS_JOGO.caminhoImagens;
    container.innerHTML = `
        <div style="height:85px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><h1 style="font-size:1.1rem; font-weight:900; color:var(--cor-primaria); text-transform:uppercase; text-align:center; padding:0 20px;">${JOGO_CONFIG.nomeDoJogo}</h1></div>
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; gap:20px;">
            <div style="border:4px solid var(--cor-primaria); border-radius:20px; padding:15px; background:white; width:120px; height:120px; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 25px rgba(0,0,0,0.05);"><img src="${path}${item.img}" style="height:65%; object-fit:contain;"></div>
            <p style="font-weight:900; color:var(--text-grey); font-size:1.1rem; text-transform:uppercase;">Tutorial de Jogo</p>
            <div style="display:flex; gap:15px;">
                <div style="width:70px; height:70px; background:white; border:2px solid #eee; border-radius:15px; display:flex; align-items:center; justify-content:center;"><img src="${path}${DADOS_JOGO.itens[1].img}" style="height:60%;"></div>
                <div style="width:70px; height:70px; background:white; border:3px solid #8cc63f; border-radius:15px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 15px rgba(140, 198, 63, 0.4);"><img src="${path}${item.img}" style="height:60%;"></div>
                <div style="width:70px; height:70px; background:white; border:2px solid #eee; border-radius:15px; display:flex; align-items:center; justify-content:center;"><img src="${path}${DADOS_JOGO.itens[2].img}" style="height:60%;"></div>
            </div>
        </div>
        <div style="height:85px; display:flex; align-items:center; padding:0 30px; gap:20px; border-top:1px solid #f2f2f2; flex-shrink:0;">
            <img src="${JOGO_CONFIG.caminhoIconsJogos}inform.png" width="55" style="cursor:pointer;" onclick="document.getElementById('page-info').classList.add('active')">
            <button onclick="irParaJogo()" style="flex:1; background:var(--cor-primaria); color:white; border:none; padding:15px; border-radius:50px; font-weight:900; font-size:1.5rem; cursor:pointer; text-transform:uppercase;">JOGAR</button>
        </div>
    `;
}

function irParaJogo() {
    tocarSom('clique');
    rondaAtual = 1; certos = 0; errados = 0; ajudasUsadas = 0;
    renderGameContent();
    trocarEcra('tela-jogo');
    proximaRonda();
}

function renderGameContent() {
    const container = document.getElementById("tela-jogo");
    container.innerHTML = `
        <div style="height:80px; display:flex; align-items:center; justify-content:space-between; padding:0 20px; border-bottom:1px solid #f2f2f2; flex-shrink:0;">
            <div style="display:flex; align-items:center; gap:10px;">
                <img src="${JOGO_CONFIG.caminhoIconsJogos}lampada.png" height="45" style="cursor:pointer;" onclick="usarAjuda()">
                <div id="ui-ronda" style="background:#6c757d; color:white; padding:5px 15px; border-radius:50px; font-weight:900;">1/10</div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <div style="background:#8cc63f; color:white; padding:6px 12px; border-radius:10px; font-weight:900;">✓ <span id="ui-certos">0</span></div>
                <div style="background:#ff5a5f; color:white; padding:6px 12px; border-radius:10px; font-weight:900;">X <span id="ui-errados">0</span></div>
                <img src="${JOGO_CONFIG.caminhoIconsJogos}inform.png" width="35" style="cursor:pointer;" onclick="document.getElementById('page-info').classList.add('active')">
            </div>
        </div>
        <div id="game-grid" style="flex:1; display:grid; gap:15px; padding:30px 15px; align-content:center; justify-content:center; width:100%;"></div>
    `;
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { renderResults(); return; }
    document.getElementById("ui-ronda").innerText = `${rondaAtual}/10`;
    document.getElementById("ui-certos").innerText = certos;
    document.getElementById("ui-errados").innerText = errados;

    const grid = document.getElementById("game-grid");
    const isPortrait = window.innerHeight > window.innerWidth;
    grid.style.gridTemplateColumns = isPortrait ? "repeat(2, 1fr)" : "repeat(4, 1fr)";

    const lista = [...DADOS_JOGO.itens];
    itemAlvo = lista[Math.floor(Math.random() * lista.length)];
    const dist = lista.filter(i => i.id !== itemAlvo.id).sort(() => 0.5 - Math.random()).slice(0, 7);
    const opcoes = [...dist, itemAlvo].sort(() => 0.5 - Math.random());

    const destaqueH = isPortrait ? "100px" : "130px";
    const opcaoH = isPortrait ? "75px" : "90px";

    grid.innerHTML = `
        <div style="grid-column: 1 / -1; justify-self: center; height: ${destaqueH}; aspect-ratio: 1/1; background: white; border: 4px solid var(--cor-primaria); border-radius: 20px; display: flex; align-items: center; justify-content: center; padding: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); margin-bottom:10px;">
            <img src="${DADOS_JOGO.caminhoImagens}${itemAlvo.img}" style="height: 60%; width: auto; object-fit: contain;">
        </div>
        ${opcoes.map(item => `
            <div class="card-opcao" onclick="verificar(this, ${item.id})" style="background: white; border: 2px solid #eee; border-radius: 15px; display: flex; align-items: center; justify-content: center; height: ${opcaoH}; cursor: pointer; transition: 0.2s;">
                <img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="height: 60%; width: auto; object-fit: contain;">
            </div>
        `).join('')}
    `;
}

function verificar(el, id) {
    if (document.querySelector('.bloqueio')) return;
    document.querySelectorAll('.card-opcao').forEach(c => c.style.pointerEvents = "none");

    if (id === itemAlvo.id) {
        tocarSom('acerto');
        el.style.background = "#eef9e5"; el.style.borderColor = "#8cc63f";
        certos++;
        setTimeout(() => { rondaAtual++; proximaRonda(); }, 1000);
    } else {
        tocarSom('erro');
        el.style.background = "#ffebeb"; el.style.borderColor = "#ff5a5f";
        errados++;
        const oCorreto = Array.from(document.querySelectorAll('.card-opcao')).find(c => c.innerHTML.includes(itemAlvo.img));
        if (oCorreto) { oCorreto.style.boxShadow = "0 0 15px #8cc63f"; oCorreto.style.borderColor = "#8cc63f"; }
        setTimeout(() => { rondaAtual++; proximaRonda(); }, 1800);
    }
}

function usarAjuda() {
    ajudasUsadas++;
    const oCorreto = Array.from(document.querySelectorAll('.card-opcao')).find(c => c.innerHTML.includes(itemAlvo.img));
    if (oCorreto) { oCorreto.style.boxShadow = "0 0 25px gold"; setTimeout(() => oCorreto.style.boxShadow = "", 1500); }
}

function renderResults() {
    const container = document.getElementById("tela-resultados");
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    trocarEcra('tela-resultados');
    container.innerHTML = `
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px 20px;">
            <h2 style="color:var(--cor-primaria); font-weight:900; margin-bottom:20px; font-size:2.2rem; text-transform:uppercase;">Resultados</h2>
            <img src="${JOGO_CONFIG.caminhoIconsJogos}${rel.img}" width="140" style="margin-bottom:20px;">
            <h3 style="color:var(--cor-primaria); margin-bottom:30px; font-size:1.8rem;">${rel.titulo}</h3>
            <div style="display:flex; gap:15px; margin-bottom:40px;">
                <div style="background:#8cc63f; color:white; padding:15px 30px; border-radius:15px; font-weight:900; font-size:1.4rem;">✓ ${certos}</div>
                <div style="background:#ff5a5f; color:white; padding:15px 30px; border-radius:15px; font-weight:900; font-size:1.4rem;">X ${errados}</div>
                <div style="background:#f39c12; color:white; padding:15px 30px; border-radius:15px; font-weight:900; font-size:1.4rem;">💡 ${ajudasUsadas}</div>
            </div>
            <div style="display:flex; gap:15px; width:100%; max-width:400px;">
                <button onclick="location.reload()" style="flex:1; background:white; color:var(--cor-primaria); border:2px solid var(--cor-primaria); padding:15px; border-radius:50px; font-weight:900; cursor:pointer;">REPETIR</button>
                <button onclick="window.location.href='../'" style="flex:1; background:var(--cor-primaria); color:white; border:none; padding:15px; border-radius:50px; font-weight:900; cursor:pointer;">OUTROS</button>
            </div>
        </div>
    `;
}
