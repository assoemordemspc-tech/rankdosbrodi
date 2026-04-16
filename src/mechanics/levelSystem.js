export class LevelSystem {
    constructor() {
        this.level = 1;
        this.currentXP = 0;
        this.nextLevelXP = 5; // XP inicial necessário
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
        this.currentXP = 0;
        this.nextLevelXP = Math.floor(this.nextLevelXP * 1.5); // Escala de dificuldade
        this.isSelectingUpgrade = true;
        this.generateUpgrades();
    }

    generateUpgrades() {
        const pool = [
            { id: 'damage', name: 'Dano +20%', type: 'stat' },
            { id: 'attackSpeed', name: 'Vel. Ataque +15%', type: 'stat' },
            { id: 'moveSpeed', name: 'Vel. Movimento +10%', type: 'stat' }
        ];
        
        // Sorteia 3 opções (neste caso são as 3 que temos)
        this.availableUpgrades = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
        
        console.log(`--- LEVEL UP: ${this.level} ---`);
        this.availableUpgrades.forEach((up, i) => {
            console.log(`${i + 1}: ${up.name}`);
        });
    }

    applyUpgrade(index, player, game) {
        const upgrade = this.availableUpgrades[index];
        if (!upgrade) return;

        switch (upgrade.id) {
            case 'damage':
                // Precisaremos adicionar 'damage' no projectile.js depois
                console.log("Dano aumentado!");
                break;
            case 'attackSpeed':
                game.attackInterval *= 0.85;
                break;
            case 'moveSpeed':
                player.velocity *= 1.1;
                break;
        }

        this.isSelectingUpgrade = false;
    }
}