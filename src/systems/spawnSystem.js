spawn() {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    const padding = 50;

    if (side === 0) { x = Math.random() * this.canvas.width; y = -padding; }
    else if (side === 1) { x = this.canvas.width + padding; y = Math.random() * this.canvas.height; }
    else if (side === 2) { x = Math.random() * this.canvas.width; y = this.canvas.height + padding; }
    else { x = -padding; y = Math.random() * this.canvas.height; }

    // 🎯 WAVE DIRECTOR (baseado no tempo total)
    let type = 'normal';

    if (this.timer > 60000) {
        type = 'fast';
    }

    if (this.timer > 120000) {
        type = 'tank';
    }

    const enemy = new Enemy(x, y, type);

    // --- DIFICULDADE SUAVE (mantida) ---
    const secondsPassed = this.timer / 1000;

    let calculatedHP = 1;
    if (secondsPassed > 45) {
        calculatedHP += Math.floor((secondsPassed - 45) / 45);
    }
    enemy.health = Math.min(calculatedHP, 6);

    enemy.velocity = 0.8 + Math.min(secondsPassed / 120, 1.2);

    this.enemies.push(enemy);
}
