import Point from './point.js';
import Circle from './circle.js';
import Complex from '../utils/complex.js';

export default class HyperbolicLineFromCenter extends Circle {
    /**
     * The center should be outside of the poincare disk
     * @param {Point} center
     */
    constructor(center) {
        super(0, 0, 0);
        this.centerPoint = center;
        this.center = center.values;

        this.updateListener = this.update.bind(this);
        this.centerPoint.addUpdateListener(this.updateListener);
        this.update();
    }

    removeUpdateListeners() {
        this.centerPoint.removeUpdateListener(this.updateListener);
    }

    // http://shogo82148.github.io/homepage/memo/geometry/point-circle.html
    update() {
        this.center = this.centerPoint.values;
        const sq = this.center.absSq();
        const c = this.center;
        const p1 = new Complex((c.re + c.im * Math.sqrt(sq - 1)) / sq,
                               (c.im - c.re * Math.sqrt(sq - 1)) / sq);

        this.r = Complex.distance(this.center, p1);

        this.updated();
    }
}
