export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 25;
        this.health = 2;
        this.velocity = 0.5;
        this.flash = 0;
    }

    applyScaling(totalTime) {
        // --- EIXO 3: VELOCIDADE COM CAP ---
        const calculatedSpeed = 0.5 + (totalTime * 0.00002);
        this.velocity = Math.min(1.5, calculatedSpeed);

        // --- EIXO 4: VIDA EM DEGRAUS ---
        if (totalTime < 15000) {
            this.health = 2;
        } else if (totalTime < 30000) {
            this.health = 3;
        } else if (totalTime < 60000) {
            this.health = 4;
        } else {
            const extraMinutes = Math.floor((totalTime - 60000) / 60000);
            this.health = 4 + extraMinutes;
        }
    }

    takeDamage(n) {
        this.health -= n;
        this.flash = 5;
    }

    update(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 0) {
            this.x += (dx / dist) * this.velocity;
            this.y += (dy / dist) * this.velocity;
        }

        if (this.flash > 0) this.flash--;
    }

    draw(ctx) {
        ctx.fillStyle = this.flash > 0 ? '#fff' : '#ff0000';
        ctx.fillRect(
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size
        );
    }
}
