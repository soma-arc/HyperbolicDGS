import Shape from './shape.js';
import Circle from './circle.js';

export default class EuclideanTangentLines extends Shape {
    constructor(circle, p, isPreview) {
        super();
        this.circle = circle;
        this.p = p;

        this.type = 'EuclideanTangentLines';

        this.updateListener = this.update.bind(this);
        this.circle.addUpdateListener(this.updateListener);
        this.p.addUpdateListener(this.updateListener);
        this.type = 'HyperbolicLine';
        if (isPreview === undefined) {
            this.label = Shape.getLowerLabel;
        } else {
            this.label = '';
        }
        this.lineAnticlockwise = true;

        this.update();
    }


    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        const v1 = this.p.values.sub(this.t1);
        const v2 = this.p.values.sub(this.t2);
        if (this.selected) {
            const tmp = ctx.lineWidth;
            ctx.strokeStyle = 'rgb(66, 134, 244)';
            ctx.lineWidth = tmp * 5;
            ctx.beginPath();
            ctx.stroke();
            ctx.lineWidth = tmp;
        }
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        const pp1 = this.t1.add(v1.scale(-999));
        const pp2 = this.t1.add(v1.scale(999));
        ctx.moveTo(pp1.re, pp1.im);
        ctx.lineTo(pp2.re, pp2.im);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        const pp12 = this.t2.add(v2.scale(-999));
        const pp22 = this.t2.add(v2.scale(999));
        ctx.moveTo(pp12.re, pp12.im);
        ctx.lineTo(pp22.re, pp22.im);
        ctx.stroke();
    }
    
    update() {
        [this.t1, this.t2] = Circle.tangentLinePoints(this.circle, this.p.values);
        this.updated();
    }
}
