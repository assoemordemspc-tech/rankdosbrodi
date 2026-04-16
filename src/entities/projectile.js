export class Projectile {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.size = 6;
        this.velocity = 7;
        this.damage = 1;

        this.vx = Math.cos(angle) * this.velocity;
        this.vy = Math.sin(angle) * this.velocity;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}
