import Shape from './shape.js';
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
        this.update();
        this.updateListener = this.update.bind(this);
        this.p1.addUpdateListener(this.updateListener);
        this.p2.addUpdateListener(this.updateListener);
        this.type = 'HyperbolicLine';
        this.label = Shape.getLowerLabel;
    }

    removeUpdateListeners() {
        this.p1.removeUpdateListener(this.updateListener);
        this.p2.removeUpdateListener(this.updateListener);
    }

    update() {
        const p1 = this.p1.values;
        const p2 = this.p2.values;
        const p1Inv = Circle.POINCARE_DISK.invertOnPoint(p1);
        const p2Inv = Circle.POINCARE_DISK.invertOnPoint(p2);
        const p1OnPoincare = Complex.distance(p1, p1Inv) < 0.00001;
        const p2OnPoincare = Complex.distance(p2, p2Inv) < 0.00001;

        let c;
        if (p1OnPoincare && p2OnPoincare) {
            const center = new Complex((p2.im - p1.im) /
                                       (p1.re * p2.im - p2.re * p1.im),
                                       (p1.re - p2.re) /
                                       (p1.re * p2.im - p2.re * p1.im));
            c = new Circle(center.re, center.im,
                           Complex.distance(center, p1));
        } else if (p1OnPoincare) {
            c = Circle.fromPoints(p1,
                                  p2,
                                  p2Inv);
        } else if (p2OnPoincare) {
            c = Circle.fromPoints(p1,
                                  p2,
                                  p1Inv);
        } else {
            c = Circle.fromPoints(p1,
                                  p2,
                                  p1Inv);
        }
        this.center = c.center;
        this.r = c.r;

        this.updated();
    }
}
