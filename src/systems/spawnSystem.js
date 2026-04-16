console.log('ARQUIVO NOVO CARREGADO');
import { Enemy } from '../entities/enemy.js';

export class SpawnSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.enemies = [];
        this.timer = 0;
        this.spawnTimer = 0;

        this.baseMaxEnemies = 5;
        this.baseSpawnInterval = 2000;
    }

    update(dt, player) {
        console.log('spawn funcionando');

        this.timer += dt;
        this.spawnTimer += dt;

        const maxEnemies = this.baseMaxEnemies + Math.floor(this.timer / 8000);

        const spawnInterval = Math.max(
            600,
            this.baseSpawnInterval - (this.timer * 0.03)
        );

        if (this.spawnTimer >= spawnInterval && this.enemies.length < maxEnemies) {
            this.spawn();
            this.spawnTimer = 0;
        }

        for (let enemy of this.enemies) {
            enemy.update(player, this.timer);
        }
    }

    spawn() {
        console.log('SPAWNANDO INIMIGO');

        let x, y;
        const margin = 50;

        const side = Math.floor(Math.random() * 4);

        if (side === 0) {
            x = Math.random() * this.canvas.width;
            y = -margin;
        } else if (side === 1) {
            x = this.canvas.width + margin;
            y = Math.random() * this.canvas.height;
        } else if (side === 2) {
            x = Math.random() * this.canvas.width;
            y = this.canvas.height + margin;
        } else {
            x = -margin;
            y = Math.random() * this.canvas.height;
        }

        const enemy = new Enemy(x, y);

        const timeFactor = this.timer / 10000;

        enemy.health = 2 + timeFactor * 1.5;
        enemy.speed = 0.6 + Math.min(0.5, timeFactor * 0.2);
        enemy.damage = 5 + Math.min(10, timeFactor * 2);

        this.enemies.push(enemy);
    }

    draw(ctx) {
        for (let enemy of this.enemies) {
            enemy.draw(ctx);
        }
    }
}
