import { Player } from '../entities/player.js';
import { Input } from './input.js'; 
import { SpawnSystem } from '../systems/spawnSystem.js';
import { Projectile } from '../entities/projectile.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Inicializa as propriedades ANTES de chamar métodos
        this.projectiles = [];
        this.attackTimer = 0;
        this.attackInterval = 1000;
        this.lastTime = 0;

        // Agora sim chamamos o resize
        this.handleResize(); 
        window.addEventListener('resize', () => this.handleResize());

        this.input = new Input();
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        this.spawnSystem = new SpawnSystem(this.canvas);
    }

    // Renomeei para handleResize para evitar conflitos de nomes reservados
    handleResize() {
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

        // Sistema de Ataque Automático
        this.attackTimer += dt;
        if (this.attackTimer >= this.attackInterval) {
            this.shootClosest();
            this.attackTimer = 0;
        }

        // Atualizar Projéteis e Colisões
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update();

            // Remover se sair da tela (Otimização)
            if (p.x < 0 || p.x > this.canvas.width || p.y < 0 || p.y > this.canvas.height) {
                this.projectiles.splice(i, 1);
                continue;
            }

            // Colisão com Inimigos
            for (let j = this.spawnSystem.enemies.length - 1; j >= 0; j--) {
                const e = this.spawnSystem.enemies[j];
                const dist = Math.hypot(p.x - e.x, p.y - e.y);

                if (dist < (p.size + e.size / 2)) {
                    e.takeDamage(1); // Inimigo toma dano e pisca
                    this.projectiles.splice(i, 1); // Projétil some
                    
                    if (e.health <= 0) {
                        this.spawnSystem.enemies.splice(j, 1); // Inimigo morre
                    }
                    break; 
                }
            }
        }
    }

    shootClosest() {
        if (this.spawnSystem.enemies.length === 0) return;

        const closest = this.spawnSystem.enemies.reduce((prev, curr) => {
            const distPrev = Math.hypot(this.player.x - prev.x, this.player.y - prev.y);
            const distCurr = Math.hypot(this.player.x - curr.x, this.player.y - curr.y);
            return distCurr < distPrev ? curr : prev;
        });

        this.projectiles.push(new Projectile(this.player.x, this.player.y, closest.x, closest.y));
    }

    draw() {
        // Limpa a tela com preto
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.player.draw(this.ctx);
        this.spawnSystem.draw(this.ctx);
        this.projectiles.forEach(p => p.draw(this.ctx));
    }
}
