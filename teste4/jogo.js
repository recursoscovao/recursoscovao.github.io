let ronda = 1;
let itemAlvo = null;

// CONFIGURAÇÃO DO ECRÃ INICIAL
function setupApresentacao(jogo) {
    document.getElementById('area-jogo-conteudo').innerHTML = `
        <style>
            .demo-box { display:flex; flex-direction:column; align-items:center; gap:15px; position:relative; }
            .demo-target { width:90px; height:90px; border:4px dashed var(--cor-dinamica); border-radius:20px; display:flex; align-items:center; justify-content:center; animation: pulse 2s infinite; }
            .demo-hand { position:absolute; font-size:30px; color:var(--cor-dinamica); animation: moveHand 3s infinite; pointer-events:none; }
            @keyframes pulse { 0%,100% {transform:scale(1)} 50% {transform:scale(1.05)} }
            @keyframes moveHand { 0%{transform:translate(50px,120px); opacity:0} 20%{opacity:1} 50%{transform:translate(0px,100px)} 100%{opacity:0} }
        </style>
        <div class="demo-box">
            <div class="demo-target"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[0].img}" style="width:70%"></div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px;">
                <div style="width:50px; height:50px; border:2px solid #eee; border-radius:10px;"></div>
                <div style="width:50px; height:50px; border:4px solid #8ed131; border-radius:10px; display:flex; align-items:center; justify-content:center;"><img src="${DADOS_JOGO.caminhoImagens}${DADOS_JOGO.itens[0].img}" style="width:70%"></div>
                <div style="width:50px; height:50px; border:2px solid #eee; border-radius:10px;"></div>
            </div>
            <i class="fas fa-mouse-pointer demo-hand"></i>
        </div>`;

    document.getElementById('info-texto').innerHTML = `
        <h3 style="color:var(--cor-dinamica); font-weight:900;">OBJETIVO DO JOGO</h3>
        <p>Observa o animal no topo e encontra o igual na grelha.</p>
        <h3 style="color:var(--cor-dinamica); font-weight:900; margin-top:15px;">COMO JOGAR</h3>
        <ul style="padding-left:20px;">
            <li>Observa o modelo no topo.</li>
            <li>Clica na imagem exatamente igual.</li>
            <li>Tens 10 rondas para acertar o máximo possível!</li>
        </ul>
        <h3 style="color:var(--cor-dinamica); font-weight:900; margin-top:15px;">DESENVOLVIMENTO</h3>
        <ul style="padding-left:20px;">
            <li>Atenção e concentração</li>
            <li>Memória visual</li>
            <li>Discriminação visual</li>
        </ul>`;
}

function initJogo() {
    ronda = 1; acertos = 0; erros = 0; ajudas = 0;
    atualizarPlacar();
    proximaRonda();
}

function proximaRonda() {
    if (ronda > 10) { mudarEcra('resultados'); return; }
    
    document.getElementById('ronda-txt').innerText = `${ronda} / 10`;
    const container = document.getElementById('game-injection-point');
    
    itemAlvo = DADOS_JOGO.itens[Math.floor(Math.random() * DADOS_JOGO.itens.length)];
    
    let opcoes = [itemAlvo];
    let outros = DADOS_JOGO.itens.filter(i => i.id !== itemAlvo.id).sort(() => 0.5 - Math.random());
    opcoes = [...opcoes, ...outros.slice(0, 7)].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <style>
            .play-zone { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:15px; padding:10px; }
            .t-box { width:clamp(120px, 25vh, 170px); height:clamp(120px, 25vh, 170px); border:4px dashed #adb5bd; border-radius:25px; display:flex; align-items:center; justify-content:center; background:#fff; }
            .g-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; width: 100%; max-width: 600px; }
            .g-card { background: white; border: 2px solid #eee; border-radius: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; width: calc(25% - 10px); aspect-ratio: 1; }
            /* Grelha 3-3-2 no Telemóvel Portrait */
            @media (max-width: 767px) and (orientation: portrait) { .g-card { width: calc(31% - 8px); } }
            @media (max-height: 500px) { .play-zone { flex-direction: row; gap: 30px; } .g-grid { max-width: 350px; } }
        </style>
        <div class="play-zone">
            <div class="t-box"><img src="${DADOS_JOGO.caminhoImagens}${itemAlvo.img}" style="width:80%"></div>
            <div class="g-grid" id="opcoes-container"></div>
        </div>`;

    opcoes.forEach(item => {
        const card = document.createElement('div');
        card.className = 'g-card';
        card.innerHTML = `<img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="width:80%">`;
        card.onclick = () => validar(item, card);
        document.getElementById('opcoes-container').appendChild(card);
    });
}

function validar(item, el) {
    document.querySelectorAll('.g-card').forEach(c => c.style.pointerEvents = 'none');
    if (item.id === itemAlvo.id) {
        acertos++; el.style.borderColor = "#8ed131"; el.style.background = "#f1f8e9";
    } else {
        erros++; el.style.borderColor = "#ff5e5e"; el.style.background = "#fff5f5";
    }
    atualizarPlacar();
    setTimeout(() => { ronda++; proximaRonda(); }, 700);
}

function atualizarPlacar() {
    document.getElementById('v-acertos').innerText = acertos;
    document.getElementById('v-erros').innerText = erros;
}

function ajudaJogo() {
    const cards = document.querySelectorAll('.g-card');
    cards.forEach(c => {
        if (c.innerHTML.includes(itemAlvo.img)) {
            c.style.background = "#fff9c4";
            setTimeout(() => c.style.background = "white", 1000);
        }
    });
}
