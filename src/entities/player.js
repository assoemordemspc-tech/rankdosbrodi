export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.velocity = 5; // Velocidade de movimento
    }

    /**
     * @param {Input} input - Recebe a instância do sistema de input
     */
    update(input) {
        // Move o player baseado nos eixos (x: -1 a 1, y: -1 a 1)
        this.x += input.axes.x * this.velocity;
        this.y += input.axes.y * this.velocity;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx - Contexto do Canvas
     */
    draw(ctx) {
        // Desenha o jogador como um quadrado verde
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(
            this.x - this.size / 2, 
            this.y - this.size / 2, 
            this.size, 
            this.size
        );
    }
}
