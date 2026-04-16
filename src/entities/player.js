export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;

        // 🎮 Movimento balanceado
        this.velocity = 2.5;

        // ⚔️ Dano base
        this.attackDamage = 1;
        
        // ❤️ Vida
        this.maxHealth = 100;
        this.health = 100;
        this.iFrames = 0;
    }

    takeDamage(amount) {
        if (this.iFrames > 0) return;
        
        this.health -= amount;
        this.iFrames = 30;

        console.log(`Vida do Player: ${this.health}`);
        
        if (this.health <= 0) {
            this.health = 0;
        }
    }

    update(input) {
        this.x += input.axes.x * this.velocity;
        this.y += input.axes.y * this.velocity;

        // 🔒 Limite da tela
        this.x = Math.max(this.size / 2, Math.min(window.innerWidth - this.size / 2, this.x));
        this.y = Math.max(this.size / 2, Math.min(window.innerHeight - this.size / 2, this.y));

        // iFrames
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
