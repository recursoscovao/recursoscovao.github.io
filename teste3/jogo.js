let perguntas = [];
let indice = 0;
let acertos = 0;
let erros = 0;
let jogoAtivo = false;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);

window.startLogic = function() {
    let itens = JOGO_CATEGORIAS.animais.itens;
    perguntas = [...itens].sort(() => Math.random() - 0.5);
    while(perguntas.length < 10) perguntas = [...perguntas, ...itens];
    perguntas = perguntas.slice(0, 10);
};

window.initGame = function() {
    indice = 0; acertos = 0; erros = 0; jogoAtivo = true;
    mostrarPergunta();
};

function mostrarPergunta() {
    const alvo = perguntas[indice];
    const area = document.getElementById('area-jogo');
    document.getElementById('txt-contador').innerText = `${indice + 1} / 10`;

    let erradas = JOGO_CATEGORIAS.animais.itens.filter(i => i.img !== alvo.img).sort(() => Math.random() - 0.5).slice(0, 7);
    let opcoes = [alvo, ...erradas].sort(() => Math.random() - 0.5);

    area.innerHTML = `
        <style>
            .alvo-box { border: 4px solid var(--cor-dinamica); border-radius: 20px; padding: 15px; margin-bottom: 20px; background: #fff; }
            .alvo-box img { height: 80px; }
            .grid-animais { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%; }
            .card-animal { background: white; border: 2px solid #eee; border-radius: 15px; padding: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; aspect-ratio: 1/1; box-shadow: 0 4px 0 #eee; }
            .card-animal img { max-width: 90%; max-height: 90%; }
            .card-correto { background: #e8f9e8 !important; border-color: #8cc63f !important; }
            .card-errado { background: #fff1f1 !important; border-color: #ff5e5e !important; }
            @media (max-width: 500px) { .grid-animais { grid-template-columns: repeat(2, 1fr); } }
        </style>
        <div class="alvo-box"><img src="${JOGO_CONFIG.caminhoIconsJogos}${alvo.img}"></div>
        <div class="grid-animais">
            ${opcoes.map(o => `<div class="card-animal" onclick="verificar(this, '${o.img}', '${alvo.img}')"><img src="${JOGO_CONFIG.caminhoIconsJogos}${o.img}"></div>`).join('')}
        </div>
    `;
}

function verificar(el, imgClicada, imgAlvo) {
    if(!jogoAtivo) return;
    document.querySelectorAll('.card-animal').forEach(c => c.style.pointerEvents = 'none');

    if(imgClicada === imgAlvo) {
        acertos++; somAcerto.play(); el.classList.add('card-correto');
        document.getElementById('val-acertos').innerText = acertos;
    } else {
        erros++; somErro.play(); el.classList.add('card-errado');
        document.getElementById('val-erros').innerText = erros;
    }

    setTimeout(() => {
        indice++;
        if(indice < 10) mostrarPergunta();
        else finalizar();
    }, 1000);
}

function finalizar() {
    jogoAtivo = false;
    const perc = (acertos / 10) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    mudarEcra('resultados');
    document.getElementById('conteudo-resultados').innerHTML = `
        <img src="${JOGO_CONFIG.caminhoImg}${rel.img}" style="height:140px; margin-bottom:15px;">
        <h2 style="color:var(--cor-dinamica); font-size:1.8rem; font-weight:900;">${rel.titulo}</h2>
        <p style="color:#7b899b; font-weight:800; margin-top:5px;">Concluíste com ${acertos} acertos!</p>
    `;
}

function usarAjuda() {
    const alvo = perguntas[indice].img;
    document.querySelectorAll('.card-animal').forEach(c => {
        if(c.innerHTML.includes(alvo)) {
            c.style.borderColor = "#ff9f43";
            c.style.transform = "scale(1.05)";
            setTimeout(() => { c.style.borderColor = "#eee"; c.style.transform = "scale(1)"; }, 1500);
        }
    });
}
