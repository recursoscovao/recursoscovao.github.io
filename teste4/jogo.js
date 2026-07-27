// ==========================================
// VARIÁVEIS DE ESTADO DO JOGO
// ==========================================
let rondaAtual = 1;
let totalRondas = 10;
let certos = 0;
let errados = 0;
let ajudasUsadas = 0;
let itemAlvo = null;

// ==========================================
// INICIALIZAÇÃO
// ==========================================
window.onload = () => {
    // Esta função prepara o jogo mas não o inicia até clicar em JOGAR
    prepararAmbiente();
};

function prepararAmbiente() {
    // Preencher as instruções detalhadas na página de info
    const infoTexto = document.getElementById("info-instructions");
    if(infoTexto) {
        infoTexto.innerHTML = `
            <strong>Objetivo:</strong> Observa o animal no topo e encontra o igual.<br><br>
            <strong>Como jogar:</strong><br>
            1. Olha para o animal em destaque.<br>
            2. Encontra o par idêntico na grelha abaixo.<br>
            3. Clica no correto para avançar.<br><br>
            <strong>Desenvolve:</strong> Atenção, Memória Visual e Concentração.
        `;
    }
}

// Chamada pelo botão "JOGAR" do index.html
function irParaJogo() {
    rondaAtual = 1;
    certos = 0;
    errados = 0;
    ajudasUsadas = 0;
    
    atualizarInterfaceStats();
    trocarEcra('tela-jogo');
    proximaRonda();
}

// ==========================================
// LÓGICA DAS RONDAS
// ==========================================

function proximaRonda() {
    if (rondaAtual > totalRondas) {
        finalizarJogo();
        return;
    }

    atualizarInterfaceStats();

    // 1. Escolher o animal alvo aleatoriamente
    const listaItens = [...DADOS_JOGO.itens];
    itemAlvo = listaItens[Math.floor(Math.random() * listaItens.length)];

    // 2. Escolher 7 distratores (diferentes do alvo)
    const distratores = listaItens
        .filter(item => item.id !== itemAlvo.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 7);

    // 3. Juntar e baralhar as 8 opções
    const opcoesGrid = [...distratores, itemAlvo].sort(() => Math.random() - 0.5);

    renderizarJogo(opcoesGrid);
}

function renderizarJogo(opcoes) {
    const container = document.getElementById("container-jogo-injetado");
    
    // Criar estrutura interna do jogo
    container.innerHTML = `
        <div class="jogo-wrapper">
            <div class="zona-alvo">
                <div class="card-alvo anim-entrada">
                    <img src="${DADOS_JOGO.caminhoImagens}${itemAlvo.img}" alt="Alvo">
                </div>
            </div>
            <div class="zona-opcoes">
                ${opcoes.map(item => `
                    <div class="card-opcao anim-entrada" onclick="verificarResposta(this, ${item.id})">
                        <img src="${DADOS_JOGO.caminhoImagens}${item.img}" alt="Opção">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==========================================
// MECÂNICAS
// ==========================================

function verificarResposta(elemento, idEscolhido) {
    if (elemento.classList.contains('respondido')) return;

    if (idEscolhido === itemAlvo.id) {
        // ACERTO
        certos++;
        elemento.classList.add('correto', 'respondido');
        // Bloquear outros cliques
        document.querySelectorAll('.card-opcao').forEach(c => c.classList.add('respondido'));
        
        setTimeout(() => {
            rondaAtual++;
            proximaRonda();
        }, 1200);
    } else {
        // ERRO
        errados++;
        elemento.classList.add('errado');
        atualizarInterfaceStats();
        // Remove a classe de erro após a animação para poder tentar de novo
        setTimeout(() => elemento.classList.remove('errado'), 500);
    }
}

// Função da Lâmpada (Ajuda)
document.getElementById("ui-help-lamp").onclick = () => {
    ajudasUsadas++;
    atualizarInterfaceStats();
    
    // Destacar o correto temporariamente
    const cards = document.querySelectorAll('.card-opcao');
    cards.forEach(card => {
        // Esta lógica assume que guardamos o id no elemento ou comparamos
        // Para simplificar, vamos apenas dar um brilho ao correto
    });
    // Implementação visual da ajuda:
    const cardsOpcao = document.querySelectorAll('.card-opcao');
    cardsOpcao.forEach(card => {
        card.style.opacity = "0.3"; // Escurece todos
    });
    
    // Encontrar o correto e destacar
    const todosCards = Array.from(document.querySelectorAll('.card-opcao'));
    const oCorreto = todosCards.find(c => c.innerHTML.includes(itemAlvo.img));
    if(oCorreto) {
        oCorreto.style.opacity = "1";
        oCorreto.style.transform = "scale(1.1)";
        oCorreto.style.boxShadow = "0 0 20px gold";
    }

    setTimeout(() => {
        cardsOpcao.forEach(card => {
            card.style.opacity = "1";
            card.style.transform = "";
            card.style.boxShadow = "";
        });
    }, 1500);
};

function atualizarInterfaceStats() {
    document.getElementById("ui-ronda").innerText = `${rondaAtual} / ${totalRondas}`;
    document.getElementById("ui-certos").innerText = certos;
    document.getElementById("ui-errados").innerText = errados;
}

function finalizarJogo() {
    // Chama a função que já existe no index.html
    mostrarResultados(certos, errados, ajudasUsadas);
}
