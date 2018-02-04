import Shape from './shape.js';
import Complex from '../utils/complex.js';
import Circle from './circle.js';
import Constants from '../utils/constants.js';

export default class HyperbolicLine extends Circle {
    /**
     * @param {Point} p1
     * @param {Point} p2
     */
    constructor(p1, p2, isPreview) {
        super(0, 0, 0);
        this.p1 = p1;
        this.p2 = p2;

        this.updateListener = this.update.bind(this);
        this.p1.addUpdateListener(this.updateListener);
        this.p2.addUpdateListener(this.updateListener);
        this.type = 'HyperbolicLine';
        if (isPreview === undefined) {
            this.label = Shape.getLowerLabel;
        } else {
            this.label = '';
        }
        this.lineAnticlockwise = true;

        this.update();
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
        // console.log('start')
        // console.log(this.a1)
        // console.log(this.a2)
        // console.log(Math.abs(this.a2 - this.a1));
        // console.log('end')
        
        this.updated();
    }
}
