export class Projectile {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.size = 6;

        this.speed = 7;
        this.damage = 1;

        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;

        // 🔥 NOVO
        this.lifeTime = 120; // frames (~2 segundos)
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.lifeTime--;
    }

    isDead() {
        return this.lifeTime <= 0;
    }

    draw(ctx) {
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}
