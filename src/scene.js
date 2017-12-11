import Circle from './components/circle.js';
import Point from './components/point.js';

export default class Scene {
    constructor() {
        const poincareDisk = new Circle(0, 0, 1);
        this.objects = [poincareDisk];
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        for (const obj of this.objects) {
            obj.render(ctx);
        }
    }

    mouseLeft(mouseState) {
        const p = mouseState.position;
        this.objects.push(new Point(p.re, p.im));
        return true;
    }

    mouseWheel(mouseState) {
    }

    mouseRight(mouseState) {
    }
}
