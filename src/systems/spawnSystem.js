import { Enemy } from '../entities/enemy.js';

export class SpawnSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.enemies = [];
        this.spawnTimer = 0;
        this.timer = 0; // Tempo total em ms
    }

    spawn() {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        const padding = 50;

        if (side === 0) { x = Math.random() * this.canvas.width; y = -padding; }
        else if (side === 1) { x = this.canvas.width + padding; y = Math.random() * this.canvas.height; }
        else if (side === 2) { x = Math.random() * this.canvas.width; y = this.canvas.height + padding; }
        else { x = -padding; y = Math.random() * this.canvas.height; }

        const enemy = new Enemy(x, y);

        // --- NOVA LÓGICA DE DIFICULDADE SUAVE ---
        const secondsPassed = this.timer / 1000;

        // HP: 1 tiro mata nos primeiros 45 segundos.
        // Depois disso, ganha +1 de HP a cada 45 segundos.
        // O teto agora é 6, tornando-os muito mais fáceis de matar no late game.
        let calculatedHP = 1;
        if (secondsPassed > 45) {
            calculatedHP += Math.floor((secondsPassed - 45) / 45);
        }
        enemy.health = Math.min(calculatedHP, 6);

        // Velocidade: Cresce bem mais devagar para não te atropelarem.
        enemy.velocity = 0.8 + Math.min(secondsPassed / 120, 1.2); 

        this.enemies.push(enemy);
    }

    update(dt, player) {
        this.timer += dt;
        this.spawnTimer += dt;

        // Intervalo de Spawn mais generoso:
        // Começa com 2 segundos entre cada monstro e diminui devagar.
        const spawnInterval = Math.max(2000 - (this.timer / 1000) * 8, 700);

        // Limite de inimigos na tela:
        // Começa com no máximo 8 e sobe 4 a cada 30 segundos, até o máximo de 30.
        const maxEnemies = 8 + Math.min(Math.floor(this.timer / 30000) * 4, 22);

        if (this.spawnTimer >= spawnInterval && this.enemies.length < maxEnemies) {
            this.spawn();
            this.spawnTimer = 0;
        }

        for (let enemy of this.enemies) {
            enemy.update(player, dt);
        }
    }

    draw(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
    }
}
