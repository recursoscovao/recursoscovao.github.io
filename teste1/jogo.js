const GameEngine = {
    state: {
        ronda: 1,
        certos: 0,
        erros: 0,
        moedas: 0,
        target: '',
        opcoes: []
    },

    init() {
        this.aplicarTema();
        this.mostrarEcraInicial();
    },

    aplicarTema() {
        const tema = BIBLIOTECA_TEMAS[CONFIG_MESTRE.area];
        const cont = BIBLIOTECA_CONTEUDO[CONFIG_MESTRE.ano][CONFIG_MESTRE.area];
        
        // CSS Variables
        document.documentElement.style.setProperty('--cor-primaria', tema.corPrimaria);
        document.documentElement.style.setProperty('--cor-escura', tema.corEscura);
        document.body.style.backgroundColor = tema.corPagina;

        // Header Texts
        document.getElementById('txt-titulo1').innerText = cont.t1;
        document.getElementById('txt-titulo1').style.color = tema.corPrimaria;
        document.getElementById('txt-titulo2').innerText = cont.t2;
        document.getElementById('txt-subtitulo-header').innerText = cont.sub;
        document.getElementById('txt-rodape').innerText = cont.rodape;

        // Icons
        document.getElementById('header-icon').src = JOGO_CONFIG.caminhoIcons + JOGO_CONFIG.iconesMenu[CONFIG_MESTRE.ano];
        document.getElementById('icon-voltar-top').src = JOGO_CONFIG.caminhoIcons + tema.voltarMobile;
    },

    mostrarEcraInicial() {
        const cat = JOGO_CATEGORIAS[CONFIG_MESTRE.categoriaAtiva];
        const stage = document.getElementById('game-stage');
        
        stage.innerHTML = `
            <div class="card-jogo">
                <div class="badge-facil"><i class="fas fa-star"></i> FÁCIL</div>
                <div class="img-capa-circulo">
                    <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}">
                </div>
                <h1 class="game-title">${CONFIG_MESTRE.nomeJogo}</h1>
                <p class="game-desc">${cat.descricao}</p>
                
                <div class="info-row">
                    <div class="info-box"><i class="fas fa-clock"></i> Cerca de<br>2 minutos</div>
                    <div class="info-box"><i class="fas fa-coins"></i> Ganhas<br>moedas</div>
                </div>

                <button class="btn-jogar-grande" onclick="GameEngine.iniciarPartida()">
                    <i class="fas fa-play"></i> JOGAR
                </button>
            </div>
        `;
    },

    iniciarPartida() {
        this.state = { ronda: 1, certos: 0, erros: 0, moedas: 0 };
        this.proximaRonda();
    },

    proximaRonda() {
        if (this.state.ronda > JOGO_CONFIG.totalRondas) {
            this.mostrarFeedback();
            return;
        }

        const cat = JOGO_CATEGORIAS[CONFIG_MESTRE.categoriaAtiva];
        const todas = [...cat.letras];
        
        // Escolher alvo
        this.state.target = todas[Math.floor(Math.random() * todas.length)];
        
        // Gerar 7 opções erradas
        let erradas = todas.filter(l => l !== this.state.target)
                           .sort(() => Math.random() - 0.5)
                           .slice(0, 7);
        
        this.state.opcoes = [this.state.target, ...erradas].sort(() => Math.random() - 0.5);

        this.renderizarEcraJogo();
    },

    renderizarEcraJogo() {
        const stage = document.getElementById('game-stage');
        const progresso = (this.state.ronda / JOGO_CONFIG.totalRondas) * 100;

        stage.innerHTML = `
            <div class="game-container">
                <div class="top-bar">
                    <span class="label-ronda">${this.state.ronda}/${JOGO_CONFIG.totalRondas}</span>
                    <div class="progress-bg"><div class="progress-fill" style="width: ${progresso}%"></div></div>
                    <div class="label-ronda" style="color:#fbc02d"><i class="fas fa-star"></i> 5</div>
                </div>

                <h2 class="pergunta-texto">Qual é igual?</h2>
                
                <div class="target-card">
                    <span>${this.state.target}</span>
                </div>

                <div class="options-grid">
                    ${this.state.opcoes.map(letra => `
                        <div class="opt-btn" onclick="GameEngine.validar(this, '${letra}')">${letra}</div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    validar(el, letra) {
        if (el.classList.contains('correct') || el.classList.contains('wrong')) return;

        if (letra === this.state.target) {
            el.classList.add('correct');
            this.state.certos++;
            new Audio(JOGO_CONFIG.sons.acerto).play().catch(() => {});
            
            setTimeout(() => {
                this.state.ronda++;
                this.proximaRonda();
            }, 600);
        } else {
            el.classList.add('wrong');
            this.state.erros++;
            new Audio(JOGO_CONFIG.sons.erro).play().catch(() => {});
        }
    },

    mostrarFeedback() {
        new Audio(JOGO_CONFIG.sons.vitoria).play().catch(() => {});
        const perc = (this.state.certos / JOGO_CONFIG.totalRondas) * 100;
        const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
        const stage = document.getElementById('game-stage');

        stage.innerHTML = `
            <div class="card-jogo">
                <img src="${JOGO_CONFIG.caminhoImg}${rel.img}" style="width:120px; margin-bottom:20px;">
                <h1 class="game-title">${rel.titulo}</h1>
                <p class="game-desc">Terminaste o desafio!</p>

                <div class="stats-row">
                    <div class="stat-item">
                        <span class="stat-val" style="color:#4caf50">${this.state.certos}</span>
                        <span class="stat-label">Certos</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-val" style="color:#f44336">${this.state.erros}</span>
                        <span class="stat-label">Erros</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-val" style="color:#ff9800">+25</span>
                        <span class="stat-label">Moedas</span>
                    </div>
                </div>

                <div class="footer-actions">
                    <button class="btn-jogar-grande" style="width:100%" onclick="GameEngine.iniciarPartida()">
                        <i class="fas fa-redo"></i> JOGAR NOVAMENTE
                    </button>
                    <button class="btn-secundario" onclick="window.history.back()">
                        <i class="fas fa-map-marked-alt"></i> MAPA DE JOGOS
                    </button>
                </div>
            </div>
        `;
    }
};

window.onload = () => GameEngine.init();
