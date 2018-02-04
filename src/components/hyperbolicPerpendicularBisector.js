import Shape from './shape.js';
import Point from './point.js';
import Circle from './circle.js';
import Complex from '../utils/complex.js';
import Constants from '../utils/constants.js';

export default class HyperbolicPerpendicularBisector extends Circle {
    /**
     * @param {Point} p1
     * @param {Point} p2
     */
    constructor(p1, p2, isPreview) {
        super(0, 0, 0);
        this.p1 = p1;
        this.p2 = p2;

        this.updateListener = this.computeCircle.bind(this);
        this.p1.addUpdateListener(this.updateListener);
        this.p2.addUpdateListener(this.updateListener);
        this.computeCircle();

        this.type = 'HyperbolicPerpendicularBisector';

        if (isPreview) {
            this.label = '';
        } else {
            this.label = Shape.getLowerLabel;
        }
    }

    removeUpdateListeners() {
        this.p1.removeUpdateListener(this.updateListener);
        this.p2.removeUpdateListener(this.updateListener);
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
        ctx.setLineDash([0.05, 0.1]);
        ctx.arc(this.center.re, this.center.im, this.r,
                this.a1, this.a2, !this.lineAnticlockwise);
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.arc(this.center.re, this.center.im, this.r,
                this.a1, this.a2, this.lineAnticlockwise);
        ctx.stroke();
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

        [this.isect1, this.isect2] = Circle.computeIntersections(this, Circle.POINCARE_DISK);
        this.isect1 = this.isect1.sub(this.center);
        this.isect2 = this.isect2.sub(this.center);
        this.a1 = Math.atan2(this.isect1.im, this.isect1.re);
        this.a2 = Math.atan2(this.isect2.im, this.isect2.re);
        if (this.a2 < this.a1) {
            const tmp = this.a1;
            this.a1 = this.a2;
            this.a2 = tmp;
        }
        if (Math.abs(this.a2 - this.a1) < Math.PI) {
            this.lineAnticlockwise = false;
        } else {
            this.lineAnticlockwise = true;
        }
    }
}
