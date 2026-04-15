import { Player } from '../entities/player.js';
import { Input } from './input.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Ajusta resolução interna do canvas
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.input = new Input();
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        
        this.lastTime = 0;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        requestAnimationFrame((time) => this.loop(time));
    }

    loop(timeStamp) {
        // Cálculo de deltaTime para manter velocidade constante em qualquer tela
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((time) => this.loop(time));
    }

    update(dt) {
        this.player.update(this.input);
    }

    draw() {
        // Limpa a tela
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Desenha entidades
        this.player.draw(this.ctx);
    }
}