import './src/core/teste.js';
import { Game } from './src/core/game.js';

window.addEventListener('load', () => {
    try {
        const game = new Game();
        game.start();
        console.log("Jogo iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao iniciar o jogo:", error);
    }
});
