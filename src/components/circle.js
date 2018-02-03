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

        this.uiRadius = 0.025;
    }

    selectable(mouseState) {
        this.diff = this.center.sub(mouseState.position);
        return Math.abs(this.diff.abs() - this.r) < this.uiRadius;
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
        if (this.selected) {
            const tmp = ctx.lineWidth;
            ctx.strokeStyle = 'rgb(66, 134, 244)';
            ctx.lineWidth = tmp * 5;
            ctx.beginPath();
            ctx.arc(this.center.re, this.center.im, this.r,
                    0, Constants.TWO_PI);
            ctx.stroke();
            ctx.lineWidth = tmp;
        }
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(0, 0, 0)';
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

    /**
     *
     * @param {Circle} c1
     * @param {Circle} c2
     * @returns {[Complex, Complex]}
     */
    static computeIntersections(c1, c2) {
        c2.center = c2.center.sub(c1.center);
        const r1_2 = c1.r * c1.r;
        const r2_2 = c2.r * c2.r;
        const x2_2 = c2.center.re * c2.center.re;
        const y2_2 = c2.center.im * c2.center.im;
        const x2y2 = x2_2 + y2_2;
        const a = (x2_2 + y2_2 + r1_2 - r2_2) * 0.5;
        const rt = Math.sqrt(x2y2 * r1_2 - a * a);

        const p1 = new Complex((a * c2.center.re + c2.center.im * rt) / x2y2,
                               (a * c2.center.im - c2.center.re * rt) / x2y2).add(c1.center);
        const p2 = new Complex((a * c2.center.re - c2.center.im * rt) / x2y2,
                               (a * c2.center.im + c2.center.re * rt) / x2y2).add(c1.center);
        c2.center = c2.center.add(c1.center);
        return [p1, p2];
    }

    static get POINCARE_DISK() {
        return POINCARE_DISK;
    }
}

const POINCARE_DISK = new Circle(0, 0, 1);
POINCARE_DISK.type = 'PoincareDisk';
POINCARE_DISK.label = 'PD';
