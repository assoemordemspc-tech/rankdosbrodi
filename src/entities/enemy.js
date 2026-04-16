export class Enemy {
    constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.type = type;

        const configs = {
            normal: { hp: 2, speed: 1, size: 15, color: '#f00' },
            fast:   { hp: 1, speed: 2.5, size: 10, color: '#ff0' },
            tank:   { hp: 10, speed: 0.5, size: 25, color: '#800' }
        };

        const config = configs[type] || configs.normal;

        this.health = config.hp;
        this.velocity = config.speed;
        this.size = config.size;
        this.color = config.color;

        this.flash = 0;
    }

    // 🌊 WAVE CONFIG (mantido do seu sistema anterior)
    static waves = [
        { time: 0, enemies: ['normal'], rate: 1000 },
        { time: 60, enemies: ['normal', 'fast'], rate: 800 },
        { time: 120, enemies: ['tank'], rate: 2000, boss: true }
    ];

    applyScaling(totalTime) {
        const calculatedSpeed = 0.5 + (totalTime * 0.00002);
        this.velocity = Math.min(1.5, calculatedSpeed);

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
        ctx.fillStyle = this.flash > 0 ? '#fff' : this.color;

        ctx.fillRect(
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size
        );
    }
}
