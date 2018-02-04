import Shape from './shape.js';
import Point from './point.js';
import Circle from './circle.js';
import Complex from '../utils/complex.js';
import Constants from '../utils/constants.js';

export default class HyperbolicLineFromCenter extends Circle {
    /**
     * The center should be outside of the poincare disk
     * @param {Point} center
     */
    constructor(center, isPreview) {
        super(0, 0, 0);
        this.centerPoint = center;
        this.center = center.values;

        this.updateListener = this.update.bind(this);
        this.centerPoint.addUpdateListener(this.updateListener);

        this.type = 'HyperbolicLineFromCenter';
        if (isPreview) {
            this.label = '';
        } else {
            this.label = Shape.getLowerLabel;
        }

        this.lineAnticlockwise = true;

        this.update();
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
        console.log('start')
        console.log(this.a1)
        console.log(this.a2)
        console.log(Math.abs(this.a2 - this.a1));
        console.log('end')
        
        this.updated();
    }
}
