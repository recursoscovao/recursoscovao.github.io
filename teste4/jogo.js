// jogo.js

function inicializarLogicaJogo() {
    const container = document.getElementById('game-container');
    const dados = DADOS_JOGO; // Vem do dados.js
    const config = JOGO_CONFIG; // Vem do dados.js

    // Limpar o contentor antes de começar
    container.innerHTML = "";

    // 1. Criar área do Modelo (Animal que o aluno tem de encontrar)
    const areaModelo = document.createElement('div');
    areaModelo.style.textAlign = "center";
    areaModelo.style.marginBottom = "30px";
    areaModelo.innerHTML = `
        <p style="color: #5d7082; font-weight: 800; margin-bottom: 10px;">Encontra este animal:</p>
        <div style="background: white; width: 120px; height: 120px; margin: 0 auto; border-radius: 20px; border: 4px solid var(--primary-color); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 0 rgba(0,0,0,0.05);">
            <img id="imagem-modelo" src="${dados.caminhoImagens}${dados.itens[0].img}" style="width: 80px; height: 80px; object-fit: contain;">
        </div>
    `;
    container.appendChild(areaModelo);

    // 2. Criar Grelha de Opções (Aqui é onde as imagens são pequenas)
    const grelhaOpcoes = document.createElement('div');
    grelhaOpcoes.style.display = "grid";
    grelhaOpcoes.style.gridTemplateColumns = "repeat(auto-fit, minmax(100px, 1fr))"; // Colunas automáticas
    grelhaOpcoes.style.gap = "15px";
    grelhaOpcoes.style.justifyContent = "center";
    grelhaOpcoes.style.maxWidth = "500px"; // Limita a largura da grelha para não espalhar muito
    grelhaOpcoes.style.margin = "0 auto";

    // Gerar os cartões pequenos
    dados.itens.forEach(item => {
        const cartao = document.createElement('div');
        
        // Estilo do Cartão Pequeno
        Object.assign(cartao.style, {
            background: "white",
            padding: "10px",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 4px 0 rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "transform 0.1s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #eef2f6"
        });

        // Efeito de clique
        cartao.onclick = () => {
            cartao.style.transform = "scale(0.95)";
            setTimeout(() => cartao.style.transform = "scale(1)", 100);
            console.log("Clicaste em: " + item.nome);
            // Aqui chamarias a tua função de verificar acerto
        };

        // Imagem pequena dentro do cartão
        cartao.innerHTML = `
            <img src="${dados.caminhoImagens}${item.img}" 
                 style="width: 70px; height: 70px; object-fit: contain; pointer-events: none;">
            <p style="font-size: 0.75rem; font-weight: 800; color: #8792a1; margin-top: 5px;">${item.nome}</p>
        `;

        grelhaOpcoes.appendChild(cartao);
    });

    container.appendChild(grelhaOpcoes);
}

// Função auxiliar para sons (podes usar conforme os cliques)
function tocarSom(nomeSom) {
    const audio = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons[nomeSom]);
    audio.play();
}
