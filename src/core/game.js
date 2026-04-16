import { Player } from '../entities/player.js';
import { Input } from './input.js'; 
import { SpawnSystem } from '../systems/spawnSystem.js';
import { CollisionSystem } from '../systems/collisionSystem.js';
import { Projectile } from '../entities/projectile.js';
import { XPSystem } from '../systems/xpSystem.js';
import { LevelSystem } from '../mechanics/levelSystem.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
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
        // 🔒 TRAVA DURANTE UPGRADE
        if (this.levelSystem.isSelectingUpgrade) {
            this.handleUpgradeInput();
            return; 
        }

        this.player.update(this.input);
        this.spawnSystem.update(dt, this.player);

        this.handleAutoAttack(dt);

        this.xpSystem.update(this.player, (val) => this.levelSystem.addXP(val));

        // Projéteis (loop seguro)
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update();

            if (p.x < 0 || p.x > this.canvas.width || p.y < 0 || p.y > this.canvas.height) {
                this.projectiles.splice(i, 1);
            }
        }

        // 🟥 COLISÃO INIMIGO → PLAYER
        CollisionSystem.checkCircleCollision(
            [this.player],
            this.spawnSystem.enemies,
            (player, enemy) => {
                player.takeDamage(10);

                if (player.health <= 0) {
                    alert("Game Over! A horda venceu.");
                    location.reload();
                }
            }
        );

        // 🟢 COLISÃO PROJÉTIL → INIMIGO
        CollisionSystem.checkCircleCollision(
            this.projectiles, 
            this.spawnSystem.enemies, 
            (proj, enemy, pIdx, eIdx) => {
                enemy.takeDamage(1);

                this.projectiles.splice(pIdx, 1);

                if (enemy.health <= 0) {
                    this.xpSystem.spawn(enemy.x, enemy.y); 
                    this.spawnSystem.enemies.splice(eIdx, 1);
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

    handleUpgradeInput() {
        if (this.input.lastKey === '1') this.levelSystem.applyUpgrade(0, this.player, this);
        if (this.input.lastKey === '2') this.levelSystem.applyUpgrade(1, this.player, this);
        if (this.input.lastKey === '3') this.levelSystem.applyUpgrade(2, this.player, this);

        this.input.lastKey = null;
    }

    draw() {
        // Fundo
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Entidades
        this.player.draw(this.ctx);
        this.spawnSystem.draw(this.ctx);
        this.projectiles.forEach(p => p.draw(this.ctx));

        // XP
        this.xpSystem.draw(this.ctx);

        // Tela de Level Up
        if (this.levelSystem.isSelectingUpgrade) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px Arial';
            this.ctx.fillText(
                "LEVEL UP! Escolha 1, 2 ou 3",
                this.canvas.width / 2 - 140,
                this.canvas.height / 2
            );
        }

        // ❤️ Barra de vida
        const barWidth = 200;

        this.ctx.fillStyle = "#333";
        this.ctx.fillRect(20, 20, barWidth, 10);

        this.ctx.fillStyle = "#ff0000";
        this.ctx.fillRect(
            20,
            20,
            (this.player.health / this.player.maxHealth) * barWidth,
            10
        );
    }
}
