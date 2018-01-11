import Shape from './shape.js';
import Circle from './circle.js';
import Complex from '../utils/complex.js';
import Constants from '../utils/constants.js';
import Point from './point.js';

export default class PointOnCircle extends Point {
    /**
     *
     * @param {Complex} p
     * @param {Circle} circle
     */
    constructor(p, circle) {
        super(0, 0);
        this.circle = circle;
        p = p.sub(circle.center);
        this.angle = Math.atan2(p.im, p.re);
        this.updateListener = this.update.bind(this);
        this.circle.addUpdateListener(this.updateListener);
        this.update();
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

        ctx.beginPath();
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.arc(this.values.re, this.values.im, this.uiRadius,
                0, Constants.TWO_PI);
        ctx.fill();
    }

    update() {
        this.values = new Complex(this.circle.r * Math.cos(this.angle) + this.circle.center.re,
                                  this.circle.r * Math.sin(this.angle) + this.circle.center.im);
    }

    move(mouseState) {
        const p = mouseState.position.sub(this.circle.center);
        this.angle = Math.atan2(p.im, p.re);
        this.update();
        this.updated();
        return true;
    }
}
