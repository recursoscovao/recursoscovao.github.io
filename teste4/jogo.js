// ==========================================
// 1. INSTRUÇÕES DO JOGO (Injetadas no ecrã de informação)
// ==========================================
const TEXTO_INSTRUCOES = `
    <div style="text-align: left; line-height: 1.6;">
        <h3 style="color: var(--cor-dinamica); margin-bottom: 10px;">Objetivo do jogo</h3>
        <p>Observa atentamente o animal apresentado no topo do ecrã e encontra a imagem igual entre as várias opções. Clica ou toca no animal correto para avançares para a ronda seguinte.</p>

        <h3 style="color: var(--cor-dinamica); margin: 20px 0 10px 0;">Como jogar</h3>
        <ul style="margin-left: 20px;">
            <li>Observa o animal que aparece no topo do ecrã.</li>
            <li>Analisa todas as imagens apresentadas.</li>
            <li>Encontra a imagem exatamente igual ao modelo.</li>
            <li>Clica ou toca no animal correto.</li>
            <li>Se acertares, passas para a próxima ronda.</li>
            <li>Se errares, tenta novamente até encontrares o par correto.</li>
            <li>Completa as 10 rondas e descobre a tua pontuação final.</li>
        </ul>

        <h3 style="color: var(--cor-dinamica); margin: 20px 0 10px 0;">Regras</h3>
        <ul style="margin-left: 20px;">
            <li>Existe apenas uma resposta correta em cada ronda.</li>
            <li>Observa com atenção antes de responder.</li>
            <li>Não há limite de tempo.</li>
            <li>O objetivo é acertar no maior número possível de respostas.</li>
        </ul>

        <h3 style="color: var(--cor-dinamica); margin: 20px 0 10px 0;">Dicas</h3>
        <p><strong>Observa cuidadosamente:</strong> a forma do animal, as cores e os detalhes (orelhas, patas, asas, cauda, etc.).</p>
        <p>Alguns animais podem ser muito parecidos. Escolhe apenas o que é exatamente igual ao modelo.</p>

        <h3 style="color: var(--cor-dinamica); margin: 20px 0 10px 0;">O que vais desenvolver?</h3>
        <p>Este jogo ajuda a desenvolver a atenção e concentração, memória visual, capacidade de observação e discriminação visual.</p>
    </div>
`;

// Injetar as instruções assim que o script carregar
document.getElementById('info-texto').innerHTML = TEXTO_INSTRUCOES;

// ==========================================
// 2. VARIÁVEIS DE CONTROLO E ESTADO
// ==========================================
let rondaAtual = 1;
const totalRondas = 10;
let itemCorreto = null;
let jogoBloqueado = false; // Evita cliques múltiplos durante o feedback

// ==========================================
// 3. INICIALIZAÇÃO DO JOGO
// ==========================================
function initJogo() {
    // Reset das variáveis globais (que estão no index.html)
    certosGlobal = 0;
    erradosGlobal = 0;
    ajudasGlobal = 0;
    rondaAtual = 1;
    jogoBloqueado = false;

    atualizarInterface();
    gerarRonda();
}

// ==========================================
// 4. LÓGICA DE GERAÇÃO DA RONDA
// ==========================================
function gerarRonda() {
    const container = document.getElementById('game-injection-point');
    container.innerHTML = ""; 
    jogoBloqueado = false;

    // 1. Sortear 8 animais únicos
    const itensEmbaralhados = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    const opcoesRonda = itensEmbaralhados.slice(0, 8);

    // 2. Definir o alvo correto
    itemCorreto = opcoesRonda[Math.floor(Math.random() * opcoesRonda.length)];

    // 3. Construir o Layout
    let html = `
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%; gap: 15px;">
            
            <!-- MODELO (ALVO) -->
            <div id="target-box" style="
                width: 90px; height: 90px; 
                background: white; 
                border: 3px solid var(--cor-dinamica); 
                border-radius: 15px; 
                display: flex; align-items: center; justify-content: center;
                padding: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            ">
                <img src="${DADOS_JOGO.caminhoImagens}${itemCorreto.img}" style="max-width: 100%; max-height: 100%;">
            </div>

            <!-- GRELHA 4x2 -->
            <div style="
                display: grid; 
                grid-template-columns: repeat(4, 1fr); 
                grid-template-rows: repeat(2, 1fr); 
                gap: 12px; width: 100%; max-width: 650px; flex: 1;
            ">
    `;

    // 4. Criar as cartas
    opcoesRonda.forEach(item => {
        html += `
            <div class="card-animal" onclick="verificarResposta(${item.id}, this)" style="
                background: white; 
                border-radius: 15px; 
                border: 2px solid #eee; 
                display: flex; align-items: center; justify-content: center; 
                padding: 10px; cursor: pointer; transition: 0.2s;
                box-shadow: 0 4px 8px rgba(0,0,0,0.02);
            ">
                <img src="${DADOS_JOGO.caminhoImagens}${item.img}" style="max-width: 85%; max-height: 85%; pointer-events: none;">
            </div>
        `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
}

// ==========================================
// 5. VERIFICAÇÃO DE RESPOSTA
// ==========================================
function verificarResposta(idSelecionado, elemento) {
    if (jogoBloqueado) return;

    if (idSelecionado === itemCorreto.id) {
        // --- ACERTO ---
        certosGlobal++;
        jogoBloqueado = true;
        elemento.style.borderColor = "var(--cor-certo)";
        elemento.style.backgroundColor = "#f2faf0";
        elemento.style.transform = "scale(0.95)";
        
        setTimeout(proximaRonda, 600);
    } else {
        // --- ERRO ---
        erradosGlobal++;
        jogoBloqueado = true;
        elemento.style.borderColor = "var(--cor-errado)";
        elemento.style.backgroundColor = "#fff5f5";
        
        // Mostrar onde estava o correto para ensinar o aluno
        const cartas = document.querySelectorAll('.card-animal');
        cartas.forEach(c => {
            if(c.innerHTML.includes(itemCorreto.img)) {
                c.style.borderColor = "var(--cor-certo)";
                c.style.boxShadow = "0 0 15px rgba(140, 198, 63, 0.4)";
            }
        });

        setTimeout(proximaRonda, 1200);
    }
    
    atualizarInterface();
}

function proximaRonda() {
    if (rondaAtual < totalRondas) {
        rondaAtual++;
        atualizarInterface();
        gerarRonda();
    } else {
        mudarEcra('resultados');
    }
}

// ==========================================
// 6. AJUDA (LÂMPADA)
// ==========================================
function pedirAjuda() {
    if (jogoBloqueado) return;
    
    ajudasGlobal++;
    atualizarInterface();

    const cartas = document.querySelectorAll('.card-animal');
    cartas.forEach(c => {
        if(c.innerHTML.includes(itemCorreto.img)) {
            c.style.boxShadow = "0 0 20px var(--cor-ajuda)";
            c.style.transform = "scale(1.05)";
            c.style.borderColor = "var(--cor-ajuda)";
        }
    });
}

// ==========================================
// 7. UTILITÁRIOS
// ==========================================
function atualizarInterface() {
    if(document.getElementById('ronda-atual')) 
        document.getElementById('ronda-atual').innerText = rondaAtual;
    if(document.getElementById('cont-certos-jogo')) 
        document.getElementById('cont-certos-jogo').innerText = certosGlobal;
    if(document.getElementById('cont-errados-jogo')) 
        document.getElementById('cont-errados-jogo').innerText = erradosGlobal;
}
