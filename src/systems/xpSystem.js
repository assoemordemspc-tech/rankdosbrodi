export class XPOrb {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.size = 6;
    }

    draw(ctx) {
        ctx.fillStyle = '#00ffff'; // Ciano para XP
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class XPSystem {
    constructor() {
        this.orbs = [];
    }

    spawn(x, y, value = 2) {
        this.orbs.push(new XPOrb(x, y, value));
    }

    update(player, onCollect) {
        for (let i = this.orbs.length - 1; i >= 0; i--) {
            const orb = this.orbs[i];
            const dist = Math.hypot(player.x - orb.x, player.y - orb.y);
            
            // Raio de coleta (pode ser aumentado com upgrades no futuro)
            if (dist < player.size) {
                onCollect(orb.value);
                this.orbs.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.orbs.forEach(orb => orb.draw(ctx));
    }
}
