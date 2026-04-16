// src/systems/xpSystem.js
export class XPSystem {
    constructor() {
        this.orbs = []; // Verifique se o nome é 'orbs' ou 'experienceOrbs' para bater com o resto do código
    }

    update(player, onCollect) {
        for (let i = this.orbs.length - 1; i >= 0; i--) {
            const orb = this.orbs[i];
            const dist = Math.hypot(player.x - orb.x, player.y - orb.y);

            // Magnetismo
            if (player.magnetRadius && dist < player.magnetRadius) {
                const angle = Math.atan2(player.y - orb.y, player.x - orb.x);
                const force = 0.5;

                orb.vx = (orb.vx || 0) + Math.cos(angle) * force;
                orb.vy = (orb.vy || 0) + Math.sin(angle) * force;

                orb.x += orb.vx;
                orb.y += orb.vy;

                orb.vx *= 0.95;
                orb.vy *= 0.95;
            }

            // Coleta
            if (dist < player.size) {
                onCollect(orb.value);
                this.orbs.splice(i, 1);
            }
        }
    }
    
    // Certifique-se de ter o método draw aqui também
    draw(ctx) {
        this.orbs.forEach(orb => {
            ctx.fillStyle = '#00ffff';
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}
