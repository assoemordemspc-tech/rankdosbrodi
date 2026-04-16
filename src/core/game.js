import { Player } from '../entities/player.js';
import { Input } from './input.js'; 
import { SpawnSystem } from '../systems/spawnSystem.js';
import { CollisionSystem } from '../systems/collisionSystem.js';
import { Projectile } from '../entities/projectile.js';
import { XPSystem } from '../systems/xpSystem.js';
import { LevelSystem } from '../mechanics/levelSystem.js';

import { HUD } from '../ui/hud.js';
import { UpgradeMenu } from '../ui/upgradeMenu.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.projectiles = [];
        this.attackTimer = 0;
        this.shootingAngles = [0]; // direção base

        this.state = 'PLAYING';

        this.xpSystem = new XPSystem();
        this.levelSystem = new LevelSystem();

        window.addEventListener('mousedown', (e) => this.handleClick(e));
        window.addEventListener('touchstart', (e) => this.handleClick(e.touches[0]));
        this.lastTime = 0;
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
    this.lastTime = performance.now();
    requestAnimationFrame((time) => this.loop(time));
    }

    loop(timeStamp) {
       const deltaTime = timeStamp - this.lastTime || 16;
    this.lastTime = timeStamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((time) => this.loop(time));
    }

    update(dt) {
        if (this.state === 'GAME_OVER') return;

        if (this.levelSystem.isSelectingUpgrade) {
            this.state = 'LEVEL_UP';
            return;
        }

        this.state = 'PLAYING';

        this.player.update(this.input);
        this.spawnSystem.update(dt, this.player);

        this.handleAutoAttack(dt);

        this.xpSystem.update(this.player, (val) => this.levelSystem.addXP(val));

        // Projéteis
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
                    this.state = 'GAME_OVER';
                }
            }
        );

        // 🟢 COLISÃO PROJÉTIL → INIMIGO (DANO DINÂMICO)
        CollisionSystem.checkCircleCollision(
            this.projectiles, 
            this.spawnSystem.enemies, 
            (proj, enemy, pIdx, eIdx) => {
                enemy.takeDamage(proj.damage || 1);

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

        const p = new Projectile(
            this.player.x,
            this.player.y,
            closest.x,
            closest.y
        );

        // 💥 DANO DINÂMICO
        p.damage = this.player.attackDamage;

        this.projectiles.push(p);
    }

    // 🔫 TIRO FIXO
    shootFixed() {
        const p = new Projectile(
            this.player.x,
            this.player.y,
            this.player.x + 100,
            this.player.y
        );

        p.damage = this.player.attackDamage;

        this.projectiles.push(p);
    }

    handleClick(e) {
        if (this.state === 'LEVEL_UP') {
            const index = UpgradeMenu.getClickedOption(
                e.clientX,
                e.clientY,
                this.canvas
            );

            if (index !== null) {
                this.levelSystem.applyUpgrade(index, this.player, this);
                this.state = 'PLAYING';
            }
        }

        if (this.state === 'GAME_OVER') {
            location.reload();
        }
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.player.draw(this.ctx);
        this.spawnSystem.draw(this.ctx);
        this.projectiles.forEach(p => p.draw(this.ctx));
        this.xpSystem.draw(this.ctx);

        HUD.draw(this.ctx, this.player, this.levelSystem, this.canvas);

        if (this.state === 'LEVEL_UP') {
            UpgradeMenu.draw(
                this.ctx,
                this.canvas,
                this.levelSystem.availableUpgrades
            );
        }

        if (this.state === 'GAME_OVER') {
            this.drawGameOver();
        }
    }

    drawGameOver() {
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.ctx.font = '40px Arial';
        this.ctx.fillText('VOCÊ MORREU', this.canvas.width / 2, this.canvas.height / 2);

        this.ctx.font = '20px Arial';
        this.ctx.fillText(
            'Clique para tentar novamente',
            this.canvas.width / 2,
            this.canvas.height / 2 + 50
        );
    }
}
