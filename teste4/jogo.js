let rondaAtual = 1; const totalRondas = 10;
let certos = 0, errados = 0, ajudasUsadas = 0, itemAlvo = null;

function carregarInstrucoes() {
    const area = document.getElementById("ui-area-instrucoes");
    const ins = JOGO_CONFIG.instrucoes;
    area.innerHTML = `
        <div style="border-left:6px solid var(--cor-primaria); padding-left:15px; margin-bottom:30px;">
            <h2 style="margin:0; font-size:1.6rem; text-transform:uppercase;">Objetivo do jogo</h2>
            <p style="margin-top:10px; font-size:1.1rem;">${ins.objetivo}</p>
        </div>
        <h2 style="color:var(--cor-primaria); text-transform:uppercase; font-size:1.2rem; margin-top:30px; margin-bottom:15px;">➔ Como jogar</h2>
        <ul style="list-style:none; padding:0;">${ins.comoJogar.map(s => `<li style="margin-bottom:10px; font-size:1.1rem;">• ${s}</li>`).join('')}</ul>
        <h2 style="color:var(--cor-primaria); text-transform:uppercase; font-size:1.2rem; margin-top:30px; margin-bottom:15px;">➔ Regras</h2>
        <ul style="list-style:none; padding:0;">${ins.regras.map(r => `<li style="margin-bottom:10px; font-size:1.1rem;">• ${r}</li>`).join('')}</ul>
        <h2 style="color:var(--cor-primaria); text-transform:uppercase; font-size:1.2rem; margin-top:30px; margin-bottom:15px;">➔ Dicas</h2>
        <p style="line-height:1.5; font-size:1.1rem;">${ins.dicas}</p>
    `;
}

function iniciarTutorialVisual() {
    const container = document.getElementById("container-animacao-tutorial");
    if (!container || !DADOS_JOGO.itens.length) return;
    const item = DADOS_JOGO.itens[0]; const path = DADOS_JOGO.caminhoImagens;
    
    // Animação que ocupa o espaço flexível
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:20px;">
            <div style="border:4px solid var(--cor-primaria); border-radius:20px; padding:15px; background:white; width:120px; height:120px; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 20px rgba(0,0,0,0.05);">
                <img src="${path}${item.img}" style="height:70%; object-fit:contain;">
            </div>
            <div style="font-weight:900; color:var(--text-grey); font-size:1rem; text-transform:uppercase; letter-spacing:1px;">Encontra o igual</div>
            <div style="display:flex; gap:15px;">
                <div style="width:70px; height:70px; background:white; border:2px solid #eee; border-radius:15px; display:flex; align-items:center; justify-content:center;"><img src="${path}${DADOS_JOGO.itens[1].img}" style="height:60%;"></div>
                <div style="width:70px; height:70px; background:white; border:3px solid #8cc63f; border-radius:15px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 15px rgba(140, 198, 63, 0.4);"><img src="${path}${item.img}" style="height:60%;"></div>
                <div style="width:70px; height:70px; background:white; border:2px solid #eee; border-radius:15px; display:flex; align-items:center; justify-content:center;"><img src="${path}${DADOS_JOGO.itens[2].img}" style="height:60%;"></div>
            </div>
        </div>
    `;
}

function irParaJogo() {
    rondaAtual = 1; certos = 0; errados = 0; ajudasUsadas = 0;
    document.getElementById("ui-help-lamp").src = JOGO_CONFIG.caminhoIconsJogos + "lampada.png";
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    atualizarStats();
    const lista = [...DADOS_JOGO.itens];
    itemAlvo = lista[Math.floor(Math.random() * lista.length)];
    const opcoes = [...lista.filter(i => i.id !== itemAlvo.id).sort(() => 0.5 - Math.random()).slice(0, 7), itemAlvo].sort(() => 0.5 - Math.random());

    const container = document.getElementById("container-jogo-injetado");
    const isPortrait = window.innerHeight > window.innerWidth;
    
    container.style.display = "grid"; container.style.gap = "10px"; container.style.width = "100%"; container.style.height = "100%";

    if (isPortrait) {
        container.style.gridTemplateColumns = "repeat(2, 1fr)";
        container.style.gridTemplateRows = "1.5fr repeat(4, 1fr)";
    } else {
        container.style.gridTemplateColumns = "repeat(4, 1fr)";
        container.style.gridTemplateRows = "1.5fr 1fr 1fr";
    }

    container.innerHTML = `
        <div style="grid-column: 1 / -1; justify-self: center; height: 100%; aspect-ratio: 1/1; background: white; border: 4px solid var(--cor-primaria); border-radius: 20px; display: flex; align-items: center; justify-content: center; padding: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <img src="${DADOS_JOGO.caminhoImagens}${itemAlvo.img}" style="height: 60%; object-fit: contain;">
        </div>
        ${opcoes.map(item => `
            <div class="card-opcao" onclick="verificar(this, ${item.id})" style="background: white; border: 2px solid #eee; border-radius: 15px; display: flex; align-items: center; justify-content: center; height: 100%; cursor: pointer; transition: 0.2s;">
                <img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="height: 50%; object-fit: contain;">
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

document.getElementById("ui-help-lamp").onclick = () => {
    ajudasUsadas++; document.getElementById("ui-certos").innerText = certos; // Só para feedback visual da ajuda se quiseres
    const oCorreto = Array.from(document.querySelectorAll('.card-opcao')).find(c => c.innerHTML.includes(itemAlvo.img));
    if (oCorreto) { oCorreto.style.boxShadow = "0 0 25px gold"; setTimeout(() => oCorreto.style.boxShadow = "", 1500); }
};

function atualizarStats() {
    document.getElementById("ui-ronda").innerText = `${rondaAtual}/10`;
    document.getElementById("ui-certos").innerText = certos;
    document.getElementById("ui-errados").innerText = errados;
}

function finalizarJogo() {
    trocarEcra('tela-resultados');
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    document.getElementById("container-resultados-injetado").innerHTML = `
        <div style="text-align:center; padding:20px;">
            <h2 style="font-size:2rem; font-weight:900; color:var(--cor-primaria); margin-bottom:15px;">RESULTADOS</h2>
            <img src="${JOGO_CONFIG.caminhoIconsJogos}${rel.img}" width="120" style="margin-bottom:10px;">
            <h3 style="font-size:1.5rem; font-weight:900; color:var(--cor-primaria); margin-bottom:15px;">${rel.titulo}</h3>
            <div style="display:flex; justify-content:center; gap:10px; margin-bottom:25px;">
                <div class="stat-box" style="background:#8cc63f; padding:8px 20px;">✓ ${certos}</div>
                <div class="stat-box" style="background:#ff5a5f; padding:8px 20px;">X ${errados}</div>
                <div class="stat-box" style="background:#f39c12; padding:8px 20px;">💡 ${ajudasUsadas}</div>
            </div>
            <div style="display:flex; gap:15px; width:100%; max-width:350px; margin: 0 auto;">
                <button onclick="location.reload()" style="flex:1; padding:12px; border-radius:50px; border:2px solid var(--cor-primaria); background:white; color:var(--cor-primaria); font-weight:900; cursor:pointer;">REPETIR</button>
                <button onclick="window.location.href='../'" style="flex:1; padding:12px; border-radius:50px; border:none; background:var(--cor-primaria); color:white; font-weight:900; cursor:pointer;">SAIR</button>
            </div>
        </div>
    `;
}
