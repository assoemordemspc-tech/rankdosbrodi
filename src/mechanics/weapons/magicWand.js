import { Sound } from '../../systems/audioSystem.js';
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

        this.shotCount = 1; // ✅ suporte a múltiplos tiros
    }

    fire(player, enemies, projectiles) {
        // 🛑 segurança (evita erro quando não há inimigos)
        if (!enemies || enemies.length === 0) return;
Sound.playShoot(); // 🔊 AQUI
        const target = this.getClosestEnemy(player, enemies);
        if (!target) return;

        const baseAngle = Math.atan2(
            target.y - player.y,
            target.x - player.x
        );

        // 🔫 múltiplos disparos
        for (let i = 0; i < this.shotCount; i++) {

            // 🎯 cálculo de spread centralizado
            const offset = (i - (this.shotCount - 1) / 2) * 0.2;

            const p = new Projectile(
                player.x,
                player.y,
                baseAngle + offset
            );

            // aplica atributos da arma
            p.damage = this.damage;
            p.pierce = this.pierce;
            p.speed = this.projectileSpeed;

            projectiles.push(p);
        }
    }

    // 🎯 busca otimizada do inimigo mais próximo
    getClosestEnemy(player, enemies) {
        let closest = null;
        let minDist = Infinity;

        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            const dist = Math.hypot(player.x - e.x, player.y - e.y);

            if (dist < minDist) {
                minDist = dist;
                closest = e;
            }
        }

        return closest;
    }
}
