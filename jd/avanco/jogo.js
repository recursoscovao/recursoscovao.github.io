// ============================================================
// === SECÇÃO 2: CONFIGURAÇÃO VISUAL / CSS (ATUALIZADO TABLET) ===
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    #game-content { 
        display: flex; flex-direction: column; align-items: center; justify-content: center; 
        width: 100%; height: 100%; padding: 15px; box-sizing: border-box; overflow: hidden; position: relative;
    }
    #simu-container { flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; min-height: 120px; }
    #capa-menu-principal, #nivel-select-container { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 20px; padding-bottom: 5px; }
    .capa-btn-row, .nivel-row { display: flex; flex-direction: row; gap: 15px; width: 100%; max-width: 600px; justify-content: center; align-items: center; }
    
    .btn-capa-small { flex: 1; height: clamp(50px, 7vh, 75px); border-radius: 15px; border: none; color: white; font-weight: 900; font-size: clamp(0.9rem, 2.5vw, 1.1rem); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 0 rgba(0,0,0,0.1); text-transform: uppercase; }
    .btn-inform { width: clamp(50px, 7vh, 75px); height: clamp(50px, 7vh, 75px); cursor: pointer; flex: none; }
    .btn-inform img { width: 100%; height: 100%; object-fit: contain; }

    /* INSTRUÇÕES PREMIUM */
    #instrucoes-panel { 
        position: fixed; bottom: 0; left: 0; width: 100vw; height: 100vh; 
        background: white; z-index: 10000; 
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); 
        transform: translateY(100%); 
        visibility: hidden; padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0; 
        box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
    }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: absolute; top: 15px; right: 25px; font-size: 3rem; color: #ff5a5f; cursor: pointer; font-weight: 900; }

    .inst-content { max-width: 800px; margin: 0 auto; text-align: left; font-family: 'Nunito', sans-serif; }
    .inst-header { color: var(--primary-color); text-align: center; font-size: 2.2rem; font-weight: 900; margin-bottom: 30px; text-transform: uppercase; border-bottom: 4px solid var(--bg-color); padding-bottom: 10px; }

    /* TABULEIRO REFORÇADO */
    .grid-board { 
        display: grid; 
        grid-template-columns: repeat(7, 1fr); 
        gap: clamp(2px, 0.5vw, 6px); 
        background: #bbb; 
        padding: clamp(4px, 1vw, 10px); 
        border-radius: 15px; 
        margin: 0 auto; 
        box-shadow: 0 12px 30px rgba(0,0,0,0.15); 
    }
    .cell { 
        width: var(--cell-size); 
        height: var(--cell-size); 
        background: white; 
        border-radius: clamp(4px, 0.8vw, 8px); 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        position: relative; 
        transition: 0.2s;
    }
    .piece { width: 85%; height: 80%; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.3); transition: 0.3s; }
    .piece.white { background: radial-gradient(circle at 30% 30%, #fff, #bbb); border: 1px solid #ccc; }
    .piece.black { background: radial-gradient(circle at 30% 30%, #666, #000); }

    /* --- MEDIA QUERIES PARA TABLET E PAINEL --- */

    /* LANDSCAPE (TABLET GRANDE / PAINEL INTERATIVO) */
    @media screen and (min-width: 1025px), (min-width: 768px) and (orientation: landscape) {
        :root { --cell-size: min(80px, 10.5vh); }
        #game-content { padding: 20px; }
        .grid-board { gap: 6px; padding: 10px; }
    }

    /* VERTICAL (TABLET PORTRAIT) */
    @media screen and (min-width: 501px) and (max-width: 1024px) and (orientation: portrait) {
        :root { --cell-size: 11.5vw; }
        #game-content { padding: 40px 20px; }
        #simu-board { transform: scale(1.3); }
        .capa-btn-row { gap: 20px; }
    }

    /* TELEMÓVEL VERTICAL */
    @media screen and (max-width: 500px) and (orientation: portrait) {
        :root { --cell-size: 11.5vw; }
        #simu-board { transform: scale(0.85); }
        .capa-btn-row { flex-direction: column; width: 85%; }
    }
    
    /* TELEMÓVEL HORIZONTAL (MODO LADO-A-LADO APENAS PARA SMARTPHONES) */
    @media screen and (max-height: 550px) and (orientation: landscape) and (max-width: 950px) {
        :root { --cell-size: 11vh; } 
        #game-content { flex-direction: row; justify-content: center; gap: 40px; padding: 10px; }
        #simu-container { flex: none; width: auto; }
        #simu-board { transform: scale(0.8); }
        .capa-btn-row, .nivel-row { flex-direction: column; width: 180px; gap: 10px; }
    }
`;
document.head.appendChild(style);
