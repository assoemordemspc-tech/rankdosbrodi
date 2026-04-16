import { Enemy } from '../entities/enemy.js';

export class SpawnSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.enemies = [];
        this.timer = 0;
        this.spawnTimer = 0;
        this.maxEnemies = 5;
    }

    update(dt, player) {
        this.timer += dt;
        this.spawnTimer += dt;

        // --- EIXO 1: QUANTIDADE ---
        this.maxEnemies = 5 + Math.floor(this.timer / 4000);

        // --- EIXO 2: FREQUÊNCIA DE SPAWN ---
        const currentSpawnInterval = Math.max(400, 2000 - (this.timer * 0.05));

        if (this.spawnTimer >= currentSpawnInterval && this.enemies.length < this.maxEnemies) {
            this.spawn();
            this.spawnTimer = 0;
        }

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

        // 🔥 Scaling por tempo
        if (newEnemy.applyScaling) {
            newEnemy.applyScaling(this.timer);
        }

        this.enemies.push(newEnemy);
    }

    draw(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
    }
}
