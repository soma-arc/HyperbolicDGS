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
        this.uiRadius = 0.025;
        this.diff = new Complex(0, 0);
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

    select(mouseState) {
        this.diff = this.values.sub(mouseState.position);
        const selected = Complex.abs(this.diff) < this.uiRadius;
        if (selected) this.selected = selected;
        return selected;
    }

    move(mouseState) {
        this.values = mouseState.position.add(this.diff);
        this.updated();
        return true;
    }

    updated() {
    }
}
