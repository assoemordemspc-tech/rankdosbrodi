import { Player } from '../entities/player.js';
import { Input } from './input.js'; 
import { SpawnSystem } from '../systems/spawnSystem.js';
import { Projectile } from '../entities/projectile.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 1. Configurar propriedades básicas
        this.projectiles = [];
        this.attackTimer = 0;
        this.attackInterval = 800; // Um pouco mais rápido para testar
        this.lastTime = 0;

        // 2. Ajustar tamanho (usando arrow function para manter o 'this')
        this.setupCanvas();
        window.addEventListener('resize', () => this.setupCanvas());

        // 3. Inicializar entidades
        this.input = new Input();
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        this.spawnSystem = new SpawnSystem(this.canvas);
    }

    setupCanvas() {
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
        this.spawnSystem.update(dt, this.player);

        // Ataque Automático
        this.attackTimer += dt;
        if (this.attackTimer >= this.attackInterval) {
            this.shootClosest();
            this.attackTimer = 0;
        }

        // Atualizar Projéteis e Colisões
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update();

            // Remove se sair da tela
            if (p.x < 0 || p.x > this.canvas.width || p.y < 0 || p.y > this.canvas.height) {
                this.projectiles.splice(i, 1);
                continue;
            }

            // Colisão com Inimigos
            const enemies = this.spawnSystem.enemies;
            for (let j = enemies.length - 1; j >= 0; j--) {
                const e = enemies[j];
                const dist = Math.hypot(p.x - e.x, p.y - e.y);

                if (dist < (p.size + e.size / 2)) {
                    e.takeDamage(1);
                    this.projectiles.splice(i, 1);
                    if (e.health <= 0) enemies.splice(j, 1);
                    break;
                }
            }
        }
    }

    shootClosest() {
        const enemies = this.spawnSystem.enemies;
        if (enemies.length === 0) return;

        const closest = enemies.reduce((prev, curr) => {
            const distPrev = Math.hypot(this.player.x - prev.x, this.player.y - prev.y);
            const distCurr = Math.hypot(this.player.x - curr.x, this.player.y - curr.y);
            return distCurr < distPrev ? curr : prev;
        });

        this.projectiles.push(new Projectile(this.player.x, this.player.y, closest.x, closest.y));
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.player.draw(this.ctx);
        this.spawnSystem.draw(this.ctx);
        this.projectiles.forEach(p => p.draw(this.ctx));
    }
}
