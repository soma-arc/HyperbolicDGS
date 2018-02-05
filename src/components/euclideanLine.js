import Shape from '../components/shape.js';
import Complex from '../utils/complex.js';

export default class EuclideanLine extends Shape {

    constructor(p1, p2, isPreview) {
        super();
        this.p1 = p1;
        this.p2 = p2;

        this.uiRadius = 0.025;
        
        this.updateListener = this.update.bind(this);

        this.type = 'EuclideanLine';
        if (isPreview === undefined) {
            this.label = Shape.getLowerLabel;
        } else {
            this.label = '';
        }

        this.update();
    }

    selectable(mouseState) {
        const v = this.p2.values.sub(this.p1.values).normalize();
        const normal = new Complex(-v.im, v.re);
        const v2 = mouseState.position.sub(this.p1.values);
        return Math.abs(Complex.dot(normal, v2)) < this.uiRadius;
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        const v = this.p2.values.sub(this.p1.values);
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
        const pp1 = this.p1.values.add(v.scale(-999));
        const pp2 = this.p2.values.add(v.scale(999));
        ctx.moveTo(pp1.re, pp1.im);
        ctx.lineTo(pp2.re, pp2.im);
        ctx.stroke();
    }
    
    update() {
        this.updated();
    }
}
