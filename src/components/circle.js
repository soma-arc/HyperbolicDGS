import Complex from '../utils/complex.js';
import Constants from '../utils/constants.js';

export default class Circle {
    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} r
     */
    constructor(x, y, r) {
        this.center = new Complex(x, y);
        this.r = r;
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
}
