export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 25;
        this.velocity = 1.5;
        this.health = 3; // Vida do inimigo
        this.flashTimer = 0; // Para o feedback visual
    }

    takeDamage(amount) {
        this.health -= amount;
        this.flashTimer = 10; // Fica branco por 10 frames
    }

    update(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.x += (dx / distance) * this.velocity;
            this.y += (dy / distance) * this.velocity;
        }

        if (this.flashTimer > 0) this.flashTimer--;
    }

    draw(ctx) {
        // Se estiver sob dano, desenha branco, senão vermelho
        ctx.fillStyle = this.flashTimer > 0 ? '#fff' : '#ff0000';
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
}
