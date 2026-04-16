// src/ui/upgradeMenu.js
export class UpgradeMenu {
    static draw(ctx, canvas, upgrades) {
        // Overlay escuro
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 30px Arial';
        ctx.fillText('ESCOLHA UM UPGRADE', canvas.width / 2, canvas.height * 0.2);

        // Desenhar as 3 opções como botões
        upgrades.forEach((up, i) => {
            const y = canvas.height * 0.4 + (i * 100);
            
            // Fundo do botão
            ctx.fillStyle = '#222';
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.fillRect(canvas.width / 4, y, canvas.width / 2, 70);
            ctx.strokeRect(canvas.width / 4, y, canvas.width / 2, 70);

            // Texto do Upgrade
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.fillText(up.name, canvas.width / 2, y + 42);
        });
    }

    // Detecta qual opção foi clicada (útil para Mobile e Mouse)
    static getClickedOption(x, y, canvas) {
        for (let i = 0; i < 3; i++) {
            const buttonY = canvas.height * 0.4 + (i * 100);
            if (x > canvas.width / 4 && x < canvas.width * 0.75 &&
                y > buttonY && y < buttonY + 70) {
                return i;
            }
        }
        return null;
    }
}