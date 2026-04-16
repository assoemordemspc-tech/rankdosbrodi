import { Player } from '../entities/player.js';
import { Input } from './input.js'; 
import { SpawnSystem } from '../systems/spawnSystem.js';
import { CollisionSystem } from '../systems/collisionSystem.js'; // Importando o novo sistema
import { Projectile } from '../entities/projectile.js';
import { XPSystem } from '../systems/xpSystem.js';
import { LevelSystem } from '../mechanics/levelSystem.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Propriedades de estado do jogo
        this.projectiles = [];
        this.attackTimer = 0;
        this.attackInterval = 800; 
        this.lastTime = 0;
        this.xpSystem = new XPSystem();
        this.levelSystem = new LevelSystem();

        this.init();
    }

    init() {
        this.setupCanvas();
        window.addEventListener('resize', () => this.setupCanvas());

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
        // 1. Atualizar Entidades
        this.player.update(this.input);
        this.spawnSystem.update(dt, this.player);
        
        // 2. Ataque Automático
        this.handleAutoAttack(dt);

        // 3. Atualizar Projéteis (movimento e remoção de tela)
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update();

            if (p.x < 0 || p.x > this.canvas.width || p.y < 0 || p.y > this.canvas.height) {
                this.projectiles.splice(i, 1);
            }
        }

        // 4. PROCESSAR COLISÕES (Usando o sistema especializado)
        CollisionSystem.checkCircleCollision(
    this.projectiles, 
    this.spawnSystem.enemies, 
    (proj, enemy, pIdx, eIdx) => {
        enemy.takeDamage(1);
        
        // Remove o projétil
        this.projectiles.splice(pIdx, 1);
        
        if (enemy.health <= 0) {
            this.spawnSystem.enemies.splice(eIdx, 1);
                    // Futuro: Aqui chamaremos o xpSystem para dropar XP
                }
            }
        );
    }

    handleAutoAttack(dt) {
        this.attackTimer += dt;
        if (this.attackTimer >= this.attackInterval) {
            this.shootClosest();
            this.attackTimer = 0;
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
