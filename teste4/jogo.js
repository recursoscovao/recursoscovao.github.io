let rondaAtual = 1; const totalRondas = 10;
let certos = 0, errados = 0, ajudasUsadas = 0, itemAlvo = null;

function carregarInstrucoes() {
    const area = document.getElementById("ui-area-instrucoes");
    const ins = JOGO_CONFIG.instrucoes;
    area.innerHTML = `
        <div style="border-left:6px solid var(--cor-primaria); padding-left:15px; margin-bottom:35px;">
            <h2 style="margin:0; font-size:1.6rem; text-transform:uppercase;">Objetivo do jogo</h2>
            <p style="margin-top:10px; font-size:1.1rem;">${ins.objetivo}</p>
        </div>
        <h2 style="color:var(--cor-primaria); text-transform:uppercase; font-size:1.3rem; margin-top:35px; margin-bottom:15px;">Como jogar</h2>
        <ul style="list-style:none; padding:0;">${ins.comoJogar.map(s => `<li style="margin-bottom:12px; display:flex; gap:10px;">➔ ${s}</li>`).join('')}</ul>
        <h2 style="color:var(--cor-primaria); text-transform:uppercase; font-size:1.3rem; margin-top:35px; margin-bottom:15px;">Regras</h2>
        <ul style="list-style:none; padding:0;">${ins.regras.map(r => `<li style="margin-bottom:12px; display:flex; gap:10px;">➔ ${r}</li>`).join('')}</ul>
        <h2 style="color:var(--cor-primaria); text-transform:uppercase; font-size:1.3rem; margin-top:35px; margin-bottom:15px;">Dicas</h2>
        <p style="line-height:1.5;">${ins.dicas}</p>
        <div style="background:#f9f9f9; padding:20px; border-radius:20px; border:1px solid #eee; margin-top:40px;">
            <h2 style="margin:0 0 10px 0; font-size:1.1rem;">O que vais desenvolver?</h2>
            <ul style="list-style:none; padding:0;">${ins.desenvolvimento.map(d => `<li style="margin-bottom:5px; display:flex; gap:10px;">➔ ${d}</li>`).join('')}</ul>
        </div>
    `;
}

function irParaJogo() {
    rondaAtual = 1; certos = 0; errados = 0; ajudasUsadas = 0;
    // Carrega a lâmpada
    document.getElementById("ui-help-lamp").src = JOGO_CONFIG.caminhoIconsJogos + "lampada.png";
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    atualizarStats();
    
    const lista = [...DADOS_JOGO.itens];
    itemAlvo = lista[Math.floor(Math.random() * lista.length)];
    const distratores = lista.filter(i => i.id !== itemAlvo.id).sort(() => 0.5 - Math.random()).slice(0, 8);
    const opcoes = [...distratores.slice(0,7), itemAlvo].sort(() => 0.5 - Math.random());

    const container = document.getElementById("container-jogo-injetado");
    const isPortrait = window.innerHeight > window.innerWidth;
    container.style.display = "grid"; container.style.gap = "8px"; container.style.alignContent = "center"; container.style.justifyContent = "center";

    if (isPortrait) {
        container.style.gridTemplateColumns = "repeat(2, 1fr)";
        container.style.gridTemplateRows = "1.2fr repeat(4, 1fr)";
    } else {
        container.style.gridTemplateColumns = "repeat(4, 1fr)";
        container.style.gridTemplateRows = "1.4fr 1fr 1fr";
    }

    container.innerHTML = `
        <div style="grid-column: 1 / -1; justify-self: center; height: 100%; aspect-ratio: 1/1; background: white; border: 3px solid var(--cor-primaria); border-radius: 15px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); padding: 5px;">
            <img src="${DADOS_JOGO.caminhoImagens}${itemAlvo.img}" style="height: 55%; width: auto; object-fit: contain;">
        </div>
        ${opcoes.map(item => `
            <div class="card-opcao" onclick="verificar(this, ${item.id})" style="background: white; border: 2px solid #eee; border-radius: 12px; display: flex; align-items: center; justify-content: center; height: 100%; cursor: pointer; transition: 0.2s; padding: 5px;">
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
        const todos = Array.from(document.querySelectorAll('.card-opcao'));
        const correto = todos.find(c => c.innerHTML.includes(itemAlvo.img));
        if (correto) { correto.style.boxShadow = "0 0 15px #8cc63f"; correto.style.borderColor = "#8cc63f"; }
        setTimeout(() => { rondaAtual++; proximaRonda(); }, 1800);
    }
}

document.getElementById("ui-help-lamp").onclick = () => {
    ajudasUsadas++; atualizarStats();
    const correto = Array.from(document.querySelectorAll('.card-opcao')).find(c => c.innerHTML.includes(itemAlvo.img));
    if (correto) { correto.style.boxShadow = "0 0 25px gold"; setTimeout(() => correto.style.boxShadow = "", 1500); }
};

function atualizarStats() {
    document.getElementById("ui-ronda").innerText = `${rondaAtual}/10`;
    document.getElementById("ui-certos").innerText = certos;
    document.getElementById("ui-errados").innerText = errados;
}

function iniciarTutorialVisual() {
    const container = document.getElementById("container-animacao-tutorial");
    if (!container || !DADOS_JOGO.itens.length) return;
    const item1 = DADOS_JOGO.itens[0]; const path = DADOS_JOGO.caminhoImagens;
    container.innerHTML = `<div style="display:flex; flex-direction:column; align-items:center;"><div style="border:3px solid var(--cor-primaria); border-radius:12px; padding:8px; background:white; width:70px; height:70px; display:flex; align-items:center; justify-content:center; margin-bottom:8px;"><img src="${path}${item1.img}" style="height:60%;"></div><div style="font-size:0.7rem; font-weight:800; color:#8792a1; margin-bottom:8px;">ENCONTRA O IGUAL</div><div style="display:flex; gap:8px;"><div style="width:55px; height:55px; background:white; border:2px solid #eee; border-radius:10px; display:flex; align-items:center; justify-content:center;"><img src="${path}${DADOS_JOGO.itens[1].img}" style="height:50%;"></div><div style="width:55px; height:55px; background:white; border:3px solid #8cc63f; border-radius:10px; display:flex; align-items:center; justify-content:center;"><img src="${path}${item1.img}" style="height:50%;"></div><div style="width:55px; height:55px; background:white; border:2px solid #eee; border-radius:10px; display:flex; align-items:center; justify-content:center;"><img src="${path}${DADOS_JOGO.itens[2].img}" style="height:50%;"></div></div></div>`;
}
