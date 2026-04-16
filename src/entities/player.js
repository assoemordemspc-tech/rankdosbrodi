import { MagicWand } from '../mechanics/weapons/magicWand.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;

        this.velocity = 2.5;

        // ⚔️ Sistema modular de armas
        this.weapons = [new MagicWand()];

        // 🧲 Sistema de coleta
        this.magnetRadius = 150;

        // ⚔️ Legacy combat (compatibilidade)
        this.attackDamage = 1;
        this.attackSpeed = 1000;
        this.lastDirection = { x: 1, y: 0 };

        // ❤️ Vida
        this.maxHealth = 100;
        this.health = 100;
        this.iFrames = 0;
    }

    takeDamage(amount) {
        if (this.iFrames > 0) return;

        this.health -= amount;
        this.iFrames = 30;

        if (this.health < 0) this.health = 0;
    }

    update(input, dt, enemies = [], projectiles = []) {
        // ======================
        // 🎮 MOVIMENTO
        // ======================
        this.x += input.axes.x * this.velocity;
        this.y += input.axes.y * this.velocity;

        // limites da tela
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.x = Math.max(this.size / 2, Math.min(w - this.size / 2, this.x));
        this.y = Math.max(this.size / 2, Math.min(h - this.size / 2, this.y));

        // 📌 última direção válida
        if (input.axes.x !== 0 || input.axes.y !== 0) {
            this.lastDirection = {
                x: input.axes.x,
                y: input.axes.y
            };
        }

        // ======================
        // ⚔️ ARMAS (SISTEMA MODULAR)
        // ======================
        for (let i = 0; i < this.weapons.length; i++) {
            const weapon = this.weapons[i];

            // 🔥 CORREÇÃO PRINCIPAL:
            weapon.update(dt, this, enemies, projectiles);
        }

        // ======================
        // ⏱️ iFrames
        // ======================
        if (this.iFrames > 0) this.iFrames--;
    }

    draw(ctx) {
        // piscada de invencibilidade
        if (this.iFrames > 0 && Math.floor(Date.now() / 100) % 2 === 0) return;

        ctx.fillStyle = '#00ff00';

        ctx.fillRect(
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size
        );
    }
}
