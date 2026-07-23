const Game = {
    state: { ronda: 1, certos: 0, erros: 0, target: '', options: [] },

    init() {
        this.setupTheme();
        this.showIntro();
    },

    setupTheme() {
        const tema = BIBLIOTECA_TEMAS[CONFIG_MESTRE.area];
        const cont = BIBLIOTECA_CONTEUDO[CONFIG_MESTRE.ano][CONFIG_MESTRE.area];
        
        // CSS Vars
        const root = document.documentElement;
        root.style.setProperty('--cor-primaria', tema.corPrimaria);
        root.style.setProperty('--cor-escura', tema.corEscura);
        root.style.setProperty('--bg-page', tema.corPagina);
        root.style.setProperty('--bg-card', tema.corCard);

        // Header
        document.getElementById('txt-titulo1').innerText = cont.t1;
        document.getElementById('txt-titulo2').innerText = cont.t2;
        document.getElementById('txt-subtitulo-header').innerText = cont.sub;
        document.getElementById('txt-rodape').innerText = cont.rodape;
        
        document.getElementById('header-icon').src = JOGO_CONFIG.caminhoIcons + JOGO_CONFIG.iconesMenu[CONFIG_MESTRE.ano];
        document.getElementById('icon-voltar-top').src = JOGO_CONFIG.caminhoIcons + tema.voltarMobile;
    },

    showIntro() {
        const cat = JOGO_CATEGORIAS[CONFIG_MESTRE.categoriaAtiva];
        const stage = document.getElementById('game-stage');
        stage.innerHTML = `
            <div class="card-jogo">
                <div class="badge-facil"><i class="fas fa-star"></i> FÁCIL</div>
                <div class="img-circulo"><img src="${cat.imgCapa}"></div>
                <h1 class="game-title">${CONFIG_MESTRE.nomeJogo}</h1>
                <p class="game-desc">${cat.descricao}</p>
                <div class="info-row">
                    <div class="info-box"><i class="fas fa-clock"></i> Cerca de<br>2 minutos</div>
                    <div class="info-box"><i class="fas fa-coins"></i> Ganhas<br>moedas</div>
                </div>
                <button class="btn-principal" onclick="Game.start()">
                    <i class="fas fa-play"></i> JOGAR
                </button>
            </div>
        `;
    },

    start() {
        this.state = { ronda: 1, certos: 0, erros: 0 };
        this.nextRound();
    },

    nextRound() {
        if (this.state.ronda > JOGO_CONFIG.totalRondas) return this.showResults();

        const cat = JOGO_CATEGORIAS[CONFIG_MESTRE.categoriaAtiva];
        const all = [...cat.letras];
        this.state.target = all[Math.floor(Math.random() * all.length)];
        
        let wrong = all.filter(l => l !== this.state.target)
                       .sort(() => Math.random() - 0.5)
                       .slice(0, 7);
        
        this.state.options = [this.state.target, ...wrong].sort(() => Math.random() - 0.5);
        this.renderPlayScreen();
    },

    renderPlayScreen() {
        const stage = document.getElementById('game-stage');
        const pct = (this.state.ronda / JOGO_CONFIG.totalRondas) * 100;

        stage.innerHTML = `
            <div class="card-jogo" style="max-width: 700px">
                <div class="top-status">
                    <span style="font-weight:900; color:var(--cor-primaria)">${this.state.ronda}/${JOGO_CONFIG.totalRondas}</span>
                    <div class="progress-bar-bg"><div class="progress-fill" style="width: ${pct}%"></div></div>
                    <div class="info-box" style="margin:0"><i class="fas fa-star"></i> 5</div>
                </div>
                <h2 class="pergunta">Qual é igual?</h2>
                <div class="target-box"><span>${this.state.target}</span></div>
                <div class="options-grid">
                    ${this.state.options.map(l => `<div class="opt-card" onclick="Game.check(this, '${l}')">${l}</div>`).join('')}
                </div>
            </div>
        `;
    },

    check(el, val) {
        if (el.classList.contains('correct') || el.classList.contains('wrong')) return;

        if (val === this.state.target) {
            el.classList.add('correct');
            this.state.certos++;
            new Audio(JOGO_CONFIG.sons.acerto).play().catch(() => {});
            setTimeout(() => { this.state.ronda++; this.nextRound(); }, 600);
        } else {
            el.classList.add('wrong');
            this.state.erros++;
            new Audio(JOGO_CONFIG.sons.erro).play().catch(() => {});
        }
    },

    showResults() {
        new Audio(JOGO_CONFIG.sons.vitoria).play().catch(() => {});
        const pct = (this.state.certos / JOGO_CONFIG.totalRondas) * 100;
        const rel = JOGO_CONFIG.relatorios.find(r => pct >= r.min && pct <= r.max);
        const stage = document.getElementById('game-stage');

        stage.innerHTML = `
            <div class="card-jogo">
                <img src="${rel.img}" style="width:110px; margin-bottom:15px;">
                <h1 class="game-title">${rel.titulo}</h1>
                <p class="game-desc">Terminaste o desafio!</p>
                <div class="stats-grid">
                    <div class="stat-card"><span class="stat-val" style="color:#4caf50">${this.state.certos}</span><span class="stat-label">Certos</span></div>
                    <div class="stat-card"><span class="stat-val" style="color:#f44336">${this.state.erros}</span><span class="stat-label">Erros</span></div>
                    <div class="stat-card"><span class="stat-val" style="color:#ff9800">+25</span><span class="stat-label">Moedas</span></div>
                </div>
                <div class="btn-stack">
                    <button class="btn-principal" onclick="Game.start()"><i class="fas fa-redo"></i> JOGAR NOVAMENTE</button>
                    <button class="btn-outline" onclick="window.history.back()"><i class="fas fa-th"></i> OUTRO JOGO</button>
                    <button class="btn-outline" onclick="window.history.back()"><i class="fas fa-map-marked-alt"></i> MAPA DE JOGOS</button>
                </div>
            </div>
        `;
    }
};

window.onload = () => Game.init();
