export class CollisionSystem {
    /**
     * Checa colisão entre dois grupos de objetos (ex: projéteis e inimigos)
     * @param {Array} groupA - Lista de objetos (ex: projéteis)
     * @param {Array} groupB - Lista de objetos (ex: inimigos)
     * @param {Function} callback - O que acontece quando colidem
     */
    static checkCircleCollision(groupA, groupB, callback) {
        for (let i = groupA.length - 1; i >= 0; i--) {
            for (let j = groupB.length - 1; j >= 0; j--) {
                const a = groupA[i];
                const b = groupB[j];

                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                const minDist = (a.size / 2) + (b.size / 2);

                if (dist < minDist) {
                    callback(a, b, i, j);
                }
            }
        }
    }
}
