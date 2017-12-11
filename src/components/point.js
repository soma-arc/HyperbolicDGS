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
        this.uiRadius = 0.05;
        this.selected = false;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.arc(this.values.re, this.values.im, this.uiRadius,
                0, Constants.TWO_PI);
        ctx.fill();
    }

    select(mouseState) {
        const selected = Complex.distance(this.values, mouseState.position) < this.uiRadius;
        if (selected) this.selected = selected;
        return selected;
    }

    move(mouseState) {
        this.values = mouseState.position;
        this.updated();
    }

    updated() {
    }
}
