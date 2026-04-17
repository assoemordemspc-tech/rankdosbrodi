export class LevelSystem {
    constructor() {
        this.level = 1;
        this.currentXP = 0;
        this.nextLevelXP = 5;

        this.isSelectingUpgrade = false;
        this.availableUpgrades = [];
    }

    addXP(amount) {
        this.currentXP += amount;

        if (this.currentXP >= this.nextLevelXP) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;

        this.currentXP -= this.nextLevelXP;
        this.nextLevelXP = Math.floor(this.nextLevelXP * 1.4);

        this.isSelectingUpgrade = true;
        this.generateUpgrades();
    }

    generateUpgrades() {
        const pool = [
            { type: 'DAMAGE', name: 'Dano +1' },
            { type: 'ATTACK_SPEED', name: 'Ataque +20%' },
            { type: 'MOVE_SPEED', name: 'Velocidade +10%' },

            // 🔫 SISTEMA DE ARMAS NOVO
            { type: 'DOUBLE_SHOT', name: 'Tiro Duplo' },
            { type: 'MAGNET', name: 'Imã +50' }
        ];

        this.availableUpgrades = pool
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
    }

    applyUpgrade(index, player, game) {
        const upgrade = this.availableUpgrades[index];
        if (!upgrade) return;

        switch (upgrade.type) {

            // =====================
            // 📊 STATS
            // =====================

            case 'DAMAGE':
                player.weapons.forEach(w => w.damage += 1);
                break;

            case 'ATTACK_SPEED':
                player.weapons.forEach(w => w.cooldown *= 0.8);
                break;

            case 'MOVE_SPEED':
                player.velocity *= 1.1;
                break;

            // =====================
            // 🔫 ARMAS
            // =====================

            case 'DOUBLE_SHOT':
                player.weapons.forEach(w => {
                    w.shotCount = (w.shotCount || 1) + 1;
                });
                break;

            case 'MAGNET':
                player.magnetRadius = (player.magnetRadius || 0) + 50;
                break;
        }

        this.isSelectingUpgrade = false;
    }
}
