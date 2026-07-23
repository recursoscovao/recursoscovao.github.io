const Game = {
    state: { ronda: 1, certos: 0, erros: 0, tempo: 0, timer: null, target: null, options: [] },

    init() {
        this.setupUI();
        this.buildMenu();
        this.showIntro();
    },

    setupUI() {
        const tema = BIBLIOTECA_TEMAS[CONFIG_MESTRE.area];
        const cont = BIBLIOTECA_CONTEUDO[CONFIG_MESTRE.ano][CONFIG_MESTRE.area];
        const root = document.documentElement;

        root.style.setProperty('--cor-primaria', tema.corPrimaria);
        root.style.setProperty('--cor-escura', tema.corEscura);
        root.style.setProperty('--bg-page', tema.corPagina);

        document.getElementById('txt-t1').innerText = cont.t1;
        document.getElementById('txt-t2').innerText = cont.t2;
        document.getElementById('txt-sub').innerText = cont.sub;
        document.getElementById('header-icon').src = "https://cdn-icons-png.flaticon.com/512/3468/3468403.png"; // Pintainho
    },

    buildMenu() {
        const menu = document.getElementById('menuDropdown');
        const labels = { home: "Início", pre: "Pré-Escolar", ano1: "1º Ano", ano2: "2º Ano", ano3: "3º Ano", ano4: "4º Ano" };
        Object.keys(JOGO_CONFIG.links).forEach(key => {
            const item = document.createElement('a');
            item.className = 'menu-item';
            item.href = JOGO_CONFIG.links[key];
            item.innerHTML = `<i class="fas fa-chevron-right"></i> <span>${labels[key] || key}</span>`;
            menu.appendChild(item);
        });
    },

    showIntro() {
        const cat = JOGO_CATEGORIAS[CONFIG_MESTRE.categoriaAtiva];
        document.getElementById('game-stage').innerHTML = `
            <div class="game-card">
                <div class="target-box"><img src="${cat.imgCapa}"></div>
                <h1 style="color:#1a4a7a; font-weight:900; margin-bottom:10px;">${CONFIG_MESTRE.nomeJogo}</h1>
                <p style="color:#8792a1; font-weight:700; margin-bottom:30px;">${cat.descricao}</p>
                <button class="btn-p" onclick="Game.start()"><i class="fas fa-play"></i> JOGAR</button>
            </div>
        `;
    },

    start() {
        this.state = { ronda: 1, certos: 0, erros: 0, tempo: 0 };
        this.startTimer();
        this.nextRound();
    },

    startTimer() {
        if(this.state.timer) clearInterval(this.state.timer);
        this.state.timer = setInterval(() => {
            this.state.tempo++;
            const el = document.getElementById('timer-val');
            if(el) {
                const m = Math.floor(this.state.tempo / 60).toString().padStart(2,'0');
                const s = (this.state.tempo % 60).toString().padStart(2,'0');
                el.innerText = `${m}:${s}`;
            }
        }, 1000);
    },

    nextRound() {
        if (this.state.ronda > JOGO_CONFIG.totalRondas) return this.showResults();
        
        const cat = JOGO_CATEGORIAS[CONFIG_MESTRE.categoriaAtiva];
        this.state.target = cat.itens[Math.floor(Math.random() * cat.itens.length)];
        
        let pool = [...cat.itens].sort(() => 0.5 - Math.random());
        let others = pool.filter(i => i.id !== this.state.target.id).slice(0, 7);
        this.state.options = [this.state.target, ...others].sort(() => 0.5 - Math.random());
        
        this.render();
    },

    render() {
        document.getElementById('game-stage').innerHTML = `
            <div class="game-card">
                <div class="status-row">
                    <div class="st-pill"><i class="far fa-clock"></i> <span id="timer-val">00:00</span></div>
                    <div class="st-pill" style="color:var(--cor-escura)">${this.state.ronda} / ${JOGO_CONFIG.totalRondas}</div>
                    <div style="display:flex; gap:8px;">
                        <div class="st-pill st-green"><i class="fas fa-check"></i> ${this.state.certos}</div>
                        <div class="st-pill st-red"><i class="fas fa-times"></i> ${this.state.erros}</div>
                    </div>
                </div>

                <div class="target-box">
                    ${this.state.target.tipo === 'img' ? `<img src="${this.state.target.valor}">` : `<span>${this.state.target.valor}</span>`}
                </div>

                <div class="options-grid">
                    ${this.state.options.map(opt => `
                        <div class="opt-btn" onclick="Game.check(this, '${opt.id}')">
                            ${opt.tipo === 'img' ? `<img src="${opt.valor}">` : `<span>${opt.valor}</span>`}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    check(el, id) {
        if (el.style.opacity === "0.4") return;
        if (id == this.state.target.id) {
            el.style.borderColor = "#4caf50"; el.style.background = "#e8f5e9";
            this.state.certos++;
            new Audio(JOGO_CONFIG.sons.acerto).play().catch(()=>{});
            setTimeout(() => { this.state.ronda++; this.nextRound(); }, 600);
        } else {
            el.style.borderColor = "#f44336"; el.style.background = "#ffebee";
            el.style.opacity = "0.4";
            this.state.erros++;
            new Audio(JOGO_CONFIG.sons.erro).play().catch(()=>{});
        }
    },

    showResults() {
        clearInterval(this.state.timer);
        new Audio(JOGO_CONFIG.sons.vitoria).play().catch(()=>{});
        document.getElementById('game-stage').innerHTML = `
            <div class="game-card">
                <img src="https://cdn-icons-png.flaticon.com/512/3112/3112946.png" style="width:110px; margin-bottom:15px;">
                <h1 style="color:var(--cor-escura); font-weight:900;">És um craque!</h1>
                
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:15px; margin:30px 0;">
                    <div style="background:#f8f9fa; padding:15px; border-radius:20px;">
                        <b style="font-size:1.6rem; color:#2e7d32;">${this.state.certos}</b><br><small style="font-weight:800; color:#8792a1;">CERTOS</small>
                    </div>
                    <div style="background:#f8f9fa; padding:15px; border-radius:20px;">
                        <b style="font-size:1.6rem; color:#c62828;">${this.state.erros}</b><br><small style="font-weight:800; color:#8792a1;">ERRADOS</small>
                    </div>
                    <div style="background:#f8f9fa; padding:15px; border-radius:20px;">
                        <b style="font-size:1.6rem; color:#fbc02d;">0</b><br><small style="font-weight:800; color:#8792a1;">AJUDAS</small>
                    </div>
                </div>

                <button class="btn-p" style="width:100%; margin-bottom:15px;" onclick="Game.start()">JOGAR DE NOVO</button>
                <button class="btn-s" onclick="location.reload()">OUTRO NÍVEL</button>
                <button class="btn-s" style="border-color:#ddd; color:#888;" onclick="window.location.href='../'">SAIR</button>
            </div>
        `;
    }
};

window.onload = () => Game.init();
