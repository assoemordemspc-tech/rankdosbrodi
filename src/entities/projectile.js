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
        this.effect = effect;

        // ✨ NOVO: rastro visual
        this.history = [];
    }

    update() {
        // ✨ salva histórico (trail)
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 5) this.history.shift();

        // movimento
        this.x += this.vx;
        this.y += this.vy;

        this.lifeTime--;
    }

    isDead() {
        return this.lifeTime <= 0 || this.pierce <= 0;
    }

    draw(ctx) {
        // ✨ TRAIL (rastro suave)
        this.history.forEach((pos, index) => {
            const opacity = index / this.history.length;

            ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.5})`;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, (this.size / 2) * opacity, 0, Math.PI * 2);
            ctx.fill();
        });

        // 💥 cabeça do projétil
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    }
}
