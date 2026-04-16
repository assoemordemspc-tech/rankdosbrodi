export class Weapon {
    constructor(config) {
        this.name = config.name;
        this.damage = config.damage;
        this.cooldown = config.cooldown; // Velocidade de ataque
        this.pierce = config.pierce;
        this.timer = 0;
        this.type = config.type; // 'auto-aim', 'orbital', 'directional'
    }

    update(dt, player, enemies, projectiles) {
        this.timer += dt;
        if (this.timer >= this.cooldown) {
            this.fire(player, enemies, projectiles);
            this.timer = 0;
        }
    }

    fire(player, enemies, projectiles) {
        // Lógica específica de cada arma (ex: busca inimigo mais próximo)
    }
}
