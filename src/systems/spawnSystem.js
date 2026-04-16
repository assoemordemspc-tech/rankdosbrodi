import { Enemy } from '../entities/enemy.js';

export class SpawnSystem {
    constructor(canvas) {
        this.canvas = canvas;

        this.enemies = [];

        this.timer = 0;
        this.spawnTimer = 0;

        // 🔥 Estado inicial equilibrado
        this.baseMaxEnemies = 5;
        this.baseSpawnInterval = 2000;
    }

    update(dt, player) {
    console.log('spawn funcionando'); // 👈 ADICIONA AQUI

    this.timer += dt;
    this.spawnTimer += dt;

        // =========================
        // 📈 PROGRESSÃO CONTROLADA
        // =========================

        // 🧠 Quantidade cresce devagar
        const maxEnemies =
            this.baseMaxEnemies +
            Math.floor(this.timer / 8000); // +1 a cada 8s

        // 🧠 Spawn fica mais rápido, mas com limite
        const spawnInterval = Math.max(
            600, // nunca fica insano
            this.baseSpawnInterval - (this.timer * 0.03)
        );

        // =========================
        // 👾 SPAWN
        // =========================

        if (this.spawnTimer >= spawnInterval && this.enemies.length < maxEnemies) {
            this.spawn();
            this.spawnTimer = 0;
        }

        // =========================
        // 🧠 UPDATE DOS INIMIGOS
        // =========================

        for (let enemy of this.enemies) {
            enemy.update(player, this.timer);
        }
    }

    spawn() {
        spawn() {
    console.log('SPAWNANDO INIMIGO'); // 👈 ESSENCIAL

    let x, y;
        let x, y;
        const margin = 50;

        // 🔥 Spawn fora da tela (4 lados)
        const side = Math.floor(Math.random() * 4);

        switch (side) {
            case 0: // topo
                x = Math.random() * this.canvas.width;
                y = -margin;
                break;

            case 1: // direita
                x = this.canvas.width + margin;
                y = Math.random() * this.canvas.height;
                break;

            case 2: // baixo
                x = Math.random() * this.canvas.width;
                y = this.canvas.height + margin;
                break;

            case 3: // esquerda
                x = -margin;
                y = Math.random() * this.canvas.height;
                break;
        }

        const enemy = new Enemy(x, y);

        // =========================
        // 🔥 SCALING SUAVE (ESSENCIAL)
        // =========================

        const timeFactor = this.timer / 10000; // escala bem lento

        // ❤️ Vida cresce devagar
        enemy.health = 2 + timeFactor * 1.5;

        // 🏃 Velocidade cresce pouco (evita injustiça)
        enemy.speed = 0.6 + Math.min(0.5, timeFactor * 0.2);

        // 💥 Dano controlado
        enemy.damage = 5 + Math.min(10, timeFactor * 2);

        this.enemies.push(enemy);
    }

    draw(ctx) {
        for (let enemy of this.enemies) {
            enemy.draw(ctx);
        }
    }
}
