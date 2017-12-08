import Shape from './shape.js';
import Complex from '../utils/complex.js';
import Constants from '../utils/constants.js';

export default class Point extends Shape {
    /**
     * @param {Number} x
     * @param {Number} y
     */
    constructor(x, y) {
        super();
        this.values = new Complex(x, y);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.values.x, this.values.y,
                0, Constants.TWO_PI);
        ctx.fill();
    }
}
