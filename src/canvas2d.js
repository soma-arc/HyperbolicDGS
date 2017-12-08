import Scene from './scene.js';

export default class Canvas2d {
    /**
     *
     * @param {String} canvasId
     * @param {Scene} scene
     */
    constructor(canvasId, scene) {
        this.canvasId = canvasId;
        this.scene = scene;
        this.canvas = document.getElementById(this.canvasId);
        this.ctx = this.canvas.getContext('2d');
    }

    render() {
        const ctx = this.ctx;

        ctx.beginPath();
        ctx.moveTo(0, this.canvas.height * 0.5);
        ctx.lineTo(this.canvas.width, this.canvas.height * 0.5);
        ctx.moveTo(this.canvas.width * 0.5, 0);
        ctx.lineTo(this.canvas.width * 0.5, this.canvas.height);
        ctx.stroke();
    }
}
