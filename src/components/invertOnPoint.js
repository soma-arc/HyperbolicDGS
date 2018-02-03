import Point from './point.js';

export default class InvertOnPoint extends Point {
    /**
     *
     * @param {Complex} p
     * @param {Circle} circle
     */
    constructor(p, circle) {
        super(0, 0);
        this.p = p;
        this.circle = circle;
        this.updateListener = this.update.bind(this);
        this.circle.addUpdateListener(this.updateListener);
        this.p.addUpdateListener(this.updateListener);
        this.update();

        this.type = 'InvertOnPoint';
    }

    update() {
        this.values = this.circle.invertOnPoint(this.p.values);
    }
}
