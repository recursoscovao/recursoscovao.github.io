// ==========================================
// 4. LÓGICA DO JOGO
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0;
let itemDestaque = null;
let audioInstrucao = null;
let audioAnimal = null;

// Sons de sistema
const somAcerto = new Audio(JOGO_CONFIG.caminhoSonsSistema + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSonsSistema + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSonsSistema + JOGO_CONFIG.sons.clique);

function tocarAudioInstrucoes() {
    // Se já estiver a tocar, não faz nada (evita repetição)
    if (audioInstrucao && !audioInstrucao.paused) return;

    audioInstrucao = new Audio("../../sons/" + DADOS_JOGO.somInstrucoes);
    audioInstrucao.play().catch(e => console.log("Erro ao tocar instrução"));
}

function pararAudioInstrucao() {
    if (audioInstrucao) {
        audioInstrucao.pause();
        audioInstrucao.currentTime = 0;
    }
}

function tocarSomAnimal() {
    if (!itemDestaque) return;
    
    // Para o som anterior se ainda estiver a tocar
    if (audioAnimal) {
        audioAnimal.pause();
        audioAnimal.currentTime = 0;
    }
    
    audioAnimal = new Audio(JOGO_CONFIG.caminhoSons + itemDestaque.som);
    audioAnimal.play().catch(e => console.log("Erro ao tocar som do animal"));
}

function mostrarCapa() {
    document.getElementById('shell-header-content').innerHTML = `
        <h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
            <div class="destaque-box" style="cursor:default; border-style:solid;">
                <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" style="filter:none; width:60%;">
            </div>
            <h3 style="color:var(--primary-color); font-weight:800;">Quem sou eu?</h3>
            <p style="color:var(--text-grey); font-weight:600;">Ouve o som e escolhe o animal certo.</p>
        </div>`;

    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="tocarAudioInstrucoes()">
        <button class="btn-play-rect" onclick="iniciarJogo()"><i class="fas fa-play"></i> JOGAR</button>`;
}

function iniciarJogo() { 
    pararAudioInstrucao(); // Para o som das instruções ao clicar em Jogar
    somClique.play();
    jogoAtivo = true; 
    rondaAtual = 1; 
    certos = 0; 
    erros = 0; 
    proximaRonda(); 
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    
    // Seleção aleatória
    const listaBaralhada = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = listaBaralhada[0];
    
    let opcoes = listaBaralhada.slice(0, 3).sort(() => Math.random() - 0.5);

    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div class="destaque-box" onclick="tocarSomAnimal()" style="cursor:pointer;">
            <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" style="filter:none; width:50%;" id="icon-som-principal">
            <div style="position:absolute; bottom: -20px; font-weight:900; color:var(--primary-color); font-size:0.8rem;">CLICA PARA OUVIR</div>
        </div>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:15px; width:fit-content; margin-top:20px;">
            ${opcoes.map(item => `
                <div class="opcao-card" id="card-${item.id}" onclick="verificarResposta(${item.id}, this)">
                    <img src="../../img/${item.pasta}/${item.img}">
                </div>`).join('')}
        </div>`;

    // Tocar o som automaticamente ao iniciar a ronda
    setTimeout(tocarSomAnimal, 500);
}

function verificarResposta(id, el) {
    if (!jogoAtivo) return;
    
    // Desativa cliques
    document.querySelectorAll('.opcao-card').forEach(c => c.style.pointerEvents = 'none');
    document.getElementById('icon-som-principal').parentElement.style.pointerEvents = 'none';

    if (id === itemDestaque.id) {
        certos++; somAcerto.play();
        el.style.borderColor = "#8cc63f";
        el.innerHTML += '<i class="fas fa-check feedback-icon icon-v"></i>';
    } else {
        erros++; somErro.play();
        el.style.borderColor = "#ff5a5f";
        el.innerHTML += '<i class="fas fa-times feedback-icon icon-x"></i>';
        const correto = document.getElementById(`card-${itemDestaque.id}`);
        if(correto) correto.style.borderColor = "#8cc63f";
    }

    setTimeout(() => { 
        rondaAtual++; 
        proximaRonda(); 
    }, 1800);
}

function finalizarJogo() {
    jogoAtivo = false;
    if (audioAnimal) audioAnimal.pause();
    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, 0, rel);
}

// Inicialização
window.onload = mostrarCapa;
