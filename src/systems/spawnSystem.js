import { Enemy } from '/src/entities/enemy.js';

export class SpawnSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnInterval = 1500; // Nasce um inimigo a cada 1.5 segundos
    }

    spawn() {
        let x, y;
        const margin = 50; // Distância fora da tela
        const side = Math.floor(Math.random() * 4); // 0: Cima, 1: Direita, 2: Baixo, 3: Esquerda

        switch (side) {
            case 0: // Cima
                x = Math.random() * this.canvas.width;
                y = -margin;
                break;
            case 1: // Direita
                x = this.canvas.width + margin;
                y = Math.random() * this.canvas.height;
                break;
            case 2: // Baixo
                x = Math.random() * this.canvas.width;
                y = this.canvas.height + margin;
                break;
            case 3: // Esquerda
                x = -margin;
                y = Math.random() * this.canvas.height;
                break;
        }

        this.enemies.push(new Enemy(x, y));
    }

    update(dt, player) {
        this.spawnTimer += dt;

        if (this.spawnTimer >= this.spawnInterval) {
            this.spawn();
            this.spawnTimer = 0;
        }

        // Atualiza cada inimigo passando a referência do player
        this.enemies.forEach(enemy => enemy.update(player));
    }

    draw(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
    }
}
