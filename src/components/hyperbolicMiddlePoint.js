import Point from './point.js';
import Shape from './shape.js';
import HyperbolicLine from './hyperbolicLine.js';
import HyperbolicPerpendicularBisector from './hyperbolicPerpendicularBisector.js';
import Circle from './circle.js';
import Complex from '../utils/complex.js';
import Constants from '../utils/constants.js';

export default class HyperbolicMiddlePoint extends Shape {
    /**
     *
     * @param {Point} p1
     * @param {Point} p2
     */
    constructor(p1, p2, isPreview) {
        super();
        this.p1 = p1;
        this.p2 = p2;

        this.uiRadius = 0.025;

        this.update();
        this.updateListener = this.update.bind(this);
        this.p1.addUpdateListener(this.updateListener);
        this.p2.addUpdateListener(this.updateListener);

        if (isPreview) {
            this.label = '';
        } else {
            this.label = Shape.getUpperLabel;
        }
        this.type = 'HyperbolicMiddlePoint';
    }

    removeUpdateListeners() {
        this.p1.removeUpdateListener(this.updateListener);
        this.p2.removeUpdateListener(this.updateListener);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        if (this.selected) {
            ctx.fillStyle = 'rgb(66, 134, 244)';
            ctx.beginPath();
            ctx.arc(this.values.re, this.values.im,
                    this.uiRadius * 1.5,
                    0, Constants.TWO_PI);
            ctx.fill();
        }

        if (this.values !== undefined) {
            ctx.beginPath();
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.arc(this.values.re, this.values.im, this.uiRadius,
                    0, Constants.TWO_PI);
            ctx.fill();
        }
    }

    update() {
        if (this.p1.values.abs() >= 1 || this.p2.values.abs() >= 1) {
            this.values = undefined;
            return;
        }

        const bisector = new HyperbolicPerpendicularBisector(this.p1, this.p2);
        const line = new HyperbolicLine(this.p1, this.p2);
        const [p1, p2] = Circle.computeIntersections(bisector, line);
        if (Complex.distance(Circle.POINCARE_DISK.center, p1) < Circle.POINCARE_DISK.r) {
            this.values = p1;
        } else if (Complex.distance(Circle.POINCARE_DISK.center, p2) < Circle.POINCARE_DISK.r) {
            this.values = p2;
        }
    }
}
