const Game = {
    state: { ronda: 1, certos: 0, erros: 0, target: '', options: [] },

    init() {
        this.setupTheme();
        this.buildMenu();
        this.showIntro();
    },

    setupTheme() {
        const tema = BIBLIOTECA_TEMAS[CONFIG_MESTRE.area];
        const cont = BIBLIOTECA_CONTEUDO[CONFIG_MESTRE.ano][CONFIG_MESTRE.area];
        const root = document.documentElement;

        // Variáveis CSS
        root.style.setProperty('--cor-primaria', tema.corPrimaria);
        root.style.setProperty('--cor-escura', tema.corEscura);
        root.style.setProperty('--cor-hamburger', tema.corHamburger);
        root.style.setProperty('--bg-page', tema.corPagina);
        root.style.setProperty('--bg-card', tema.corCard);

        // Conteúdo do Header
        document.getElementById('txt-titulo1').innerText = cont.t1;
        document.getElementById('txt-titulo2').innerText = cont.t2;
        document.getElementById('txt-subtitulo-header').innerText = cont.sub;
        document.getElementById('txt-rodape').innerText = cont.rodape;
        
        document.getElementById('header-icon').src = JOGO_CONFIG.caminhoIcons + JOGO_CONFIG.iconesMenu[CONFIG_MESTRE.ano];
        document.getElementById('icon-voltar-top').src = JOGO_CONFIG.caminhoIcons + tema.voltarMobile;
    },

    buildMenu() {
        const menu = document.getElementById('menuDropdown');
        const labels = { home: "Início", pre: "Pré-Escolar", ano1: "1º Ano", ano2: "2º Ano", ano3: "3º Ano", ano4: "4º Ano" };
        
        Object.keys(JOGO_CONFIG.links).forEach(key => {
            if(JOGO_CONFIG.iconesMenu[key]) {
                const item = document.createElement('a');
                item.className = 'menu-item';
                item.href = JOGO_CONFIG.links[key];
                item.innerHTML = `<img src="${JOGO_CONFIG.caminhoIcons}${JOGO_CONFIG.iconesMenu[key]}"> <span>${labels[key] || key}</span>`;
                menu.appendChild(item);
            }
        });
    },

    showIntro() {
        const cat = JOGO_CATEGORIAS[CONFIG_MESTRE.categoriaAtiva];
        document.getElementById('game-stage').innerHTML = `
            <div class="card-jogo">
                <div class="img-circulo"><img src="${cat.imgCapa}"></div>
                <h1 class="game-title">${CONFIG_MESTRE.nomeJogo}</h1>
                <p class="game-desc">${cat.descricao}</p>
                <button class="btn-principal" style="background:var(--cor-escura); color:white; border:none; padding:18px 60px; border-radius:35px; font-weight:900; font-size:1.1rem; cursor:pointer; box-shadow: 0 8px 0 rgba(0,0,0,0.15);" onclick="Game.start()">
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
        this.state.target = cat.letras[Math.floor(Math.random() * cat.letras.length)];
        let wrong = cat.letras.filter(l => l !== this.state.target).sort(() => 0.5 - Math.random()).slice(0, 7);
        this.state.options = [this.state.target, ...wrong].sort(() => 0.5 - Math.random());
        this.render();
    },

    render() {
        const pct = (this.state.ronda / JOGO_CONFIG.totalRondas) * 100;
        document.getElementById('game-stage').innerHTML = `
            <div class="card-jogo">
                <div class="top-status">
                    <span style="font-weight:900; color:var(--cor-primaria)">${this.state.ronda}/${JOGO_CONFIG.totalRondas}</span>
                    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
                    <span style="font-weight:900; color:#fbc02d"><i class="fas fa-star"></i> 5</span>
                </div>
                <h2 style="color:#1a4a7a; font-weight:900; margin-bottom:15px;">Qual é igual?</h2>
                <div class="target-box"><span>${this.state.target}</span></div>
                <div class="options-grid">
                    ${this.state.options.map(l => `<div class="opt-btn" onclick="Game.check(this, '${l}')">${l}</div>`).join('')}
                </div>
            </div>
        `;
    },

    check(el, val) {
        if (el.classList.contains('correct') || el.classList.contains('wrong')) return;
        if (val === this.state.target) {
            el.classList.add('correct'); this.state.certos++;
            new Audio(JOGO_CONFIG.sons.acerto).play().catch(() => {});
            setTimeout(() => { this.state.ronda++; this.nextRound(); }, 600);
        } else {
            el.classList.add('wrong'); this.state.erros++;
            new Audio(JOGO_CONFIG.sons.erro).play().catch(() => {});
        }
    },

    showResults() {
        const rel = JOGO_CONFIG.relatorios[0]; 
        document.getElementById('game-stage').innerHTML = `
            <div class="card-jogo">
                <img src="${rel.img}" style="width:120px; margin-bottom:20px;">
                <h1 class="game-title">${rel.titulo}</h1>
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin:25px 0;">
                    <div style="background:#f8f9fa; padding:15px; border-radius:20px;"><b>${this.state.certos}</b><br><small>CERTOS</small></div>
                    <div style="background:#f8f9fa; padding:15px; border-radius:20px;"><b>${this.state.erros}</b><br><small>ERROS</small></div>
                    <div style="background:#f8f9fa; padding:15px; border-radius:20px;"><b>+25</b><br><small>MOEDAS</small></div>
                </div>
                <button class="btn-principal" style="background:var(--cor-escura); color:white; border:none; padding:18px 40px; border-radius:35px; font-weight:900; width:100%; cursor:pointer; box-shadow:0 6px 0 rgba(0,0,0,0.1);" onclick="Game.start()">REPETIR JOGO</button>
            </div>
        `;
    }
};

window.onload = () => Game.init();
