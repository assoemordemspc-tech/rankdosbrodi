import { Enemy } from '../entities/enemy.js';

export class SpawnSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.enemies = [];
        this.spawnTimer = 0;
        this.timer = 0; // Tempo total de jogo em ms
    }

    spawn() {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        const padding = 50;

        // Define o spawn fora da visão do jogador
        if (side === 0) { x = Math.random() * this.canvas.width; y = -padding; }
        else if (side === 1) { x = this.canvas.width + padding; y = Math.random() * this.canvas.height; }
        else if (side === 2) { x = Math.random() * this.canvas.width; y = this.canvas.height + padding; }
        else { x = -padding; y = Math.random() * this.canvas.height; }

        const enemy = new Enemy(x, y);

        // --- LÓGICA DE DIFICULDADE EQUILIBRADA ---
        
        // A cada 30 segundos (30000ms), o nível de dificuldade sobe
        const difficultyLevel = Math.floor(this.timer / 30000);

        // HP: Começa com 1. Sobe +1 a cada nível, mas trava no 10.
        // Isso garante que mesmo no "late game" eles morram com alguns tiros.
        enemy.health = 1 + Math.min(difficultyLevel, 9);

        // Velocidade: Aumenta levemente, mas nunca passa de 2.5
        enemy.velocity = 1 + Math.min(difficultyLevel * 0.2, 1.5);

        this.enemies.push(enemy);
    }

    update(dt, player) {
        this.timer += dt;
        this.spawnTimer += dt;

        // --- CONTROLE DE POPULAÇÃO ---
        
        // Intervalo de spawn: começa em 1.5s e diminui até 0.5s conforme o tempo passa
        const spawnInterval = Math.max(1500 - (this.timer / 1000) * 10, 500);

        // Limite de inimigos: No início 10, aumenta até 40 conforme o jogo progride
        const maxEnemies = 10 + Math.min(Math.floor(this.timer / 20000) * 5, 30);

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
