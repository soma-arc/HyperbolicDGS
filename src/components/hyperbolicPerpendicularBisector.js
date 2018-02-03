import Shape from './shape.js';
import Point from './point.js';
import Circle from './circle.js';
import Complex from '../utils/complex.js';

export default class HyperbolicPerpendicularBisector extends Circle {
    /**
     * @param {Point} p1
     * @param {Point} p2
     */
    constructor(p1, p2) {
        super(0, 0, 0);
        this.p1 = p1;
        this.p2 = p2;

        this.updateListener = this.computeCircle.bind(this);
        this.p1.addUpdateListener(this.updateListener);
        this.p2.addUpdateListener(this.updateListener);
        this.computeCircle();

        this.type = 'HyperbolicPerpendicularBisector';
        this.label = Shape.getLowerLabel;
    }

    removeUpdateListeners() {
        this.p1.removeUpdateListener(this.updateListener);
        this.p2.removeUpdateListener(this.updateListener);
    }

    // https://qiita.com/tmakimoto/items/2da05225633272ef935c
    computeCircle() {
        const p1d = Circle.POINCARE_DISK.invertOnPoint(this.p1.values);
        const p2d = Circle.POINCARE_DISK.invertOnPoint(this.p2.values);

        const dirP1P2 = this.p1.values.sub(this.p2.values).normalize();
        const u = p1d.sub(p2d).normalize();
        const n = new Complex(dirP1P2.im, -dirP1P2.re);
        const alpha = Complex.dot(n, this.p1.values.sub(p1d))
              / Complex.dot(n, u);
        this.center = p1d.add(u.scale(alpha));

        const sq = this.center.absSq();
        const c = this.center;
        const p1 = new Complex((c.re + c.im * Math.sqrt(sq - 1)) / sq,
                               (c.im - c.re * Math.sqrt(sq - 1)) / sq);

        this.r = Complex.distance(this.center, p1);
    }
}
