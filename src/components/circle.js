import Shape from '../components/shape.js';
import Complex from '../utils/complex.js';
import Constants from '../utils/constants.js';

export default class Circle extends Shape {
    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} r
     */
    constructor(x, y, r) {
        super();
        this.center = new Complex(x, y);
        this.r = r;
    }

    /**
     *
     * @returns {Complex}
     */
    getPosition() {
        return this.center;
    }
    
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.center.re, this.center.im, this.r,
                0, Constants.TWO_PI);
        ctx.stroke();
    }

    /**
     * Apply inversion to a given point
     * @param {Complex} p
     * @param {Complex}
     */
    invertOnPoint (p) {
        const r2 = this.r * this.r;
        const d = p.sub(this.center);
        const lenSq = d.absSq();
        return d.scale(r2 / lenSq).add(this.center);
    }

    /**
     * Apply inversion to a given circle
     * @param {Circle} c
     * @returns {Circle}
     */
    invertOnCircle (c) {
        const coeffR = c.r * Math.sqrt(2) / 2;
        const p1 = this.invertOnPoint(c.center.add(new Complex(coeffR, coeffR)));
        const p2 = this.invertOnPoint(c.center.add(new Complex(-coeffR, -coeffR)));
        const p3 = this.invertOnPoint(c.center.add(new Complex(coeffR, -coeffR)));
        return Circle.fromPoints(p1, p2, p3);
    }

    /**
     * Compute a circle passing through three points
     * @param {Complex} a
     * @param {Complex} b
     * @param {Complex} c
     * @returns {Circle}
     */
    static fromPoints (a, b, c) {
        const lA = Complex.distance(b, c);
        const lB = Complex.distance(a, c);
        const lC = Complex.distance(a, b);
        const coefA = lA * lA * (lB * lB + lC * lC - lA * lA);
        const coefB = lB * lB * (lA * lA + lC * lC - lB * lB);
        const coefC = lC * lC * (lA * lA + lB * lB - lC * lC);
        const denom = coefA + coefB + coefC;
        const center = new Complex((coefA * a.re + coefB * b.re + coefC * c.re) / denom,
                                   (coefA * a.im + coefB * b.im + coefC * c.im) / denom);
        return new Circle(center.re, center.im, Complex.distance(center, a));
    }

    static get POINCARE_DISK() {
        return POINCARE_DISK;
    }
}

const POINCARE_DISK = new Circle(0, 0, 1);
