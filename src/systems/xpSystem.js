update(player, onCollect) {
    for (let i = this.orbs.length - 1; i >= 0; i--) {
        const orb = this.orbs[i];

        const dist = Math.hypot(player.x - orb.x, player.y - orb.y);

        // =========================
        // 🧲 MAGNETISMO (ATRACÇÃO)
        // =========================
        if (player.magnetRadius && dist < player.magnetRadius) {
            const angle = Math.atan2(player.y - orb.y, player.x - orb.x);
            const force = 0.5;

            orb.vx = (orb.vx || 0) + Math.cos(angle) * force;
            orb.vy = (orb.vy || 0) + Math.sin(angle) * force;

            orb.x += orb.vx;
            orb.y += orb.vy;

            // fricção (suaviza movimento)
            orb.vx *= 0.95;
            orb.vy *= 0.95;
        }

        // =========================
        // 🎯 COLETA
        // =========================
        if (dist < player.size) {
            onCollect(orb.value);
            this.orbs.splice(i, 1);
        }
    }
}
