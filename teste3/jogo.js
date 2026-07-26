let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let jogoAtivo = false;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);

window.startLogic = function() {
    const cat = JOGO_CATEGORIAS["animais"];
    // Sorteia 10 perguntas baseadas nos itens disponíveis
    perguntas = [...cat.itens].sort(() => Math.random() - 0.5);
    // Se tiver menos de 10 itens, repetimos para completar 10 rounds
    while(perguntas.length < 10) perguntas = [...perguntas, ...cat.itens];
    perguntas = perguntas.slice(0, 10);
};

window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0; jogoAtivo = true;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    mostrarPergunta();
};

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const alvo = perguntas[indicePergunta];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    // Criar opções: 1 correta + 7 erradas
    let todasAsOutras = JOGO_CATEGORIAS["animais"].itens.filter(i => i.img !== alvo.img);
    let erradas = todasAsOutras.sort(() => Math.random() - 0.5).slice(0, 7);
    let opcoes = [alvo, ...erradas].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .target-area { display: flex; justify-content: center; margin-bottom: 20px; }
            .target-box { border: 4px solid #E691A7; border-radius: 20px; padding: 15px; background: white; }
            .target-box img { height: 80px; }
            .grid-opcoes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; flex: 1; }
            .card-animal { background: white; border: 2px solid #eee; border-radius: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 10px; box-shadow: 0 4px 0 #eee; }
            .card-animal img { width: 100%; max-height: 90px; object-fit: contain; }
            .correto { background: #e8f9e8 !important; border-color: #8cc63f !important; }
            .errado { background: #fff1f1 !important; border-color: #ff5e5e !important; }
            @media (max-width: 600px) { .grid-opcoes { grid-template-columns: repeat(2, 1fr); } }
        </style>
        <div class="target-area">
            <div class="target-box"><img src="${JOGO_CONFIG.caminhoIconsJogos}${alvo.img}"></div>
        </div>
        <div class="grid-opcoes">
            ${opcoes.map(opt => `
                <div class="card-animal" onclick="verificar(this, ${opt.img === alvo.img})">
                    <img src="${JOGO_CONFIG.caminhoIconsJogos}${opt.img}">
                </div>
            `).join('')}
        </div>
    `;
}

function verificar(el, eCorreto) {
    if (!jogoAtivo) return;
    const cards = document.querySelectorAll('.card-animal');
    cards.forEach(c => c.style.pointerEvents = 'none');

    if (eCorreto) {
        acertos++;
        el.classList.add('correto');
        document.getElementById('hits-val').innerText = acertos;
        if(somAcerto.src) somAcerto.play();
    } else {
        erros++;
        el.classList.add('errado');
        document.getElementById('miss-val').innerText = erros;
        if(somErro.src) somErro.play();
    }

    setTimeout(() => {
        indicePergunta++;
        if (indicePergunta < 10) mostrarPergunta();
        else finalizarJogo();
    }, 1000);
}

function finalizarJogo() {
    jogoAtivo = false;
    const perc = (acertos / 10) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.querySelectorAll('.view-container').forEach(v => v.classList.remove('view-active'));
    document.getElementById('view-resultados').classList.add('view-active');
    
    document.getElementById('scr-result').innerHTML = `
        <div style="text-align:center; padding: 20px;">
            <img src="${JOGO_CONFIG.caminhoImg}${rel.img}" style="height:150px">
            <h2 style="color:var(--cor-dinamica); font-size:2rem; margin:15px 0">${rel.titulo}</h2>
            <p style="font-weight:bold; color:#777">Acertaste ${acertos} de 10!</p>
            <button class="btn-jogar" style="margin-top:20px" onclick="location.reload()">JOGAR DE NOVO</button>
        </div>
    `;
}

function usarAjuda() {
    const alvo = perguntas[indicePergunta];
    const cards = document.querySelectorAll('.card-animal');
    cards.forEach(c => {
        if(c.querySelector('img').src.includes(alvo.img)) {
            c.style.borderColor = "#ff9f43";
            c.style.transform = "scale(1.05)";
            setTimeout(() => {
                c.style.borderColor = "#eee";
                c.style.transform = "scale(1)";
            }, 1000);
        }
    });
}
