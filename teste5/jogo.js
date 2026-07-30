// ==========================================
// 1. ESTILO REFORMULADO (BARRA CURTA E MAIS ESPAÇO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    /* Barra de Status super compacta */
    #shell-header { height: 40px !important; min-height: 40px !important; padding: 0 !important; }
    .status-bar-container { height: 40px !important; padding: 0 8px !important; display: flex; align-items: center; justify-content: space-between; }
    .status-item { font-size: 0.75rem !important; font-weight: 800 !important; }
    .status-item img { height: 16px !important; margin-right: 2px !important; }
    
    /* Ajuste do container principal para remover folgas inúteis */
    #game-content { padding-top: 5px !important; padding-bottom: 5px !important; }

    /* Garantir que as imagens nos cards fiquem uniformes */
    .opcao-card img { 
        width: 95%; 
        height: 95%; 
        object-fit: contain; /* Mantém a proporção sem cortar, mas ocupa o máximo do box */
    }
`;
document.head.appendChild(style);

// ... (sons e estado global permanecem iguais)

// ==========================================
// 3. LÓGICA DO JOGO (COM ANIMAIS MAIORES)
// ==========================================

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }

    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros);
    
    const lamp = document.querySelector('.lamp-icon');
    if(lamp) lamp.onclick = darAjuda;

    const area = document.getElementById('game-content');
    const todosItens = [...DADOS_JOGO.itens].sort(() => Math.random() - 0.5);
    itemDestaque = todosItens[0];
    opcoesRonda = todosItens.slice(0, 10).sort(() => Math.random() - 0.5);

    const isPortrait = window.innerHeight > window.innerWidth;
    // Aumentei a altura dos cards para aproveitarem o espaço extra
    const imgHeight = isPortrait ? "11vh" : "15vh"; 

    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; padding: 5px 0;">
            
            <!-- Animal de Destaque (Menos padding, imagem maior) -->
            <div style="height:20vh; padding:5px; background:#f9f9f9; border-radius:15px; border:2px dashed var(--primary-color); display:flex; align-items:center; justify-content:center;">
                <img src="${DADOS_JOGO.caminhoImagens + itemDestaque.img}" style="height:100%; width:auto; object-fit:contain;">
            </div>

            <!-- Grelha de Opções (Imagens maiores e sem padding interno nos cards) -->
            <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:6px; width:98%; max-width:700px;">
                ${opcoesRonda.map(item => `
                    <div class="opcao-card" id="card-${item.id}" onclick="verificarResposta(${item.id}, this)" style="
                        background:white; border:2px solid #e0e0e0; border-radius:10px; 
                        height:${imgHeight}; display:flex; align-items:center; justify-content:center; cursor:pointer; overflow:hidden;
                    ">
                        <img src="${DADOS_JOGO.caminhoImagens + item.img}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ... (resto das funções como verificarResposta, finalizarJogo, etc.)
