import { Player } from '../entities/player.js';
import { Input } from './input.js';
import { SpawnSystem } from '../systems/spawnSystem.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.input = new Input();
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        
        // Inicializa o sistema de spawn
        this.spawnSystem = new SpawnSystem(this.canvas);
        
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
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((time) => this.loop(time));
    }

    update(dt) {
        this.player.update(this.input);
        
        // Atualiza o sistema de spawn passando deltaTime e o player
        this.spawnSystem.update(dt, this.player);
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Renderiza o player
        this.player.draw(this.ctx);
        
        // Renderiza os inimigos
        this.spawnSystem.draw(this.ctx);
    }
}
