export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 25;
        this.velocity = 1.5; // Um pouco mais lento que o player
    }

    update(player) {
        // Calcula a distância entre o inimigo e o player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Se a distância for maior que zero, normaliza o vetor e move
        if (distance > 0) {
            this.x += (dx / distance) * this.velocity;
            this.y += (dy / distance) * this.velocity;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#ff0000'; // Quadrado Vermelho para os Inimigos
        ctx.fillRect(
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size
        );
    }
}