import Complex from '../utils/complex.js';
import Circle from './circle.js';

export default class HyperbolicLine extends Circle {
    /**
     * @param {Point} p1
     * @param {Point} p2
     */
    constructor(p1, p2) {
        super(0, 0, 0);
        this.p1 = p1;
        this.p2 = p2;
        this.computeCircle();
        this.p1.addUpdateListener(this.computeCircle.bind(this));
        this.p2.addUpdateListener(this.computeCircle.bind(this));
    }

    computeCircle() {
        const c = Circle.fromPoints(this.p1.values,
                                    this.p2.values,
                                    Circle.POINCARE_DISK.invertOnPoint(this.p1.values));
        this.center = c.center;
        this.r = c.r;
    }

    deselect() {
        this.selected = false;
    }
}
