export class Projectile {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.velocity = 7;
        
        // Calcula a direção para o alvo
        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.vx = (dx / dist) * this.velocity;
        this.vy = (dy / dist) * this.velocity;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        ctx.fillStyle = '#ffff00'; // Amarelo (estilo faísca/sympathy)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
