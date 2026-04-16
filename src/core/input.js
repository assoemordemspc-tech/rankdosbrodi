export class Input {
    constructor() {
        this.axes = { x: 0, y: 0 }; // Direção de -1 a 1
        this.isTouch = false;

        this.lastKey = null; // ✅ ADICIONADO

        // Teclado (PC)
        window.addEventListener('keydown', (e) => this.handleKey(e, true));
        window.addEventListener('keyup', (e) => this.handleKey(e, false));

        // Toque (Mobile)
        window.addEventListener('touchstart', (e) => this.handleTouch(e));
        window.addEventListener('touchmove', (e) => this.handleTouch(e));
        window.addEventListener('touchend', () => {
            this.axes.x = 0;
            this.axes.y = 0;
        });
    }

    handleKey(e, isDown) {
        const val = isDown ? 1 : 0;

        // ✅ CAPTURA DA ÚLTIMA TECLA PRESSIONADA
        if (isDown) {
            this.lastKey = e.key;
        }

        if (e.key === 'ArrowLeft' || e.key === 'a') this.axes.x = isDown ? -1 : 0;
        if (e.key === 'ArrowRight' || e.key === 'd') this.axes.x = isDown ? 1 : 0;
        if (e.key === 'ArrowUp' || e.key === 'w') this.axes.y = isDown ? -1 : 0;
        if (e.key === 'ArrowDown' || e.key === 's') this.axes.y = isDown ? 1 : 0;
    }

    handleTouch(e) {
        const touch = e.touches[0];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        this.axes.x = touch.clientX > centerX ? 1 : -1;
        this.axes.y = touch.clientY > centerY ? 1 : -1;
    }
}
