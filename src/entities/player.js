export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.velocity = 5;
        
        // Atributos de Vida
        this.maxHealth = 100;
        this.health = 100;
        this.iFrames = 0; // Frames de invulnerabilidade após tomar dano
    }

    takeDamage(amount) {
        if (this.iFrames > 0) return; // Proteção ativa
        
        this.health -= amount;
        this.iFrames = 30; // Fica invulnerável por meio segundo (aprox. 30 frames)
        console.log(`Vida do Player: ${this.health}`);
        
        if (this.health <= 0) {
            this.health = 0;
            // O Game.js cuidará do Game Over
        }
    }

    update(input) {
        this.x += input.axes.x * this.velocity;
        this.y += input.axes.y * this.velocity;

        // Reduz invulnerabilidade com o tempo
        if (this.iFrames > 0) this.iFrames--;
    }

    draw(ctx) {
        // Se estiver invulnerável, pisca o player (feedback visual)
        if (this.iFrames > 0 && Math.floor(Date.now() / 100) % 2 === 0) return;

        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
}
