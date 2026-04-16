export class Enemy {
    constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.type = type;

        const configs = {
            normal: {
                hp: 2,
                speed: 1.2,
                size: 15,
                color: '#ff4444'
            },
            fast: {
                hp: 1,
                speed: 2.5,
                size: 10,
                color: '#ffff00'
            },
            tank: {
                hp: 12,
                speed: 0.6,
                size: 25,
                color: '#880000'
            },
            suicide: {
                hp: 1,
                speed: 3.0,
                size: 12,
                color: '#ff8800'
            }
        };

        const config = configs[type] || configs.normal;

        this.maxHealth = config.hp;
        this.health = config.hp;
        this.velocity = config.speed;
        this.size = config.size;
        this.color = config.color;

        // 🔥 FUTURO: sistema de efeitos (burn, slow, poison etc)
        this.effects = [];
    }

    // 🧠 movimento básico em direção ao player
    update(player, dt) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.hypot(dx, dy);

        // evita divisão por zero
        if (dist > 0) {
            this.x += (dx / dist) * this.velocity;
            this.y += (dy / dist) * this.velocity;
        }

        // 🔥 processamento de efeitos ativos (DoT / debuff)
        this.updateEffects(dt);
    }

    // 🔥 sistema de status effects (base)
    updateEffects(dt) {
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];

            effect.timer += dt;

            // 🔥 BURN (dano ao longo do tempo)
            if (effect.type === 'burn') {
                this.health -= (effect.dps * dt) / 1000;
            }

            // ⏱ expiração do efeito
            if (effect.timer >= effect.duration) {
                this.effects.splice(i, 1);
            }
        }
    }

    // 🔥 aplica status effect
    applyEffect(type, data) {
        this.effects.push({
            type,
            duration: data.duration || 2000,
            dps: data.dps || 0,
            timer: 0
        });
    }

    // 💥 dano direto
    takeDamage(amount) {
        this.health -= amount;
    }

    // ☠️ verificação de morte
    isDead() {
        return this.health <= 0;
    }

    // 🎨 renderização
    draw(ctx) {
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 🔴 barra de vida simples (feedback visual importante)
        const hpRatio = this.health / this.maxHealth;

        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - this.size, this.y - this.size - 8, this.size * 2, 3);

        ctx.fillStyle = 'lime';
        ctx.fillRect(this.x - this.size, this.y - this.size - 8, this.size * 2 * hpRatio, 3);

        // ⚠️ destaque visual do suicida
        if (this.type === 'suicide') {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // 🔥 efeito visual simples se estiver queimando
        if (this.effects.some(e => e.type === 'burn')) {
            ctx.strokeStyle = '#ff6600';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 2, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}
