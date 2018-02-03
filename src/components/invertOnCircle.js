import Shape from './shape.js';
import Circle from './circle.js';

export default class InvertOnCircle extends Circle {
    /**
     *
     * @param {Circle} c
     * @param {Circle} circle
     */
    constructor(c, circle) {
        super(0, 0, 0);
        this.c = c;
        this.circle = circle;
        this.updateListener = this.update.bind(this);
        this.circle.addUpdateListener(this.updateListener);
        this.c.addUpdateListener(this.updateListener);
        this.update();

        this.type = 'InvertOnCircle';
        this.label = Shape.getLowerLabel;
    }

    update() {
        const c = this.circle.invertOnCircle(this.c);
        this.center = c.center;
        this.r = c.r;

        this.updated();
    }
}
