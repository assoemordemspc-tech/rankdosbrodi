import { Game } from './src/core/game.js';

// Aguarda o carregamento do DOM para garantir que o canvas exista
window.addEventListener('load', () => {
    const game = new Game();
    game.start();
});