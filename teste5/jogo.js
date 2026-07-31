// ==========================================
// 1. ESTADO GLOBAL
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0;
let totalRondas = 10;
let certos = 0;
let erros = 0;
let ajudasUsadas = 0;
let itemDestaque = null;
let opcoesRonda = [];

const style = document.createElement('style');
style.innerHTML = `
    .opcao-card {
        background: white; border: 2.2px solid #e0e0e0; border-radius: 15px; 
        display: flex; align-items: center; justify-content: center; 
        cursor: pointer; padding: 5px; transition: transform 0.2s;
    }
    .opcao-card img { width: 90%; height: 90%; object-fit: contain; }
    
    #simu-hand {
        position: absolute; font-size: 2.5rem; z-index: 100;
        transition: all 0.7s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        pointer-events: none; display: none;
    }

    .destaque-box {
        height: 25vh; min-height: 140px; aspect-ratio: 1/1; padding: 10px; 
        background: #fdfdfd; border-radius: 25px; border: 3px dashed var(--primary-color); 
        display: flex; align-items: center; justify-content: center; margin-bottom: 15px;
    }

    .grid-opcoes {
        display: grid; grid-template-columns: repeat(5, 1fr); 
        gap: 10px; width: 100%; max-width: 650px;
    }

    .capa-container {
        display: flex; flex-direction: column; align-items: center; 
        justify-content: center; width: 100%; height: 100%; position: relative;
    }
`;
document.head.appendChild(style);

// Sons (Certifica-te que os nomes dos ficheiros estão corretos na pasta de sons)
const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + "acerto.mp3");
const somErro = new Audio(JOGO_CONFIG.caminhoSons + "erro.mp3");
const somClique = new Audio(JOGO_CONFIG.caminhoSons + "clique.mp3");

// ==========================================
// 2. CAPA COM SIMULAÇÃO
// ==========================================

function mostrarCapa() {
    if (jogoAtivo) return;
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div class="capa-container">
            <div id="simu-hand">👆</div>
            <div style="display:flex; flex-direction:column; align-items:center; gap:15px; flex: 1; justify-content: center;">
                <div style="height:18vh; min-height:110px; aspect-ratio:1/1; border:3px dashed var(--primary-color); padding:10px; border-radius:25px; background:white; display:flex; align-items:center; justify-content:center;">
                    <img id="simu-destaque" src="" style="height:100%; object-fit:contain;">
                </div>
                <div style="display:flex; gap:12px;">
                    <div id="simu-opt-0" class="opcao-card" style="width:75px; height:75px;"><img src=""></div>
                    <div id="simu-opt-1" class="opcao-card" style="width:75px; height:75px;"><img src=""></div>
                    <div id="simu-opt-2" class="opcao-card" style="width:75px; height:75px;"><img src=""></div>
                </div>
            </div>
            <p style="font-size: 0.95rem; color: var(--text-grey); font-weight:700; text-align:center; padding:0 10px;">
                Identifica o animal igual ao modelo em destaque!
            </p>
        </div>
    `;
    correrSimulacao();
}

let simuInterval;
function correrSimulacao() {
    clearInterval(simuInterval);
    const hand = document.getElementById('simu-hand');
    const animar = () => {
        const itens = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
        const trio = itens.slice(0, 3);
        const certoIdx = Math.floor(Math.random() * 3);
        const itemCerto = trio[certoIdx];
        if(!document.getElementById('simu-destaque')) return;
        document.getElementById('simu-destaque').src = DADOS_JOGO.caminhoImagens + itemCerto.img;
        trio.forEach((it, i) => {
            const card = document.getElementById(`simu-opt-${i}`);
            card.querySelector('img').src = DADOS_JOGO.caminhoImagens + it.img;
            card.style.borderColor = "#e0e0e0";
        });
        hand.style.display = "block"; hand.style.opacity = "0";
        hand.style.top = "60%"; hand.style.left = "80%";
        setTimeout(() => {
            const target = document.getElementById(`simu-opt-${certoIdx}`);
            const rect = target.getBoundingClientRect();
            const parent = document.querySelector('.capa-container').getBoundingClientRect();
            hand.style.opacity = "1";
            hand.style.top = (rect.top - parent.top + 45) + "px";
            hand.style.left = (rect.left - parent.left + 25) + "px";
            setTimeout(() => {
                target.style.borderColor = "#8cc63f";
                target.style.transform = "scale(1.1)";
                setTimeout(() => { target.style.transform = "scale(1)"; hand.style.opacity = "0"; }, 400);
            }, 800);
        }, 400);
    };
    animar();
    simuInterval = setInterval(animar, 3500);
}

// ==========================================
// 3. LÓGICA DO JOGO
// ==========================================

function iniciarJogo() {
    clearInterval(simuInterval);
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0;
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    const area = document.getElementById('game-content');
    const todos = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todos[0];
    opcoesRonda = todos.slice(0, 10).sort(() => Math.random() - 0.5);
    if(!opcoesRonda.find(x => x.id === itemDestaque.id)) opcoesRonda[0] = itemDestaque;
    opcoesRonda.sort(() => Math.random() - 0.5);

    const cardHeight = (window.innerHeight > window.innerWidth) ? "12vh" : "18vh"; 

    area.innerHTML = `
        <div class="destaque-box">
            <img src="${DADOS_JOGO.caminhoImagens + itemDestaque.img}" style="height:100%; object-fit:contain;">
        </div>
        <div class="grid-opcoes">
            ${opcoesRonda.map(item => `
                <div class="opcao-card" id="card-${item.id}" onclick="verificarResposta(${item.id}, this)" style="height:${cardHeight}; min-height:85px;">
                    <img src="${DADOS_JOGO.caminhoImagens + item.img}">
                </div>
            `).join('')}
        </div>
    `;
}

function darAjuda() {
    if (!jogoAtivo) return;
    ajudasUsadas++; somClique.play();
    const correto = document.getElementById(`card-${itemDestaque.id}`);
    if (correto) {
        correto.style.borderColor = "var(--primary-color)";
        correto.animate([
            { transform: 'scale(1)', boxShadow: '0 0 0px var(--primary-color)' },
            { transform: 'scale(1.15)', boxShadow: '0 0 25px var(--primary-color)' },
            { transform: 'scale(1)', boxShadow: '0 0 0px var(--primary-color)' }
        ], { duration: 800, iterations: 2 });
    }
}

function verificarResposta(id, el) {
    if (!jogoAtivo) return;
    document.querySelectorAll('.opcao-card').forEach(c => c.style.pointerEvents = 'none');
    if (id === itemDestaque.id) {
        certos++; somAcerto.play();
        el.style.borderColor = "#8cc63f";
        el.style.backgroundColor = "#f0fff0";
    } else {
        erros++; somErro.play();
        el.style.borderColor = "#ff5a5f";
        el.style.backgroundColor = "#fff5f5";
        const real = document.getElementById(`card-${itemDestaque.id}`);
        if(real) real.style.borderColor = "#8cc63f";
    }
    setTimeout(() => { rondaAtual++; proximaRonda(); }, 1500);
}

function finalizarJogo() {
    jogoAtivo = false;
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    document.getElementById('shell-header-content').innerHTML = `<h2 style="font-size:1.2rem; color:var(--primary-color); font-weight:900;">RESULTADOS</h2>`;
    document.getElementById('game-content').innerHTML = `
        <div style="text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px 0;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu + rel.img}" style="height:20vh; min-height:140px; margin-bottom:15px;">
            <h2 style="color:var(--primary-color); font-size:1.5rem; font-weight:900;">${rel.titulo}</h2>
            <div style="display:flex; gap:12px; margin-top:15px;">
                <div class="score-box score-certo" style="background:#8cc63f; padding:8px 20px;">CERTOS: ${certos}</div>
                <div class="score-box score-erro" style="background:#ff5a5f; padding:8px 20px;">ERROS: ${erros}</div>
            </div>
            <p style="margin-top:15px; font-weight:800; color:var(--text-grey);">💡 AJUDAS: ${ajudasUsadas}</p>
        </div>`;
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = 'flex';
    footer.innerHTML = `<button class="btn-play-rect" style="background:#6c757d" onclick="location.reload()">REPETIR</button>
                        <button class="btn-play-rect" onclick="window.history.back()">SAIR</button>`;
}
