export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;

        this.velocity = 2.5;

        // ⚔️ Combate
        this.attackDamage = 1;
        this.attackSpeed = 1000; // ms
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

        if (this.health <= 0) {
            this.health = 0;
        }
    }

    update(input) {
        this.x += input.axes.x * this.velocity;
        this.y += input.axes.y * this.velocity;

        // 🔒 Limite tela
        this.x = Math.max(this.size / 2, Math.min(window.innerWidth - this.size / 2, this.x));
        this.y = Math.max(this.size / 2, Math.min(window.innerHeight - this.size / 2, this.y));

        // 📌 Última direção
        if (input.axes.x !== 0 || input.axes.y !== 0) {
            this.lastDirection = { x: input.axes.x, y: input.axes.y };
        }

        if (this.iFrames > 0) this.iFrames--;
    }

    draw(ctx) {
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
