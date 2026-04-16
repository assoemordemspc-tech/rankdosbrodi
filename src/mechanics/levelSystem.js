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
            { id: 'damage', name: 'Dano +10%' },
            { id: 'attackSpeed', name: 'Ataque +15%' },
            { id: 'moveSpeed', name: 'Velocidade +10%' },

            // 🔥 GAMEPLAY REAL
            { id: 'multiShot', name: '+1 Projétil' },
            { id: 'spread', name: 'Tiro em Cone' },
            { id: 'circle', name: 'Tiro 360°' },
            { id: 'doubleShot', name: 'Tiro Duplo Frente' }
        ];

        this.availableUpgrades = pool
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
    }

    applyUpgrade(index, player, game) {
        const upgrade = this.availableUpgrades[index];
        if (!upgrade) return;

        switch (upgrade.id) {

            // =====================
            // 📊 STATS
            // =====================

            case 'damage':
                player.attackDamage *= 1.1;
                break;

            case 'attackSpeed':
                player.attackSpeed *= 0.85;
                break;

            case 'moveSpeed':
                player.velocity *= 1.1;
                break;

            // =====================
            // 🔫 ARMAS
            // =====================

            case 'multiShot':
                game.addProjectile(0);
                break;

            case 'spread':
                game.setSpreadShot();
                break;

            case 'circle':
                game.setCircleShot();
                break;

            case 'doubleShot':
                game.setDoubleFront();
                break;
        }

        this.isSelectingUpgrade = false;
    }
}
