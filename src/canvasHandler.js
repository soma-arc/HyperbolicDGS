import Scene from './scene.js';
import Canvas2d from './canvas2d.js';

export default class CanvasHandler {
    /**
     *
     * @param {Scene} scene
     */
    constructor(scene) {
        this.scene = scene;

        this.resizeCallback = this.resize.bind(this);
    }

    init() {
        this.mainCanvas = new Canvas2d('mainCanvas', this.scene);
    }

    render() {
        this.mainCanvas.render();
    }

    resize() {
        this.mainCanvas.resizeCanvas();
        this.mainCanvas.render();
    }
}
