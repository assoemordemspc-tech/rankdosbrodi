export class Projectile {
    constructor(x, y, angle, effect = null) {
        this.x = x;
        this.y = y;
        this.size = 6;
        this.angle = angle;

        this.speed = 10;
        this.damage = 1.5;

        this.pierce = 2;

        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;

        this.lifeTime = 120;

        // 🔥 EFFECT LAYER
        this.effect = effect; // ex: 'burn'
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.lifeTime--;
    }

    isDead() {
        return this.lifeTime <= 0 || this.pierce <= 0;
    }

    draw(ctx) {
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffff00';
    }
}
