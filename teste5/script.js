// ==========================================
// 1. DADOS (ANTIGO DADOS.JS INTEGRADO)
// ==========================================
const JOGO_DATA = {
    config: {
        nome: "Encontrar o Par: Animais",
        area: "pre",
        ano: "pre",
        sons: { acerto: "certo.mp3", erro: "erro.mp3", clique: "clique.mp3" },
        instrucoes: {
            objetivo: "Observa atentamente o animal no topo e encontra o igual nas opções.",
            passos: ["Olha o animal modelo.", "Analisa a grelha.", "Clica no idêntico."],
            dicas: "Repara nas cores e orelhas!"
        }
    },
    itens: [
        { id: 1, img: "galo.png" }, { id: 2, img: "galinha.png" }, 
        { id: 3, img: "cabra.png" }, { id: 4, img: "ovelha.png" },
        { id: 5, img: "burro.png" }, { id: 6, img: "peru.png" },
        { id: 7, img: "porco.png" }, { id: 8, img: "vaca.png" }
    ]
};

// ==========================================
// 2. MOTOR DO JOGO (LÓGICA)
// ==========================================
let ronda = 1;
let certos = 0, errados = 0, itemAlvo = null;

document.addEventListener("DOMContentLoaded", () => {
    initLayout();
    renderIntro();
});

function initLayout() {
    // Aqui aplicas as cores e os textos do header dinamicamente
    // Exemplo: document.getElementById("txt-titulo1").innerText = "Pequenos";
    // (Usar a lógica de BIBLIOTECA_TEMAS aqui)
}

function renderIntro() {
    const main = document.getElementById("game-engine");
    main.innerHTML = `
        <div class="tela">
            <div style="height:85px; display:flex; align-items:center; justify-content:center;">
                <h1 style="font-size:1.2rem; font-weight:900; color:var(--cor-primaria); text-transform:uppercase;">${JOGO_DATA.config.nome}</h1>
            </div>
            <div style="flex:1; display:flex; align-items:center; justify-content:center;">
                <div style="text-align:center;">
                    <div style="border:3px solid var(--cor-primaria); border-radius:15px; width:100px; height:100px; margin:0 auto 15px; display:flex; align-items:center; justify-content:center;">
                        <img src="../img/animaisdomesticos/${JOGO_DATA.itens[0].img}" style="height:70%;">
                    </div>
                    <p style="font-weight:900; color:var(--text-grey);">TUTORIAL</p>
                </div>
            </div>
            <div style="height:85px; display:flex; align-items:center; padding:0 25px; gap:15px; border-top:1px solid #f2f2f2;">
                <button onclick="irParaJogo()" style="flex:1; background:var(--cor-primaria); color:white; border:none; padding:15px; border-radius:50px; font-weight:900; font-size:1.4rem; cursor:pointer;">JOGAR</button>
            </div>
        </div>
    `;
}

function irParaJogo() {
    ronda = 1; certos = 0; errados = 0;
    renderGame();
    proximaRonda();
}

function renderGame() {
    const main = document.getElementById("game-engine");
    main.innerHTML = `
        <div class="tela">
            <div class="game-topo">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="background:#6c757d; color:white; padding:5px 15px; border-radius:50px; font-weight:900;" id="ui-ronda">1/10</div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="background:#8cc63f; color:white; padding:5px 12px; border-radius:10px; font-weight:900;">✓ <span id="ui-certos">0</span></div>
                    <div style="background:#ff5a5f; color:white; padding:5px 12px; border-radius:10px; font-weight:900;">X <span id="ui-errados">0</span></div>
                </div>
            </div>
            <div id="game-grid-container"></div>
        </div>
    `;
}

function proximaRonda() {
    const grid = document.getElementById("game-grid-container");
    const lista = [...JOGO_DATA.itens];
    itemAlvo = lista[Math.floor(Math.random() * lista.length)];
    const opcoes = [...lista].sort(() => 0.5 - Math.random());

    grid.innerHTML = `
        <div style="grid-column: 1 / -1; justify-self: center; height: 100px; aspect-ratio: 1/1; background: white; border: 4px solid var(--cor-primaria); border-radius: 20px; display: flex; align-items: center; justify-content: center; padding: 10px;">
            <img src="../img/animaisdomesticos/${itemAlvo.img}" style="height: 60%;">
        </div>
        ${opcoes.map(item => `
            <div class="card-opcao" onclick="verificar(this, ${item.id})">
                <img src="../img/animaisdomesticos/${item.img}">
            </div>
        `).join('')}
    `;
}

function verificar(el, id) {
    if (id === itemAlvo.id) {
        certos++; el.style.background = "#eef9e5";
        setTimeout(() => { ronda++; proximaRonda(); }, 1000);
    } else {
        errados++; el.style.background = "#ffebeb";
        setTimeout(() => { ronda++; proximaRonda(); }, 1000);
    }
    document.getElementById("ui-certos").innerText = certos;
    document.getElementById("ui-errados").innerText = errados;
    document.getElementById("ui-ronda").innerText = `${ronda}/10`;
}
