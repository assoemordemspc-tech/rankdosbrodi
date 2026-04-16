import { Enemy } from '../entities/enemy.js';

export class SpawnSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.enemies = [];
        this.timer = 0; // Tempo total da partida
        this.spawnTimer = 0;
    }

    update(dt, player) {
        this.timer += dt;
        this.spawnTimer += dt;

        // 📈 DIFICULDADE ESCALÁVEL
        const currentSpawnInterval = Math.max(300, 2000 - this.timer * 0.05);
        const maxEnemies = 5 + Math.floor(this.timer / 5000);

        if (this.spawnTimer >= currentSpawnInterval && this.enemies.length < maxEnemies) {
            this.spawn();
            this.spawnTimer = 0;
        }

        // Atualiza inimigos
        this.enemies.forEach(enemy => enemy.update(player, this.timer));
    }

    spawn() {
        let x, y;
        const margin = 50;
        const side = Math.floor(Math.random() * 4);

        switch (side) {
            case 0: x = Math.random() * this.canvas.width; y = -margin; break;
            case 1: x = this.canvas.width + margin; y = Math.random() * this.canvas.height; break;
            case 2: x = Math.random() * this.canvas.width; y = this.canvas.height + margin; break;
            case 3: x = -margin; y = Math.random() * this.canvas.height; break;
        }

        const newEnemy = new Enemy(x, y);

        // 🔥 Escala com o tempo
        if (newEnemy.applyScaling) {
            newEnemy.applyScaling(this.timer);
        }

        this.enemies.push(newEnemy);
    }

    draw(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
    }
}
