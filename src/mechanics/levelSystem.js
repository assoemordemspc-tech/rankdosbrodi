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

        // 🔥 mantém sobra de XP (sensação melhor)
        this.currentXP -= this.nextLevelXP;

        // 🔥 curva mais suave
        this.nextLevelXP = Math.floor(this.nextLevelXP * 1.4);

        this.isSelectingUpgrade = true;
        this.generateUpgrades();
    }

    // =========================
    // 🎯 UPGRADES DE VERDADE
    // =========================
    generateUpgrades() {
        const pool = [
            { id: 'damage', name: 'Dano +10%' },
            { id: 'attackSpeed', name: 'Ataque +15%' },
            { id: 'moveSpeed', name: 'Velocidade +10%' },

            // 🔥 GAME CHANGERS
            { id: 'multiShot', name: '+1 Projétil' },
            { id: 'spread', name: 'Tiro em Cone' },
            { id: 'circle', name: 'Tiro 360°' }
        ];

        // embaralha e pega 3
        this.availableUpgrades = pool
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
    }

    // =========================
    // ⚙️ APLICAÇÃO DOS UPGRADES
    // =========================
    applyUpgrade(index, player, game) {
        const upgrade = this.availableUpgrades[index];
        if (!upgrade) return;

        switch (upgrade.id) {

            // =========================
            // 📊 STATS
            // =========================

            case 'damage':
                player.attackDamage *= 1.1;
                break;

            case 'attackSpeed':
                player.attackSpeed *= 0.85; // 🔥 CORRIGIDO
                break;

            case 'moveSpeed':
                player.velocity *= 1.1;
                break;

            // =========================
            // 🔫 ARMAS
            // =========================

            case 'multiShot':
                // adiciona mais um tiro na mesma direção
                game.shootingDirections.push(0);
                break;

            case 'spread':
                // tiro em cone frontal
                game.shootingDirections = [-0.3, 0, 0.3];
                break;

            case 'circle':
                // tiro em 4 direções
                game.shootingDirections = [
                    0,
                    Math.PI / 2,
                    Math.PI,
                    (3 * Math.PI) / 2
                ];
                break;
        }

        this.isSelectingUpgrade = false;
    }
}
