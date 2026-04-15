export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 25;
        this.velocity = 1.5;
        this.health = 2; // Morre com 2 tiros
        this.flash = 0;
    }
    takeDamage(n) {
        this.health -= n;
        this.flash = 5; // Pisca por 5 frames
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
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
}
