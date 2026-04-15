export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.velocity = 5; // Velocidade base
    }

    update(input) {
        // Atualiza posição baseada nos eixos do input
        this.x += input.axes.x * this.velocity;
        this.y += input.axes.y * this.velocity;
    }

    draw(ctx) {
        ctx.fillStyle = '#00ff00'; // Quadrado Verde para o Player
        ctx.fillRect(
            this.x - this.size / 2, 
            this.y - this.size / 2, 
            this.size, 
            this.size
        );
    }
}