import Circle from './components/circle.js';

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
}
