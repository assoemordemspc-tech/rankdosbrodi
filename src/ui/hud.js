// src/ui/hud.js
export class HUD {
    static draw(ctx, player, levelSystem, canvas) {
        // --- BARRA DE VIDA (Canto superior esquerdo) ---
        const hpBarWidth = 200;
        ctx.fillStyle = '#333';
        ctx.fillRect(20, 20, hpBarWidth, 15);
        
        const currentHpWidth = (player.health / player.maxHealth) * hpBarWidth;
        ctx.fillStyle = player.health > 30 ? '#00ff00' : '#ff0000';
        ctx.fillRect(20, 20, currentHpWidth, 15);
        
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(20, 20, hpBarWidth, 15);

        // --- BARRA DE XP (Topo da tela, de ponta a ponta) ---
        const xpPercent = levelSystem.currentXP / levelSystem.nextLevelXP;
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, 10);
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(0, 0, canvas.width * xpPercent, 10);

        // --- NÍVEL (Canto superior direito) ---
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`NÍVEL: ${levelSystem.level}`, canvas.width - 20, 40);
    }
}