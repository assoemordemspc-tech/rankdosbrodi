import { Weapon } from '../weapon.js';
import { Projectile } from '../../entities/projectile.js';

export class MagicWand extends Weapon {
    constructor() {
        super({
            name: "Varinha Mágica",
            cooldown: 800,
            damage: 2,
            pierce: 1,
            projectileSpeed: 12
        });
    }

    fire(player, enemies, projectiles) {
        // Lógica de busca do alvo mais próximo (encapsulada na arma!)
        let closest = enemies[0];
        let minDist = Math.hypot(player.x - closest.x, player.y - closest.y);

        for (let i = 1; i < enemies.length; i++) {
            const dist = Math.hypot(player.x - enemies[i].x, player.y - enemies[i].y);
            if (dist < minDist) {
                minDist = dist;
                closest = enemies[i];
            }
        }

        const angle = Math.atan2(closest.y - player.y, closest.x - player.x);
        
        // Cria o projétil usando os atributos desta arma
        const p = new Projectile(player.x, player.y, angle);
        p.damage = this.damage;
        p.pierce = this.pierce;
        p.speed = this.projectileSpeed;
        
        projectiles.push(p);
    }
}