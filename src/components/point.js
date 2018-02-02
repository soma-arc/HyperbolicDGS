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
        this.label = Shape.getUpperLabel;
        this.type = 'Point';
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

        ctx.save();
        ctx.translate((this.values.re + this.uiRadius),
                      (this.values.im + this.uiRadius));
        ctx.scale(0.1, -0.1);
        ctx.font = '1px serif';
        ctx.fillText(this.label,
                     0,
                     0);
        ctx.restore();
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

    /**
     *
     * @param {Complex} position
     */
    setPosition(position) {
        this.values = position;
        this.updated();
    }

    /**
     *
     * @param {Complex} translation
     */
    translate(translation) {
        console.log(translation)
        this.values = this.values.add(translation);
        this.updated();
    }

    /**
     *
     * @returns {Complex}
     */
    getPosition() {
        return this.values;
    }
}
