// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let ajudasUsadas = 0;
let tempoInicio;
let intervaloTimer;
let pecaSendoArrastada = null;
let touchStartX = 0, touchStartY = 0;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.clique);

// Caminho de áudio das instruções vindo de DADOS_JOGO
const somInstrucoes = new Audio(JOGO_CONFIG.caminhoSons + (DADOS_JOGO.somInstrucoes || 'sons1ano/f1_jogo04pt.mp3'));

// ==========================================
// 2. LÓGICA DE CAPA E INTRODUÇÃO
// ==========================================
window.mostrarCapa = function() {
    lerCorDoTema();
    const headerContent = document.getElementById('shell-header-content');
    if (headerContent) {
        headerContent.innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${DADOS_JOGO.titulo || JOGO_CONFIG.nomeDoJogo}</h2>`;
    }
    
    const catKeys = Object.keys(JOGO_CONFIG.categorias);
    const primeiraCatKey = catKeys.length > 0 ? catKeys[0] : null;
    
    const gameContent = document.getElementById('game-content');
    if (gameContent) {
        gameContent.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; width: 100%; gap: 15px;" id="intro-animation-container">
                <!-- Renderizado dinamicamente -->
            </div>
            <p style="color:var(--text-grey, #5d7082); font-weight:800; text-align:center; font-size:1.1rem; max-width: 500px; padding: 0 15px; margin-top: 15px;">
                ${JOGO_CONFIG.descricao}
            </p>
        `;
    }

    if (primeiraCatKey) {
        selecionarCategoria(primeiraCatKey);
    }
    
    const footer = document.getElementById('shell-footer-content');
    if (footer) {
        footer.style.display = "flex";
        footer.innerHTML = `
            <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="tocarAudioInstrucoes()" style="width: 65px; height: 65px; cursor: pointer; flex-shrink: 0; z-index: 100;"> 
            <button class="btn-play-rect" onclick="iniciarJogo()" style="flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); color: white; border: none; font-size: 1.5rem; font-weight: 900; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"><i class="fas fa-play"></i> JOGAR</button>
        `;
    }
};

function lerCorDoTema() {
    // Compatibilidade de temas
}

window.tocarAudioInstrucoes = function() {
    somClique.currentTime = 0;
    somClique.play().catch(e => console.log(e));
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    
    somInstrucoes.currentTime = 0;
    somInstrucoes.play().catch(e => {
        console.log("Áudio local não encontrado, a utilizar SpeechSynthesis.", e);
        const utter = new SpeechSynthesisUtterance("Escolhe a letra correta para completar o nome do animal!");
        utter.lang = 'pt-PT';
        window.speechSynthesis.speak(utter);
    });
};

window.selecionarCategoria = function(key) {
    if (!JOGO_CONFIG.categorias || !JOGO_CONFIG.categorias[key]) return;
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    const containerIntro = document.getElementById('intro-animation-container');
    if (!containerIntro) return;

    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px;">
            <div style="height:140px; display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:130px; width:auto; object-fit:contain;">
            </div>
            <div style="display:flex; align-items:center; gap:8px; font-size:32px; font-weight:900; color:var(--primary-color);">
                <div style="width:50px; height:60px; border:3px dashed var(--primary-color); border-radius:12px; position:relative; background:#fff;">
                    <div style="width:50px; height:60px; background:white; border:3px solid var(--primary-color); border-radius:12px; display:flex; align-items:center; justify-content:center; position:absolute; top:-3px; left:-3px; animation: demoIn 2s infinite;">${cat.exemplo[0]}</div>
                </div>
                <span>${cat.exemplo.substring(1)}</span>
            </div>
        </div>
        <style>@keyframes demoIn { 0%, 20% { transform: translateY(25px); opacity: 0; } 50%, 80% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(0); opacity: 0; } }</style>`;
};

// ==========================================
// 3. LÓGICA DE JOGO PRINCIPAL
// ==========================================
window.iniciarJogo = function() {
    indiceAtual = 0;
    acertos = 0;
    erros = 0;
    ajudasUsadas = 0;
    iniciarTimer();
    proximaRodada();
};

function iniciarTimer() {
    clearInterval(intervaloTimer);
    tempoInicio = Date.now();
}

function proximaRodada() {
    if (indiceAtual >= itensAtuais.length) { 
        finalizarJogo(); 
        return; 
    }
    
    if (typeof Engine !== 'undefined' && Engine.showStatusBar) {
        Engine.showStatusBar(indiceAtual + 1, itensAtuais.length, acertos, erros);
    }
    
    const container = document.getElementById('game-content');
    if (!container) return;
    
    container.style.transition = "opacity 0.25s ease";
    container.style.opacity = "0";
    
    setTimeout(() => {
        montarInterface(itensAtuais[indiceAtual]);
        container.style.opacity = "1";
    }, 250);
}

function montarInterface(item) {
    const container = document.getElementById('game-content');
    if (!container) return;
    
    const isMobile = window.innerWidth < 600;
    const correta = item.nome[0].toUpperCase();
    const resto = item.nome.substring(1);
    
    let fontSizePalavra = isMobile ? (resto.length > 8 ? '28px' : '36px') : '48px';

    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÃÕÇ";
    const opcoes = [correta, ...alfabeto.replace(correta, "").split("").sort(() => 0.5 - Math.random()).slice(0, 3)].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content:space-around; padding:10px 0;">
            <div style="background:white; padding:15px; border-radius:25px; box-shadow: 0 6px 15px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center; width: 190px; height: 180px;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:130px; width:auto; object-fit:contain;" alt="${item.nome}">
            </div>

            <div style="display:flex; align-items:center; gap:10px; margin: 15px 0; width:100%; justify-content:center;">
                <div id="target-letter" class="slot" ondrop="drop(event)" ondragover="allowDrop(event)" 
                     style="width:65px; height:75px; border:4px dashed var(--primary-color); border-radius:15px; display:flex; align-items:center; justify-content:center; font-size:40px; font-weight:900; color:var(--primary-color); flex-shrink:0; background:#fff;"></div>
                <div style="font-size:${fontSizePalavra}; font-weight:900; color:#445; letter-spacing:2px; white-space:nowrap; overflow:hidden;">${resto}</div>
            </div>

            <div id="options-grid" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; width:100%; max-width:400px; padding: 0 10px;"></div>
        </div>`;

    const grid = document.getElementById('options-grid');
    opcoes.forEach(l => grid.appendChild(criarBotaoLetra(l, correta)));
}

function criarBotaoLetra(letra, correta) {
    const div = document.createElement('div');
    div.className = 'silaba-btn letra-opcao';
    div.dataset.letra = letra;
    div.innerText = letra;
    div.draggable = true;
    div.id = 'L-' + Math.random().toString(36).substr(2, 5);

    Object.assign(div.style, {
        height: '70px', background: 'white', color: 'var(--primary-color)',
        border: '3px solid var(--primary-color)', borderRadius: '15px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: '900',
        cursor: 'pointer', boxShadow: '0 5px 0 rgba(0,0,0,0.1)', userSelect: 'none', touchAction: 'none',
        transition: 'transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease'
    });

    div.onmouseenter = function() {
        if (!pecaSendoArrastada) {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 15px rgba(0,0,0,0.12)';
            this.style.backgroundColor = '#f7fbff';
            this.style.cursor = 'pointer';
        }
    };
    div.onmouseleave = function() {
        if (!pecaSendoArrastada) {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 0 rgba(0,0,0,0.1)';
            this.style.backgroundColor = 'white';
        }
    };

    div.ontouchstart = function(e) {
        const t = e.touches[0];
        touchStartX = t.clientX; touchStartY = t.clientY;
        pecaSendoArrastada = this;
        const r = this.getBoundingClientRect();
        this.dataset.ox = t.clientX - r.left;
        this.dataset.oy = t.clientY - r.top;
        this.style.zIndex = "1000";
        this.style.transform = 'scale(1.05)';
    };

    div.ontouchmove = function(e) {
        if (!pecaSendoArrastada) return;
        const t = e.touches[0];
        this.style.position = 'fixed';
        this.style.pointerEvents = 'none';
        this.style.left = (t.clientX - this.dataset.ox) + 'px';
        this.style.top = (t.clientY - this.dataset.oy) + 'px';
    };

    div.ontouchend = function(e) {
        if (!pecaSendoArrastada) return;
        const t = e.changedTouches[0];
        const dist = Math.hypot(t.clientX - touchStartX, t.clientY - touchStartY);
        
        this.style.pointerEvents = 'auto';
        const elemAbaixo = document.elementFromPoint(t.clientX, t.clientY);
        const slot = elemAbaixo ? elemAbaixo.closest('.slot') : null;

        if (dist < 12 || slot) {
            verificar(letra, correta);
        }

        this.style.position = 'relative';
        this.style.left = '0'; this.style.top = '0';
        this.style.transform = 'scale(1)';
        pecaSendoArrastada = null;
    };

    div.onclick = function(e) {
        if (e.pointerType === 'touch') return;
        verificar(letra, correta);
    };

    div.ondragstart = function(e) {
        pecaSendoArrastada = this;
        e.dataTransfer.setData("text", letra);
    };

    return div;
}

function verificar(escolhida, correta) {
    const slot = document.getElementById('target-letter');
    if (!slot || slot.innerText !== "") return; 

    const gameContent = document.getElementById('game-content');
    if (gameContent) gameContent.style.pointerEvents = 'none';
    
    slot.innerText = escolhida;
    slot.style.borderStyle = 'solid';
    
    const acerto = escolhida === correta;
    const cor = acerto ? '#8cc63f' : '#ff5a5f';
    
    slot.style.backgroundColor = cor;
    slot.style.borderColor = cor;
    slot.style.color = 'white';

    if (acerto) { 
        acertos++; 
        somAcerto.currentTime = 0; 
        somAcerto.play().catch(e=>console.log(e)); 
    } else { 
        erros++; 
        somErro.currentTime = 0; 
        somErro.play().catch(e=>console.log(e)); 
    }

    setTimeout(() => {
        if (gameContent) gameContent.style.pointerEvents = 'all';
        indiceAtual++;
        proximaRodada();
    }, 1200);
}

window.allowDrop = (e) => e.preventDefault();
window.drop = function(e) {
    e.preventDefault();
    const letra = e.dataTransfer.getData("text");
    const correta = itensAtuais[indiceAtual].nome[0].toUpperCase();
    verificar(letra, correta);
};

window.darAjuda = function() {
    ajudasUsadas++;
    somClique.currentTime = 0; 
    somClique.play().catch(e=>console.log(e));
    const correta = itensAtuais[indiceAtual].nome[0].toUpperCase();
    
    const botoes = document.querySelectorAll('.letra-opcao');
    botoes.forEach(btn => {
        if (btn.dataset.letra === correta) {
            btn.style.animation = "piscarBotao 0.4s ease infinite alternate";
            btn.style.borderColor = "#ffcc00";
            btn.style.boxShadow = "0 0 15px #ffcc00";
        }
    });

    if (!document.getElementById('hint-animation-style')) {
        const style = document.createElement('style');
        style.id = 'hint-animation-style';
        style.innerHTML = `@keyframes piscarBotao { 0% { transform: scale(1); background-color: white; } 100% { transform: scale(1.12); background-color: #fff9d6; } }`;
        document.head.appendChild(style);
    }
};

function finalizarJogo() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const rel = JOGO_CONFIG.relatorios.find(r => acertos >= r.min && acertos <= r.max) || JOGO_CONFIG.relatorios[0];
    if (typeof Engine !== 'undefined' && Engine.showResults) {
        Engine.showResults(acertos, erros, ajudasUsadas, rel);
    }
}
