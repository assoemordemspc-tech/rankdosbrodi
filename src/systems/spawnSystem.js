import { Enemy } from '../entities/enemy.js';

export class SpawnSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.enemies = [];
        this.spawnTimer = 0;
        this.timer = 0;

        // 🎯 WAVE DIRECTOR (Maestro do jogo)
        this.waves = [
            {
                time: 0,
                types: ['normal'],
                rate: 1500,
                max: 10,
                intensity: 1
            },
            {
                time: 30000,
                types: ['normal', 'fast'],
                rate: 1000,
                max: 20,
                intensity: 1.1
            },
            {
                time: 60000,
                types: ['fast', 'tank'],
                rate: 1200,
                max: 25,
                intensity: 1.25
            },
            {
                time: 120000,
                types: ['tank', 'fast'],
                rate: 800,
                max: 40,
                intensity: 1.5
            }
        ];
    }

    // 🔎 pega a wave atual baseada no tempo
    getCurrentWave() {
        for (let i = this.waves.length - 1; i >= 0; i--) {
            if (this.timer >= this.waves[i].time) {
                return this.waves[i];
            }
        }
        return this.waves[0];
    }

    // 🧠 evita spam de certos tipos (ex: tank)
    validateType(type, wave) {
        if (type !== 'tank') return type;

        const tankCount = this.enemies.filter(e => e.type === 'tank').length;

        if (tankCount > wave.max * 0.25) {
            return 'fast';
        }

        return type;
    }

    // 📦 spawn de inimigo
    spawn() {
        const wave = this.getCurrentWave();

        // escolhe tipo da wave
        let type = wave.types[Math.floor(Math.random() * wave.types.length)];
        type = this.validateType(type, wave);

        // spawn nas bordas
        const side = Math.floor(Math.random() * 4);
        const padding = 50;

        let x, y;

        if (side === 0) {
            x = Math.random() * this.canvas.width;
            y = -padding;
        } else if (side === 1) {
            x = this.canvas.width + padding;
            y = Math.random() * this.canvas.height;
        } else if (side === 2) {
            x = Math.random() * this.canvas.width;
            y = this.canvas.height + padding;
        } else {
            x = -padding;
            y = Math.random() * this.canvas.height;
        }

        // cria inimigo
        const enemy = new Enemy(x, y, type);

        // 🎯 aplicação de intensidade da wave (balanceamento global)
        enemy.health *= wave.intensity;
        enemy.velocity *= (1 + (wave.intensity - 1) * 0.2);

        this.enemies.push(enemy);
    }

    // 🔄 loop principal do sistema
    update(dt, player) {
        this.timer += dt;
        this.spawnTimer += dt;

        const wave = this.getCurrentWave();

        // spawn controlado por wave
        if (
            this.spawnTimer >= wave.rate &&
            this.enemies.length < wave.max
        ) {
            this.spawn();
            this.spawnTimer = 0;
        }

        // update dos inimigos
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(player, dt);
        }
    }

    // 🎨 render
    draw(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
    }
}
