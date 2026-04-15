import { Game } from './src/core/game.js';

window.addEventListener('load', () => {
    try {
        const game = new Game();
        game.start();
        console.log("Jogo iniciado!");
    } catch (e) {
        console.error("Erro ao carregar o jogo:", e);
    }
});
