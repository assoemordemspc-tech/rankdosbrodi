import { Player } from '../entities/player.js';
import { Input } from './input.js'; 
import { SpawnSystem } from '../systems/spawnSystem.js';
import { Projectile } from '../entities/projectile.js'; // Novo!

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.input = new Input();
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        this.spawnSystem = new SpawnSystem(this.canvas);
        
        this.projectiles = [];
        this.attackTimer = 0;
        this.attackInterval = 1000; // Ataca a cada 1 segundo
        this.lastTime = 0;
    }

    // ... (mantenha o resize e start)

    update(dt) {
        this.player.update(this.input);
        this.spawnSystem.update(dt, this.player);

        // --- LÓGICA DE ATAQUE AUTOMÁTICO ---
        this.attackTimer += dt;
        if (this.attackTimer >= this.attackInterval) {
            this.shootClosest();
            this.attackTimer = 0;
        }

        // Atualizar projéteis e remover os que saem da tela
        this.projectiles.forEach((p, pIdx) => {
            p.update();
            
            // Colisão Projétil vs Inimigos
            this.spawnSystem.enemies.forEach((e, eIdx) => {
                const dist = Math.hypot(p.x - e.x, p.y - e.y);
                if (dist < (p.size + e.size / 2)) {
                    e.takeDamage(1);
                    this.projectiles.splice(pIdx, 1);
                    if (e.health <= 0) this.spawnSystem.enemies.splice(eIdx, 1);
                }
            });
        });
    }

    shootClosest() {
        if (this.spawnSystem.enemies.length === 0) return;

        // Encontra o inimigo mais próximo
        const closest = this.spawnSystem.enemies.reduce((prev, curr) => {
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
    
    // ... loop()
}
