export class CollisionSystem {
    static checkCircleCollision(groupA, groupB, callback) {
        // Percorremos de trás para frente para evitar erros de índice ao remover itens
        for (let i = groupA.length - 1; i >= 0; i--) {
            for (let j = groupB.length - 1; j >= 0; j--) {
                const a = groupA[i];
                const b = groupB[j];

                // Segurança: Se algum deles já foi removido por outra colisão, pula
                if (!a || !b) continue;

                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.hypot(dx, dy);
                
                // Usamos o raio (tamanho / 2) para uma colisão circular precisa
                const minDist = (a.size / 2) + (b.size / 2);

                if (dist < minDist) {
                    callback(a, b, i, j);
                }
            }
        }
    }
}
