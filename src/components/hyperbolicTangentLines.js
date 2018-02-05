import Shape from './shape.js';
import Circle from './circle.js';
import HyperbolicPerpendicularBisector from './hyperbolicPerpendicularBisector.js';
import HyperbolicLine from './hyperbolicLine.js';
import Complex from '../utils/complex.js';

export default class HyperbolicTangentLines extends Shape {
    constructor(circle, p, isPreview) {
        super();
        this.circle = circle;
        this.p = p;

        this.type = 'HyperbolicTangentLines';

        this.updateListener = this.update.bind(this);
        this.circle.addUpdateListener(this.updateListener);
        this.p.addUpdateListener(this.updateListener);
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
        this.tc1.render(ctx);
        this.tc2.render(ctx);
    }
    
    update() {
        // const p1 = Circle.POINCARE_DISK.center;
        // const p2 = this.p.values
        // const p1d = p1;
        // const p2d = Circle.POINCARE_DISK.invertOnPoint(p2);
        // console.log(p1d);
        // console.log(p2d);
        
        // const dirP1P2 = p1.sub(p2).normalize();
        // const u = p1d.sub(p2d).normalize();
        // const n = new Complex(dirP1P2.im, -dirP1P2.re);
        // const alpha = Complex.dot(n, p1.sub(p1d))
        //       / Complex.dot(n, u);
        // const center = p1d.add(u.scale(alpha));

        // const sq = center.absSq();
        // const c = center;
        // const ppp = new Complex((c.re + c.im * Math.sqrt(sq - 1)) / sq,
        //                         (c.im - c.re * Math.sqrt(sq - 1)) / sq);

        // const r = Complex.distance(center, ppp);

        // this.m = new Circle(center.re, center.im, r);
        // console.log(this.m);
        // console.log(this.circle);
        // const cd = this.m.invertOnCircle(this.circle);

        // const [t1, t2] = Circle.tangentLinePoints(cd, Circle.POINCARE_DISK.center);
        // //tangent lines -- (t1, (0, 0)), (t2, (0, 0))

        // this.tp1 = this.m.invertOnPoint(t1);
        // this.tp2 = this.m.invertOnPoint(t2);

        // this.tc1 = this.comp(p1, this.tp1);
        // this.tc2 = this.comp(p1, this.tp2);
        
        this.updated();
    }

    comp(p1, p2) {
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
        return c;
    }
}
