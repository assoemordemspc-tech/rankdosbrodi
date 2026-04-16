export class Projectile {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.size = 6;
        this.angle = angle; // Guardamos o ângulo caso precise para efeitos visuais

        this.speed = 10;
        this.damage = 1.5; 

        // 🔥 NOVO: Pierce (Penetração)
        // O tiro agora atravessa 1 inimigo e desaparece ao atingir o 2º
        this.pierce = 2; 

        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;

        this.lifeTime = 120; // frames (~2 segundos)
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.lifeTime--;
    }

    // O projétil morre se o tempo acabar OU se a penetração chegar a 0
    isDead() {
        return this.lifeTime <= 0 || this.pierce <= 0;
    }

    draw(ctx) {
        ctx.fillStyle = '#ffff00'; // Amarelo brilhante
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Opcional: Adicionar um brilho simples para parecer um tiro de energia
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffff00';
    }
}
