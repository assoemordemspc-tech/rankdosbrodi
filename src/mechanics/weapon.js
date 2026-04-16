export class Weapon {
    constructor(config) {
        this.name = config.name || "Arma";
        this.level = 1;
        this.cooldown = config.cooldown || 1000; // ms
        this.timer = 0;
        this.damage = config.damage || 1;
        this.pierce = config.pierce || 1;
        this.projectileSpeed = config.projectileSpeed || 10;
    }

    update(dt, player, enemies, projectiles) {
        this.timer += dt;
        if (this.timer >= this.cooldown) {
            // Só atira se houver inimigos (opcional, para performance)
            if (enemies.length > 0) {
                this.fire(player, enemies, projectiles);
                this.timer = 0;
            }
        }
    }

    // Método que cada arma específica vai sobrescrever
    fire(player, enemies, projectiles) {
        console.warn(`${this.name} não implementou o método fire!`);
    }
}
